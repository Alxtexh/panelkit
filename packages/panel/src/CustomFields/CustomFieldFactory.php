<?php

declare(strict_types=1);

namespace Alxtexh\Panel\CustomFields;

use Illuminate\Contracts\Database\Query\Expression as QueryExpression;
use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Forms\Fields\DateField;
use Alxtexh\Panel\Forms\Fields\Field;
use Alxtexh\Panel\Forms\Fields\NumberField;
use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Forms\Fields\TextareaField;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Fields\ToggleField;
use Alxtexh\Panel\Tables\Columns\BadgeColumn;
use Alxtexh\Panel\Tables\Columns\Column;
use Alxtexh\Panel\Tables\Columns\TextColumn;

/**
 * Turns one stored `CustomField` into the real objects the rest of the
 * panel already knows how to render - roadmap 5.1.
 *
 * A NARROW, EXPLICIT TYPE MAP, not "any Field subclass by class name". An
 * operator is choosing a type from a list, not writing PHP - accepting an
 * arbitrary class string here would mean an operator's typo (or a crafted
 * request against the definitions endpoint) could instantiate anything in
 * the app implementing `Field`, including ones that assume construction-time
 * arguments this factory never supplies (`RepeaterField`'s child schema,
 * `FileUploadField`'s disk). The six offered here need only a key and a
 * label to be valid.
 *
 * THE FORM KEY IS PREFIXED `custom_`, never the bare stored key. A
 * definition named `name` or `status` must not silently shadow a resource's
 * own declared field of the same key once merged into one form - prefixing
 * makes a collision with a REAL column impossible by construction, not by
 * a validation rule someone could still get past `RecordController`'s fold
 * step (see its own note) unprefixes it again on the way into `custom`.
 */
final class CustomFieldFactory
{
    /** @var array<string, class-string<Field>> */
    private const TYPES = [
        'text' => TextField::class,
        'textarea' => TextareaField::class,
        'number' => NumberField::class,
        'select' => SelectField::class,
        'toggle' => ToggleField::class,
        'date' => DateField::class,
    ];

    /** @return list<string> Every type an operator may choose, for the definition form's own select. */
    public static function types(): array
    {
        return array_keys(self::TYPES);
    }

    public static function formKey(CustomField $definition): string
    {
        return 'custom_'.$definition->key;
    }

    public static function field(CustomField $definition): Field
    {
        $class = self::TYPES[$definition->type] ?? TextField::class;

        /** @var Field $field */
        $field = $class::make(self::formKey($definition))->label($definition->label);

        if ($field instanceof SelectField) {
            $field->options($definition->options ?? []);
        }

        // A toggle is never `required` - see ToggleField's own note on why
        // an unchecked box submitting nothing would make that rule reject
        // the value somebody actually chose.
        if ($definition->required && ! $field instanceof ToggleField) {
            $field->required();
        }

        return $field;
    }

    /**
     * A read-only table column showing the stored value - never editable
     * inline (see `EditableColumn`'s own write path; that is a separate,
     * larger commitment this does not make) and never sortable (a
     * JSON-extracted value sorts as whatever text its driver returns it as,
     * which is not necessarily the type's own ordering - `2` sorts before
     * `10` for a number, not after).
     *
     * DELIBERATELY UNAWARE OF ITS OWN VALUE'S SOURCE. `Column::from()` takes
     * a real `table.column` reference and aliases it - it is not a place for
     * a raw SQL function call, whose own `.` (inside `custom`'s JSON path,
     * here) gets parsed as ANOTHER table-qualifier by the query grammar and
     * corrupts the expression. `selectExpression()` below is the actual
     * fetch, exactly like `UserResource::role_names` - a bare-keyed column
     * plus a raw expression riding in the table's `alsoSelect`, aliased to
     * that same key.
     *
     * A `select` FIELD GETS A BADGE, because it is the only column type that
     * maps a stored value to what it READS as. The database holds `gold`; the
     * operator chose "Gold", and a list cell showing the lowercase key looks
     * like leaked data rather than the choice somebody made. Every other type
     * already stores what it displays.
     */
    public static function column(CustomField $definition): Column
    {
        if ($definition->type === 'select' && $definition->options !== null) {
            return BadgeColumn::make(self::formKey($definition))
                ->label($definition->label)
                ->labels($definition->options)
                // NO COLOUR MAP: an operator's own choices carry no meaning
                // this factory could read one from. "Gold" is not `success`.
                ->defaultColor('neutral');
        }

        return TextColumn::make(self::formKey($definition))->label($definition->label);
    }

    /**
     * The raw SQL that actually fetches one custom field's value, aliased to
     * `column()`'s key - append this to the table's `alsoSelect`/
     * `appendSelect`, never pass it through `Column::from()` (see
     * `column()`'s own note on why).
     *
     * `custom` IS TABLE-QUALIFIED, by `$definition->resource` - not because
     * a JOIN is expected on every resource, but because `Client`, `Router`
     * and `Plan` all carry their own `custom` column (the same migration
     * added all three), and `ClientResource` joins `plans`. A bare `custom`
     * there is ambiguous SQL, not merely ugly - the database refuses the
     * query rather than guessing which one was meant.
     *
     * `$definition->resource` DOUBLES AS THE TABLE NAME here on the
     * assumption `Resource::key()` matches the underlying table - true for
     * every resource `CustomFieldStorage` reserves storage on today. A
     * resource whose table name diverges from its key would need this
     * qualified from the definition's OWN resource class rather than the
     * string, which nothing here has a route to without a resource registry
     * lookup this factory does not otherwise need.
     *
     * ALL THREE FIRST-CLASS DRIVERS, no favourites. The first version
     * handled SQLite and MySQL and excluded Postgres on reasoning about
     * THIS playground's connections - which is exactly the "locked to a
     * specific database" trap a framework must not ship: a consumer running
     * Postgres would have had a custom-fields column that silently reads
     * nothing. `->>'key'` extracts as text on both `json` and `jsonb`; the
     * `default` arm is SQLite's rather than a silent assumption -
     * `DriverCoverageTest` fails any driver-specific feature that misses
     * one of the three.
     */
    public static function selectExpression(CustomField $definition): QueryExpression
    {
        $key = self::formKey($definition);
        $path = '$.'.$definition->key;
        $column = $definition->resource.'.custom';

        $expression = match (DB::connection()->getDriverName()) {
            'mysql', 'mariadb' => "JSON_UNQUOTE(JSON_EXTRACT({$column}, '{$path}'))",
            'pgsql' => "{$column}->>'{$definition->key}'",
            default => "json_extract({$column}, '{$path}')",
        };

        return DB::raw("{$expression} as {$key}");
    }
}

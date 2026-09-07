<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Resources;

use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Http\NestedRelation;
use Alxtexh\Panel\Models\Scopes\TenantScope;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Tables\ListResult;
use Alxtexh\Panel\Tables\Table;
use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use InvalidArgumentException;

/**
 * A related list shown on a record's page - a client's sessions, a router's
 * clients, an account's invoices.
 *
 * THE WHOLE POINT IS THAT IT IS A TABLE, NOT AN EAGER LOAD. The obvious
 * implementation is `$client->load('sessions')` and a `v-for`, and it is wrong
 * in a way that only shows up in production: a client with 40,000 sessions
 * loads 40,000 rows into memory to render the twenty a person will look at.
 * Relations are the single most common place an admin panel falls over at
 * scale, because the relation is small for every record the developer tested
 * with.
 *
 * So a relation manager reuses the SAME ListQuery the main table uses - keyset
 * pagination, explicit select, per-shape indexes, no blocking count - and is
 * fetched on demand rather than with the parent record.
 *
 * THE FOREIGN KEY IS DECLARED, NEVER INFERRED FROM THE REQUEST. `ownerKey` is
 * a column name written in a resource class; the request supplies only which
 * declared relation to open. Inferring it would make this endpoint a way to
 * join any table to any other.
 */
final class RelationManager
{
    /** @var class-string<Model> */
    private string $model;

    private string $foreignKey;

    private ?Closure $table = null;

    private ?Closure $modifyQuery = null;

    /** @var Closure(Form): Form|null */
    private ?Closure $form = null;

    private ?string $icon = null;

    private string $ability = 'view';

    private string $createAbility = 'create';

    private string $updateAbility = 'update';

    private bool $readOnly = false;

    /**
     * Nested child resource that owns the dedicated list/create/edit pages.
     *
     * @var class-string<\Alxtexh\Panel\Resources\Resource>|null
     */
    private ?string $resource = null;

    private function __construct(
        public readonly string $key,
        private readonly string $label,
    ) {}

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }

    /**
     * The related model and the column pointing back at the parent.
     *
     * @param  class-string<Model>  $model
     */
    public function related(string $model, string $foreignKey): self
    {
        if (! is_subclass_of($model, Model::class)) {
            throw new InvalidArgumentException("[{$model}] is not an Eloquent model.");
        }

        if (preg_match('/^[a-zA-Z_][a-zA-Z0-9_.]*$/', $foreignKey) !== 1) {
            // It reaches a where clause; validated here rather than trusted.
            throw new InvalidArgumentException("[{$foreignKey}] is not a valid column identifier.");
        }

        $this->model = $model;
        $this->foreignKey = $foreignKey;

        return $this;
    }

    /**
     * The table definition, as a closure.
     *
     * A closure rather than a built Table, for the reason every other
     * definition is deferred: building it eagerly would run at class-definition
     * time, and a filter's option closure would query on every page render
     * (antipatterns §3.3).
     *
     * @param  Closure(Table): Table  $table
     */
    public function table(Closure $table): self
    {
        $this->table = $table;

        return $this;
    }

    /** Narrow the relation further - "unpaid invoices", "live sessions". */
    public function query(Closure $modify): self
    {
        $this->modifyQuery = $modify;

        return $this;
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /** The policy ability checked on the PARENT before the list is served. */
    public function authorize(string $ability): self
    {
        $this->ability = $ability;

        return $this;
    }

    /**
     * Dedicated nested resource that owns list/create/edit pages for this relation.
     *
     * NOT A MODAL. Filament's default relation manager mutates in a dialog; this
     * kit routes related records as their own pages under the parent URL
     * (`/{parent}/{id}/{child}`), the same surface `$parent` already provides.
     * The relation tab on the view page stays a summary that LINKS there.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $resource
     */
    public function resource(string $resource): self
    {
        if (! is_subclass_of($resource, Resource::class)) {
            throw new InvalidArgumentException("[{$resource}] is not a panel resource.");
        }

        $this->resource = $resource;

        if (! isset($this->model)) {
            $model = $resource::model();

            if (NestedRelation::belongsToMany($resource)) {
                $this->model = $model;
                $this->foreignKey = '';
            } else {
                $table = (new $model)->getTable();

                $this->related($model, $table.'.'.$resource::parentColumn());
            }
        }

        return $this;
    }

    /**
     * Create/edit form schema, used when the nested resource has not supplied one.
     *
     * Writes go to the nested resource's dedicated pages, not to a modal.
     *
     * @param  Closure(Form): Form  $form
     */
    public function form(Closure $form): self
    {
        $this->form = $form;

        return $this;
    }

    public function createAbility(string $ability): self
    {
        $this->createAbility = $ability;

        return $this;
    }

    public function updateAbility(string $ability): self
    {
        $this->updateAbility = $ability;

        return $this;
    }

    /**
     * No inline create, no edit affordance, on THIS tab.
     *
     * Scoped to what a relation manager actually owns: the summary tab on the
     * parent record page. It does not lock the nested resource's own
     * dedicated pages - `TagResource::table()`'s `attach`/`detach` route to
     * that resource's own `update`/`create` abilities, resolved independently
     * of any tab that happens to link to them. A relation genuinely meant to
     * be read-only everywhere gates that on the nested resource itself.
     */
    public function readOnly(bool $readOnly = true): self
    {
        $this->readOnly = $readOnly;

        return $this;
    }

    public function hasForm(): bool
    {
        return ! $this->readOnly && ($this->form !== null || $this->resource !== null);
    }

    public function formDefinition(): ?Form
    {
        if ($this->form !== null) {
            return ($this->form)(Form::make());
        }

        if ($this->resource !== null) {
            return $this->resource::formDefinition();
        }

        return null;
    }

    /**
     * Whether create-from-tab is offered. Edit and view stay on dedicated pages.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $parentResourceClass
     */
    public function canInlineCreate(string $parentResourceClass, Model $parent): bool
    {
        if ($this->readOnly) {
            return false;
        }

        $form = $this->formDefinition();

        if ($form === null || $form->fields() === []) {
            return false;
        }

        if ($this->resource !== null) {
            return (bool) ($this->resource::permissions()['create'] ?? false);
        }

        return $parentResourceClass::can($this->createAbility, $parent);
    }

    /**
     * Persist one related row from the parent record page.
     *
     * The parent key is stamped from the URL context, never honoured from input.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $parentResourceClass
     * @param  array<string, mixed>  $validated
     */
    public function store(string $parentResourceClass, Model $parent, array $validated): Model
    {
        $form = $this->formDefinition();

        abort_if($form === null, 404);

        /** @var class-string<Model> $modelClass */
        $modelClass = $this->resource !== null ? $this->resource::model() : $this->model;

        $record = new $modelClass;
        $record->forceFill($form->sanitize($validated));

        $this->applyTenant($record);

        if ($this->resource !== null) {
            if (! NestedRelation::belongsToMany($this->resource)) {
                $record->setAttribute($this->resource::parentColumn(), $parent->getKey());
            }

            $record->save();

            if (NestedRelation::belongsToMany($this->resource)) {
                NestedRelation::associateNew($this->resource, $parent, $record);
            }
        } else {
            $column = str_contains($this->foreignKey, '.')
                ? substr($this->foreignKey, strrpos($this->foreignKey, '.') + 1)
                : $this->foreignKey;

            $record->setAttribute($column, $parent->getKey());
            $record->save();
        }

        return $record->fresh() ?? $record;
    }

    private function applyTenant(Model $record): void
    {
        $context = app(TenantContext::class);

        if (! $context->shouldScopeByColumn()) {
            return;
        }

        if (! Schema::hasColumn($record->getTable(), $context->column())) {
            return;
        }

        if (! $record->hasGlobalScope(TenantScope::class)) {
            return;
        }

        $key = $context->currentKey();

        abort_if($key === null, 403, 'No tenant resolved; refusing to write an unscoped record.');

        $record->setAttribute($context->column(), $key);
    }

    public function getAbility(): string
    {
        return $this->ability;
    }

    /** @return class-string<Model> */
    public function getModel(): string
    {
        return $this->model;
    }

    public function nestedResource(): ?string
    {
        return $this->resource;
    }

    /**
     * Foreign key stamped from the parent URL on inline create, never from input.
     */
    public function stampedParentColumn(): ?string
    {
        if ($this->resource !== null) {
            if (NestedRelation::belongsToMany($this->resource)) {
                return null;
            }

            return $this->resource::parentColumn();
        }

        if (! isset($this->foreignKey) || $this->foreignKey === '') {
            return null;
        }

        return str_contains($this->foreignKey, '.')
            ? substr($this->foreignKey, strrpos($this->foreignKey, '.') + 1)
            : $this->foreignKey;
    }

    public function definition(): Table
    {
        if ($this->table !== null) {
            return ($this->table)(Table::make());
        }

        if ($this->resource !== null) {
            return $this->resource::definition();
        }

        return Table::make();
    }

    /**
     * Rows for one parent record.
     *
     * The parent key is bound as a PARAMETER against a column named in the
     * declaration - the request never chooses the column, only which declared
     * relation to open.
     */
    public function rows(Request $request, int|string $parentKey): ListResult
    {
        $definition = $this->definition();
        $foreignKey = $this->foreignKey;
        $modify = $this->modifyQuery;

        if ($this->resource !== null && NestedRelation::belongsToMany($this->resource)) {
            $parentClass = $this->resource::parentResource();
            $parent = $parentClass::model()::query()->findOrFail($parentKey);
            $resource = $this->resource;

            NestedRelation::appendPivotColumns($definition, $parent, $resource);

            $query = $definition->toListQuery($this->model);

            $query->constrain(function ($builder) use ($parent, $resource, $modify): void {
                NestedRelation::constrain($builder, $resource, $parent);

                if ($modify !== null) {
                    $modify($builder);
                }
            });

            return $query->run($request);
        }

        $query = $definition->toListQuery($this->model);

        // Layered on top of whatever join the table already declares, so a
        // relation manager can still show joined columns.
        $query->join(function ($builder) use ($foreignKey, $parentKey, $modify, $definition): void {
            $existing = $definition->getQueryModifier();

            if ($existing !== null) {
                $existing($builder);
            }

            $builder->where($foreignKey, $parentKey);

            if ($modify !== null) {
                $modify($builder);
            }
        });

        return $query->run($request);
    }

    /** @return array<string, mixed> Structure only. Never runs a query. */
    public function toSchema(): array
    {
        $formSchema = null;

        if ($this->readOnly) {
            // Nothing this tab could submit the form TO - store() is gated
            // on canInlineCreate(), which is false here regardless.
        } elseif ($this->form !== null) {
            $formSchema = ($this->form)(Form::make())->toSchema();
        } elseif ($this->resource !== null) {
            $formSchema = $this->resource::formDefinition()->toSchema();
        }

        $formSchema = $this->withoutStampedParentField($formSchema);

        $canCreate = false;
        $canEdit = false;
        $pages = null;

        $inlineCreate = $formSchema !== null;

        $definition = $this->definition();

        if ($this->resource !== null) {
            $permissions = $this->resource::permissions();
            $canCreate = ! $this->readOnly && (bool) ($permissions['create'] ?? false);
            $canEdit = ! $this->readOnly && (bool) ($permissions['update'] ?? false);
            $pages = ['resource' => $this->resource::key()];
            if (NestedRelation::belongsToMany($this->resource)) {
                $pages['attach'] = true;
                // Structure only here - no parent to read a value against
                // yet. `rows()` adds the matching `appendSelect()` for one.
                $definition->appendColumns(NestedRelation::pivotColumnDeclarations($this->resource));
            }
            $inlineCreate = $canCreate;
        }

        return [
            'key' => $this->key,
            'label' => $this->label,
            'icon' => $this->icon,
            'readOnly' => $this->readOnly,
            'table' => $definition->toSchema(),
            'form' => $formSchema,
            /*
             * Create opens inline on the parent tab when a form exists. Edit
             * and view stay on the nested resource's dedicated pages.
             */
            'canCreate' => $inlineCreate,
            'canEdit' => $canEdit,
            'inlineCreate' => $inlineCreate,
            'pages' => $pages,
            'createAbility' => $this->createAbility,
            'updateAbility' => $this->updateAbility,
        ];
    }

    /**
     * Drop the parent foreign key from the inline create form. It is stamped
     * from the URL after validation, so offering it in the dialog would let
     * the body claim a different parent.
     *
     * @param  array<string, mixed>|null  $schema
     * @return array<string, mixed>|null
     */
    private function withoutStampedParentField(?array $schema): ?array
    {
        if ($schema === null) {
            return null;
        }

        $column = $this->stampedParentColumn();

        if ($column === null) {
            return $schema;
        }

        $schema['fields'] = array_values(array_filter(
            $schema['fields'] ?? [],
            static fn (mixed $field): bool => ! is_array($field) || ($field['key'] ?? null) !== $column,
        ));

        $strip = static function (array $node) use (&$strip, $column): ?array {
            if (($node['component'] ?? null) === 'field' && ($node['key'] ?? null) === $column) {
                return null;
            }

            foreach (['children', 'fields', 'schema'] as $key) {
                if (! isset($node[$key]) || ! is_array($node[$key])) {
                    continue;
                }

                $node[$key] = array_values(array_filter(
                    array_map(
                        static fn (mixed $child): ?array => is_array($child) ? $strip($child) : null,
                        $node[$key],
                    ),
                ));
            }

            return $node;
        };

        $schema['nodes'] = array_values(array_filter(
            array_map(
                static fn (mixed $node): ?array => is_array($node) ? $strip($node) : null,
                $schema['nodes'] ?? [],
            ),
        ));

        return $schema;
    }
}

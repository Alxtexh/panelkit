<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

use Illuminate\Contracts\Database\Query\Expression as QueryExpression;
use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Schema\Renderable;
use Alxtexh\Panel\Tables\Summarizer;

/**
 * A column in the resource schema.
 *
 * TWO RULES this base class exists to enforce.
 *
 * 1. NO CLASS STRINGS. A column never emits a CSS class. It emits semantic
 *    values - `type: 'badge'`, `color: 'danger'`, `align: 'right'` - and the Vue
 *    layer decides what those look like.
 *
 *    This is a hard architectural boundary, not a preference (antipatterns
 *    §6.1). A CSS build that does not scan PHP purges PHP-authored classes
 *    silently, and *partially*: one class of a responsive pair survives because
 *    Blade used it elsewhere and the other vanishes, hiding an element at every
 *    width instead of only small ones. It cost a full build-and-deploy cycle to
 *    find, and it has already happened once in this repository.
 *
 * 2. NO TENANT DATA and NO QUERIES. Everything a column contributes must be
 *    identical for every tenant and computable without touching the database
 *    (addendum Part A, antipatterns §3.3). That is what lets the schema be
 *    cached once per permission set rather than once per tenant, and what stops
 *    a definition-time query taking a page down for everyone.
 */
abstract class Column implements Renderable
{
    protected ?string $label = null;

    protected bool $sortable = false;

    protected bool $searchable = false;

    protected bool $copyable = false;

    protected bool $locked = false;

    /**
     * Pin this column to the left while the table scrolls horizontally.
     *
     * Presentation only. Off by default so unused tables pay nothing. Prefer
     * `Table::stickyFirstColumn()` when the first data column should stick;
     * set this when a later column (or an explicit key) must pin instead.
     */
    protected bool $sticky = false;

    /** Preferred width in pixels; the client may resize when resizable. */
    protected ?int $width = null;

    /** Whether the operator may drag-resize this column. Off by default. */
    protected bool $resizable = false;

    protected ?string $sortKey = null;

    protected ?string $databaseColumn = null;

    /** A SQL expression this column's value is computed by - see `fromRaw()`. */
    protected ?string $rawExpression = null;

    protected string $align = 'left';

    /**
     * De-emphasised rendering.
     *
     * Lives on the base rather than TextColumn because it is a presentation
     * INTENT that applies to any column type - a muted date is as ordinary as a
     * muted string. Still a semantic name, never a CSS class (antipatterns S6.1).
     */
    protected bool $muted = false;

    protected ?Summarizer $summarizer = null;

    protected ?string $prefix = null;

    protected ?string $suffix = null;

    final public function __construct(public readonly string $key) {}

    public static function make(string $key): static
    {
        return new static($key);
    }

    abstract public function type(): string;

    public function label(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function sortable(bool $sortable = true): static
    {
        $this->sortable = $sortable;

        return $this;
    }

    public function searchable(bool $searchable = true): static
    {
        $this->searchable = $searchable;

        return $this;
    }

    /**
     * A footer aggregate for this column.
     *
     * Over the FILTERED set, not the page - see Summarizer. Declared on the
     * column because that is where the reader looks for it: a total belongs
     * under the numbers it totals.
     */
    public function summarize(Summarizer $summarizer): static
    {
        $this->summarizer = $summarizer;

        return $this;
    }

    public function summarizer(): ?Summarizer
    {
        return $this->summarizer;
    }

    /** Renders an inline copy affordance on the cell that holds the value. */
    public function copyable(bool $copyable = true): static
    {
        $this->copyable = $copyable;

        return $this;
    }

    /** Excluded from the column-visibility menu; always rendered. */
    public function locked(bool $locked = true): static
    {
        $this->locked = $locked;

        return $this;
    }

    /** Pin this column while the table scrolls horizontally. */
    public function sticky(bool $sticky = true): static
    {
        $this->sticky = $sticky;

        return $this;
    }

    /** Preferred width in pixels (client may still resize when allowed). */
    public function width(int $width): static
    {
        $this->width = max(48, $width);

        return $this;
    }

    /** Allow the operator to drag-resize this column. */
    public function resizable(bool $resizable = true): static
    {
        $this->resizable = $resizable;

        return $this;
    }

    /**
     * ORDER BY key when it differs from the display key.
     *
     * Phase 2 proved these are not the same thing: Plans displays a formatted
     * `price` but must sort by `price_cents`, or 12,000.00 orders before 900.00.
     */
    public function sortAs(string $key): static
    {
        $this->sortKey = $key;

        return $this;
    }

    /** Qualified database column when it differs from the key. */
    public function from(string $column): static
    {
        $this->databaseColumn = $column;

        return $this;
    }

    /**
     * A value the DATABASE computes, rather than a column it stores.
     *
     * FOR THE THINGS THAT ARE A COMPARISON, NOT A FACT. The case that forced
     * this was a ticket's unread badge: "is there a reply newer than the last
     * time this side looked" is two columns compared, and the alternatives
     * were both bad - a stored flag that has to be maintained by every writer,
     * or a per-row lookup, which is the N+1 a badge is not worth.
     *
     * IT MUST BE AN `Expression`, and that is the whole reason this is a
     * separate method rather than a longer string passed to `from()`. A raw
     * expression handed to the builder as a STRING is quoted as an
     * identifier - `select "(case when ... end) as unread"` - which fails with
     * a syntax error pointing at a dot, several layers from anything that
     * looks like this.
     *
     * NEVER GIVEN USER INPUT. Everything here is interpolated into SQL with
     * nothing bound, so callers pass a literal written in the resource class.
     * A column expression built from a request parameter is an injection, and
     * there is no shape of this API that makes that safe.
     */
    public function fromRaw(string $expression): static
    {
        $this->rawExpression = $expression;

        return $this;
    }

    /**
     * How this column appears in the SELECT list - aliased to its own key.
     *
     * THE ALIAS IS ADDED HERE RATHER THAN WRITTEN BY HAND, because writing it by
     * hand fails silently. `->from('clients.name')` on a column keyed
     * `client_name` selects a result column called `name`, the row arrives with
     * a key nothing looks for, and the cell renders an em dash. Nothing errors:
     * the query is valid, the join is correct, and the only symptom is a column
     * of dashes that reads like missing data.
     *
     * An explicit `as` in the expression is respected - several resources
     * already write `->from('plans.name as plan_name')`, and second-guessing
     * them would break the thing this is meant to fix.
     */
    public function selectExpression(): string|QueryExpression
    {
        // A computed value - see `fromRaw()` for why this cannot be a string.
        if ($this->rawExpression !== null) {
            return DB::raw($this->rawExpression.' as '.$this->key);
        }

        $column = $this->databaseColumn ?? $this->key;

        // Already aliased, or unqualified and therefore already named after
        // itself. Neither needs help.
        if (stripos($column, ' as ') !== false || ! str_contains($column, '.')) {
            return $column;
        }

        $bare = substr($column, strrpos($column, '.') + 1);

        return $bare === $this->key ? $column : "{$column} as {$this->key}";
    }

    /**
     * Rendered before the value, e.g. a currency code.
     *
     * A unit is part of what the value MEANS, so it belongs in the schema. The
     * alternative was a per-resource Vue slot, which is exactly the bespoke Vue
     * Phase 4 exists to remove.
     */
    public function prefix(string $prefix): static
    {
        $this->prefix = $prefix;

        return $this;
    }

    /** Rendered after the value, e.g. a unit of measure. */
    public function suffix(string $suffix): static
    {
        $this->suffix = $suffix;

        return $this;
    }

    public function muted(bool $muted = true): static
    {
        $this->muted = $muted;

        return $this;
    }

    public function align(string $align): static
    {
        $this->align = $align;

        return $this;
    }

    public function isSortable(): bool
    {
        return $this->sortable;
    }

    public function isSearchable(): bool
    {
        return $this->searchable;
    }

    public function resolvedSortKey(): string
    {
        return $this->sortKey ?? $this->key;
    }

    /**
     * The column an ORDER BY may name - never the alias.
     *
     * Any `as` is stripped: `ORDER BY plans.name as plan_name` is not valid SQL,
     * and a joined column that is both displayed and sortable would otherwise
     * produce exactly that. The SELECT wants the alias; the ORDER BY wants the
     * column. They are different questions and this is the one that must not
     * carry a rename.
     */
    public function resolvedDatabaseColumn(): ?string
    {
        if ($this->databaseColumn === null) {
            return null;
        }

        $position = stripos($this->databaseColumn, ' as ');

        return $position === false
            ? $this->databaseColumn
            : trim(substr($this->databaseColumn, 0, $position));
    }

    public function resolvedLabel(): string
    {
        return $this->label ?? str($this->key)->afterLast('.')->headline()->value();
    }

    /**
     * Satisfies Renderable, so a Column can be a leaf in a schema tree and the
     * view page can reuse Section/Tabs/Grid rather than growing a parallel Entry
     * hierarchy.
     *
     * An alias rather than a rename: `toArray()` is what the table schema has
     * always called, and renaming it would churn every call site to no benefit.
     *
     * @return array<string, mixed>
     */
    public function toSchema(): array
    {
        return $this->toArray();
    }

    /**
     * Serialisable description. Must contain no tenant data and no CSS classes.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            // Discriminator, so a view-page layout tree can mix layout nodes and
            // columns. A column already carries everything an "infolist entry"
            // would - key, label, type, colour intent - so a parallel Entry
            // hierarchy would be duplication with a different name.
            'component' => 'entry',
            'key' => $this->key,
            'label' => $this->resolvedLabel(),
            'type' => $this->type(),
            'sortable' => $this->sortable,
            'sortKey' => $this->sortKey,
            'copyable' => $this->copyable,
            'locked' => $this->locked,
            'sticky' => $this->sticky,
            'width' => $this->width,
            'resizable' => $this->resizable,
            'align' => $this->align === 'left' ? null : $this->align,
            'muted' => $this->muted,
            'prefix' => $this->prefix,
            'suffix' => $this->suffix,
            // Structure only: which aggregate and how to render it. The VALUE
            // arrives later, deferred, like the total count.
            'summary' => $this->summarizer?->toSchema(),
        ], static fn (mixed $v): bool => $v !== null && $v !== false);
    }
}

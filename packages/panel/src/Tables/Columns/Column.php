<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

use Alxtexh\Panel\Schema\Renderable;
use Alxtexh\Panel\Support\HasQualifiedSource;
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
    use HasQualifiedSource;

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

    /*
     * `from()`, `fromRaw()` and `selectExpression()` are inherited from
     * `HasQualifiedSource`, shared with `Entry` - see that trait for the
     * reasoning ("a ticket's unread badge" for `fromRaw()`, the aliasing note
     * for `selectExpression()`). A column and a view-page entry describe the
     * same kind of fact and used to each carry their own, silently-driftable
     * copy of this.
     */

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

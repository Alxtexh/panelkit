<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables;

use Closure;
use Illuminate\Database\Connection;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Query\Builder;
use Illuminate\Contracts\Database\Query\Expression as QueryExpression;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use InvalidArgumentException;
use Alxtexh\Panel\Actions\ActionGroup;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Tables\Filters\Filter;
use Alxtexh\Panel\Tables\Filters\QueryBuilderFilter;
use Alxtexh\Panel\Tables\Filters\TrashedFilter;
use Alxtexh\Panel\Tables\Grouping\Group;
use Alxtexh\Panel\Support\Deprecation;
use Alxtexh\Panel\Support\AllowListedQueryExpression;

/**
 * The shared list query, extracted in Phase 3 from three hardcoded controllers.
 *
 * Everything the §10 mandates require lives here once, so no resource can forget
 * one of them:
 *
 *   - toBase()          no model hydration on a read-only list
 *   - explicit select   never SELECT * on a wide table
 *   - keyset seek       OFFSET 100000 walks 100,000 rows; a seek does not
 *   - no COUNT          the total is returned as a closure the caller defers
 *   - constant queries  one query, plus one per declared join
 *
 * Tenant scoping is deliberately NOT handled here. It comes from the global
 * scope on the model, which `toBase()` applies before dropping to the query
 * builder. Re-adding it here would give resources two places to get it wrong.
 *
 * The three shapes Phase 2 surfaced, all of which a two-example abstraction
 * would have missed, are first-class:
 *
 *   - tri-state boolean filters      (BooleanFilter, null !== false)
 *   - computed columns               (transform(), plus sortAs() so the display
 *                                     key can differ from the ORDER BY column)
 *   - data-derived filter options    (SelectFilter::options(Closure))
 */
/** @phpstan-type TableState array{tab: string|null, search: string, sort: string, direction: string, cursor: string|null, page: int, filters: array<string, mixed>, group: mixed} */
final class ListQuery
{
    /** @var class-string */
    private string $model;

    /** @var list<string|QueryExpression> */
    private array $select = ['*'];

    /** @var array<string, string> display key => qualified ORDER BY column */
    private array $sortable = [];

    /** @var list<string> qualified columns searched by prefix */
    private array $searchable = [];

    /** @var array<string, list<string>> relation name => its searched columns */
    private array $searchableRelations = [];

    /** Whether a multi-word term is ANDed word by word - see `applySearch()`. */
    private bool $splitSearchTerms = true;

    /** prefix | exact | relevance. */
    private string $searchMode = 'prefix';

    /** @var list<Filter> */
    private array $filters = [];

    /** @var array<string, array{summarizer: Summarizer, column: string}> */
    private array $summaries = [];

    private ?Closure $join = null;

    /**
     * Predicates that define WHAT THIS TABLE LISTS, never a join.
     *
     * Applied to every query the table makes - rows, counts, exports, bulk
     * selections. See `base()` for why it cannot share a hook with the join.
     */
    private ?Closure $constrain = null;

    /** The caller's eloquent-stage hook - see modifyEloquent(). */
    private ?Closure $modifyEloquent = null;

    private ?Closure $transform = null;

    /** @var Closure(list<array<string, mixed>>): void|null */
    private ?Closure $prepareRows = null;

    private ?DataProvider $dataProvider = null;

    /**
     * The declared record actions, for per-row availability.
     *
     * @var list<RecordAction|ActionGroup>
     */
    private array $recordActions = [];

    /**
     * This table's slice of the query string, when it shares a page.
     *
     * Null for a resource index - the only table on its page, so it owns the
     * flat query string and its URLs stay exactly as they were.
     */
    private ?string $namespace = null;

    /** The grouping key as the client knows it, and the column behind it. */
    private ?string $groupKey = null;

    private ?string $groupColumn = null;

    private bool $groupDate = false;

    private ?Group $activeGroup = null;

    /**
     * Declared groupings the request may pick from.
     *
     * @var list<array{0: Group, 1: string}>
     */
    private array $availableGroups = [];

    private ?string $defaultGroupKey = null;

    /** Whether `?group=` is honoured. False means the default is always on. */
    private bool $groupPicker = false;

    private ?Tabs $tabs = null;

    private string $defaultSort = 'created_at';

    private string $defaultDirection = 'desc';

    private int $perPage = 10;

    /**
     * Allowlist for the per-page selector.
     *
     * An allowlist rather than a clamp: `?perPage=100000` would otherwise
     * become a legitimate way to pull an entire tenant table in one request,
     * which is both a performance and an exfiltration concern.
     *
     * @var list<int>
     */
    private array $perPageOptions = [10, 25, 50, 100];

    private string $keyColumn = 'id';

    /**
     * keyset | offset.
     *
     * KEYSET is the default because OFFSET 100000 makes the database walk
     * 100,000 rows it then discards, so page 2,000 gets steadily slower.
     *
     * But it is a DEFAULT, not a mandate. Offset is genuinely better for a small
     * table where an operator wants to jump to page 7, and refusing to offer it
     * would be the framework imposing a decision it cannot make - a 200-row
     * lookup table pays nothing for OFFSET and gains real navigation.
     */
    private string $paginationStrategy = 'keyset';

    /**
     * deferred | exact | approximate | none.
     *
     *   deferred     count runs AFTER the rows are sent (default)
     *   exact        count blocks the response. Correct for a small table.
     *   approximate  engine statistics. Instant, and wrong by a little.
     *   none         no total at all. Cheapest, and no page count.
     */
    private string $countStrategy = 'deferred';

    /** @param class-string $model */
    private function __construct(string $model)
    {
        $this->model = $model;
    }

    /** @param class-string $model */
    public static function for(string $model): self
    {
        return new self($model);
    }

    /** @param list<string|QueryExpression> $columns */
    public function select(array $columns): self
    {
        $normalised = [];

        foreach ($columns as $column) {
            if (is_string($column)) {
                $normalised[] = $column;
            } elseif ($column instanceof QueryExpression) {
                $normalised[] = $column;
            } else {
                throw new InvalidArgumentException('List select expressions must be Laravel query expressions.');
            }
        }

        $this->select = $normalised;

        return $this;
    }

    /**
     * Declared joins, so the query count stays constant rather than N+1.
     *
     * JOINS ONLY. A predicate here is silently dropped from counts - see the
     * comment in `base()`. Use `constrain()` for anything that narrows the set
     * of rows the table describes.
     */
    public function join(Closure $join): self
    {
        $this->join = $join;

        return $this;
    }

    /** A predicate applied to every query, counts included. */
    public function constrain(Closure $constrain): self
    {
        $this->constrain = $constrain;

        return $this;
    }

    /**
     * A caller's one chance at the ELOQUENT builder, before scopes resolve.
     *
     * `constrain` belongs to the TABLE - it is part of the resource's own
     * definition and travels with `toListQuery()`. This one belongs to the
     * CALLER: the search endpoint threads `Resource::modifySearchQuery()`
     * through it, so a palette can be narrowed without the list screen
     * changing underneath it. Applied after the table's own constraint, so a
     * caller can only tighten what the definition already decided.
     */
    public function modifyEloquent(Closure $modify): self
    {
        $this->modifyEloquent = $modify;

        return $this;
    }

    /**
     * Allowlist of sortable columns.
     *
     * This is a security boundary, not ergonomics: the value is interpolated
     * into an ORDER BY, which no query binding can parameterise. Anything not in
     * this map falls back to the default sort.
     *
     * @param  array<string, string>  $map  display key => qualified column
     */
    public function sortable(array $map): self
    {
        $this->sortable = $map;

        return $this;
    }

    /** @param list<string> $columns */
    public function searchable(array $columns): self
    {
        $this->searchable = $columns;

        return $this;
    }

    /** Use a host-owned read-only source instead of the Eloquent query path. */
    public function dataProvider(DataProvider $provider): self
    {
        $this->dataProvider = $provider;

        return $this;
    }

    /** Select the matching strategy for declared searchable columns. */
    public function searchMode(string $mode): self
    {
        if (! in_array($mode, ['prefix', 'exact', 'relevance'], true)) {
            throw new InvalidArgumentException("Unknown search mode [{$mode}].");
        }

        $this->searchMode = $mode;

        return $this;
    }

    /**
     * Columns searched THROUGH a relation, without declaring a join.
     *
     * AN EXPLICIT MAP, NOT DOTTED STRINGS IN `searchable()`. The entries there
     * are already qualified `table.column`, so `plans.name` is ambiguous
     * between "the joined plans table" and "the plans() relation" - and an
     * ambiguity in what gets searched is one nobody notices until the answer
     * is wrong. Here the relation is named as a relation and nothing has to
     * be guessed.
     *
     * `whereHas` rather than a join, deliberately: a join against a has-many
     * duplicates parent rows and breaks keyset pagination, while an EXISTS
     * subquery answers "does any related row match" without multiplying
     * anything. The related model's own global scopes apply inside it, so
     * tenancy holds on the far side of the relation too.
     *
     * @param  array<string, list<string>>  $relations  relation => columns
     */
    public function searchableRelations(array $relations): self
    {
        $this->searchableRelations = $relations;

        return $this;
    }

    /** Whether a multi-word term is ANDed word by word - see `applySearch()`. */
    public function splitSearchTerms(bool $split): self
    {
        $this->splitSearchTerms = $split;

        return $this;
    }

    /**
     * Footer aggregates, keyed by column key.
     *
     * @param  array<string, array{summarizer: Summarizer, column: string}>  $summaries
     */
    public function summaries(array $summaries): self
    {
        $this->summaries = $summaries;

        return $this;
    }

    /** @param list<Filter> $filters */
    public function filters(array $filters): self
    {
        $this->filters = $filters;

        /*
         * A QUERY BUILDER IS TOLD WHAT IT MAY TARGET, HERE AND NOWHERE ELSE.
         *
         * It offers only columns the resource already filters on, so it adds
         * no new way to reach anything. Wiring that by hand in the resource
         * would be a SECOND place the allow-list is decided - and the one
         * nobody updates when a filter is added or removed, which is how a
         * builder ends up offering a column the resource stopped exposing.
         */
        foreach ($this->filters as $filter) {
            if ($filter instanceof QueryBuilderFilter) {
                $filter->over($this->filters);
            }
        }

        return $this;
    }

    public function defaultSort(string $key, string $direction = 'desc'): self
    {
        $this->defaultSort = $key;
        $this->defaultDirection = $direction;

        return $this;
    }

    public function perPage(int $perPage): self
    {
        $this->perPage = $perPage;

        return $this;
    }

    /** @param list<int> $options */
    public function perPageOptions(array $options): self
    {
        $this->perPageOptions = $options;

        return $this;
    }

    /**
     * Status tabs with counts from ONE grouped query (addendum C1).
     *
     * Takes the already-built `Tabs` object rather than rebuilding one from
     * `$column`/`$values` - `Table::tabs()`'s optional configure closure
     * (`Tabs::modifyQuery()`) runs against the caller's instance, and a
     * fresh `Tabs::make()` here would silently drop every modifier it set.
     */
    public function tabs(Tabs $tabs): self
    {
        $this->tabs = $tabs;

        return $this;
    }

    /** keyset (default) or offset. See the property docblock for the trade. */
    public function paginationStrategy(string $strategy): self
    {
        if (! in_array($strategy, ['keyset', 'offset'], true)) {
            throw new InvalidArgumentException("Unknown pagination strategy [{$strategy}].");
        }

        $this->paginationStrategy = $strategy;

        return $this;
    }

    /** deferred (default), exact, approximate, or none. */
    public function countStrategy(string $strategy): self
    {
        if (! in_array($strategy, ['deferred', 'exact', 'approximate', 'none'], true)) {
            throw new InvalidArgumentException("Unknown count strategy [{$strategy}].");
        }

        $this->countStrategy = $strategy;

        return $this;
    }

    /** Qualified primary key, used as the keyset tiebreaker. */
    public function keyColumn(string $column): self
    {
        $this->keyColumn = $column;

        return $this;
    }

    /**
     * @param  list<array{0: Group, 1: string}>  $groups  [Group, qualified column]
     */
    public function grouping(array $groups, ?string $defaultKey, bool $picker): self
    {
        $this->availableGroups = $groups;
        $this->defaultGroupKey = $defaultKey;
        $this->groupPicker = $picker;

        return $this;
    }

    /**
     * @deprecated Use {@see grouping()}. Kept for callers that already picked a group.
     */
    public function groupRowsBy(string $key, string $column): self
    {
        Deprecation::warn(__METHOD__, 'grouping()');
        $this->groupKey = $key;
        $this->groupColumn = $column;
        $this->activeGroup = Group::make($key);

        return $this;
    }

    /**
     * @param  list<RecordAction|ActionGroup>  $actions
     */
    /**
     * Read this table's state from `?{namespace}[sort]=…` instead of `?sort=…`.
     *
     * Set by `Workspace`, never by a resource index. The name must be a plain
     * identifier: it becomes a query-string key and, on the client, a prop name.
     */
    public function within(string $namespace): self
    {
        if (preg_match('/^[a-z][a-z0-9_]*$/', $namespace) !== 1) {
            throw new InvalidArgumentException("[{$namespace}] is not a valid table namespace.");
        }

        $this->namespace = $namespace;

        return $this;
    }

    public function namespaceName(): ?string
    {
        return $this->namespace;
    }

    /** @param list<RecordAction|ActionGroup> $actions */
    public function recordActions(array $actions): self
    {
        $this->recordActions = $actions;

        return $this;
    }

    /**
     * Which declared actions apply to this row, and where the links point.
     *
     * SENT AS KEYS, NOT AS MENUS. The labels, icons and confirmation copy are
     * identical for every row, so they travel once in the schema; repeating
     * them per row would be 25 copies of the same menu in every page payload.
     *
     * Evaluated against the ROW ARRAY - no model is hydrated, which is the
     * whole reason the list is fast on a million rows.
     *
     * Returns null when the resource declares no actions at all, so the client
     * can tell "no filtering needed" apart from "nothing is available".
     *
     * @param  array<string, mixed>  $row
     * @return array{keys: list<string>, urls: array<string, string>}|null
     */
    private function actionsFor(array $row): ?array
    {
        if ($this->recordActions === []) {
            return null;
        }

        $keys = [];
        $urls = [];

        foreach ($this->recordActions as $entry) {
            $actions = $entry instanceof ActionGroup
                ? $entry->getActions()
                : [$entry];

            foreach ($actions as $action) {
                if (! $action->appliesTo($row)) {
                    continue;
                }

                $keys[] = $action->key;

                if ($action->isLink()) {
                    $urls[$action->key] = (string) $action->urlFor($row);
                }
            }
        }

        return ['keys' => $keys, 'urls' => $urls];
    }

    /**
     * Transform, then annotate. In that order, deliberately - a transform may
     * rename or derive the very columns a `visible()` predicate reads.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    private function decorate(array $rows): array
    {
        if ($this->transform !== null) {
            $rows = array_map($this->transform, $rows);
        }

        if ($this->activeGroup !== null) {
            $rows = array_map(fn (array $row): array => $this->annotateGroup($row), $rows);
        }

        if ($this->recordActions === []) {
            return $rows;
        }

        /*
         * ONE LOOK AT THE WHOLE PAGE BEFORE ANY ROW IS ASKED ABOUT.
         *
         * An action's `visible()` sees one row and nothing else, so a predicate
         * that needs the record - not the row, the RECORD - has no choice but to
         * load it, and it does that once per row. That is an N+1 that no column
         * declares and no query log attributes to the list: it is spent deciding
         * which menu entries to draw.
         *
         * This hook is the batch point that was missing. It runs once with every
         * row on the page, which is where a predicate's dependencies can be
         * fetched in a single query and held for the per-row pass below.
         */
        if ($this->prepareRows !== null) {
            ($this->prepareRows)($rows);
        }

        return array_map(function (array $row): array {
            $resolved = $this->actionsFor($row);

            return $resolved === null
                ? $row
                : [...$row, '_actions' => $resolved['keys'], '_actionUrls' => $resolved['urls']];
        }, $rows);
    }

    /**
     * Stamp the clustering key and heading onto a fetched row.
     *
     * `__group` is what the client compares and what a date-group cursor
     * carries. `__groupTitle` is what the heading prints, which may be a
     * custom title rather than the raw value.
     *
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>
     */
    private function annotateGroup(array $row): array
    {
        if ($this->activeGroup === null) {
            return $row;
        }

        $row['__group'] = $this->activeGroup->clusterKey($row[$this->activeGroup->key()] ?? null);
        $row['__groupTitle'] = $this->activeGroup->title($row);

        return $row;
    }

    public function transform(Closure $transform): self
    {
        $this->transform = $transform;

        return $this;
    }

    /**
     * Run `$prepare` once with the whole page of rows, before per-row action
     * visibility is resolved.
     *
     * @param  Closure(list<array<string, mixed>>): void  $prepare
     */
    public function prepareRows(Closure $prepare): self
    {
        $this->prepareRows = $prepare;

        return $this;
    }

    /**
     * Rows among $ids that changed since $since.
     *
     * This is what makes the poll driver cheap enough to be the default. It is
     * NOT the polling S8 warns against - that warning is about re-rendering a
     * component server-side once per viewer per tick, so cost scales with
     * audience. This asks one bounded, indexed question:
     *
     *     WHERE id IN (visible ids) AND updated_at > ?
     *
     * The id set is capped by the page size, so the query is O(page), never
     * O(table), and it returns only rows that actually changed - usually none,
     * in which case the response is an empty array.
     *
     * @param  list<int|string>  $ids  Ids currently on screen.
     * @return list<array<string, mixed>>
     */
    public function changedSince(array $ids, string $since): array
    {
        $this->assertEloquentSource('live updates');

        if ($ids === []) {
            return [];
        }

        /** @var \Illuminate\Database\Eloquent\Builder $eloquent */
        $eloquent = $this->model::query();

        // The diff SELECTS the same columns the list does, joined ones included,
        // so this join is always needed - unlike the count paths in base().
        if ($this->join !== null) {
            ($this->join)($eloquent);
        }

        // toBase() applies the tenant scope, so a crafted id list can only ever
        // return rows this tenant already owns.
        $rows = $eloquent->toBase()
            ->select($this->selectedColumns())
            ->whereIn($this->keyColumn, $ids)
            // Parsed, not passed through. The client sends ISO-8601 with an
            // offset (2026-07-27T09:15:00+00:00) while the column holds
            // 'Y-m-d H:i:s', and comparing those as strings silently matches
            // nothing - an endpoint that returns 200 and an empty array forever.
            ->where($this->qualifiedUpdatedAt(), '>', $this->normaliseTimestamp($since))
            ->limit(count($ids))
            ->get()
            ->map(static fn (object $r): array => (array) $r)
            ->all();

        return $this->transform === null ? array_values($rows) : array_values(array_map($this->transform, $rows));
    }

    /**
     * Client timestamp to a comparable database value, in UTC.
     *
     * Returns a far-future value on garbage input rather than throwing or
     * defaulting to the epoch: the epoch would return every row on every poll,
     * which is the expensive wrong answer.
     */
    private function normaliseTimestamp(string $since): string
    {
        try {
            return Carbon::parse($since)->utc()->format('Y-m-d H:i:s');
        } catch (\Throwable) {
            return Carbon::now()->addCentury()->format('Y-m-d H:i:s');
        }
    }

    /**
     * Whether anything applied to this query references a JOINED column.
     *
     * Columns are declared table-qualified throughout, so "belongs to the base
     * table" is decidable from the name. Anything unqualified is assumed to be
     * the base table, which is how an unqualified column already behaves in the
     * generated SQL.
     *
     * Conservative by construction: if this cannot prove the join is
     * unnecessary it keeps it, so the worst case is the cost it has today.
     *
     * @param  TableState  $state
     */
    private function joinRequired(array $state): bool
    {
        $table = (new $this->model)->getTable();

        $isJoined = static fn (string $column): bool => str_contains($column, '.')
            && ! str_starts_with($column, $table.'.');

        // A search touches every searchable column, so any joined one counts.
        if ($state['search'] !== '') {
            foreach ($this->searchable as $column) {
                if ($isJoined($column)) {
                    return true;
                }
            }
        }

        foreach ($this->filters as $filter) {
            $value = $state['filters'][$filter->key] ?? null;

            // Only APPLIED filters matter - a declared filter nobody used adds
            // no predicate. The trashed filter always applies, and always
            // targets the base table's own deleted_at.
            if ($value === null && ! $filter instanceof TrashedFilter) {
                continue;
            }

            if ($isJoined($filter->resolvedColumn())) {
                return true;
            }
        }

        if ($this->tabs !== null && $isJoined($this->tabs->column)) {
            return true;
        }

        return false;
    }

    /**
     * Every declared aggregate, in ONE query over the filtered set.
     *
     * The naive version runs a query per summarised column, which is the same
     * N+1 shape as counting tabs one at a time - invisible at two columns and a
     * full extra scan each at five. One SELECT with several aggregate
     * expressions costs exactly one pass.
     *
     * Aliases are derived from the column KEY and sanitised, because they are
     * interpolated into the SELECT alongside the aggregate.
     *
     * @param  TableState  $state
     * @return array<string, int|float|null>
     */
    private function summarise(array $state): array
    {
        // The join is only needed if an aggregate reads a joined column - the
        // same question the counts ask, and usually the same answer.
        $needsJoin = $this->joinRequired($state);

        foreach ($this->summaries as $summary) {
            $column = $summary['summarizer']->readsColumn() ?? $summary['column'];

            if (str_contains($column, '.') && ! str_starts_with($column, (new $this->model)->getTable().'.')) {
                $needsJoin = true;

                break;
            }
        }

        $query = $this->base($state, forCount: ! $needsJoin);

        $expressions = [];
        $aliases = [];

        foreach ($this->summaries as $key => $summary) {
            // Derived from the declared key, never from input, and stripped to
            // an identifier because it lands in the SELECT unquoted.
            $alias = 'pk_sum_'.preg_replace('/[^a-zA-Z0-9_]/', '_', $key);

            $expressions[] = $summary['summarizer']->expression($alias, $summary['column']);
            $aliases[$key] = $alias;
        }

        $row = $query->selectRaw(implode(', ', $expressions))->first();

        $out = [];

        foreach ($aliases as $key => $alias) {
            $value = $row?->{$alias};

            // Null means "no matching rows", which is a real answer and not
            // zero: an average over nothing is not 0, it is undefined.
            $out[$key] = $value === null ? null : (float) $value;
        }

        return $out;
    }

    private function hasTrashedFilter(): bool
    {
        foreach ($this->filters as $filter) {
            if ($filter instanceof TrashedFilter) {
                return true;
            }
        }

        return false;
    }

    private function qualifiedUpdatedAt(): string
    {
        // Qualified, because the list may join another table that also has an
        // updated_at and an unqualified column is ambiguous the moment it does.
        $table = str_contains($this->keyColumn, '.')
            ? substr($this->keyColumn, 0, strpos($this->keyColumn, '.'))
            : (new $this->model)->getTable();

        return "{$table}.updated_at";
    }

    /**
     * A SINGLE record, through the same select and joins the list uses.
     *
     * The detail page renders the table's columns, so it must fetch them the
     * same way. Reading the raw model instead silently drops every joined
     * column - the Plan field rendered an em dash, which an operator reads as
     * "this client has no plan" rather than "this value was not loaded".
     *
     * @return array<string, mixed>|null
     */
    public function find(int|string $id): ?array
    {
        $this->assertEloquentSource('record lookup');

        /** @var \Illuminate\Database\Eloquent\Builder $eloquent */
        $eloquent = $this->model::query();

        if ($this->join !== null) {
            ($this->join)($eloquent);
        }

        // toBase() applies the tenant global scope before dropping to the query
        // builder, so another tenant's record is simply not found.
        $row = $eloquent->toBase()
            ->select($this->selectedColumns())
            ->where($this->keyColumn, $id)
            ->first();

        if ($row === null) {
            return null;
        }

        $row = (array) $row;

        return $this->transform === null ? $row : ($this->transform)($row);
    }

    /**
     * The set a bulk action or an export should operate on.
     *
     * REBUILT FROM THE REQUEST, NEVER TRUSTED FROM THE CLIENT. The browser
     * sends the same filter parameters it used to draw the table, and this
     * re-derives the query from them - it does not accept a row count, a list
     * of "everything", or a where clause. The only thing the client can widen
     * is which of its OWN visible rows are included.
     *
     * `$ids` is an intersection, not a source of truth: it narrows the already
     * scoped set. An id belonging to another tenant survives the whereIn and is
     * then removed by the global scope, so a forged selection matches nothing
     * rather than reaching across the boundary.
     *
     * Passing null means "everything matching the current filters", which is
     * the select-all-matching case §8 requires.
     *
     * @param  list<int|string>|null  $ids
     */
    public function matching(Request $request, ?array $ids = null): Builder
    {
        $this->assertEloquentSource('bulk selection');

        $query = $this->base($this->readState($request));

        if ($ids !== null) {
            $query->whereIn($this->qualifiedKey(), $ids);
        }

        return $query;
    }

    /**
     * Walk the whole filtered set in chunks, for an export.
     *
     * Reuses the list's own select, joins and row transform, so the export
     * carries the same VALUES the table was built from - a joined plan name
     * where the screen shows a plan name, rather than the raw `plan_id`.
     * Rebuilding the query separately is how an export ends up full of foreign
     * keys that nobody notices until a customer opens the file.
     *
     * Per-column PRESENTATION is deliberately not applied: casing, date
     * formatting and badge styling are decided in the Vue layer, so a status
     * exports as `suspended` rather than `Suspended` and a date as an ISO-ish
     * timestamp rather than "27 May 2026". A CSV is read by spreadsheets and
     * scripts, and a machine-readable date beats a prettier one.
     *
     * KEYSET, not OFFSET, for the same reason the runner is: at 100k rows
     * `OFFSET 90000` re-walks ninety thousand rows to skip them, so the last
     * chunk costs the most and the export gets slower the longer it runs.
     * There is no shrinking-set hazard here - an export does not write - but
     * the cost argument alone settles it.
     *
     * @param  list<int|string>|null  $ids
     * @param  Closure(list<array<string, mixed>>): (bool|void)  $callback  Return false to stop.
     * @return int Rows emitted.
     */
    public function eachMatching(Request $request, ?array $ids, int $chunkSize, Closure $callback): int
    {
        $this->assertEloquentSource('exports');

        $state = $this->readState($request);
        $key = $this->qualifiedKey();

        $emitted = 0;
        $after = null;

        while (true) {
            $query = $this->base($state)->select($this->selectedColumns());

            if ($ids !== null) {
                $query->whereIn($key, $ids);
            }

            if ($after !== null) {
                $query->where($key, '>', $after);
            }

            $rows = $query->orderBy($key)->limit($chunkSize)->get()->all();

            if ($rows === []) {
                break;
            }

            $mapped = array_map(static fn (object $row): array => (array) $row, $rows);

            if ($this->transform !== null) {
                $mapped = array_map($this->transform, $mapped);
            }

            if ($callback($mapped) === false) {
                break;
            }

            $emitted += count($mapped);
            /*
             * BY THE ROW'S KEY NAME, not the key COLUMN. See `rowKeyName()`:
             * a qualified `audit_entries.id` never appears as a row key, so this
             * read null, the loop broke after the first chunk, and an export of
             * a joined resource silently produced one page of rows and called it
             * the whole file.
             */
            $after = ((array) end($rows))[$this->rowKeyName()] ?? null;

            if (count($rows) < $chunkSize || $after === null) {
                break;
            }
        }

        return $emitted;
    }

    /** The key column, table-qualified when the list joins. */
    public function qualifiedKey(): string
    {
        if (str_contains($this->keyColumn, '.')) {
            return $this->keyColumn;
        }

        return (new $this->model)->getTable().'.'.$this->keyColumn;
    }

    public function keyColumnName(): string
    {
        return $this->keyColumn;
    }

    /**
     * The key as it appears on a ROW, which is not the same as the key column.
     *
     * A resource that joins declares `keyColumn('audit_entries.id')`, because
     * an unqualified `id` is ambiguous in SQL the moment a second table is in
     * the query. The rows that come back are keyed by the SELECT alias, which
     * has no table prefix - so reading `$row['audit_entries.id']` finds nothing
     * and reading `$row['id']` finds it.
     *
     * THIS EXISTED AS AN ASSUMPTION IN TWO PLACES AND WAS WRONG IN BOTH. The
     * cursor did `(int) $last['id']` outright, so the Activity screen - the one
     * resource with a qualified key and a join - died with `Undefined array key
     * "id"` the moment it had more than one page of rows. Under a page it never
     * fired, because a last page encodes no cursor at all, which is why every
     * test passed: the suite creates a handful of entries and the seeded
     * database has thousands.
     */
    private function rowKeyName(): string
    {
        return str_contains($this->keyColumn, '.')
            ? substr($this->keyColumn, strrpos($this->keyColumn, '.') + 1)
            : $this->keyColumn;
    }

    /**
     * Guarantee the row key is in the SELECT, even when the caller listed
     * display columns and forgot it.
     *
     * Without this, every row arrives with no identity, Vue keys every
     * checkbox on `undefined`, and ticking one row selects the page.
     */
    private function ensureKeyIsSelected(): void
    {
        if ($this->select === [] || in_array('*', $this->select, true)) {
            return;
        }

        $expression = $this->keySelectExpression();
        $bare = $this->rowKeyName();

        foreach ($this->select as $column) {
            if (! is_string($column)) {
                continue;
            }

            if ($column === $expression || $column === $this->keyColumn || $column === $bare) {
                return;
            }

            if (stripos($column, ' as '.$bare) !== false) {
                return;
            }
        }

        $this->select[] = $expression;
    }

    /** The SELECT term that puts {@see rowKeyName()} on every fetched row. */
    private function keySelectExpression(): string
    {
        $column = $this->keyColumn;
        $bare = $this->rowKeyName();

        if (! str_contains($column, '.')) {
            return $column;
        }

        $suffix = substr($column, strrpos($column, '.') + 1);

        return $suffix === $bare ? $column : "{$column} as {$bare}";
    }

    /** @return list<string|QueryExpression> The columns the list selects. */
    public function selectedColumns(): array
    {
        $this->ensureKeyIsSelected();

        return $this->select;
    }

    public function run(Request $request): ListResult
    {
        if ($this->dataProvider === null && $this->sortable === []) {
            throw new InvalidArgumentException('A list query must declare at least one sortable column.');
        }

        if ($this->dataProvider === null && ! array_key_exists($this->defaultSort, $this->sortable)) {
            throw new InvalidArgumentException(
                "Default sort [{$this->defaultSort}] is not in the sortable allowlist."
            );
        }

        $state = $this->readState($request);

        $this->activateGroup($state['group'] ?? null);

        // Request-supplied per-page, but only if it is on the allowlist.
        $requested = (int) $this->param($request, 'perPage', (string) $this->perPage);
        $perPage = in_array($requested, $this->perPageOptions, true) ? $requested : $this->perPage;

        if ($this->dataProvider !== null) {
            $provided = $this->dataProvider->provide($request, $state, $perPage);

            return new ListResult(
                records: $this->decorate($provided->records),
                state: $state,
                filterSchema: array_map(static fn (Filter $f): array => $f->toArray(), $this->filters),
                nextCursor: $provided->hasMore ? $provided->nextCursor : null,
                perPage: $perPage,
                perPageOptions: $this->perPageOptions,
                tabs: $this->tabs === null ? [] : $this->tabs->values,
                tabCounts: null,
                summary: null,
                total: static fn (): int => $provided->total,
                countStrategy: 'exact',
                indicators: $this->indicatorsFor($state['filters']),
                groupBy: $this->activeGroup?->toSchema(),
            );
        }

        /*
         * ONE ROW MORE THAN THE PAGE, and the extra row is never shown.
         *
         * "The page was full, so there is probably more" is not a fact, it is a
         * guess - and it is wrong exactly when the row count is a multiple of
         * the page size. With 20 routers and a page of 10, page 2 came back
         * full, so a cursor was issued, so Next stayed enabled, so page 3
         * rendered "No routers yet" under a paginator reading "3 of 2".
         *
         * Asking for `perPage + 1` replaces the guess with an answer: if the
         * extra row exists there IS a next page, and if it does not there is
         * not. The cost is reading one row that gets discarded, which is the
         * cheapest possible way to know.
         */
        $rows = $this->fetch($state, $perPage);

        $hasMore = count($rows) > $perPage;

        // The probe row is dropped before anything sees it.
        $rows = $hasMore ? array_slice($rows, 0, $perPage) : $rows;

        // Derived from the actual last row of the PAGE rather than trusted from
        // the client.
        $last = $rows === [] ? null : $rows[array_key_last($rows)];

        /*
         * The cursor carries EVERY ordering value, in the order they are sorted
         * by - read from the row's own keys rather than from the qualified
         * columns, because that is the shape the client got.
         */
        $nextCursor = $last === null || ! $hasMore
            ? null
            : Cursor::encode(
                array_map(
                    fn (string $key): mixed => $last[$key] ?? null,
                    $this->cursorRowKeys($state['sort']),
                ),
                (int) ($last[$this->rowKeyName()] ?? 0),
            );

        return new ListResult(
            records: $rows,
            state: $state,
            filterSchema: array_map(static fn (Filter $f): array => $f->toArray(), $this->filters),
            nextCursor: $nextCursor,
            perPage: $perPage,
            perPageOptions: $this->perPageOptions,
            tabs: $this->tabs === null ? [] : $this->tabs->values,
            // Counts come from the query WITHOUT the tab constraint - with it,
            // every tab except the active one would read zero, which looks like
            // real data rather than a bug. Deferred so they never block rows.
            // ALL summaries in ONE query. Five summarised columns must not be
            // five scans of the same filtered set.
            summary: $this->summaries === [] ? null : fn (): array => $this->summarise($state),
            tabCounts: $this->tabs === null
                ? null
                : fn (): array => $this->tabs->counts($this->base($state, applyTab: false, forCount: true)),
            // A closure, not a number. The caller wraps it in Inertia::defer()
            // so the rows paint before any COUNT runs (§10).
            total: $this->totalResolver($state),
            countStrategy: $this->countStrategy,
            indicators: $this->indicatorsFor($state['filters']),
            groupBy: $this->activeGroup?->toSchema(),
        );
    }

    /**
     * How the total is produced, per the declared strategy.
     *
     * @param  TableState  $state
     * @return Closure(): ?int
     */
    private function totalResolver(array $state): Closure
    {
        return match ($this->countStrategy) {
            'none' => static fn (): ?int => null,

            /*
             * Engine statistics: instant, and approximate. Postgres keeps
             * reltuples on pg_class and it is close enough for "about 500k"
             * while costing nothing. It is only valid UNFILTERED - a filtered
             * approximate count would be a number that looks precise and is
             * simply wrong, so this falls back to an exact count the moment any
             * filter or search is applied.
             */
            'approximate' => fn (): ?int => $this->isUnfiltered($state)
                ? $this->approximateTotal()
                : $this->base($state, forCount: true)->count(),

            default => fn (): int => $this->base($state, forCount: true)->count(),
        };
    }

    /** @param TableState $state */
    private function isUnfiltered(array $state): bool
    {
        if ($state['search'] !== '' || $state['tab'] !== null) {
            return false;
        }

        foreach ($state['filters'] as $value) {
            if ($value !== null) {
                return false;
            }
        }

        return true;
    }

    /**
     * Row estimate from engine statistics.
     *
     * Postgres only. Every other engine falls back to an exact count rather
     * than guessing - MySQL's information_schema.TABLE_ROWS is unreliable
     * enough on InnoDB to be misleading, and SQLite has nothing.
     */
    private function approximateTotal(): ?int
    {
        $connection = $this->model::query()->getConnection();

        if ($this->driverName($connection) !== 'pgsql') {
            return $this->base([
                'tab' => null,
                'search' => '',
                'filters' => [],
                'sort' => $this->defaultSort,
                'direction' => 'desc',
                'cursor' => null,
                'page' => 1,
                'group' => null,
            ], forCount: true)->count();
        }

        $table = (new $this->model)->getTable();

        $row = $connection->selectOne(
            'select reltuples::bigint as estimate from pg_class where relname = ?',
            [$table],
        );

        return $row === null ? null : max(0, (int) $row->estimate);
    }

    /**
     * @return TableState
     */
    private function readState(Request $request): array
    {
        $sort = (string) $this->param($request, 'sort', $this->defaultSort);
        $direction = strtolower((string) $this->param($request, 'direction', $this->defaultDirection));

        $filters = [];

        foreach ($this->filters as $filter) {
            // Deliberately preserved even when null, so the frontend can tell
            // "filter exists but is unset" from "filter does not exist".
            $filters[$filter->key] = $filter->normalise($this->param($request, $filter->key));
        }

        return [
            'tab' => $this->tabs?->normalise($this->param($request, 'tab')),
            'search' => trim((string) $this->param($request, 'search', '')),
            'sort' => array_key_exists($sort, $this->sortable) ? $sort : $this->defaultSort,
            'direction' => $direction === 'asc' ? 'asc' : 'desc',
            'cursor' => $this->param($request, 'cursor') ? (string) $this->param($request, 'cursor') : null,
            'page' => max(1, (int) $this->param($request, 'page', 1)),
            'filters' => $filters,
            'group' => $this->param($request, 'group'),
        ];
    }

    /**
     * One query parameter, read from this table's own namespace.
     *
     * WHY A NAMESPACE EXISTS AT ALL: a workspace page hosts several independent
     * tables, and every one of them wants to be called `page`, `sort` and
     * `search`. Sharing the flat query string means paging the redemption
     * history also pages the active rewards beside it, and neither table can
     * express its own state in a shareable URL.
     *
     * BRACKET NOTATION rather than a `history_page` prefix: `?history[page]=2`
     * parses into a nested array natively, so there is no delimiter to collide
     * with a column name that happens to contain an underscore - and every
     * column name in this application contains an underscore.
     *
     * An unnamespaced table reads the flat query string exactly as before, which
     * is what keeps every existing resource URL working and shareable.
     */
    private function param(Request $request, string $name, mixed $default = null): mixed
    {
        if ($this->namespace === null) {
            return $request->query($name, $default);
        }

        $scoped = $request->query($this->namespace);

        if (! is_array($scoped)) {
            return $default;
        }

        return $scoped[$name] ?? $default;
    }

    /**
     * @param  TableState  $state
     * @return list<array<string, mixed>>
     */
    private function fetch(array $state, int $perPage): array
    {
        /*
         * The probe is applied to the LIMIT only, never to the offset.
         *
         * `forPage($page, $size)` derives its offset from the size it is given,
         * so inflating the size here would move the window: page 2 of a 10-row
         * table would start at row 11 instead of row 10 and quietly skip one.
         * The offset uses the real page size; only the fetch limit is one
         * larger.
         */
        $limit = $perPage + 1;

        $column = $this->sortable[$state['sort']];
        $direction = $this->sqlDirection($state['direction']);

        $terms = $this->orderingTerms($state['sort'], $column);

        $query = $this->base($state)->select($this->selectedColumns());

        if ($this->searchMode === 'relevance' && $state['search'] !== '') {
            $driver = $this->driverName($query->getConnection());
            [$expression, $bindings] = $this->relevanceOrdering(
                (string) $state['search'],
                $driver === 'pgsql' ? 'ilike' : 'like',
            );

            if ($expression !== null) {
                $query->orderBy(AllowListedQueryExpression::fromValidated($expression), 'desc');
                foreach ($bindings as $binding) {
                    $query->addBinding($binding, 'order');
                }
            }
        }

        /*
         * Group first, then the chosen sort. That single extra ORDER BY term is
         * the whole of grouping - rows arrive clustered, and the client inserts
         * a heading wherever the value changes.
         */
        foreach ($terms as $term) {
            if ($term['raw']) {
                $query->orderBy(AllowListedQueryExpression::fromValidated($term['sql']), $direction);
            } else {
                $query->orderBy($term['sql'], $direction);
            }
        }

        /*
         * The tiebreaker is also the trailing column on every sort index.
         * Without it the seek below is ambiguous and rows repeat or vanish
         * across page boundaries.
         *
         * QUALIFIED, via the helper that exists for exactly this. It used to
         * order by the raw `keyColumn`, which is `id` unless a resource says
         * otherwise - so the first table to declare a join produced
         * "ambiguous column name: id" and nothing in the message pointed at the
         * tiebreaker. Resources should still set `keyColumn`, but forgetting it
         * is now a working query rather than a broken page.
         */
        $query->orderBy($this->qualifiedKey(), $direction);

        if ($this->paginationStrategy === 'offset') {
            // Explicitly opt-in. Fine on a small table, and the reason page
            // 2,000 is slow on a large one.
            $page = max(1, $state['page']);
            $query->forPage($page, $perPage);
        } else {
            $this->applyCursor($query, $state, $terms, $direction);
        }

        $rows = array_values(array_map(
            static fn (object $row): array => (array) $row,
            $query->limit($limit)->get()->all(),
        ));

        return $this->decorate($rows);
    }

    /**
     * @param  TableState  $state
     */
    private function base(array $state, bool $applyTab = true, bool $forCount = false): Builder
    {
        /** @var \Illuminate\Database\Eloquent\Builder $eloquent */
        $eloquent = $this->model::query();

        /*
         * A TRASHED FILTER TAKES OVER THE SOFT-DELETE PREDICATE.
         *
         * Eloquent's soft-delete scope is resolved by `toBase()` below, long
         * before a filter runs, so a filter cannot lift it afterwards. When the
         * table declares a TrashedFilter the scope is removed here and the
         * filter applies `deleted_at IS NULL` itself - one place decides, in a
         * form the index can serve.
         *
         * ONLY when the filter is declared. Removing the scope unconditionally
         * would make every table without one start listing deleted records,
         * which is the kind of change that looks like a data bug.
         */
        if ($this->hasTrashedFilter()) {
            $eloquent->withoutGlobalScope(SoftDeletingScope::class);
        }

        /*
         * THE JOIN IS SKIPPED FOR COUNTS THAT DO NOT NEED IT.
         *
         * A count selects no joined columns, so the join exists only to let a
         * FILTER or the SEARCH reference one. When nothing applied does, it is
         * pure cost - and at scale not a small one: counting a tenant's 200,000
         * clients took 503 ms through a LEFT JOIN to plans and 25 ms without
         * it, because every counted row did a primary-key lookup whose result
         * was then discarded.
         *
         * Twenty times, for a join nothing read.
         */
        if ($this->join !== null && ! ($forCount && ! $this->joinRequired($state))) {
            ($this->join)($eloquent);
        }

        /*
         * A CONSTRAINT ALWAYS APPLIES, INCLUDING TO COUNTS. This is the half the
         * optimisation above must never touch.
         *
         * The distinction is not pedantry - it was a real bug. A workspace table
         * put `whereNull('ended_at')` inside the join closure, which reads
         * naturally and is what the old single hook invited. Nothing needed the
         * join for a count, so the whole closure was skipped, and the "live
         * sessions" total came back as every session ever recorded. No error,
         * no warning, just a number that was wrong.
         *
         * Dropping a JOIN from a count is safe because a count selects no joined
         * columns. Dropping a WHERE changes the answer. Two hooks, because they
         * are two different things and only one of them is optional.
         */
        if ($this->constrain !== null) {
            ($this->constrain)($eloquent);
        }

        // The caller's hook, after the table's own constraint - see
        // modifyEloquent() for whose it is and why they are separate.
        if ($this->modifyEloquent !== null) {
            ($this->modifyEloquent)($eloquent);
        }

        /*
         * SEARCH IS APPLIED AT THE ELOQUENT STAGE, and moving it here is what
         * made relation search possible at all. It used to run on the base
         * builder after toBase(), where `whereHas` does not exist - and a
         * word must be allowed to match a column OR a relation inside ONE
         * predicate group, so the whole search has to live where both are
         * expressible. A WHERE is a WHERE wherever it is added; only the
         * vocabulary changes.
         */
        $this->applySearch($eloquent, (string) $state['search']);

        // toBase() applies global scopes (including tenant scoping) before
        // handing back the underlying query builder. Reaching for the query
        // builder directly would bypass them.
        $query = $eloquent->toBase();

        if ($applyTab && $this->tabs !== null && ($state['tab'] ?? null) !== null) {
            $this->tabs->apply($query, $state['tab']);
        }

        foreach ($this->filters as $filter) {
            $value = $state['filters'][$filter->key] ?? null;

            /*
             * A TRASHED FILTER ALWAYS APPLIES, even with no value.
             *
             * For every other filter, null means "not applied". For this one
             * null means "live records only" - the DEFAULT view - and skipping
             * it was a genuine bug in two ways at once. The soft-delete global
             * scope has been lifted above so this filter can own the decision,
             * so with nothing applied the list showed DELETED ROWS; and with no
             * `deleted_at` predicate the rebuilt indexes, which lead with it,
             * could not serve the sort, so a 1.6 ms list became 416 ms and a
             * temp B-tree over 200,000 rows.
             *
             * Correctness and performance failed together, which is what made
             * it obvious. Either alone would have been easy to miss.
             */
            if ($filter instanceof TrashedFilter) {
                $filter->apply($query, $value);

                continue;
            }

            // `!== null`, never a truthiness check - `false` is an applied
            // value for a BooleanFilter and must not be skipped.
            if ($value !== null) {
                $filter->apply($query, $value);
            }
        }

        return $query;
    }

    /**
     * The search predicate, one AND-group per word.
     *
     * WORD-prefix, not string-prefix. This was string-prefix only (`term%`)
     * because that is the shape a btree index can serve. It was also silently
     * wrong: names are stored as "Amina Achieng", so searching the surname
     * "Achieng" matched ZERO rows while returning HTTP 200 and an empty table.
     * An operator reads that as "no such customer", which is the exact failure
     * mode antipatterns.md opens with. So each column is matched two ways: at
     * the start of the value, which stays index-served, OR at the start of any
     * later word, which does not - the deliberate price of a search that
     * actually finds people. Substring-anywhere is still refused; it is
     * unbounded and belongs to a trigram index or FTS once the engine is
     * chosen.
     *
     * EVERY WORD MUST MATCH SOMETHING; a word may match ANY column - or any
     * declared relation. The whole phrase used to be one pattern, so "Amina
     * Achieng" only ever matched a single column containing those two words in
     * that order, adjacent. ANDing the words fixes that and narrows as you
     * type: each extra word can only remove rows. Within a word, columns and
     * relations are ORed, so it does not matter which field - or which side of
     * a relation - the word lives in. That is why relation search is inside
     * this method rather than beside it: "Amina Gold" must be one client on
     * one plan, not every Amina plus every gold plan.
     */
    /** @param EloquentBuilder<\Illuminate\Database\Eloquent\Model> $eloquent */
    private function applySearch(EloquentBuilder $eloquent, string $term): void
    {
        if ($term === '' || ($this->searchable === [] && $this->searchableRelations === [])) {
            return;
        }

        /*
         * POSTGRES `LIKE` IS CASE-SENSITIVE and the others are not, so the
         * same search that worked all through development returned nothing
         * on the one engine this is deployed to. `ILIKE` is Postgres's own
         * spelling of the case-insensitive match and needs no expression
         * wrapping - which matters, because wrapping the column in `lower()`
         * would also put it beyond any index that names the column plainly.
         */
        $like = $this->driverName($eloquent->getConnection()) === 'pgsql' ? 'ilike' : 'like';

        /*
         * A QUOTED PHRASE IS ONE TERM, and invisible characters are not terms
         * at all. Reading the term as CSV with a space separator gives quoting
         * for free - the syntax everybody already expects from a search box -
         * and the normalise step collapses runs of whitespace AND the Hangul
         * fillers U+3164 and U+1160, which ride along in pasted text, survive
         * `trim()`, and make an ordinary-looking term match nothing.
         */
        $normalised = preg_replace(
            '/(\s|\x{3164}|\x{1160})+/u',
            ' ',
            trim($term),
        ) ?? '';

        if ($this->searchMode === 'exact') {
            $eloquent->where(function (EloquentBuilder $q) use ($normalised): void {
                foreach ($this->searchable as $i => $column) {
                    $method = $i === 0 ? 'where' : 'orWhere';
                    $q->{$method}($column, '=', $normalised);
                }

                foreach ($this->searchableRelations as $relation => $columns) {
                    $q->orWhereHas($relation, static function (EloquentBuilder $related) use ($columns, $normalised): void {
                        $related->where(function (EloquentBuilder $inner) use ($columns, $normalised): void {
                            foreach ($columns as $i => $column) {
                                $method = $i === 0 ? 'where' : 'orWhere';
                                $inner->{$method}($column, '=', $normalised);
                            }
                        });
                    });
                }
            });

            return;
        }

        /*
         * SPLITTING IS RIGHT FOR NAMES AND WRONG FOR REFERENCES.
         *
         * ANDing the words is what makes "Amina Achieng" find a person whose
         * name is spread over two columns. It is exactly wrong for an
         * identifier that legitimately CONTAINS a space - an invoice reference
         * like `INV 2026 0042`, a postcode, a serial - because each fragment
         * is then required to match something on its own, and a reference is
         * one atom that happens to have spaces in it. Quoting works, and
         * nobody types quotes around the number printed on the thing in their
         * hand.
         *
         * A table whose search is a lookup rather than a name search declares
         * `->splitsSearchTerms(false)` and gets the whole phrase as one term.
         */
        $words = $this->splitSearchTerms
            ? array_values(array_filter(
                str_getcsv($normalised, separator: ' ', enclosure: '"', escape: '\\'),
                static fn (?string $word): bool => $word !== null && trim($word) !== '',
            ))
            : [$normalised];

        foreach ($words as $word) {
            $escaped = str_replace(['%', '_'], ['\%', '\_'], $word);
            $startsWith = $escaped.'%';
            $wordStart = '% '.$escaped.'%';

            $eloquent->where(function (EloquentBuilder $q) use ($startsWith, $wordStart, $like): void {
                foreach ($this->searchable as $i => $searchColumn) {
                    if ($i === 0) {
                        $q->where($searchColumn, $like, $startsWith);
                    } else {
                        $q->orWhere($searchColumn, $like, $startsWith);
                    }

                    $q->orWhere($searchColumn, $like, $wordStart);
                }

                foreach ($this->searchableRelations as $relation => $columns) {
                    $q->orWhereHas(
                        $relation,
                        static function (EloquentBuilder $related) use ($columns, $startsWith, $wordStart, $like): void {
                            $related->where(
                                static function (EloquentBuilder $inner) use ($columns, $startsWith, $wordStart, $like): void {
                                    foreach ($columns as $i => $column) {
                                        if ($i === 0) {
                                            $inner->where($column, $like, $startsWith);
                                        } else {
                                            $inner->orWhere($column, $like, $startsWith);
                                        }

                                        $inner->orWhere($column, $like, $wordStart);
                                    }
                                },
                            );
                        },
                    );
                }
            });
        }
    }

    /** @return array{0: string|null, 1: list<string>} */
    private function relevanceOrdering(string $term, string $like): array
    {
        if ($this->searchable === []) {
            return [null, []];
        }

        $normalised = preg_replace('/(\s|\x{3164}|\x{1160})+/u', ' ', trim($term)) ?? '';
        $escaped = str_replace(['%', '_'], ['\\%', '\\_'], $normalised);
        $startsWith = $escaped.'%';
        $pattern = '%'.$escaped.'%';
        $parts = [];
        $bindings = [];

        foreach ($this->searchable as $column) {
            $parts[] = "CASE WHEN {$column} = ? THEN 3 WHEN {$column} {$like} ? THEN 2 WHEN {$column} {$like} ? THEN 1 ELSE 0 END";
            $bindings[] = $normalised;
            $bindings[] = $startsWith;
            $bindings[] = $pattern;
        }

        return [implode(' + ', $parts), $bindings];
    }

    /**
     * The ORDER BY, minus the key: group first, then the chosen sort.
     *
     * ONE DEFINITION, used by the query, the cursor that is issued, and the
     * cursor that is read back. Three places deriving the same list separately
     * is how a seek ends up disagreeing with the sort it is seeking into, and
     * that bug looks like rows repeating or vanishing across page boundaries
     * rather than like an ordering mistake.
     *
     * The group column is dropped when it IS the sort column - ordering by a
     * column twice is harmless but makes the cursor carry a value the seek then
     * compares against itself. Date grouping of that same column still
     * clusters, because datetime order is date-then-time.
     *
     * @return list<array{rowKey: string, sql: string, raw: bool}>
     */
    private function orderingTerms(string $sortKey, string $sortColumn): array
    {
        $sort = ['rowKey' => $sortKey, 'sql' => $sortColumn, 'raw' => false];

        if ($this->groupColumn === null || $this->groupColumn === $sortColumn || $this->groupKey === $sortKey) {
            return [$sort];
        }

        $group = $this->groupDate
            ? ['rowKey' => '__group', 'sql' => 'date('.$this->wrapColumn($this->groupColumn).')', 'raw' => true]
            : ['rowKey' => $this->groupKey, 'sql' => $this->groupColumn, 'raw' => false];

        return [$group, $sort];
    }

    /** @return list<string> */
    private function cursorRowKeys(string $sortKey): array
    {
        return array_map(
            static fn (array $term): string => $term['rowKey'],
            $this->orderingTerms($sortKey, $this->sortable[$sortKey]),
        );
    }

    private function wrapColumn(string $column): string
    {
        return $this->model::query()->toBase()->getGrammar()->wrap($column);
    }

    private function assertEloquentSource(string $operation): void
    {
        if ($this->dataProvider !== null) {
            throw new InvalidArgumentException(
                "Custom table data providers are read-only and do not support {$operation}."
            );
        }
    }

    /**
     * Pick the grouping this request asked for, against the declared allowlist.
     *
     * WITHOUT A PICKER the default is always on and `?group=` is ignored: a
     * table that only ever clusters by status should not let a URL turn that
     * off. WITH A PICKER, `group=-` means none, an unknown key falls back to
     * the default, and a declared key is used.
     */
    private function activateGroup(mixed $requested): void
    {
        if ($this->availableGroups === []) {
            return;
        }

        $byKey = [];

        foreach ($this->availableGroups as [$group, $column]) {
            $byKey[$group->key()] = [$group, $column];
        }

        $key = is_string($requested) ? $requested : null;

        if (! $this->groupPicker) {
            $key = $this->defaultGroupKey;
        } elseif ($key === '-' || $key === '') {
            $this->groupKey = null;
            $this->groupColumn = null;
            $this->groupDate = false;
            $this->activeGroup = null;

            return;
        } elseif ($key === null || ! isset($byKey[$key])) {
            $key = $this->defaultGroupKey;
        }

        if ($key === null || ! isset($byKey[$key])) {
            $this->groupKey = null;
            $this->groupColumn = null;
            $this->groupDate = false;
            $this->activeGroup = null;

            return;
        }

        [$group, $column] = $byKey[$key];
        $this->activeGroup = $group;
        $this->groupKey = $group->key();
        $this->groupColumn = $column;
        $this->groupDate = $group->isDate();
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return list<array{key: string, label: string, removable: bool}>
     */
    private function indicatorsFor(array $filters): array
    {
        $out = [];

        foreach ($this->filters as $filter) {
            foreach ($filter->indicators($filters[$filter->key] ?? null) as $indicator) {
                $out[] = $indicator;
            }
        }

        return $out;
    }

    /**
     * The lexicographic keyset seek.
     *
     * For an order of `(a, b, id)` the predicate is
     *
     *     a > ?  OR (a = ? AND b > ?)  OR (a = ? AND b = ? AND id > ?)
     *
     * which is exactly "everything after this row in that ordering". Written as
     * a loop rather than by hand because the number of terms is now variable:
     * one column ungrouped, two grouped, and hardcoding either would silently
     * paginate wrongly in the other case.
     *
     * @param  TableState  $state
     * @param  list<array{rowKey: string, sql: string, raw: bool}>  $terms
     */
    private function applyCursor(Builder $query, array $state, array $terms, string $direction): void
    {
        $cursor = Cursor::decode($state['cursor']);

        if ($cursor === null) {
            return;
        }

        $operator = $direction === 'asc' ? '>' : '<';
        $key = $this->keyColumn;

        /*
         * A cursor from a DIFFERENT ordering cannot be honoured.
         *
         * Grouping can be turned on with a cursor already in the URL, and that
         * cursor carries one value where the seek now needs two. Resuming from
         * it would compare the old sort value against the group column and land
         * somewhere arbitrary, so the page restarts instead - which is what
         * every other state change already does.
         */
        if (count($cursor->values) !== count($terms)) {
            return;
        }

        /*
         * A NULL ordering value cannot be seeked against.
         *
         * `WHERE col < NULL` is not a comparison, it is an error - and even
         * spelled as `IS NULL` the ordering of nulls differs by engine, so
         * there is no seek that means "after this row" when the row's sort
         * value is null. Restarting the page is the only honest answer, and it
         * is the same thing every other unusable cursor does.
         */
        foreach ($cursor->values as $value) {
            if ($value === null) {
                return;
            }
        }

        $query->where(function (Builder $outer) use ($terms, $operator, $cursor, $key): void {
            foreach ($terms as $depth => $term) {
                $outer->orWhere(function (Builder $q) use ($terms, $depth, $operator, $cursor): void {
                    for ($i = 0; $i < $depth; $i++) {
                        $this->constrainTerm($q, $terms[$i], '=', $cursor->values[$i]);
                    }

                    $this->constrainTerm($q, $terms[$depth], $operator, $cursor->values[$depth]);
                });
            }

            $outer->orWhere(function (Builder $q) use ($terms, $operator, $cursor, $key): void {
                foreach ($terms as $i => $term) {
                    $this->constrainTerm($q, $term, '=', $cursor->values[$i]);
                }

                $q->where($key, $operator, $cursor->id);
            });
        });
    }

    /**
     * Return the driver only for Laravel's concrete connection implementation.
     * The public Eloquent/query contract intentionally exposes no driver method,
     * so non-standard connection implementations fail closed to the portable
     * SQL branch.
     */
    private function driverName(ConnectionInterface $connection): string
    {
        return $connection instanceof Connection ? $connection->getDriverName() : '';
    }

    /** @return 'asc'|'desc' */
    private function sqlDirection(string $direction): string
    {
        return $direction === 'asc' ? 'asc' : 'desc';
    }

    /** @param array{rowKey: string, sql: string, raw: bool} $term */
    private function constrainTerm(Builder $query, array $term, string $operator, mixed $value): void
    {
        if ($term['raw']) {
            $query->where(AllowListedQueryExpression::fromValidated($term['sql']), $operator, $value);

            return;
        }

        $query->where($term['sql'], $operator, $value);
    }
}

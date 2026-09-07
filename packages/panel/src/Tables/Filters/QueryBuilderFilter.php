<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Filters;

use Illuminate\Database\Query\Builder;

/**
 * A nested and/or rule tree the operator composes in the UI.
 *
 * THE LAST FILAMENT GAP, and the only one that needed a subsystem rather than
 * a component. Filament calls it `QueryBuilder`; the shape is a tree of rules
 * and groups - "status is active AND (plan is gold OR created after March)".
 *
 * IT TARGETS ONLY COLUMNS THE RESOURCE ALREADY FILTERS ON, and that is the
 * whole security design. `over()` is handed the resource's OTHER filters and
 * derives its field list from them, so this adds no new way to query anything.
 * A resource that never exposed `password_hash` to a filter cannot have it
 * reached through here, and the alternative - naming columns in a second list -
 * is a list that drifts out of step with the first one and grants something
 * nobody re-read.
 *
 * A RULE NAMING AN UNKNOWN FIELD IS REFUSED, NOT DROPPED. Silently ignoring it
 * turns "status is active AND secret is x" into "status is active" - a WIDER
 * result set than the operator asked for, returned without comment. If the
 * request cannot be honoured as written it must not be honoured at all.
 *
 * DEPTH AND SIZE ARE CAPPED. The tree arrives from the client, and a
 * thousand-deep nest is a stack overflow in the translator and a query planner
 * denial-of-service in the database. Both limits refuse rather than truncate,
 * for the same reason as above.
 */
final class QueryBuilderFilter extends Filter
{
    /** Nesting beyond this is a mistake or an attack; neither deserves service. */
    public const MAX_DEPTH = 5;

    /** Rules in the whole tree, counted across every group. */
    public const MAX_RULES = 50;

    /**
     * The operators a field of each kind may be asked for.
     *
     * DERIVED FROM THE FILTER TYPE, never from the request. An operator the
     * map does not list for that field is refused - `like` against a boolean
     * is not a query anybody meant, and permitting it invites a `where` the
     * index cannot serve over every row in the table.
     */
    private const OPERATORS = [
        'select' => ['is', 'is_not'],
        'multiselect' => ['is_any_of', 'is_none_of'],
        'boolean' => ['is'],
        'daterange' => ['before', 'after', 'between'],
    ];

    /** @var list<Filter> */
    private array $over = [];

    /**
     * The sibling filters this may target.
     *
     * CALLED BY `ListQuery::filters()`, not by the application. Wiring it by
     * hand would be a second place the allow-list is decided, and the one that
     * gets forgotten when somebody adds a filter.
     *
     * @param  list<Filter>  $filters
     */
    public function over(array $filters): self
    {
        $this->over = array_values(array_filter(
            $filters,
            fn (Filter $filter): bool => $filter !== $this && $this->kindOf($filter) !== null,
        ));

        return $this;
    }

    /** What kind of rule editor a sibling filter implies, or null if it cannot be targeted. */
    private function kindOf(Filter $filter): ?string
    {
        return match (true) {
            $filter instanceof MultiSelectFilter => 'multiselect',
            $filter instanceof SelectFilter => 'select',
            $filter instanceof BooleanFilter => 'boolean',
            $filter instanceof DateRangeFilter => 'daterange',
            /*
             * TrashedFilter and NumberRangeFilter are deliberately absent.
             * TrashedFilter rewrites the query's soft-delete scope rather than
             * adding a predicate, so "deleted is true OR status is active" has
             * no meaning the translator could honour - it would silently widen
             * the set to include every deleted row.
             *
             * NumberRangeFilter is a from–to pair of its own; wiring it here
             * would mean a third range editor in the builder for a filter that
             * already has min/max inputs on the toolbar.
             */
            default => null,
        };
    }

    /** @return array<string, array{kind: string, label: string, column: string, options: list<string>}> */
    private function fields(): array
    {
        $fields = [];

        foreach ($this->over as $filter) {
            $kind = $this->kindOf($filter);

            if ($kind === null) {
                continue;
            }

            $schema = $filter->toSchema();

            $options = [];
            foreach ((array) ($schema['options'] ?? []) as $option) {
                $options[] = is_array($option)
                    ? (string) ($option['value'] ?? '')
                    : (string) $option;
            }

            $fields[$filter->key] = [
                'kind' => $kind,
                'label' => (string) ($schema['label'] ?? $filter->key),
                'column' => $filter->resolvedColumn(),
                'options' => $options,
            ];
        }

        return $fields;
    }

    /**
     * The tree, or null when it is absent, empty or unusable.
     *
     * RETURNING NULL FOR AN INVALID TREE IS THE ONE PLACE THIS IS PERMISSIVE,
     * and it is bounded: `normalise()` cannot report an error through the
     * `Filter` contract, which returns a value or null. So the endpoint
     * validates first and refuses - see `errorsIn()` - and this is the second
     * line, for a tree that reached here anyway. An unusable tree applies
     * NOTHING rather than applying part of itself.
     */
    /** @return array<string, mixed>|null */
    public function normalise(mixed $raw): ?array
    {
        if (is_string($raw)) {
            $raw = json_decode($raw, true);
        }

        if (! is_array($raw) || $this->errorsIn($raw) !== []) {
            return null;
        }

        return $this->pruned($raw) ?: null;
    }

    /**
     * Everything wrong with a tree, as messages, or `[]` when it is sound.
     *
     * SEPARATE FROM `normalise()` SO THE ENDPOINT CAN REFUSE WITH A REASON. A
     * 422 naming the field is the difference between "that column is not
     * filterable" and a result set quietly missing a condition.
     *
     * @return list<string>
     */
    public function errorsIn(mixed $tree, int $depth = 0, int &$count = 0): array
    {
        if ($depth > self::MAX_DEPTH) {
            return ['The query is nested more than '.self::MAX_DEPTH.' groups deep.'];
        }

        if (! is_array($tree)) {
            return ['The query is not a group.'];
        }

        $logic = strtolower((string) ($tree['logic'] ?? 'and'));

        if (! in_array($logic, ['and', 'or'], true)) {
            return ["Unknown logic \"{$logic}\" - expected and, or."];
        }

        $fields = $this->fields();
        $errors = [];

        foreach ((array) ($tree['rules'] ?? []) as $rule) {
            if (! is_array($rule)) {
                $errors[] = 'A rule is not an object.';

                continue;
            }

            // A group, not a rule.
            if (array_key_exists('rules', $rule)) {
                $errors = [...$errors, ...$this->errorsIn($rule, $depth + 1, $count)];

                continue;
            }

            if (++$count > self::MAX_RULES) {
                return ['The query has more than '.self::MAX_RULES.' rules.'];
            }

            $field = (string) ($rule['field'] ?? '');

            if (! isset($fields[$field])) {
                /*
                 * NAMES THE FIELD, and that is safe: the operator chose it from
                 * a list this endpoint sent them, so it is not a probe that
                 * learns anything. What it prevents is a query that silently
                 * did less than it said.
                 */
                $errors[] = "\"{$field}\" is not a filterable field on this resource.";

                continue;
            }

            $operator = (string) ($rule['operator'] ?? '');
            $allowed = self::OPERATORS[$fields[$field]['kind']] ?? [];

            if (! in_array($operator, $allowed, true)) {
                $errors[] = "\"{$operator}\" cannot be used with \"{$field}\".";
            }
        }

        return $errors;
    }

    /** The tree with empty groups removed, so an untouched builder applies nothing. */
    /**
     * @param array<string, mixed> $tree
     * @return array<string, mixed>
     */
    private function pruned(array $tree): array
    {
        $rules = [];

        foreach ((array) ($tree['rules'] ?? []) as $rule) {
            if (! is_array($rule)) {
                continue;
            }

            if (array_key_exists('rules', $rule)) {
                $nested = $this->pruned($rule);

                if ($nested !== []) {
                    $rules[] = $nested;
                }

                continue;
            }

            $rules[] = $rule;
        }

        return $rules === [] ? [] : [
            'logic' => strtolower((string) ($tree['logic'] ?? 'and')),
            'rules' => $rules,
        ];
    }

    public function apply(Builder $query, mixed $value): void
    {
        if (! is_array($value) || $value === []) {
            return;
        }

        /*
         * THE WHOLE TREE IN ONE NESTED WHERE. Without the outer closure an
         * `or` at the top level would escape and OR itself against the tenant
         * scope already on the query - which is a cross-tenant read that looks
         * like a feature.
         */
        $query->where(function (Builder $inner) use ($value): void {
            $this->applyGroup($inner, $value);
        });
    }

    /** @param array<string, mixed> $group */
    private function applyGroup(Builder $query, array $group): void
    {
        $or = ($group['logic'] ?? 'and') === 'or';
        $fields = $this->fields();

        foreach ((array) ($group['rules'] ?? []) as $rule) {
            if (! is_array($rule)) {
                continue;
            }

            if (array_key_exists('rules', $rule)) {
                $method = $or ? 'orWhere' : 'where';

                $query->{$method}(function ($inner) use ($rule): void {
                    $this->applyGroup($inner, $rule);
                });

                continue;
            }

            $field = $fields[(string) ($rule['field'] ?? '')] ?? null;

            // Unknown fields were refused upstream; reaching here means the
            // tree came from somewhere that skipped validation, so skip it
            // rather than trusting it.
            if ($field === null) {
                continue;
            }

            $this->applyRule($query, $or, $field, (string) ($rule['operator'] ?? ''), $rule['value'] ?? null);
        }
    }

    /**
     * @param array{kind: string, label: string, column: string, options: list<string>} $field
     */
    private function applyRule(
        Builder $query,
        bool $or,
        array $field,
        string $operator,
        mixed $value,
    ): void {
        $column = $field['column'];
        $where = $or ? 'orWhere' : 'where';
        $whereIn = $or ? 'orWhereIn' : 'whereIn';
        $whereNotIn = $or ? 'orWhereNotIn' : 'whereNotIn';

        match ($operator) {
            'is' => $query->{$where}($column, $field['kind'] === 'boolean' ? (bool) $value : (string) $value),
            'is_not' => $query->{$where}($column, '!=', (string) $value),
            'is_any_of' => $query->{$whereIn}($column, array_map('strval', (array) $value)),
            'is_none_of' => $query->{$whereNotIn}($column, array_map('strval', (array) $value)),
            'before' => $query->{$where}($column, '<', (string) $value),
            'after' => $query->{$where}($column, '>', (string) $value),
            'between' => $query->{$where.'Between'}($column, [
                (string) (is_array($value) ? ($value[0] ?? '') : ''),
                (string) (is_array($value) ? ($value[1] ?? '') : ''),
            ]),
            default => null,
        };
    }

    protected function schemaType(): string
    {
        return 'querybuilder';
    }

    /**
     * A TREE TRAVELS AS JSON IN THE QUERY STRING, not as bracketed array
     * params. Laravel would happily parse `advanced[rules][0][field]`, and a
     * nested tree expressed that way is unreadable in a shared link and
     * ambiguous about where a group ends.
     */
    public function toQueryValue(mixed $value): string
    {
        return json_encode($value) ?: '';
    }

    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'type' => 'querybuilder',
            'label' => $this->label ?? 'Advanced',
            'fields' => $this->fields(),
            'operators' => self::OPERATORS,
            'maxDepth' => self::MAX_DEPTH,
            'maxRules' => self::MAX_RULES,
        ];
    }
}

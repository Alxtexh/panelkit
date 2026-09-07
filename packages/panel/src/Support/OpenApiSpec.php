<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Tables\Table;

/**
 * OpenAPI 3.1 document generated from the panel resource registry.
 *
 * GENERATED, NOT WRITTEN. A hand-maintained spec drifts from the routes and
 * still looks authoritative. Resources opt out with `Resource::documented()`.
 */
final class OpenApiSpec
{
    /**
     * @return array<string, mixed>
     */
    public static function document(?string $title = null): array
    {
        $paths = [
            '/api/v1' => [
                'get' => self::operation(
                    'Public API',
                    'Public API overview',
                    "Bearer-token surface at `/api/v1/{resource}`.\n\n"
                    ."Issue a token with `php artisan panel:api-token` or the Api keys screen "
                    ."(`Panel::apps(['api-keys'])`). Abilities on the token are intersected with "
                    .'the resource policy; a token cannot exceed its owner.',
                    responds: [
                        'type' => 'object',
                        'properties' => [
                            'message' => [
                                'type' => 'string',
                                'description' => 'Informational. CRUD lives under /api/v1/{resource}.',
                            ],
                        ],
                    ],
                    security: [['bearer' => []]],
                ),
            ],
        ];

        foreach (app(PanelManager::class)->resources() as $key => $class) {
            if (! $class::documented()) {
                continue;
            }

            $label = $class::pluralLabel();
            $table = $class::definition();
            $form = $class::formDefinition();
            $schema = new JsonSchema;
            $supports = static fn (string $action): bool => in_array($action, $class::actions(), true);
            $bearer = [['bearer' => []]];

            $paths["/{$key}"] = [
                'get' => self::operation(
                    $label,
                    "List {$label}",
                    'Keyset-paginated. The total arrives as a deferred prop rather than blocking the rows.',
                    query: self::listQuery($table),
                    responds: $schema->page($table->getColumns()),
                    security: $bearer,
                ),
            ];

            if ($supports('create')) {
                $paths["/{$key}"]['post'] = self::operation(
                    $label,
                    "Create a {$class::label()}",
                    'Validated against the resource form - the same declaration that generated this schema.',
                    accepts: $schema->writeBody($form->fields()),
                    responds: $schema->row($table->getColumns()),
                    security: $bearer,
                );
            }

            $paths["/{$key}/{id}"] = array_filter([
                'get' => $supports('view')
                    ? self::operation(
                        $label,
                        "Read one {$class::label()}",
                        '',
                        path: true,
                        responds: $schema->row($table->getColumns()),
                        security: $bearer,
                    )
                    : null,
                'put' => $supports('update')
                    ? self::operation(
                        $label,
                        "Update a {$class::label()}",
                        'Send only the attributes being changed; nothing is required.',
                        path: true,
                        accepts: $schema->writeBody($form->fields(), partial: true),
                        responds: $schema->row($table->getColumns()),
                        security: $bearer,
                    )
                    : null,
                'delete' => $supports('delete')
                    ? self::operation(
                        $label,
                        "Delete a {$class::label()}",
                        '',
                        path: true,
                        security: $bearer,
                    )
                    : null,
            ]);

            $bulkKeys = array_column(
                array_map(static fn ($a): array => $a->toArray(), $table->getBulkActions()),
                'key',
            );

            if ($bulkKeys !== []) {
                $paths["/{$key}/bulk"] = [
                    'post' => self::operation(
                        $label,
                        'Run a bulk action',
                        'The request names a declared action KEY and a selection. It never describes what the action does.',
                        accepts: $schema->bulkBody($bulkKeys),
                        security: $bearer,
                    ),
                ];
            }

            $recordKeys = self::recordActionKeys($table);

            if ($recordKeys !== []) {
                $paths["/{$key}/{id}/action"] = [
                    'post' => self::operation(
                        $label,
                        'Run a record action',
                        'Same rule as bulk: a key the resource declared, never an attribute set.',
                        path: true,
                        accepts: $schema->recordActionBody($recordKeys),
                        security: $bearer,
                    ),
                ];
            }

            if ((bool) $class::importable()) {
                $paths["/{$key}/import"] = [
                    'post' => self::operation(
                        $label,
                        'Import a CSV',
                        'Send `dryRun` to validate without writing. Rows fail independently and are reported by spreadsheet line.',
                        security: $bearer,
                    ),
                ];
            }

            foreach ($class::relations() as $relation) {
                $relationKey = $relation->key;
                $relationLabel = (string) ($relation->toSchema()['label'] ?? $relationKey);

                $paths["/{$key}/{id}/relations/{$relationKey}"] = array_filter([
                    'get' => self::operation(
                        $label,
                        "List {$relationLabel}",
                        'Keyset-paginated related rows for one parent. The foreign key is declared on the relation manager, never taken from the request.',
                        path: true,
                        responds: $schema->page($relation->definition()->getColumns()),
                        security: $bearer,
                    ),
                    'post' => $relation->nestedResource() !== null
                        ? self::operation(
                            $label,
                            "Create a {$relationLabel} row",
                            'Nested create under the parent id. The parent foreign key is stamped from the URL.',
                            path: true,
                            security: $bearer,
                        )
                        : null,
                ]);
            }
        }

        return [
            'openapi' => '3.1.0',
            'info' => [
                'title' => $title ?? (config('app.name').' panel API'),
                'version' => '1.0.0',
                'description' => "The HTTP surface every resource screen uses.\n\n"
                    ."Every endpoint is tenant-scoped and authorized per record; an id belonging to another\n"
                    ."organisation is *not found* rather than forbidden.\n\n"
                    ."The stable public API is at `/api/v1` (bearer token via `php artisan panel:api-token` "
                    .'or the Api keys screen). Resources appear when `documented()` is true (opt-out).',
            ],
            'servers' => [['url' => (string) config('app.url')]],
            'components' => [
                'securitySchemes' => [
                    'session' => [
                        'type' => 'apiKey',
                        'in' => 'cookie',
                        'name' => config('session.cookie'),
                        'description' => 'The panel\'s own endpoints. Not a contract - they change with the screens.',
                    ],
                    'bearer' => [
                        'type' => 'http',
                        'scheme' => 'bearer',
                        'description' => 'The public API at /api/v1. Issue a token with `php artisan panel:api-token` or ApiKeysPage.',
                    ],
                ],
            ],
            'paths' => $paths,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function listQuery(Table $table): array
    {
        $schema = $table->toSchema();

        $sortable = [];
        $searchable = [];

        foreach ($table->getColumns() as $column) {
            if ($column->isSortable()) {
                $sortable[] = $column->resolvedSortKey();
            }

            if ($column->isSearchable()) {
                $searchable[] = $column->key;
            }
        }

        $query = [];

        if ($searchable !== []) {
            $query[] = self::param(
                'search',
                'Matches the START of any word in '.self::readable($searchable)
                    .'. Not a substring match - a trailing wildcard can use an index and a '
                    .'leading one cannot, which is the difference between a fast list and a scan.',
            );
        }

        if ($sortable !== []) {
            $query[] = self::param(
                'sort',
                "Anything undeclared falls back to `{$schema['defaultSort']}`, silently - "
                    .'an unsortable column is not an error, because the alternative is a '
                    .'saved link breaking when a column stops being sortable.',
                enum: $sortable,
            );

            $query[] = self::param('direction', 'Sort direction.', enum: ['asc', 'desc']);
        }

        $query[] = self::param(
            'cursor',
            'Opaque keyset cursor, taken from the previous page. Never an offset: a page '
                .'number skips or repeats rows as records are inserted underneath it.',
        );

        $query[] = self::param(
            'perPage',
            'Anything not in this list is refused rather than clamped, so a request for '
                .'50000 rows fails instead of quietly returning 100.',
                enum: self::stringList((array) ($schema['perPageOptions'] ?? [])),
        );

        if (($schema['tabs'] ?? []) !== []) {
            $query[] = self::param(
                'tab',
                'A predefined slice of the list, applied ALONGSIDE the filters rather than '
                    .'instead of them.',
                enum: self::stringList(array_values((array) $schema['tabs'])),
            );
        }

        foreach ($table->getFilters() as $filter) {
            $shape = $filter->toSchema();

            $query[] = self::param(
                (string) $shape['key'],
                "Filter by {$shape['label']} ({$shape['type']}). Permitted values travel with "
                    .'the rows, because they are the organisation\'s own data.',
            );
        }

        if (($schema['groupBy'] ?? null) !== null) {
            $query[] = self::param(
                'group',
                "Rows are grouped by {$schema['groupBy']['label']} by default. Send `0` to switch that off.",
            );
        }

        return $query;
    }

    /**
     * @return list<string>
     */
    private static function recordActionKeys(Table $table): array
    {
        $keys = [];

        foreach ((array) ($table->toSchema()['recordActions'] ?? []) as $entry) {
            foreach ((array) ($entry['actions'] ?? []) as $action) {
                if (isset($action['key'])) {
                    $keys[] = (string) $action['key'];
                }
            }
        }

        return array_values(array_unique($keys));
    }

    /** @param list<string> $items */
    private static function readable(array $items): string
    {
        if (count($items) === 1) {
            return "`{$items[0]}`";
        }

        $last = array_pop($items);

        return '`'.implode('`, `', $items)."` or `{$last}`";
    }

    /**
     * @param  list<array<string, mixed>>  $query
     * @param  array<string, mixed>|null  $accepts
     * @param  array<string, mixed>|null  $responds
     * @param  list<array<string, list<string>>>|null  $security
     * @return array<string, mixed>
     */
    private static function operation(
        string $tag,
        string $summary,
        string $description = '',
        array $query = [],
        bool $path = false,
        ?array $accepts = null,
        ?array $responds = null,
        ?array $security = null,
    ): array {
        $parameters = $query;

        if ($path) {
            $parameters[] = [
                'name' => 'id',
                'in' => 'path',
                'required' => true,
                'schema' => ['type' => 'integer'],
            ];
        }

        return array_filter([
            'tags' => [$tag],
            'summary' => $summary,
            'description' => $description,
            'parameters' => $parameters,
            'security' => $security,
            'requestBody' => $accepts === null ? null : [
                'required' => true,
                'content' => ['application/json' => ['schema' => $accepts]],
            ],
            'responses' => [
                '200' => array_filter([
                    'description' => 'OK',
                    'content' => $responds === null ? null : [
                        'application/json' => ['schema' => $responds],
                    ],
                ]),
                '403' => ['description' => 'Authenticated, but not permitted.'],
                '404' => ['description' => 'No such record - including one belonging to another organisation.'],
                '422' => $accepts === null ? ['description' => 'Validation failed.'] : [
                    'description' => 'Validation failed.',
                    'content' => ['application/json' => ['schema' => (new JsonSchema)->validationError()]],
                ],
            ],
        ], static fn (mixed $v): bool => $v !== '' && $v !== [] && $v !== null);
    }

    /**
     * @param  list<string>  $enum
     * @return array<string, mixed>
     */
    private static function param(string $name, string $description, array $enum = []): array
    {
        return [
            'name' => $name,
            'in' => 'query',
            'required' => false,
            'description' => $description,
            'schema' => array_filter([
                'type' => 'string',
                'enum' => $enum,
            ], static fn (mixed $v): bool => $v !== []),
        ];
    }

    /**
     * @param array<int|string, mixed> $values
     * @return list<string>
     */
    private static function stringList(array $values): array
    {
        $result = [];

        foreach ($values as $value) {
            if (is_scalar($value)) {
                $result[] = (string) $value;
            }
        }

        return $result;
    }
}

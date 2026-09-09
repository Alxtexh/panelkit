<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Widgets;

use Illuminate\Http\Request;
use InvalidArgumentException;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\Ability;
use Throwable;

/**
 * A capped resource list on a dashboard, drawn with the same DataTable.
 *
 * ChartWidget::type('table') is a labelled fact list (rows of key/value). This
 * is the other thing people mean by "table widget": the resource's own columns
 * and ListQuery, limited to a handful of rows. One query, no pager, no COUNT.
 *
 *     TableWidget::make('recent')->resource(OrderResource::class)->limit(5);
 *
 * DISCOVERED like every other widget: a class with make() returning this, under
 * a directory the panel passed to discoverWidgets(). Or return it from
 * DashboardPage::tables() / Panel::widgets().
 */
final class TableWidget
{
    use CanPoll;
    use HasLayout;

    /** @var class-string<Resource>|null */
    private ?string $resource = null;

    private int $limit = 5;

    private ?string $label = null;

    private ?string $description = null;

    private ?string $ability = null;

    private function __construct(public readonly string $key) {}

    public static function make(string $key, ?string $label = null): self
    {
        $widget = new self($key);
        $widget->label = $label;

        return $widget;
    }

    /** @param class-string<Resource> $resource */
    public function resource(string $resource): self
    {
        if (! is_subclass_of($resource, Resource::class)) {
            throw new InvalidArgumentException(
                "[{$resource}] is not a panel resource, so a table widget cannot list it."
            );
        }

        $this->resource = $resource;

        return $this;
    }

    public function limit(int $limit): self
    {
        if ($limit < 1) {
            throw new InvalidArgumentException('A table widget must list at least one row.');
        }

        $this->limit = min($limit, 100);

        return $this;
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function description(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function ability(?string $ability): self
    {
        $this->ability = $ability;

        return $this;
    }

    /**
     * Visible when the ability is held, or (with no ability) when the resource
     * may be listed. A recent-orders card must not appear for someone who cannot
     * open the orders list.
     */
    public function visibleTo(mixed $user): bool
    {
        if ($this->ability !== null) {
            return Ability::allows($user, $this->ability);
        }

        if ($this->resource === null) {
            return false;
        }

        return $this->resource::can('viewAny');
    }

    /** @return array<string, mixed> Structure only. Never runs a query. */
    public function toArray(): array
    {
        $class = $this->resource;
        $href = null;

        if ($class !== null) {
            $href = $class::schema()['routes']['index'] ?? null;
        }

        return [
            'key' => $this->key,
            'label' => $this->label ?? ($class !== null ? $class::pluralLabel() : $this->key),
            'description' => $this->description,
            'limit' => $this->limit,
            'href' => $href,
            /*
             * SAME OPT-IN AS THE INDEX, carried onto the card. A resource that
             * declares `rowClick('view')` gets clickable rows here too, at the
             * same `{href}/{id}` a row link on its own index page already
             * resolves to - and one that does not (an audit log, a fixture)
             * stays inert here for the identical reason it stays inert there.
             */
            'rowClick' => $class !== null ? ($class::schema()['table']['rowClick'] ?? null) : null,
            ...$this->layoutToArray(),
            ...$this->refreshToArray(),
        ];
    }

    /**
     * The capped list. Never throws: a broken query is one broken card.
     *
     * @return array{
     *     records: list<array<string, mixed>>,
     *     columns: list<array<string, mixed>>,
     *     rowKey: string,
     *     error: bool
     * }
     */
    public function resolve(): array
    {
        $empty = ['records' => [], 'columns' => [], 'rowKey' => 'id', 'error' => true];

        if ($this->resource === null) {
            return $empty;
        }

        $class = $this->resource;

        try {
            if (! $class::isEnabled() || ! $class::isAccessible() || ! $class::can('viewAny')) {
                return $empty;
            }

            $schema = $class::schema();
            $query = $class::definition()->toListQuery($class::model());
            $query
                ->perPage($this->limit)
                ->perPageOptions([$this->limit])
                ->countStrategy('none');

            $result = $query->run(Request::create('/', 'GET'));

            return [
                'records' => $result->records,
                'columns' => $schema['table']['columns'] ?? [],
                'rowKey' => $schema['table']['rowKey'] ?? 'id',
                'error' => false,
            ];
        } catch (Throwable $e) {
            report($e);

            return $empty;
        }
    }
}

<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Schema;

/**
 * An untitled column grid, for laying out fields without a heading.
 *
 * A single integer remains the compact common case. Responsive maps let a
 * resource describe its intended density once instead of forcing every host
 * developer to add bespoke CSS around the generated form:
 *
 *     Grid::make(['default' => 1, 'sm' => 2, 'lg' => 4])
 */
final class Grid extends Component
{
    /** @var int|array<string, int> */
    private readonly int|array $columns;

    /** @param int|array<string, int> $columns */
    private function __construct(int|array $columns)
    {
        $this->columns = $columns;
    }

    /** @param int|array<string, int> $columns */
    public static function make(int|array $columns = 2): self
    {
        if (is_int($columns)) {
            return new self(max(1, $columns));
        }

        $allowed = ['default', 'sm', 'md', 'lg', 'xl', '2xl'];
        $normalised = [];

        foreach ($columns as $breakpoint => $count) {
            if (! in_array($breakpoint, $allowed, true)) {
                throw new \InvalidArgumentException("Unknown grid breakpoint [{$breakpoint}].");
            }

            if ($count < 1 || $count > 12) {
                throw new \InvalidArgumentException("Grid columns for [{$breakpoint}] must be between 1 and 12.");
            }

            $normalised[$breakpoint] = $count;
        }

        if ($normalised === []) {
            throw new \InvalidArgumentException('A responsive grid must define at least one breakpoint.');
        }

        return new self($normalised);
    }

    /** @return int|array<string, int> */
    public function columns(): int|array
    {
        return $this->columns;
    }

    public function component(): string
    {
        return 'grid';
    }

    public function toSchema(): array
    {
        return [...parent::toSchema(), 'columns' => $this->columns];
    }
}

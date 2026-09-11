<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

/**
 * A numeric rating rendered as stars.
 *
 *     RatingColumn::make('score')->max(5);
 */
final class RatingColumn extends Column
{
    private int $max = 5;

    public function type(): string
    {
        return 'rating';
    }

    public function max(int $max): self
    {
        $this->max = max(1, min(10, $max));

        return $this;
    }

    /**
     * OVERRIDES `toArray()`, NOT `toSchema()` - see MoneyColumn::toArray()'s
     * docblock: `Table.php`'s column-serialisation loop always calls
     * `->toArray()` directly, so a `toSchema()` override here never ran and
     * every rating column rendered against the client's default star count
     * regardless of a custom `->max()`.
     */
    public function toArray(): array
    {
        return [
            ...parent::toArray(),
            'max' => $this->max,
        ];
    }
}

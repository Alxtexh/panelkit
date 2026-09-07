<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Infolists;

use InvalidArgumentException;

/**
 * Repeating groups of entries on the dedicated view page.
 *
 * The stored value is a JSON array of objects. Each item is rendered with the
 * same entry schema. Nested repeatables are refused: that shape is a related
 * table, and nested HasMany already has dedicated pages.
 *
 * @phpstan-type entryList list<Entry>
 */
final class RepeatableEntry extends Entry
{
    /** @var list<Entry> */
    private array $entries = [];

    public function type(): string
    {
        return 'repeatable';
    }

    /** @param  list<mixed>  $entries */
    public function schema(array $entries): static
    {
        $normalised = [];

        foreach ($entries as $entry) {
            if (! $entry instanceof Entry) {
                throw new InvalidArgumentException('A repeatable infolist may only contain entries.');
            }

            if ($entry instanceof self) {
                throw new InvalidArgumentException(
                    "[{$entry->key}] cannot be nested inside a repeatable entry. A repeating "
                    .'group of repeating groups is a related table. Use nested HasMany pages.'
                );
            }

            $normalised[] = $entry;
        }

        $this->entries = $normalised;

        return $this;
    }

    public function toSchema(): array
    {
        return [
            ...parent::toSchema(),
            'entries' => array_map(static fn (Entry $entry): array => $entry->toSchema(), $this->entries),
        ];
    }
}

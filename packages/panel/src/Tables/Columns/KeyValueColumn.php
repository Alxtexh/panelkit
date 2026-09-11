<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

/**
 * A map, shown as labelled pairs rather than as its JSON.
 *
 * THE OTHER HALF OF `KeyValueField`, which has shipped for releases with
 * nothing able to display what it stores. A record page printed
 * `{"region":"west","tier":"2"}` - the value, technically, and unreadable to
 * the person who typed it in through a two-column editor.
 *
 * IN A CELL IT IS A COUNT. "3 entries", because a row has one line and a map
 * has as many as somebody pasted; expanding it into the table would push every
 * other column off the screen to show data nobody is scanning for. The pairs
 * belong on the record page, where there is room and where somebody has
 * already decided this is the record they care about.
 *
 * A NON-MAP VALUE IS SHOWN AS ITSELF rather than as "0 entries". A column
 * pointed at the wrong attribute should reveal that, not report an empty map
 * that reads like a record nobody has configured.
 */
final class KeyValueColumn extends Column
{
    private ?string $keyLabel = null;

    private ?string $valueLabel = null;

    public function type(): string
    {
        return 'keyvalue';
    }

    /** Column headings for the pairs, where "Key" and "Value" are too abstract. */
    public function labels(string $key, string $value): self
    {
        $this->keyLabel = $key;
        $this->valueLabel = $value;

        return $this;
    }

    /**
     * OVERRIDES `toArray()`, NOT `toSchema()` - see MoneyColumn::toArray()'s
     * docblock: `Table.php`'s column-serialisation loop always calls
     * `->toArray()` directly, so a `toSchema()` override here never ran and
     * every key-value column rendered the generic "Key"/"Value" labels
     * regardless of `->labels()`.
     */
    public function toArray(): array
    {
        return [
            ...parent::toArray(),
            'keyLabel' => $this->keyLabel,
            'valueLabel' => $this->valueLabel,
        ];
    }
}

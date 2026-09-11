<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

/**
 * A stored blob of code or configuration - JSON, a template, a snippet.
 *
 * WHY THIS EXISTS AT ALL: THE PACKAGE COULD TAKE ONE AND NOT SHOW ONE.
 * `CodeField` has shipped for releases, so an operator could paste a webhook
 * payload or a router config into a record - and the record page then printed
 * it as a single unwrapped line of proportional text, because nothing knew it
 * was code. A framework that accepts a value and cannot display it is only
 * half a feature.
 *
 * TWO DENSITIES, ONE TYPE. In a table cell this is one truncated monospace
 * line, because a row is a scanning surface and forty lines of JSON in it
 * destroys the table. On the record page it is the whole thing, wrapped, in a
 * block. Same column, and the density follows the screen rather than a second
 * class somebody has to remember to use.
 */
final class CodeColumn extends Column
{
    private ?string $language = null;

    public function type(): string
    {
        return 'code';
    }

    /**
     * A HINT, NOT A PROMISE. It is carried to the client and used for the
     * label above the block; nothing here highlights syntax, and claiming a
     * language while rendering plain text would be the more misleading of the
     * two options.
     */
    public function language(string $language): self
    {
        $this->language = $language;

        return $this;
    }

    /**
     * OVERRIDES `toArray()`, NOT `toSchema()` - see MoneyColumn::toArray()'s
     * docblock for why `toSchema()` is a dead override here: `Table.php`'s
     * column-serialisation loop always calls `->toArray()` directly, so a
     * `language` set here never reached the client and every code column
     * rendered its hint-less default.
     */
    public function toArray(): array
    {
        return [...parent::toArray(), 'language' => $this->language];
    }
}

<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Contracts\Database\Query\Expression;
use Illuminate\Database\Grammar;
use InvalidArgumentException;

/**
 * A query expression assembled from identifiers that the caller has already
 * validated against an allow-list.
 *
 * Laravel's `Connection::raw()` intentionally accepts only literal strings in
 * its static contract. Panel query features also need driver-specific and
 * schema-declared expressions, which are safe after validation but cannot be
 * represented as literal strings to a static analyser. Keeping this wrapper
 * separate makes that boundary visible without weakening ordinary bindings.
 */
final class AllowListedQueryExpression implements Expression
{
    private function __construct(private readonly string $validatedValue)
    {
    }

    public static function fromValidated(string $value): self
    {
        if ($value === '') {
            throw new InvalidArgumentException('A query expression cannot be empty.');
        }

        return new self($value);
    }

    public function getValue(Grammar $grammar): string
    {
        unset($grammar);

        return $this->validatedValue;
    }
}

<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Contracts\Database\Query\Expression as QueryExpression;
use Illuminate\Support\Facades\DB;

/**
 * A SQL source for a schema node keyed by `$key` - a plain attribute by
 * default, a qualified/joined column via `from()`, or a computed expression
 * via `fromRaw()`.
 *
 * SHARED BETWEEN `Column` AND `Entry`, deliberately - a table column and a
 * view-page entry describe the SAME kind of fact ("this key's value comes
 * from this SQL"), and a List and a View showing the same joined or computed
 * attribute (a plan's name via `plans.name`, an unread badge via a raw CASE
 * expression) should not need two independent, silently-driftable
 * implementations of "how do I alias this back to my own key." Requires the
 * using class to declare `public readonly string $key`, exactly as `Column`
 * and `Entry` both already do.
 */
trait HasQualifiedSource
{
    protected ?string $databaseColumn = null;

    /** A SQL expression this value is computed by - see `fromRaw()`. */
    protected ?string $rawExpression = null;

    /** Qualified database column when it differs from the key. */
    public function from(string $column): static
    {
        $this->databaseColumn = $column;

        return $this;
    }

    /**
     * A value the DATABASE computes, rather than a column it stores.
     *
     * IT MUST BE AN `Expression`, and that is the whole reason this is a
     * separate method rather than a longer string passed to `from()`. A raw
     * expression handed to the builder as a STRING is quoted as an
     * identifier - `select "(case when ... end) as unread"` - which fails
     * with a syntax error pointing at a dot, several layers from anything
     * that looks like this.
     *
     * NEVER GIVEN USER INPUT. Everything here is interpolated into SQL with
     * nothing bound, so callers pass a literal written in the resource
     * class. An expression built from a request parameter is an injection,
     * and there is no shape of this API that makes that safe.
     */
    public function fromRaw(string $expression): static
    {
        $this->rawExpression = $expression;

        return $this;
    }

    /**
     * How this value appears in the SELECT list - aliased to its own key.
     *
     * THE ALIAS IS ADDED HERE RATHER THAN WRITTEN BY HAND, because writing it
     * by hand fails silently. `->from('clients.name')` on a key `client_name`
     * selects a result column called `name`, the row arrives with a key
     * nothing looks for, and the cell (or entry) renders an em dash. Nothing
     * errors: the query is valid, the join is correct, and the only symptom
     * is a value that reads like missing data.
     *
     * An explicit `as` in the expression is respected - several resources
     * already write `->from('plans.name as plan_name')`, and second-guessing
     * them would break the thing this is meant to fix.
     */
    public function selectExpression(): string|QueryExpression
    {
        // A computed value - see `fromRaw()` for why this cannot be a string.
        if ($this->rawExpression !== null) {
            return DB::raw($this->rawExpression.' as '.$this->key);
        }

        $column = $this->databaseColumn ?? $this->key;

        // Already aliased, or unqualified and therefore already named after
        // itself. Neither needs help.
        if (stripos($column, ' as ') !== false || ! str_contains($column, '.')) {
            return $column;
        }

        $bare = substr($column, strrpos($column, '.') + 1);

        return $bare === $this->key ? $column : "{$column} as {$this->key}";
    }
}

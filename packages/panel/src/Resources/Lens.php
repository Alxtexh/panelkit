<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Resources;

use Closure;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Alxtexh\Panel\Tables\Table;

/**
 * An alternate index over one resource: a scoped query and optional table overrides.
 *
 * Lenses travel in the cached schema as structure only. The active lens key rides
 * with the list request, and its query modifier runs on every count and export too.
 */
final class Lens
{
    private ?Closure $query = null;

    private ?Closure $table = null;

    public function __construct(
        public readonly string $key,
        public readonly string $label,
    ) {
        if (preg_match('/^[a-z][a-z0-9_-]*$/', $key) !== 1) {
            throw new \InvalidArgumentException("[{$key}] is not a valid lens key.");
        }
    }

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }

    /** @param Closure(EloquentBuilder<covariant Model>): void $query */
    public function query(Closure $query): self
    {
        $this->query = $query;

        return $this;
    }

    /** @param Closure(Table): Table $table */
    public function table(Closure $table): self
    {
        $this->table = $table;

        return $this;
    }

    public function applyTable(Table $table): Table
    {
        if ($this->table === null) {
            return $table;
        }

        return ($this->table)($table);
    }

    /** @param EloquentBuilder<covariant Model> $query */
    public function applyQuery(EloquentBuilder $query): void
    {
        if ($this->query !== null) {
            ($this->query)($query);
        }
    }

    /** @return array{key: string, label: string} */
    public function toSchema(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->label,
        ];
    }
}

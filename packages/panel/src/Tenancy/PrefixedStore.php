<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tenancy;

use Illuminate\Contracts\Cache\Lock;
use Illuminate\Contracts\Cache\LockProvider;
use Illuminate\Contracts\Cache\Store;
use RuntimeException;

/**
 * A cache store whose every key wears a tenant prefix - roadmap "no leaks".
 *
 * THE STORE CONTRACT IS THE ONLY CHOKE POINT WITHOUT HOLES. Prefixing at the
 * repository looked simpler and is not: `itemKey()` covers `get`/`put`/
 * `forget` but `many()`, `putMany()`, `add()` and `increment()` reach the
 * store with raw keys, so four documented methods would bypass the
 * isolation - and `Cache::many()` is exactly what the queue worker calls
 * every few seconds. Setting `cache.prefix` is worse: only the database,
 * redis and memcached stores honour it at all - `FileStore::getPrefix()`
 * and `ArrayStore::getPrefix()` are hardcoded `''` - so the two stores a
 * plain installation is most likely to run would silently not isolate.
 *
 * Every repository operation, whatever its shape, ends as one of these ten
 * store calls with final keys. Prefix here and there is nothing left to
 * miss.
 *
 * `flush()` IS DELIBERATELY WHOLE-STORE. A prefix scopes reads and writes,
 * not bulk clears - flushing "only this tenant's slice" would require
 * enumerating keys, which half the stores cannot do. Nothing in the panel
 * flushes at runtime; the caveat lives here and in the bootstrapper's
 * docblock.
 */
final class PrefixedStore implements LockProvider, Store
{
    public function __construct(
        private readonly Store $inner,
        private readonly string $prefix,
    ) {}

    private function key(string $key): string
    {
        return $this->prefix.$key;
    }

    public function get($key): mixed
    {
        return $this->inner->get($this->key($key));
    }

    /**
     * @param list<string> $keys
     * @return array<string, mixed>
     */
    public function many(array $keys): array
    {
        $prefixed = array_map(fn (string $key): string => $this->key($key), $keys);

        $values = $this->inner->many($prefixed);

        // Callers expect their OWN keys back, not the prefixed ones.
        $result = [];

        foreach ($keys as $index => $key) {
            $result[$key] = $values[$prefixed[$index]] ?? null;
        }

        return $result;
    }

    public function put($key, $value, $seconds): bool
    {
        return $this->inner->put($this->key($key), $value, $seconds);
    }

    /** @param array<string, mixed> $values */
    public function putMany(array $values, $seconds): bool
    {
        $prefixed = [];

        foreach ($values as $key => $value) {
            $prefixed[$this->key((string) $key)] = $value;
        }

        return $this->inner->putMany($prefixed, $seconds);
    }

    public function increment($key, $value = 1): int|bool
    {
        return $this->inner->increment($this->key($key), $value);
    }

    public function decrement($key, $value = 1): int|bool
    {
        return $this->inner->decrement($this->key($key), $value);
    }

    public function forever($key, $value): bool
    {
        return $this->inner->forever($this->key($key), $value);
    }

    public function touch($key, $seconds): bool
    {
        return $this->inner->touch($this->key($key), $seconds);
    }

    public function forget($key): bool
    {
        return $this->inner->forget($this->key($key));
    }

    public function flush(): bool
    {
        return $this->inner->flush();
    }

    public function getPrefix(): string
    {
        return $this->prefix.$this->inner->getPrefix();
    }

    /** Locks are keys too - an unprefixed lock is a cross-tenant lock. */
    public function lock($name, $seconds = 0, $owner = null): Lock
    {
        return $this->lockProvider()->lock($this->key($name), $seconds, $owner);
    }

    public function restoreLock($name, $owner): Lock
    {
        return $this->lockProvider()->restoreLock($this->key($name), $owner);
    }

    private function lockProvider(): LockProvider
    {
        if (! $this->inner instanceof LockProvider) {
            throw new RuntimeException(
                'The ['.$this->inner::class.'] cache store does not support locks.',
            );
        }

        return $this->inner;
    }
}

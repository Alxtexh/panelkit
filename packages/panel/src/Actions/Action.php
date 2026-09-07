<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Closure;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

/**
 * A named PHP action. Three homes, one key-from-the-client rule:
 *
 *   Infolist: `Entry::action()`. Click POSTs `{ action }` to
 *   `{resource}/{id}/infolist-action`. `handle()` / `mutate()` touch the
 *   record. The view stays a page, never a modal and never Livewire.
 *
 *   Form affix: `Field::suffixAction()` / `prefixAction()`. Click POSTs
 *   `{ field, action, values }` to `{resource}/form-action`. `action()`
 *   patches the form through `$get` / `$set`. Same family as `live()`
 *   form-state. Copy/url affixes stay client-only and never hit this.
 *
 *   Notification: `Notification::make()->actions([...])`. `url()` is an
 *   href on the toast and the bell. `openUrlInNewTab()` opens a new tab.
 *   `method('post')` POSTs that href (named route, same CSRF as infolist).
 *   Closures do not travel: a toast cannot run `handle()` without Livewire.
 *
 * THE REQUEST NAMES A KEY, NEVER AN ATTRIBUTE SET. Only a key the resource
 * declared is runnable.
 *
 * `Entry::url()` is a separate link. An entry may have a URL, an action,
 * both, or neither.
 */
final class Action
{
    private ?string $icon = null;

    private bool $destructive = false;

    private ?string $confirmation = null;

    private string $ability = 'view';

    /** @var array<string, mixed> */
    private array $mutate = [];

    private ?Closure $handle = null;

    /**
     * Form affix callback. Distinct from `handle()`, which mutates a record.
     *
     * @var Closure(callable(string): mixed, callable(string, mixed): void): mixed|null
     */
    private ?Closure $formAction = null;

    private ?string $url = null;

    private bool $openUrlInNewTab = false;

    private string $httpMethod = 'get';

    private function __construct(public readonly string $key, private string $label)
    {
        if (preg_match('/^[a-z][a-z0-9_-]*$/', $key) !== 1) {
            throw new InvalidArgumentException("[{$key}] is not a valid action key.");
        }
    }

    public static function make(string $key, ?string $label = null): self
    {
        return new self($key, $label ?? str($key)->headline()->value());
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function destructive(bool $destructive = true): self
    {
        $this->destructive = $destructive;

        return $this;
    }

    public function confirm(string $message): self
    {
        $this->confirmation = $message;

        return $this;
    }

    public function authorize(string $ability): self
    {
        $this->ability = $ability;

        return $this;
    }

    /** @param array<string, mixed> $attributes */
    public function mutate(array $attributes): self
    {
        $this->mutate = $attributes;

        return $this;
    }

    /** @param  Closure(Model): mixed  $handle */
    public function handle(Closure $handle): self
    {
        $this->handle = $handle;

        return $this;
    }

    /**
     * Patch form values. `$get('title')` reads, `$set('slug', $value)` writes.
     *
     *     Action::make('generate')->action(fn ($get, $set) => $set('slug', Str::slug($get('title'))))
     *
     * @param  Closure(callable(string): mixed, callable(string, mixed): void): mixed  $callback
     */
    public function action(Closure $callback): self
    {
        $this->formAction = $callback;

        return $this;
    }

    /**
     * Client-side href. Toast and bell render this as a button or link.
     * Infolist `Entry::url()` is separate; this is for `Action::make()`.
     */
    public function url(?string $url, bool $shouldOpenInNewTab = false): self
    {
        $this->url = $url;

        if ($shouldOpenInNewTab) {
            $this->openUrlInNewTab = true;
        }

        return $this;
    }

    public function openUrlInNewTab(bool $condition = true): self
    {
        $this->openUrlInNewTab = $condition;

        return $this;
    }

    /**
     * HTTP verb for `url()`. `post` hits a named route the way infolist
     * actions POST `{ action }` to `{resource}/{id}/infolist-action`.
     */
    public function method(string $method): self
    {
        $this->httpMethod = strtolower($method);

        return $this;
    }

    public function hasFormAction(): bool
    {
        return $this->formAction !== null;
    }

    /**
     * @param  array<string, mixed>  $values
     * @return array<string, mixed>
     */
    public function runForm(array $values): array
    {
        if ($this->formAction === null) {
            throw new InvalidArgumentException("[{$this->key}] declares no form action.");
        }

        $get = static function (string $key) use (&$values): mixed {
            return $values[$key] ?? null;
        };

        $set = static function (string $key, mixed $value) use (&$values): void {
            $values[$key] = $value;
        };

        ($this->formAction)($get, $set);

        return $values;
    }

    public function ability(): string
    {
        return $this->ability;
    }

    public function run(Model $record): void
    {
        if ($this->handle !== null) {
            ($this->handle)($record);

            return;
        }

        if ($this->mutate === []) {
            throw new InvalidArgumentException("[{$this->key}] declares nothing to do.");
        }

        $record->forceFill($this->mutate)->save();
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return array_filter([
            'key' => $this->key,
            'label' => $this->label,
            'icon' => $this->icon,
            'destructive' => $this->destructive,
            'confirmation' => $this->confirmation,
        ], static fn (mixed $v): bool => $v !== null && $v !== false);
    }

    /**
     * Schema for a prefix/suffix button. `post: true` tells Vue to POST the
     * named key rather than copy or open a URL.
     *
     * @return array<string, mixed>
     */
    public function toAffixSchema(): array
    {
        if ($this->url !== null && $this->url !== '') {
            return array_filter([
                'key' => $this->key,
                'label' => $this->label,
                'icon' => $this->icon,
                'url' => $this->url,
            ], static fn (mixed $v): bool => $v !== null);
        }

        return array_filter([
            'key' => $this->key,
            'label' => $this->label,
            'icon' => $this->icon,
            'post' => true,
        ], static fn (mixed $v): bool => $v !== null);
    }

    /**
     * Toast and bell payload. URL actions only: a closure cannot leave PHP.
     *
     * @return array<string, mixed>|null
     */
    public function toNotificationSchema(): ?array
    {
        if ($this->url === null || $this->url === '') {
            return null;
        }

        return array_filter([
            'key' => $this->key,
            'label' => $this->label,
            'icon' => $this->icon,
            'href' => $this->url,
            'newTab' => $this->openUrlInNewTab ?: null,
            'method' => $this->httpMethod !== 'get' ? $this->httpMethod : null,
        ], static fn (mixed $v): bool => $v !== null);
    }
}

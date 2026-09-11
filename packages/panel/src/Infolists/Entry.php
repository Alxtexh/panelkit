<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Infolists;

use Alxtexh\Panel\Actions\Action;
use Alxtexh\Panel\Schema\Component;
use Alxtexh\Panel\Support\HasQualifiedSource;

/**
 * A labelled value on a dedicated view page.
 *
 * Separate from table columns so a view can show an icon, a link, or a short
 * text without reusing a list cell. The view page stays a page, never a modal.
 *
 * SELECTED FOR ITSELF, not borrowed from `table()`. `ResourceController::show()`
 * builds the View page's data from whichever entries a resource's `infolist()`
 * actually declares (via `from()`/`fromRaw()`, the same mechanism `Column`
 * uses - see `HasQualifiedSource`), not from `table()->columns()`. An entry
 * for an attribute the list happens not to display used to render `—` even
 * though the value existed, because the View's query was really the List's.
 */
abstract class Entry extends Component
{
    use HasQualifiedSource;

    protected ?string $label = null;

    protected ?string $url = null;

    protected ?Action $action = null;

    final public function __construct(public readonly string $key) {}

    public static function make(string $key): static
    {
        return new static($key);
    }

    public function component(): string
    {
        return 'entry';
    }

    public function label(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    /**
     * Optional href. The client renders the value as a link; the server never
     * treats this as authorisation.
     */
    public function url(?string $url): static
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Click POSTs `{ action }` to `{resource}/{id}/infolist-action`.
     *
     * Independent of `url()`. The view page stays a dedicated page.
     */
    public function action(Action $action): static
    {
        $this->action = $action;

        return $this;
    }

    public function getAction(): ?Action
    {
        return $this->action;
    }

    abstract public function type(): string;

    /**
     * Extra record keys this entry needs selected beyond its own `key`.
     *
     * THE DEFAULT IS NONE, because `key` is the whole story for most entries.
     * `ImageEntry::fallbackFrom()` is the exception: it reads a SECOND key
     * from the same record (an initials fallback, `name` unless overridden),
     * and the View page's selection is now driven entirely by declared
     * entries (see `HasQualifiedSource` / `ResourceController::show()`) - a
     * key nothing declares is a key nothing selects, and a value that drops
     * out of a SELECT list renders an em dash with no error anywhere.
     *
     * Each returned key is selected as a plain, unqualified attribute -
     * override `dependsOn()` with a qualified string, or select it explicitly
     * elsewhere, for a dependency that lives on a joined table.
     *
     * @return list<string>
     */
    public function dependsOn(): array
    {
        return [];
    }

    public function toSchema(): array
    {
        return array_filter([
            'component' => 'entry',
            'key' => $this->key,
            'label' => $this->label ?? str($this->key)->headline()->value(),
            'type' => $this->type(),
            'url' => $this->url,
            'action' => $this->action?->toArray(),
            'children' => [],
        ], static fn (mixed $v): bool => $v !== null && $v !== []);
    }
}

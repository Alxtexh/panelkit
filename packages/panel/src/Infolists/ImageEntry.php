<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Infolists;

/**
 * An avatar or logo on the dedicated view page.
 *
 * Same contract as ImageColumn: the value is a URL, the size is fixed, and a
 * missing image falls back to initials rather than a torn-page glyph. The view
 * stays a page, never a modal.
 */
final class ImageEntry extends Entry
{
    private bool $rounded = true;

    private string $size = 'md';

    private string $fallback = 'initials';

    private ?string $fallbackFrom = null;

    public function type(): string
    {
        return 'image';
    }

    public function rounded(bool $rounded = true): static
    {
        $this->rounded = $rounded;

        return $this;
    }

    public function square(): static
    {
        return $this->rounded(false);
    }

    public function size(string $size): static
    {
        $this->size = in_array($size, ['sm', 'md', 'lg'], true) ? $size : 'md';

        return $this;
    }

    public function fallbackFrom(string $key): static
    {
        $this->fallbackFrom = $key;

        return $this;
    }

    /** The fallback-initials source is a second key this entry reads - see `Entry::dependsOn()`. */
    public function dependsOn(): array
    {
        return [$this->fallbackFrom ?? 'name'];
    }

    public function fallback(string $fallback): static
    {
        $this->fallback = in_array($fallback, ['initials', 'icon', 'none'], true) ? $fallback : 'initials';

        return $this;
    }

    public function toSchema(): array
    {
        return [
            ...parent::toSchema(),
            'rounded' => $this->rounded,
            'size' => $this->size,
            'fallback' => $this->fallback,
            'fallbackFrom' => $this->fallbackFrom ?? 'name',
        ];
    }
}

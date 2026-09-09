<?php

declare(strict_types=1);

namespace App\Support;

use Alxtexh\Panel\Support\PanelSettings;

/**
 * The public landing page's title, description and business name.
 *
 * NOT A CONSTANT ANYWHERE IN A TEMPLATE. An imported landing bundle is a
 * static, pre-built document, and hardcoding this installation's branding
 * into one of nine vendored Next.js exports means every other template - and
 * every OTHER installation that adopts the same template - inherits it too.
 * This lives in `panel_settings` instead: the one place already meant for
 * "facts about this installation", read fresh on every request rather than
 * baked in at build time.
 *
 * `LandingSeoInjector` is what actually rewrites the served HTML with these
 * values; this class only holds them.
 */
final readonly class LandingSeoSettings
{
    public const KEY = 'landing_seo';

    public function __construct(
        public string $title,
        public string $description,
        public string $businessName,
        public string $locale,
    ) {}

    public static function load(?PanelSettings $store = null): self
    {
        $store ??= app(PanelSettings::class);
        $raw = $store->get(self::KEY);

        return self::fromArray(is_array($raw) ? $raw : []);
    }

    /** @param array<string, mixed> $raw */
    public static function fromArray(array $raw): self
    {
        return new self(
            title: self::stringOr($raw['title'] ?? null, 'PanelKit'),
            description: self::stringOr(
                $raw['description'] ?? null,
                'Admin panel and business management, built with PanelKit.',
            ),
            businessName: self::stringOr($raw['businessName'] ?? null, 'PanelKit'),
            locale: self::stringOr($raw['locale'] ?? null, 'en'),
        );
    }

    /** @return array<string, string> */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'businessName' => $this->businessName,
            'locale' => $this->locale,
        ];
    }

    public function save(?PanelSettings $store = null, ?string $by = null): void
    {
        ($store ?? app(PanelSettings::class))->put(self::KEY, $this->toArray(), $by);
    }

    private static function stringOr(mixed $value, string $default): string
    {
        return is_string($value) && trim($value) !== '' ? $value : $default;
    }
}

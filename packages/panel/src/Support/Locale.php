<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

/**
 * Which language the panel is in, and which way it runs.
 *
 * DIRECTION IS A PROPERTY OF THE LOCALE, not a separate setting. Offering "RTL"
 * as its own toggle invites the two to disagree - Arabic rendered left to right,
 * or English mirrored - and both are states nobody ever wants and somebody will
 * eventually reach. One list, derived.
 *
 * THE LIST IS SHORT AND DELIBERATE. Every RTL script in use is here; adding a
 * locale the panel has no translations for would make the switcher offer
 * languages that render as untranslated English, which is worse than not
 * offering them.
 */
final class Locale
{
    /**
     * Languages written right to left.
     *
     * Matched on the SUBTAG, so `ar`, `ar-EG` and `ar_SA` all resolve together -
     * a region does not change which way a script runs, and listing every region
     * would be a list that is always missing one.
     */
    public const RTL = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi', 'dv', 'ckb'];

    /** @return 'rtl'|'ltr' */
    public static function direction(?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();

        // `ar-EG` and `ar_EG` both reduce to `ar`.
        $subtag = strtolower(preg_split('/[-_]/', $locale)[0] ?? '');

        return in_array($subtag, self::RTL, true) ? 'rtl' : 'ltr';
    }

    public static function isRtl(?string $locale = null): bool
    {
        return self::direction($locale) === 'rtl';
    }

    /**
     * The locales this installation actually has translations for.
     *
     * PACKAGE FILES PLUS ANY THE HOST ADDED. A language dropped into
     * `lang/{locale}` or published under `lang/vendor/panel` appears without a
     * second edit. A language whose files were removed cannot linger as an
     * option that renders raw keys.
     *
     * @return list<string>
     */
    public static function available(): array
    {
        $found = [];

        foreach (self::localeDirectories() as $path) {
            if (! is_dir($path)) {
                continue;
            }

            foreach (glob($path.'/*', GLOB_ONLYDIR) ?: [] as $dir) {
                $name = basename($dir);

                if (preg_match('/^[a-z]{2,3}([-_][A-Za-z]{2,4})?$/', $name)) {
                    $found[$name] = true;
                }
            }
        }

        $found = array_keys($found);
        sort($found);

        return $found === [] ? [(string) config('app.locale', 'en')] : $found;
    }

    /**
     * Every string the frontend needs, for the current locale.
     *
     * SENT WHOLE, ONCE, WITH THE PAGE. The panel's string set is a few kilobytes
     * - smaller than one icon - and fetching it separately would mean a frame
     * where every label on screen is a translation key. Shipping it inline costs
     * less than the flash costs.
     *
     * Package groups (`billing`, `operations`, …) come from `panel::*` lang
     * files. A host file at `lang/{locale}/panel.php` overlays extra keys
     * (`actions.save`, and so on) without replacing the kit groups.
     *
     * @return array<string, mixed>
     */
    public static function messages(?string $locale = null): array
    {
        $locale = $locale ?? app()->getLocale();
        $messages = [];
        $loader = app('translator')->getLoader();
        $fallback = (string) config('app.fallback_locale', 'en');

        foreach (self::groups() as $group) {
            $line = $loader->load($locale, $group, 'panel');

            if ($line === [] && $locale !== $fallback) {
                $line = $loader->load($fallback, $group, 'panel');
            }

            $messages[$group] = $line;
        }

        $overlay = lang_path($locale.'/panel.php');

        if (! is_file($overlay) && $locale !== $fallback) {
            $overlay = lang_path($fallback.'/panel.php');
        }

        if (is_file($overlay)) {
            $messages = array_replace_recursive($messages, (array) require $overlay);
        }

        return $messages;
    }

    /**
     * @return array{current: string, direction: 'rtl'|'ltr', available: list<string>}
     */
    public static function shared(?string $locale = null): array
    {
        $locale = $locale ?? app()->getLocale();

        return [
            'current' => $locale,
            'direction' => self::direction($locale),
            'available' => self::available(),
        ];
    }

    /**
     * @return list<string>
     */
    public static function groups(): array
    {
        $dir = self::packageLangPath().'/en';

        if (! is_dir($dir)) {
            return ['auth', 'billing', 'chrome', 'directory', 'grants', 'onboarding', 'operations', 'support'];
        }

        $files = glob($dir.'/*.php') ?: [];
        $groups = array_map(static fn (string $file): string => basename($file, '.php'), $files);
        sort($groups);

        return $groups;
    }

    public static function packageLangPath(): string
    {
        return dirname(__DIR__, 2).'/resources/lang';
    }

    /**
     * @return list<string>
     */
    private static function localeDirectories(): array
    {
        return array_values(array_filter([
            self::packageLangPath(),
            lang_path(),
            lang_path('vendor/panel'),
        ], static fn (string $path): bool => $path !== ''));
    }
}

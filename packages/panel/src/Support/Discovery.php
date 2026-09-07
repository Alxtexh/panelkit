<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Classes an application wrote that the panel never registered.
 *
 * REPORTED FROM A REAL PORT, TWICE OVER, AND IT COST AN HOUR EACH TIME.
 * `panel.discover` was pointed at `app/Panel/SuperAdmin` instead of
 * `app/Panel/SuperAdmin/Resources`; discovery globbed a directory whose
 * namespaces did not match, `class_exists()` was false for every candidate, and
 * it registered NOTHING AND SAID NOTHING. Separately `discover_pages` was
 * absent from a published config entirely, so pages were discovered nowhere.
 *
 * BOTH PRESENT AS A 404 ON A SCREEN YOU JUST WROTE, which is indistinguishable
 * from code you have not finished - so the reasonable next move is to go and
 * look at the code, which is fine, and correct, and not where the fault is.
 *
 * IT COMPARES DISK AGAINST THE REGISTRY, not config against convention, and
 * that is the whole design. Asking "does this configured directory contain
 * resources" answers a narrower question and gets both false positives and
 * false negatives: a directory may legitimately be empty on an installation
 * that registers through a plugin, and a directory full of resources says
 * nothing about a class sitting somewhere else. Asking "is this class on disk
 * registered anywhere" is the question whose wrong answer is the 404 - and it
 * is silent about resources a plugin or an explicit `registerResources()` call
 * installed, because those ARE registered.
 *
 * THE CLASS NAME IS DERIVED FROM THE PATH, PSR-4 STYLE, which is also how the
 * mismatch announces itself: a file under `app/Panel/Resources` that declares
 * some other namespace fails `class_exists()` here exactly as it failed in
 * discovery, and is reported as unreachable rather than skipped in silence.
 */
final class Discovery
{
    /**
     * Concrete subclasses of `$base` under `$appPath` that are not in
     * `$registered`.
     *
     * @param  list<class-string>  $registered  What the manager actually holds.
     * @return list<class-string>
     */
    public static function unregistered(
        string $appPath,
        string $appNamespace,
        string $base,
        array $registered,
    ): array {
        $orphans = [];

        foreach (self::classesIn($appPath, $appNamespace) as $class) {
            if (in_array($class, $registered, true)) {
                continue;
            }

            if (! class_exists($class)) {
                continue;
            }

            $reflection = new \ReflectionClass($class);

            if ($reflection->isAbstract() || ! $reflection->isSubclassOf($base)) {
                continue;
            }

            $orphans[] = $class;
        }

        sort($orphans);

        return $orphans;
    }

    /**
     * Every class name a PSR-4 reading of this tree would produce.
     *
     * NOT `class_exists()`-CHECKED HERE, deliberately: a name that does not
     * resolve is the mismatch case, and the caller decides what that means.
     *
     * @return list<class-string>
     */
    private static function classesIn(string $appPath, string $appNamespace): array
    {
        if (! is_dir($appPath)) {
            return [];
        }

        $classes = [];

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($appPath, RecursiveDirectoryIterator::SKIP_DOTS),
        );

        foreach ($files as $file) {
            if (! $file->isFile() || $file->getExtension() !== 'php') {
                continue;
            }

            $relative = substr($file->getPathname(), strlen(rtrim($appPath, '/')) + 1);

            $class = rtrim($appNamespace, '\\').'\\'
                .str_replace('/', '\\', substr($relative, 0, -4));

            if (class_exists($class)) {
                $classes[] = $class;
            }
        }

        return $classes;
    }
}

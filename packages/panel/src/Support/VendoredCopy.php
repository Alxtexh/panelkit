<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * A package installed from a PATH REPOSITORY that composer COPIED.
 *
 * REPORTED FROM A REAL PORT. A `path` repository is how you develop against a
 * package you also maintain, and composer resolves it one of two ways:
 *
 *   symlink   vendor/alxtexh-enterprise/panel POINTS AT your source. Edit, reload, done.
 *   copy      vendor/alxtexh-enterprise/panel is a SNAPSHOT taken at install time.
 *
 * Which one you get is not a decision most people make. `"symlink": true` is
 * the default where symlinks work, and composer falls back to copying WITHOUT
 * FAILING where they do not - Windows without developer mode, a Docker bind
 * mount over a filesystem that cannot link, a CI runner unpacking an artefact.
 * The two arrangements are indistinguishable from the application: the classes
 * autoload, every page returns 200, the tests pass.
 *
 * WHAT IS SILENT IS EVERYTHING AFTER THE FIRST INSTALL. You fix a bug in the
 * package, reload, and watch the bug still happen - because the running code is
 * the snapshot. The reasonable conclusions ("my fix is wrong", "something is
 * cached") are both wrong, and no amount of `optimize:clear` helps. Worse,
 * `panel:update` writes page files FROM the vendored copy, so an upgrade
 * appears to run and installs the previous version's screens.
 *
 * `composer update alxtexh-enterprise/panel` refreshes the snapshot. There is nothing to
 * fix in the package - the point of this check is that the failure names
 * itself, once, rather than costing somebody an afternoon.
 */
final class VendoredCopy
{
    /**
     * The source directory a `path` repository points at for this package, or
     * null when it is not installed that way (the ordinary case: Packagist).
     *
     * @param  array<mixed>  $composerJson  The application's own composer.json.
     */
    public static function sourceFor(array $composerJson, string $basePath, string $package): ?string
    {
        foreach ((array) ($composerJson['repositories'] ?? []) as $repository) {
            if (! is_array($repository) || ($repository['type'] ?? null) !== 'path') {
                continue;
            }

            $url = (string) ($repository['url'] ?? '');

            if ($url === '') {
                continue;
            }

            /*
             * A COMPOSER PATH URL MAY BE A GLOB - `packages/*` is the idiom for
             * a monorepo - so the candidate list is expanded rather than
             * treated as one directory. `glob()` on a plain path returns that
             * path when it exists, so both shapes go through one branch.
             */
            $absolute = str_starts_with($url, '/') ? $url : $basePath.'/'.$url;

            $candidates = glob($absolute);

            if ($candidates === false) {
                continue;
            }

            foreach ($candidates as $candidate) {
                $manifest = $candidate.'/composer.json';

                if (! is_file($manifest)) {
                    continue;
                }

                $name = json_decode((string) file_get_contents($manifest), true);

                if (is_array($name) && ($name['name'] ?? null) === $package) {
                    return $candidate;
                }
            }
        }

        return null;
    }

    /**
     * Has the source changed since the copy in `vendor/` was taken?
     *
     * A SYMLINK IS NEVER STALE and is answered first - there is one copy, and
     * comparing it with itself would be a coin toss on filesystem timestamp
     * resolution.
     *
     * MODIFICATION TIME, NOT A HASH. Reading every file to compare content
     * would be exact and would also be several hundred file reads on a command
     * people are asked to run often. The false positive it risks - a source
     * file touched without being changed - costs somebody one composer update,
     * and the false NEGATIVE a hash cannot have is not worth the cost here.
     */
    public static function isStale(string $source, string $vendor): bool
    {
        if (! is_dir($source) || ! is_dir($vendor) || self::isLinked($source, $vendor)) {
            return false;
        }

        return self::newestChange($source) > self::newestChange($vendor);
    }

    /**
     * THE TWO PATHS ARE ONE DIRECTORY - so there is nothing that can go stale.
     *
     * `is_link()` WAS NOT ENOUGH, AND FAILED ON THE ARRANGEMENT IT WAS MEANT TO
     * BLESS. Windows has two kinds of link and PHP recognises one: composer
     * (and npm) create JUNCTIONS, and `is_link()` answers false for every one
     * of them. A correctly symlinked Windows checkout therefore looked exactly
     * like a copy - the case this class exists to warn about - so the warning
     * pointed at the healthy setup.
     *
     * COMPARING RESOLVED PATHS ASKS THE QUESTION DIRECTLY. Whether the link is
     * a symlink, a junction, or a bind mount does not matter; what matters is
     * whether editing the source edits what runs. `realpath()` follows all
     * three, and two paths that resolve to one directory are one directory.
     */
    public static function isLinked(string $source, string $vendor): bool
    {
        $resolvedSource = realpath($source);
        $resolvedVendor = realpath($vendor);

        return $resolvedSource !== false
            && $resolvedVendor !== false
            && $resolvedSource === $resolvedVendor;
    }

    /**
     * The most recent mtime under a directory, over PHP files only.
     *
     * NARROWED TO `.php` DELIBERATELY. A package directory in a working tree
     * carries things `vendor/` never receives - a `.git` directory, `node_modules`,
     * a coverage report, an editor's swap file - and any of them would report a
     * source that is newer without the shipped code differing by a line.
     */
    private static function newestChange(string $directory): int
    {
        $newest = 0;

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST,
        );

        foreach ($files as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                $newest = max($newest, (int) $file->getMTime());
            }
        }

        return $newest;
    }
}

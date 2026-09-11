<?php

declare(strict_types=1);

/**
 * Documentation drift checks that a VitePress build alone can't catch (that
 * build already fails on a dead internal link - see `make check-docs`,
 * which runs it first). This script checks facts a link-checker has no way
 * to know: whether a documented command still exists, whether a documented
 * icon name is still supported, and whether the AI Blueprint only mentions
 * Filament APIs as things to avoid rather than as real PanelKit surface.
 *
 * Usage: php scripts/check-docs.php
 */
$root = dirname(__DIR__);
$autoload = $root.'/apps/playground/vendor/autoload.php';
$docsSite = $root.'/docs-site';

if (! is_file($autoload)) {
    fwrite(STDERR, "check-docs requires the playground dependencies (composer install in apps/playground).\n");
    exit(2);
}

require $autoload;

$app = require $root.'/apps/playground/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$problems = [];

/*
 * 1. Every artisan command named in commands/index.md actually exists.
 */
$commandsPage = (string) file_get_contents($docsSite.'/commands/index.md');
$commandNegationWords = ['not', 'never', 'instead', 'wrong', 'doesn\'t', 'does not'];

foreach (preg_split('/\n\s*\n/', $commandsPage) ?: [] as $paragraph) {
    preg_match_all('/`((?:php artisan )?(?:panel|make):[a-z][a-z0-9_-]*)`/', $paragraph, $matches);

    if ($matches[1] === []) {
        continue;
    }

    $hasNegation = false;
    foreach ($commandNegationWords as $word) {
        if (stripos($paragraph, $word) !== false) {
            $hasNegation = true;
            break;
        }
    }

    if ($hasNegation) {
        continue; // e.g. "this is not `make:relation-manager`" - a deliberate wrong-name callout.
    }

    $registered = array_keys(Illuminate\Support\Facades\Artisan::all());

    foreach (array_unique($matches[1]) as $mention) {
        $name = trim(str_replace('php artisan ', '', $mention));

        if (! in_array($name, $registered, true)) {
            $problems[] = "commands/index.md mentions `{$name}`, which is not a registered artisan command.";
        }
    }
}

/*
 * 2. Every icon name in the documented navigation allowlist is still in the
 *    client's own curated list - the two are meant to be the same list,
 *    copied into prose for readability; if they diverge, the docs are
 *    either stale or wrong about what panel:doctor will accept.
 */
$iconNamesFile = $root.'/packages/panel/resources/client/inertia/composables/panel-icon-names.json';

if (is_file($iconNamesFile)) {
    $supportedIcons = json_decode((string) file_get_contents($iconNamesFile), true, 512, JSON_THROW_ON_ERROR);
    $navPage = (string) file_get_contents($docsSite.'/navigation/index.md');

    if (preg_match('/```\n(activity,.*?)\n```/s', $navPage, $m) === 1) {
        $documented = array_map('trim', explode(',', str_replace("\n", ' ', $m[1])));

        foreach ($documented as $icon) {
            if ($icon !== '' && ! in_array($icon, $supportedIcons, true)) {
                $problems[] = "navigation/index.md lists icon `{$icon}`, which is not in the client's supported icon list.";
            }
        }

        foreach ($supportedIcons as $icon) {
            if (! in_array($icon, $documented, true)) {
                $problems[] = "The client supports icon `{$icon}`, which is missing from navigation/index.md's documented list.";
            }
        }
    } else {
        $problems[] = 'Could not find the icon allowlist block in navigation/index.md to cross-check.';
    }
} else {
    fwrite(STDERR, "Note: icon allowlist file not found at {$iconNamesFile}; skipping icon cross-check.\n");
}

/*
 * 3. Every `protected static <type> $prop = ...` declaration in the docs for
 *    a known Resource property matches that property's REAL declared type
 *    and nullability - reflected live, not hardcoded here. This exists
 *    because of a real, previously-shipped bug: every doc example declared
 *    `?string $icon`, but the actual base class declares it non-nullable
 *    `string`, which is a PHP FATAL ERROR on class load (a subclass cannot
 *    widen an inherited typed property to nullable). A fresh-agent build
 *    test caught this by actually running the generated code - this check
 *    exists so the next drift is caught by CI instead.
 */
$resourceReflection = new ReflectionClass(Alxtexh\Panel\Resources\Resource::class);
$realTypes = [];

foreach (['icon', 'group', 'sort', 'model', 'panel', 'cluster', 'parent', 'parentColumn', 'relationship', 'module', 'feature', 'purpose'] as $prop) {
    if ($resourceReflection->hasProperty($prop)) {
        $type = $resourceReflection->getProperty($prop)->getType();
        if ($type !== null) {
            $realTypes[$prop] = (string) $type;
        }
    }
}

$docFilesIterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($docsSite, FilesystemIterator::SKIP_DOTS),
);
$docFiles = [];
foreach ($docFilesIterator as $item) {
    if ($item->getExtension() === 'md' && ! str_contains($item->getPathname(), 'node_modules') && ! str_contains($item->getPathname(), '.vitepress')) {
        $docFiles[] = $item->getPathname();
    }
}

$typeMismatchNegationWords = ['bad', 'good', 'fatal', 'mistake', 'wrong', 'not `', "n't "];

foreach ($docFiles as $file) {
    $content = (string) file_get_contents($file);

    foreach (preg_split('/\n\s*\n/', $content) ?: [] as $paragraph) {
        foreach ($realTypes as $prop => $realType) {
            if (preg_match_all('/protected\s+static\s+(\??[A-Za-z]+)\s+\$'.$prop.'\b/', $paragraph, $m) === 0) {
                continue;
            }

            $mismatched = array_filter($m[1], static fn (string $declared): bool => $declared !== $realType);

            if ($mismatched === []) {
                continue;
            }

            $hasContext = false;
            foreach ($typeMismatchNegationWords as $word) {
                if (stripos($paragraph, $word) !== false) {
                    $hasContext = true;
                    break;
                }
            }

            if ($hasContext) {
                continue; // A deliberate "BAD"/"fatal error" illustration, not a stray real mismatch.
            }

            $relative = str_replace($root.'/', '', $file);
            $problems[] = "{$relative} declares `\${$prop}` as `{$mismatched[array_key_first($mismatched)]}`, but Resource::\${$prop} is actually `{$realType}` - this exact mismatch caused a PHP fatal error when a fresh build tried it.";
        }
    }
}

/*
 * 4. The AI Blueprint never presents a Filament API as real PanelKit
 *    surface. Mentioning one AS AN EXAMPLE OF WHAT NOT TO DO is the whole
 *    point of the "common errors" module - so this checks that every
 *    mention sits in a paragraph that also signals "this is wrong", rather
 *    than banning the term outright.
 */
$forbiddenApis = ['navigationIcon', 'navigationGroup', 'navigationSort', 'CreateAction', 'EditAction', 'ViewAction', 'DeleteAction', 'Forms\\Components', 'Tables\\Actions'];
$negationWords = ['not', 'never', 'Filament', 'BAD', 'does not', "doesn't", 'wrong', 'mistake', 'instead'];

$aiFiles = array_merge(
    glob($docsSite.'/ai/*.md') ?: [],
    [$root.'/AI_BLUEPRINT.md'],
);

foreach ($aiFiles as $file) {
    $content = (string) file_get_contents($file);
    $paragraphs = preg_split('/\n\s*\n/', $content) ?: [];

    foreach ($paragraphs as $paragraph) {
        foreach ($forbiddenApis as $api) {
            if (! str_contains($paragraph, $api)) {
                continue;
            }

            $hasNegation = false;
            foreach ($negationWords as $word) {
                if (stripos($paragraph, $word) !== false) {
                    $hasNegation = true;
                    break;
                }
            }

            if (! $hasNegation) {
                $relative = str_replace($root.'/', '', $file);
                $problems[] = "{$relative} mentions `{$api}` without framing it as a mistake - verify it isn't presented as valid PanelKit API.";
            }
        }
    }
}

/*
 * 4. Every class named in docs/api-manifest/classes.json still resolves -
 *    delegated to the manifest generator itself, which already exits
 *    non-zero on a missing class. Run it here too so `check-docs` alone
 *    (without a separate docs-api step) still catches this.
 */
exec('php '.escapeshellarg($root.'/scripts/generate-api-manifest.php').' 2>&1', $manifestOutput, $manifestExit);

if ($manifestExit !== 0) {
    $problems[] = 'API manifest generation reported missing classes: '.implode(' | ', $manifestOutput);
}

if ($problems !== []) {
    fwrite(STDERR, "Documentation validation failed:\n");
    foreach ($problems as $problem) {
        fwrite(STDERR, "- {$problem}\n");
    }
    exit(1);
}

fwrite(STDOUT, "Documentation validation passed.\n");

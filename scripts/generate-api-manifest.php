<?php

declare(strict_types=1);

/**
 * Generate the machine-readable API manifest (docs/api-manifest/manifest.json)
 * and one Markdown reference page per class (docs-site/api/classes/*.md).
 *
 * THIS IS GENERATED, NOT HAND-MAINTAINED, for the same reason panel:blueprint
 * is: a hand-written list of signatures drifts, and a developer or an AI agent
 * reading a drifted signature produces code that looks right and fails at
 * runtime. Every fact below comes from PHP's own Reflection API against the
 * classes actually loaded by the playground's Composer autoloader - never
 * typed by hand and never copied from memory of what a class "should" have.
 *
 * This is DELIBERATELY separate from docs/public-api.json and
 * scripts/check-public-api.php, which are a narrow backward-compatibility
 * floor (method names only, checked at release time). This script produces a
 * full reference surface (signatures, types, defaults, source links) for
 * documentation, and is not wired into the compatibility gate.
 *
 * Usage: php scripts/generate-api-manifest.php [--tag=vX.Y.Z]
 */
$root = dirname(__DIR__);
$autoload = $root.'/apps/playground/vendor/autoload.php';
$classlist = $root.'/docs/api-manifest/classes.json';
$manifestOut = $root.'/docs/api-manifest/manifest.json';
$pagesOut = $root.'/docs-site/api/classes';

if (! is_file($autoload)) {
    fwrite(STDERR, "API manifest generation requires the playground dependencies (composer install in apps/playground).\n");
    exit(2);
}

if (! is_file($classlist)) {
    fwrite(STDERR, "Missing {$classlist} - the curated list of classes to document.\n");
    exit(2);
}

require $autoload;

$tag = 'main';
foreach ($argv as $arg) {
    if (str_starts_with($arg, '--tag=')) {
        $tag = substr($arg, 6);
    }
}

/** @var array<string, array{category: string, description?: string}> $targets */
$targets = json_decode((string) file_get_contents($classlist), true, 512, JSON_THROW_ON_ERROR);

$manifest = ['generatedAt' => date('c'), 'sourceTag' => $tag, 'classes' => []];
$missing = [];

foreach ($targets as $fqcn => $meta) {
    if (! class_exists($fqcn) && ! interface_exists($fqcn) && ! trait_exists($fqcn) && ! enum_exists($fqcn)) {
        $missing[] = $fqcn;
        continue;
    }

    $reflection = new ReflectionClass($fqcn);
    $entry = describeClass($reflection, $meta['category'], $meta['description'] ?? null, $root, $tag);
    $manifest['classes'][] = $entry;

    file_put_contents(
        $pagesOut.'/'.slug($reflection->getShortName()).'.md',
        renderMarkdown($entry),
    );
}

usort($manifest['classes'], static fn (array $a, array $b): int => $a['name'] <=> $b['name']);
file_put_contents($manifestOut, json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).PHP_EOL);
file_put_contents($pagesOut.'/../all.md', renderIndex($manifest['classes'], $tag));

fwrite(STDOUT, sprintf(
    "Generated %d class page(s) into %s and manifest at %s.\n",
    count($manifest['classes']),
    $pagesOut,
    $manifestOut,
));

if ($missing !== []) {
    fwrite(STDERR, "Classes listed in classes.json but not found by the autoloader (removed, renamed, or in an optional package not installed here):\n");
    foreach ($missing as $class) {
        fwrite(STDERR, "- {$class}\n");
    }
    exit(1);
}

/**
 * @return array<string, mixed>
 */
function describeClass(ReflectionClass $reflection, string $category, ?string $description, string $root, string $tag): array
{
    $file = $reflection->getFileName();
    $relative = $file !== false ? ltrim(str_replace($root, '', $file), '/') : null;

    $kind = match (true) {
        $reflection->isInterface() => 'interface',
        $reflection->isTrait() => 'trait',
        $reflection->isEnum() => 'enum',
        $reflection->isAbstract() => 'abstract-class',
        default => 'class',
    };

    $methods = [];
    foreach ($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
        if ($method->getDeclaringClass()->getName() !== $reflection->getName()) {
            continue; // Inherited from a base class already documented on its own page.
        }

        if (str_starts_with($method->getName(), '__')) {
            continue;
        }

        $methods[] = [
            'name' => $method->getName(),
            'static' => $method->isStatic(),
            'signature' => methodSignature($method),
            'summary' => docSummary($method->getDocComment() ?: null),
            'line' => $method->getStartLine(),
        ];
    }

    $properties = [];
    foreach ($reflection->getProperties(ReflectionProperty::IS_PUBLIC | ReflectionProperty::IS_PROTECTED) as $property) {
        if ($property->getDeclaringClass()->getName() !== $reflection->getName() || ! $property->isStatic()) {
            continue; // Only this class's own static properties - these are the $icon/$group/$model-style config surface.
        }

        $properties[] = [
            'name' => $property->getName(),
            'visibility' => $property->isPublic() ? 'public' : 'protected',
            'type' => (string) ($property->getType() ?? 'mixed'),
        ];
    }

    $traits = array_map(static fn (ReflectionClass $t): string => $t->getName(), $reflection->getTraits());
    $interfaces = $reflection->getInterfaceNames();
    $parent = $reflection->getParentClass();

    return [
        'name' => $reflection->getName(),
        'shortName' => $reflection->getShortName(),
        'kind' => $kind,
        'category' => $category,
        'description' => $description ?? docSummary($reflection->getDocComment() ?: null),
        'extends' => $parent !== false ? $parent->getName() : null,
        'implements' => $interfaces,
        'uses' => $traits,
        'sourcePath' => $relative,
        'sourceLine' => $reflection->getStartLine(),
        'sourceUrl' => $relative !== null
            ? "https://github.com/Alxtexh/panelkit/blob/{$tag}/{$relative}#L{$reflection->getStartLine()}"
            : null,
        'methods' => $methods,
        'staticProperties' => $properties,
    ];
}

function methodSignature(ReflectionMethod $method): string
{
    $params = [];

    foreach ($method->getParameters() as $param) {
        $type = $param->getType();
        $typeName = $type !== null ? ($type instanceof ReflectionNamedType ? ($type->allowsNull() && ! str_starts_with((string) $type, '?') ? '?' : '').$type->getName() : (string) $type) : '';
        $piece = trim($typeName.' $'.$param->getName());

        if ($param->isDefaultValueAvailable()) {
            $default = $param->isDefaultValueConstant()
                ? $param->getDefaultValueConstantName()
                : var_export($param->getDefaultValue(), true);
            $piece .= ' = '.$default;
        }

        if ($param->isVariadic()) {
            $piece = '...'.$piece;
        }

        $params[] = $piece;
    }

    $return = $method->getReturnType();
    $returnStr = $return !== null ? (string) $return : 'mixed';

    return sprintf(
        '%s%s(%s): %s',
        $method->isStatic() ? 'static ' : '',
        $method->getName(),
        implode(', ', $params),
        $returnStr,
    );
}

function docSummary(?string $docComment): ?string
{
    if ($docComment === null) {
        return null;
    }

    $lines = preg_split('/\R/', $docComment) ?: [];

    foreach ($lines as $line) {
        $clean = trim($line, "/* \t");

        if ($clean !== '' && ! str_starts_with($clean, '@')) {
            return $clean;
        }
    }

    return null;
}

/**
 * @param  list<array<string, mixed>>  $classes
 */
function renderIndex(array $classes, string $tag): string
{
    $byCategory = [];
    foreach ($classes as $class) {
        $byCategory[$class['category']][] = $class;
    }
    ksort($byCategory);

    $lines = [
        '# All classes',
        '',
        'Generated from the '.$tag.' source tree by `scripts/generate-api-manifest.php` — every',
        'signature below was read with PHP Reflection against the actual loaded classes, not typed',
        'by hand. Regenerate with `php scripts/generate-api-manifest.php` after adding a class to',
        '`docs/api-manifest/classes.json`.',
        '',
    ];

    foreach ($byCategory as $category => $entries) {
        $lines[] = '## '.ucfirst(str_replace('-', ' ', $category));
        $lines[] = '';
        foreach ($entries as $entry) {
            $lines[] = sprintf('- [`%s`](/api/classes/%s) — `%s`', $entry['shortName'], slug($entry['shortName']), $entry['kind']);
        }
        $lines[] = '';
    }

    return implode("\n", $lines);
}

function slug(string $shortName): string
{
    $withDashes = preg_replace('/(?<!^)[A-Z]/', '-$0', $shortName) ?? $shortName;

    return strtolower($withDashes);
}

function renderMarkdown(array $entry): string
{
    $lines = [];
    $lines[] = '# '.$entry['shortName'];
    $lines[] = '';
    $lines[] = '`'.$entry['name'].'` &middot; `'.$entry['kind'].'`'.($entry['sourceUrl'] !== null ? ' &middot; [source]('.$entry['sourceUrl'].')' : '');
    $lines[] = '';

    if ($entry['description'] !== null) {
        $lines[] = $entry['description'];
        $lines[] = '';
    }

    if ($entry['extends'] !== null) {
        $lines[] = '**Extends:** `'.$entry['extends'].'`';
        $lines[] = '';
    }

    if ($entry['implements'] !== []) {
        $lines[] = '**Implements:** '.implode(', ', array_map(static fn (string $i): string => '`'.$i.'`', $entry['implements']));
        $lines[] = '';
    }

    if ($entry['uses'] !== []) {
        $lines[] = '**Uses:** '.implode(', ', array_map(static fn (string $t): string => '`'.$t.'`', $entry['uses']));
        $lines[] = '';
    }

    if ($entry['staticProperties'] !== []) {
        $lines[] = '## Configuration properties';
        $lines[] = '';
        $lines[] = '| Property | Type |';
        $lines[] = '| --- | --- |';
        foreach ($entry['staticProperties'] as $prop) {
            $lines[] = sprintf('| `$%s` | `%s` |', $prop['name'], $prop['type']);
        }
        $lines[] = '';
    }

    if ($entry['methods'] !== []) {
        $lines[] = '## Methods';
        $lines[] = '';

        foreach ($entry['methods'] as $method) {
            $lines[] = '### `'.$method['signature'].'`';
            $lines[] = '';
            if ($method['summary'] !== null) {
                $lines[] = $method['summary'];
                $lines[] = '';
            }
        }
    }

    return implode("\n", $lines)."\n";
}

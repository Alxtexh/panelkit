<?php

declare(strict_types=1);

/**
 * Generate llms.txt and llms-full.txt from the documentation site's own
 * file tree - not hand-duplicated, so adding or removing a guide page is
 * reflected here the next time this script runs, rather than needing a
 * second, parallel list somebody remembers to update.
 *
 * llms.txt follows the community convention (https://llmstxt.org/): a
 * short, curated index an LLM can fetch cheaply. llms-full.txt concatenates
 * every guide/API/AI page's actual content for a client that wants the
 * whole corpus in one fetch.
 *
 * Usage: php scripts/generate-llms-txt.php
 */
$root = dirname(__DIR__);
$docsSite = $root.'/docs-site';
$publicDir = $docsSite.'/public';

if (! is_dir($publicDir) && ! mkdir($publicDir, 0755, true) && ! is_dir($publicDir)) {
    fwrite(STDERR, "Could not create {$publicDir}\n");
    exit(1);
}

$baseUrl = 'https://alxtexh.github.io/panelkit';

/**
 * Section directories, in the order they should appear - matches the
 * site's own nav/sidebar grouping in .vitepress/config.ts.
 */
$sections = [
    'Getting started' => 'getting-started',
    'Resources' => 'resources',
    'Authentication' => 'authentication',
    'Forms' => 'forms',
    'Tables' => 'tables',
    'Infolists' => 'infolists',
    'Relation Managers' => 'relation-managers',
    'Actions' => 'actions',
    'Authorization' => 'authorization',
    'Navigation' => 'navigation',
    'Money' => 'money',
    'Customization' => 'customization',
    'Extending PanelKit' => 'extending',
    'Commands' => 'commands',
    'Testing' => 'testing',
    'Deployment' => 'deployment',
    'Troubleshooting' => 'troubleshooting',
    'API Reference' => 'api',
    'AI Blueprint' => 'ai',
];

/**
 * @return array{title: string, description: string}
 */
function readFrontMatter(string $path): array
{
    $content = (string) file_get_contents($path);
    $title = 'Untitled';

    if (preg_match('/^#\s+(.+)$/m', $content, $m) === 1) {
        $title = trim($m[1]);
    }

    $description = '';
    $body = preg_replace('/^#\s+.+$/m', '', $content, 1) ?? '';
    $paragraphs = array_filter(array_map('trim', explode("\n\n", $body)));

    foreach ($paragraphs as $paragraph) {
        $clean = trim($paragraph);
        if ($clean !== '' && ! str_starts_with($clean, '#') && ! str_starts_with($clean, '```') && ! str_starts_with($clean, '|') && ! str_starts_with($clean, '::: ')) {
            $description = preg_replace('/\s+/', ' ', strip_tags($clean)) ?? '';
            break;
        }
    }

    return ['title' => $title, 'description' => mb_substr($description, 0, 200)];
}

/**
 * @return list<string>
 */
function markdownFiles(string $dir): array
{
    if (! is_dir($dir)) {
        return [];
    }

    $files = glob($dir.'/*.md') ?: [];
    sort($files);

    // index.md first, then everything else alphabetically.
    usort($files, static fn (string $a, string $b): int => (basename($a) === 'index.md' ? -1 : 0) <=> (basename($b) === 'index.md' ? -1 : 0));

    return $files;
}

$lines = [
    '# PanelKit',
    '',
    '> Laravel + Vue + Inertia administration framework. Resources, tables, forms and',
    '> infolists are declared as PHP classes; a Vue kit renders them over Inertia. Not',
    '> Filament, not Livewire - do not assume Filament conventions or property names.',
    '',
    'Canonical documentation: '.$baseUrl.'/',
    'AI coding agents: read '.$baseUrl.'/ai/ (or AI_BLUEPRINT.md in the repository root) before generating PanelKit code.',
    'Full documentation corpus: '.$baseUrl.'/llms-full.txt',
    '',
];

$fullParts = [];

foreach ($sections as $label => $dir) {
    $path = $docsSite.'/'.$dir;
    $files = markdownFiles($path);

    if ($files === []) {
        continue;
    }

    $lines[] = "## {$label}";
    $lines[] = '';

    foreach ($files as $file) {
        // Skip generated per-class API pages and per-item AI pages from the
        // short index - they're too numerous to list one by one; the
        // section link plus /api/all covers them.
        $relative = ltrim(str_replace($docsSite, '', $file), '/');
        $isTopLevel = substr_count($relative, '/') <= 1;

        $meta = readFrontMatter($file);
        $urlPath = $relative === $dir.'/index.md' ? "/{$dir}/" : '/'.substr($relative, 0, -3);

        if ($isTopLevel) {
            $lines[] = "- [{$meta['title']}]({$baseUrl}{$urlPath}): {$meta['description']}";
        }

        $fullParts[] = "\n\n---\n\n# {$meta['title']}\n\nSource: {$baseUrl}{$urlPath}\n\n".file_get_contents($file);
    }

    $lines[] = '';
}

file_put_contents($publicDir.'/llms.txt', implode("\n", $lines));
file_put_contents($publicDir.'/llms-full.txt', ltrim(implode('', $fullParts)));

fwrite(STDOUT, sprintf(
    "Generated llms.txt (%d bytes) and llms-full.txt (%d bytes) in %s.\n",
    filesize($publicDir.'/llms.txt'),
    filesize($publicDir.'/llms-full.txt'),
    $publicDir,
));

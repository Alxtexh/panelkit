#!/usr/bin/env node

/**
 * Copy a Next.js static export into a PanelKit landing namespace.
 *
 * Next's basePath covers its generated `_next` URLs, but public files such as
 * `/hero.webp` intentionally remain root-relative. When the export is mounted
 * below `/panelkit/landings/...`, those files would otherwise escape the
 * template. This small packager prefixes only files that actually exist at the
 * export root, leaving external URLs and application routes untouched.
 */
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [source, destination, namespace] = process.argv.slice(2);

if (!source || !destination || !namespace) {
  throw new Error('Usage: package-landing-export.mjs <out> <destination> <namespace>');
}

const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await filesIn(filename)));
    } else {
      files.push(filename);
    }
  }

  return files;
}

const publicFiles = (await filesIn(source))
  .map((filename) => path.relative(source, filename).split(path.sep).join('/'))
  .filter((filename) => !filename.startsWith('_next/') && !filename.endsWith('.map'));

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });

for (const filename of await filesIn(destination)) {
  if (!textExtensions.has(path.extname(filename))) {
    continue;
  }

  let content = await readFile(filename, 'utf8');

  for (const publicFile of publicFiles) {
    const escaped = publicFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rootReference = new RegExp("([\\\"'`(])/(" + escaped + ")(?=[/?#\\\"'` )])", 'g');
    content = content.replace(rootReference, `$1${namespace}/$2`);
  }

  await writeFile(filename, content);
}

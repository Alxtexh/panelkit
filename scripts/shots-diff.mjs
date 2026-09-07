/**
 * Compare two screenshot directories, pixel by pixel.
 *
 * THE QUESTION IT ANSWERS: "is the design still intact?" - between the demo
 * before a shell change and after it, or between the demo and the starter.
 * A byte checksum is too strict (PNG encoding is not canonical) and an eyeball
 * is too generous (nobody eyeballs 174 images three times); a perceptual pixel
 * diff with a small threshold is the honest middle.
 *
 * Usage:
 *   node scripts/shots-diff.mjs <dirA> <dirB> [diffOutDir]
 *
 * Exit 1 when any common screen differs by more than 0.1% of its pixels, with
 * a diff image written beside the report when an output dir is given. Files
 * present in only one directory are reported - a screen that stopped being
 * captured is a gap, not a pass.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(
    fileURLToPath(new URL('../apps/playground/package.json', import.meta.url)),
);
/*
 * PIXELMATCH IS ESM-ONLY FROM v6, so `require` hands back the module namespace
 * rather than the function - and calling it dies with "pixelmatch is not a
 * function", which is what this script did every time it was run. Unwrap the
 * default when it is there so both packagings work.
 */
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default ?? pixelmatchModule;
const { PNG } = require('pngjs');

const [dirA, dirB, diffDir] = process.argv.slice(2);

if (!dirA || !dirB) {
    console.error('usage: node shots-diff.mjs <dirA> <dirB> [diffOutDir]');
    process.exit(2);
}

const a = resolve(dirA);
const b = resolve(dirB);

const filesA = new Set(readdirSync(a).filter((f) => f.endsWith('.png')));
const filesB = new Set(readdirSync(b).filter((f) => f.endsWith('.png')));

if (filesA.size === 0 && filesB.size === 0) {
    console.error('no PNG screenshots found in either directory');
    process.exit(2);
}

if (diffDir) {
    mkdirSync(resolve(diffDir), { recursive: true });
}

/** Differences above this share of pixels fail the run. Anti-aliasing and
 *  font rasterisation wobble sit well below it; a moved button does not. */
const THRESHOLD = 0.001;

let failed = 0;
let compared = 0;

for (const file of [...filesA].sort()) {
    if (!filesB.has(file)) {
        console.log(`  only in A: ${file}`);
        failed += 1;
        continue;
    }

    const pngA = PNG.sync.read(readFileSync(join(a, file)));
    const pngB = PNG.sync.read(readFileSync(join(b, file)));

    if (pngA.width !== pngB.width || pngA.height !== pngB.height) {
        console.log(`  SIZE     ${file}  ${pngA.width}x${pngA.height} vs ${pngB.width}x${pngB.height}`);
        failed += 1;
        continue;
    }

    const diff = diffDir ? new PNG({ width: pngA.width, height: pngA.height }) : null;

    const mismatched = pixelmatch(pngA.data, pngB.data, diff?.data ?? null, pngA.width, pngA.height, {
        threshold: 0.1,
    });

    const share = mismatched / (pngA.width * pngA.height);
    compared += 1;

    if (share > THRESHOLD) {
        console.log(`  DIFF     ${file}  ${(share * 100).toFixed(2)}% of pixels`);
        failed += 1;

        if (diff && diffDir) {
            writeFileSync(join(resolve(diffDir), `diff-${basename(file)}`), PNG.sync.write(diff));
        }
    }
}

for (const file of [...filesB].sort()) {
    if (!filesA.has(file)) {
        console.log(`  only in B: ${file}`);
        failed += 1;
    }
}

console.log(`${compared} compared, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

/**
 * Self-contained kit SPA. Vue, Inertia, pages, and Tailwind are bundled so a
 * host can load public/vendor/panel/{app.js,app.css} without npm run build.
 *
 * Run after the library build: the lib empties dist/, this writes dist/kit/.
 */
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    define: {
        'import.meta.env.VITE_APP_NAME': JSON.stringify('Panel'),
    },
    resolve: {
        alias: [
            {
                find: /^@alxtexh-enterprise\/panel\/inertia$/,
                replacement: fileURLToPath(new URL('./inertia/index.ts', import.meta.url)),
            },
            {
                find: /^@alxtexh-enterprise\/panel$/,
                replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            },
        ],
        dedupe: ['vue', '@inertiajs/vue3'],
    },
    build: {
        outDir: 'dist/kit',
        emptyOutDir: true,
        // ONE CSS FILE, NOT SPLIT PER ROUTE. This used to be `cssCodeSplit: true`
        // with every chunk's CSS asset forced to the same literal name
        // (`app.css`) via `assetFileNames`. Once there were enough lazy route
        // chunks to force more than one physical CSS emission, Rollup silently
        // disambiguated the name collision into app.css/app2.css/app3.css - and
        // `KitAssets::publish()` (packages/panel/src/Support/KitAssets.php) only
        // ever copies the literally-named `app.css` to a fresh install's
        // `public/vendor/panel/`. Whichever chunk Rollup happened to name
        // app2/app3 - which turned out to hold the shell/design-system rules
        // every page depends on - never reached a single consumer. This file's
        // own docblock promises "a self-contained kit SPA... host can load
        // public/vendor/panel/{app.js,app.css}" - a two-file contract that
        // `cssCodeSplit: true` cannot actually satisfy once the app has more
        // than a trivial number of routes. Keep it false so Rollup always
        // produces exactly one deterministically-named CSS file.
        cssCodeSplit: false,
        rollupOptions: {
            input: fileURLToPath(new URL('src/kit/app.ts', import.meta.url)),
            output: {
                entryFileNames: 'app.js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: (asset) =>
                    asset.name?.endsWith('.css') ? 'app.css' : 'assets/[name]-[hash][extname]',
                format: 'es',
            },
        },
        sourcemap: false,
    },
})

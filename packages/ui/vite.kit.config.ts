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
        // Keep route-only styles beside their lazy page chunks. The shell and
        // design tokens still land in app.css, while large optional screens
        // do not inflate first paint for every installation.
        cssCodeSplit: true,
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

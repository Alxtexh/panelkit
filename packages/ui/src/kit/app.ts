/**
 * Prebuilt Inertia bootstrap. Compiled into dist/kit/app.js so panel:install
 * works after Composer without npm run build.
 *
 * Hosts who customise Vue still publish app.ts and run Vite. This file is the
 * default path: kit pages, kit layout, kit CSS.
 *
 * `layout: (name) => …` MUST stay. Packaged screens set
 * `defineOptions({ layout: { breadcrumbs } })` as layout PROPS; Inertia only
 * wraps those in PanelLayout when this callback exists. Mutating
 * `page.default.layout ??= PanelLayout` in resolve does not: a breadcrumbs
 * object is already set, so `??=` never assigns the shell.
 */
import { createInertiaApp, router } from '@inertiajs/vue3'
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { SettingsLayout } from '../../inertia'
import {
    bootstrapAppearance,
    initializeAppearance,
    setAppearancePersister,
    syncAppearanceFromInertiaPage,
} from '../index'
import PanelLayout from './PanelLayout.vue'
import './app.css'

bootstrapAppearance()

router.on('start', () => {
    document.documentElement.dataset.pkNavigating = 'true'
})

router.on('finish', () => {
    delete document.documentElement.dataset.pkNavigating
})

router.on('success', (event) => {
    syncAppearanceFromInertiaPage(event.detail.page)
})

setAppearancePersister((patch) => {
    let prefix = ''

    try {
        const raw = document.getElementById('app')?.dataset.page
        prefix = raw ? (JSON.parse(raw)?.props?.panel?.path ?? '') : ''
    } catch {
        prefix = ''
    }

    const base = !prefix || prefix === '/' ? '' : String(prefix).replace(/\/$/, '')
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

    fetch(`${base}/settings/appearance`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': match ? decodeURIComponent(match[1]) : '',
        },
        credentials: 'same-origin',
        body: JSON.stringify(patch),
    })
        .then(async (response) => {
            if (!response.ok) {
                return
            }

            const data = (await response.json()) as { appearance?: Record<string, unknown> }

            if (data.appearance && typeof data.appearance === 'object') {
                // Align account snapshot without remount flash (fingerprint skip).
                initializeAppearance(data.appearance)
            }
        })
        .catch(() => {
            // Offline, or a guest. The preference still applies in this browser.
        })
})

createInertiaApp({
    title: (title) => (title ? `${title} - Panel` : 'Panel'),

    resolve: (name) => {
        const pages = import.meta.glob<DefineComponent>('../../inertia/pages/**/*.vue')
        const page = pages[`../../inertia/pages/${name}.vue`]

        if (!page) {
            throw new Error(
                `Inertia page [${name}] is not in the published kit bundle. ` +
                    'Customise Vue with npm run build, or run panel:update.',
            )
        }

        return page()
    },

    layout: (name) => {
        if (
            name.startsWith('panel/auth/') ||
            name.startsWith('auth/') ||
            name.startsWith('landing/') ||
            name.startsWith('errors/')
        ) {
            return null
        }

        if (name === 'settings/Index') {
            return PanelLayout
        }

        if (name.startsWith('settings/')) {
            return [PanelLayout, SettingsLayout]
        }

        return PanelLayout
    },

    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el)
    },

    progress: { color: '#4B5563' },
})

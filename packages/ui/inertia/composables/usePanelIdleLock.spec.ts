import { router } from '@inertiajs/vue3'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { usePanelIdleLock } from './usePanelIdleLock'

const page: { props: Record<string, unknown>; component: string; url: string } = {
    props: {},
    component: 'clients/Index',
    url: '/clients',
}

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    router: {
        on: vi.fn(() => () => {}),
        post: vi.fn(),
    },
}))

function mountLock() {
    return mount(
        defineComponent({
            setup() {
                usePanelIdleLock()

                return () => h('div')
            },
        }),
    )
}

/**
 * THE REGRESSION THIS PINS: a background reload's 423 could arrive after a
 * separate, faster visit (e.g. `lockNow()`'s own POST) had already landed the
 * SPA on the lock screen. `onHttpException` used to gate `preventDefault()`
 * behind `!isAuthPage()`, so that late arrival skipped suppression entirely
 * and Inertia's "must receive a valid Inertia response" dialog fired - the
 * exact crash reported on `/clients`.
 */
describe('usePanelIdleLock - httpException handling', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        page.props = {
            panelIdleLock: {
                idleMinutes: 5,
                warningSeconds: 30,
                lockUrl: '/panel/lock',
                screenUrl: '/panel/screens/locked',
            },
        }
        page.component = 'clients/Index'
        page.url = '/clients'
        vi.mocked(router.on).mockClear()
        vi.mocked(router.post).mockClear()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    function capturedHandler(): (event: Event) => void {
        const call = vi
            .mocked(router.on)
            .mock.calls.find(([type]) => type === 'httpException')

        expect(call).toBeDefined()

        return call![1] as (event: Event) => void
    }

    it('suppresses the dialog for a 423 that arrives after the page already moved to the lock screen', () => {
        const wrapper = mountLock()
        const handler = capturedHandler()

        // A different, faster visit already won the race and landed on the
        // lock screen by the time this stale background reload settles.
        page.component = 'auth/LockScreen'
        page.url = '/screens/locked'

        const preventDefault = vi.fn()
        handler({ preventDefault, detail: { response: { status: 423 } } } as unknown as Event)

        expect(preventDefault).toHaveBeenCalled()

        wrapper.unmount()
    })

    it('still redirects on a 423 while genuinely on an ordinary page', () => {
        const wrapper = mountLock()
        const handler = capturedHandler()

        const preventDefault = vi.fn()

        expect(() =>
            handler({
                preventDefault,
                detail: { response: { status: 423 } },
            } as unknown as Event),
        ).not.toThrow()

        expect(preventDefault).toHaveBeenCalled()

        wrapper.unmount()
    })

    /**
     * THE REGRESSION THIS PINS: the redirect used to fire at `lockUrl`, which
     * is the POST-only endpoint `lockNow()` submits to. `window.location.assign`
     * is a GET, and that route answers a GET with 405 - so the crash dialog
     * this handler exists to suppress was immediately replaced by a second,
     * different crash. The redirect target must be `screenUrl`, the GET-
     * navigable password prompt - jsdom cannot perform the navigation itself
     * (see the tolerated "Not implemented: navigation" noise on the test
     * above), so this pins the guard on the input side instead: a config
     * shaped like the pre-fix server response (`lockUrl` present, `screenUrl`
     * missing) must not be treated as actionable.
     */
    it('does not act on a config that only carries the POST-only lockUrl', () => {
        page.props = {
            panelIdleLock: { idleMinutes: 5, warningSeconds: 30, lockUrl: '/panel/lock' },
        }

        const wrapper = mountLock()
        const handler = capturedHandler()

        const preventDefault = vi.fn()
        handler({ preventDefault, detail: { response: { status: 423 } } } as unknown as Event)

        expect(preventDefault).not.toHaveBeenCalled()

        wrapper.unmount()
    })

    it('leaves non-423 exceptions alone', () => {
        const wrapper = mountLock()
        const handler = capturedHandler()

        const preventDefault = vi.fn()
        handler({ preventDefault, detail: { response: { status: 500 } } } as unknown as Event)

        expect(preventDefault).not.toHaveBeenCalled()

        wrapper.unmount()
    })
})

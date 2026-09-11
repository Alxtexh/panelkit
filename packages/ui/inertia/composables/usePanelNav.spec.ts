import { describe, expect, it, vi } from 'vitest'

const page = vi.hoisted(() => ({ props: {} as Record<string, unknown> }))

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
}))

const { usePanelNav } = await import('./usePanelNav')

describe('usePanelNav', () => {
    /**
     * THE "SETTINGS" BUG: a group with exactly one item used to render as a
     * collapsible section anyway - a chevron to expand, revealing one child
     * confusingly labelled the same as the heading above it ("Settings" >
     * "Settings"), for what should have been a single click. A fresh install
     * with none of the optional Mail/Payment/Environment/Sitemap settings
     * pages enabled hits this by default: only the built-in account-settings
     * page carries `group: 'Settings'`.
     */
    it('demotes a declared group of exactly one item to a plain top-level item', () => {
        page.props = {
            panelNav: [],
            panelPages: [
                { title: 'Settings', href: '/settings', icon: 'settings', group: 'Settings' },
            ],
        }

        const { nav } = usePanelNav()

        expect(nav.value.groups).toHaveLength(0)
        expect(nav.value.primary.map((i) => i.title)).toContain('Settings')
    })

    it('keeps a group once a second item joins it', () => {
        page.props = {
            panelNav: [],
            panelPages: [
                { title: 'Mail', href: '/settings/mail', icon: 'mail', group: 'Settings' },
                { title: 'Payments', href: '/settings/payments', icon: 'credit-card', group: 'Settings' },
            ],
        }

        const { nav } = usePanelNav()

        expect(nav.value.groups).toHaveLength(1)
        expect(nav.value.groups[0]!.name).toBe('Settings')
        expect(nav.value.groups[0]!.items.map((i) => i.title)).toEqual(['Mail', 'Payments'])
    })

    it('keeps a group of one top-level item when it has a nested subgroup', () => {
        page.props = {
            panelNav: [],
            panelPages: [
                { title: 'Overview', href: '/screens', icon: 'list', group: 'Screens' },
                { title: 'Errors', href: '/screens/errors', icon: 'flag', group: 'Screens/Errors' },
            ],
        }

        const { nav } = usePanelNav()

        expect(nav.value.groups).toHaveLength(1)
        expect(nav.value.groups[0]!.name).toBe('Screens')
        expect(nav.value.groups[0]!.items.map((i) => i.title)).toEqual(['Overview'])
        expect(nav.value.groups[0]!.groups.map((g) => g.name)).toEqual(['Errors'])
    })

    it('leaves ungrouped items at the top level as before', () => {
        page.props = {
            panelNav: [{ title: 'Customers', href: '/customers', icon: 'users', group: null }],
            panelPages: [],
        }

        const { nav } = usePanelNav()

        expect(nav.value.groups).toHaveLength(0)
        expect(nav.value.primary.map((i) => i.title)).toContain('Customers')
    })
})

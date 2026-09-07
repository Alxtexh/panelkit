import { DOMWrapper, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import BulkActions from './BulkActions.vue'

const actions = [
    {
        key: 'delete',
        label: 'Delete',
        icon: 'trash',
        destructive: true,
        confirmation: 'Delete these records?',
    },
]

/**
 * The panel is teleported to <body> - see PkDropdown's own note on why - so
 * `wrapper.find` never sees it; only the real DOM does. `attachTo` puts the
 * component in the document at all (jsdom Teleport needs a real target), and
 * `body` is queried directly for anything past the trigger.
 */
function openMenu(wrapper: ReturnType<typeof mount>) {
    return wrapper.find('button[aria-haspopup="menu"]').trigger('click')
}

const body = () => new DOMWrapper(document.body)

afterEach(() => {
    document.body.innerHTML = ''
})

describe('BulkActions - count before commit', () => {
    it('shows the exact count immediately for an explicit selection', async () => {
        const wrapper = mount(BulkActions, {
            props: { actions, count: 3, allMatching: false },
            attachTo: document.body,
        })

        const trigger = wrapper.find('button[aria-haspopup="menu"]')
        expect(trigger.text()).toContain('Bulk actions')
        expect(trigger.text()).toContain('2') // Delete + Export CSV
        expect(trigger.classes()).toContain('min-h-9')

        await openMenu(wrapper)
        await body().find('[role="menuitem"].text-destructive').trigger('click')

        expect(body().text()).toContain('3 records')
        expect(body().find('button:not([disabled])').exists()).toBe(true)
    })

    it('shows a placeholder and disables confirm while the matching total is unknown', async () => {
        const wrapper = mount(BulkActions, {
            props: { actions, count: 0, allMatching: true, total: undefined },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        await body().find('[role="menuitem"].text-destructive').trigger('click')

        expect(body().text()).toContain('…')

        const confirmButton = body()
            .findAll('button')
            .find((b) => b.text() === 'Delete')
        expect(confirmButton?.attributes('disabled')).toBeDefined()
    })

    it('blocks and explains an empty match once the total lands at zero', async () => {
        const wrapper = mount(BulkActions, {
            props: { actions, count: 0, allMatching: true, total: 0 },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        await body().find('[role="menuitem"].text-destructive').trigger('click')

        expect(body().text()).toContain('Nothing matches the current filters')

        const confirmButton = body()
            .findAll('button')
            .find((b) => b.text() === 'Delete')
        expect(confirmButton?.attributes('disabled')).toBeDefined()
    })

    it('confirms with the real select-all-matching total once it lands', async () => {
        const wrapper = mount(BulkActions, {
            props: { actions, count: 0, allMatching: true, total: 247 },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        await body().find('[role="menuitem"].text-destructive').trigger('click')

        expect(body().text()).toContain('247 records')

        const confirmButton = body()
            .findAll('button')
            .find((b) => b.text() === 'Delete')
        expect(confirmButton?.attributes('disabled')).toBeUndefined()

        await confirmButton?.trigger('click')

        expect(wrapper.emitted('run')?.[0]).toEqual(['delete'])
    })

    it('export confirms with the same count and blocks when it is zero', async () => {
        const wrapper = mount(BulkActions, {
            props: { actions: [], count: 0, allMatching: true, total: 0 },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        await body().find('[role="menuitem"]').trigger('click')

        expect(body().text()).toContain('Nothing matches the current filters')

        const exportButton = body()
            .findAll('button')
            .find((b) => b.text() === 'Export CSV')
        expect(exportButton?.attributes('disabled')).toBeDefined()

        await wrapper.setProps({ total: 90 })

        expect(body().text()).toContain('90 records')
        // Whitespace between the count and the period rendered as a visible
        // gap - "90 records ." - because the template put the "." on its own
        // line, and Vue condenses (not removes) inter-element whitespace.
        expect(body().text()).toContain('90 records.')
        expect(body().text()).not.toContain('90 records .')
        expect(exportButton?.attributes('disabled')).toBeUndefined()

        await exportButton?.trigger('click')

        expect(wrapper.emitted('export')).toBeTruthy()
    })
})

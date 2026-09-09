import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SchemaColumn } from '../../composables/useSchemaColumns'

const visit = vi.fn()

vi.mock('@inertiajs/vue3', () => ({
    router: { visit },
}))

const { default: RelationPanel } = await import('./RelationPanel.vue')

const columns: SchemaColumn[] = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'note', label: 'Note', type: 'text' },
]

afterEach(() => {
    visit.mockClear()
})

describe('RelationPanel', () => {
    it('wraps content in TableShell with a title band and actions', () => {
        const wrapper = mount(RelationPanel, {
            props: {
                title: 'Comments',
                columns,
                rows: [{ id: 1, title: 'Hello', note: null }],
                loaded: true,
            },
            slots: {
                actions: '<button type="button">Add</button>',
            },
        })

        expect(wrapper.text()).toContain('Comments')
        expect(wrapper.text()).toContain('Add')
        expect(wrapper.text()).toContain('Hello')
        expect(wrapper.text()).toContain('None')
        expect(wrapper.find('.rounded-xl').exists()).toBe(true)
    })

    it('renders PkEmptyState when loaded with no rows', () => {
        const wrapper = mount(RelationPanel, {
            props: {
                title: 'Tags',
                columns,
                rows: [],
                loaded: true,
                emptyTitle: 'No tags yet',
                emptyText: 'Nothing linked.',
            },
        })

        expect(wrapper.find('[data-slot="empty-state"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('No tags yet')
        expect(wrapper.text()).toContain('Nothing linked.')
    })

    it('keeps load-more in the pagination band', async () => {
        const wrapper = mount(RelationPanel, {
            props: {
                columns,
                rows: [{ id: 1, title: 'One', note: 'a' }],
                loaded: true,
                nextCursor: 'cursor-2',
            },
        })

        await wrapper.get('button').trigger('click')

        expect(wrapper.emitted('load')?.[0]).toEqual(['cursor-2'])
    })

    it('mounts TableToolbar when the relation declares filters', () => {
        const wrapper = mount(RelationPanel, {
            props: {
                title: 'Sessions',
                columns,
                rows: [{ id: 1, title: 'One', note: 'a' }],
                loaded: true,
                filterSchema: [
                    { key: 'status', label: 'Status', type: 'select', options: ['online'] },
                ],
                filters: { status: null },
            },
        })

        expect(wrapper.find('input[type="search"], input[placeholder*="Search"]').exists()).toBe(
            true,
        )
        expect(wrapper.text()).toMatch(/Filters|Tools/)
    })

    it('opens a row on click when the relation has a dedicated record page', async () => {
        const wrapper = mount(RelationPanel, {
            props: {
                columns,
                rows: [{ id: 42, title: 'One', note: 'a' }],
                loaded: true,
                recordBase: '/articles/1/comments',
            },
        })

        await wrapper.get('[data-slot="table-row"]').trigger('click')

        expect(visit).toHaveBeenCalledWith('/articles/1/comments/42')
    })

    it('does nothing on row click without a dedicated record page', async () => {
        const wrapper = mount(RelationPanel, {
            props: {
                columns,
                rows: [{ id: 42, title: 'One', note: 'a' }],
                loaded: true,
            },
        })

        await wrapper.get('[data-slot="table-row"]').trigger('click')

        expect(visit).not.toHaveBeenCalled()
    })

    it('ignores a row click that lands on the first column link', async () => {
        const wrapper = mount(RelationPanel, {
            props: {
                columns,
                rows: [{ id: 42, title: 'One', note: 'a' }],
                loaded: true,
                recordBase: '/articles/1/comments',
            },
        })

        await wrapper.get('a').trigger('click')

        expect(visit).not.toHaveBeenCalled()
    })

    it('ignores a modified click so opening in a new tab still works', async () => {
        const wrapper = mount(RelationPanel, {
            props: {
                columns,
                rows: [{ id: 42, title: 'One', note: 'a' }],
                loaded: true,
                recordBase: '/articles/1/comments',
            },
        })

        await wrapper.get('[data-slot="table-row"]').trigger('click', { metaKey: true })

        expect(visit).not.toHaveBeenCalled()
    })
})

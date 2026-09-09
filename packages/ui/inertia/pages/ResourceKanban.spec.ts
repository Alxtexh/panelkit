import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

const visit = vi.fn()

vi.mock('@inertiajs/vue3', () => ({
    Head: { name: 'Head', template: '<div />', props: ['title'] },
    Link: { name: 'Link', template: '<a><slot /></a>', props: ['href'] },
    router: { visit },
}))

const { default: ResourceKanban } = await import('./ResourceKanban.vue')

afterEach(() => {
    visit.mockClear()
})

const baseProps = {
    schema: { key: 'articles', label: 'Article', labelPlural: 'Articles' },
    board: {
        column: 'status',
        columns: [
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
        ],
        title: 'title',
        description: null,
    },
    columns: [
        {
            value: 'draft',
            label: 'Draft',
            cards: [{ id: 1, title: 'One', column: 'draft' }],
        },
        { value: 'published', label: 'Published', cards: [] },
    ],
    can: { update: true },
    moveUrl: '/articles/board-move',
    indexUrl: '/articles',
}

describe('ResourceKanban', () => {
    it('shows the first-N affordance when capped', () => {
        const wrapper = mount(ResourceKanban, {
            props: {
                ...baseProps,
                cardCap: 500,
                capped: true,
                totalMatching: 1200,
            },
        })

        expect(wrapper.text()).toContain('Showing first 500 cards')
        expect(wrapper.text()).toContain('of 1200 matching')
    })

    it('shows an empty state when there are no cards', () => {
        const wrapper = mount(ResourceKanban, {
            props: {
                ...baseProps,
                columns: [
                    { value: 'draft', label: 'Draft', cards: [] },
                    { value: 'published', label: 'Published', cards: [] },
                ],
            },
        })

        expect(wrapper.text()).toContain('No cards on this board')
    })

    it('opens a card on a plain click, not just a double-click', async () => {
        const wrapper = mount(ResourceKanban, { props: baseProps })

        await wrapper.get('li[draggable]').trigger('click')

        expect(visit).toHaveBeenCalledWith('/articles/1')
    })

    it('ignores a modified click on a card', async () => {
        const wrapper = mount(ResourceKanban, { props: baseProps })

        await wrapper.get('li[draggable]').trigger('click', { metaKey: true })

        expect(visit).not.toHaveBeenCalled()
    })
})

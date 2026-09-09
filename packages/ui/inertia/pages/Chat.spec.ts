import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

const get = vi.fn()
const page = { url: '/apps/chat', props: {} }

vi.mock('@inertiajs/vue3', () => ({
    Head: { name: 'Head', template: '<div />', props: ['title'] },
    router: { get },
    usePage: () => page,
}))

const { default: Chat } = await import('./Chat.vue')

afterEach(() => {
    get.mockClear()
})

const conversations = [
    { id: 1, name: 'Alice', preview: 'Hey there' },
    { id: 2, name: 'Bob', preview: 'Still around?' },
]

describe('Chat', () => {
    it('opens a conversation on click by navigating with its id on the query string', async () => {
        const wrapper = mount(Chat, { props: { conversations } })

        await wrapper.findAll('button')[1]!.trigger('click')

        expect(get).toHaveBeenCalledWith(
            '/apps/chat',
            { id: 2, q: undefined },
            { preserveState: true, preserveScroll: true },
        )
    })

    it('preserves the current search term when switching conversations', async () => {
        const wrapper = mount(Chat, { props: { conversations, search: 'billing' } })

        await wrapper.findAll('button')[0]!.trigger('click')

        expect(get).toHaveBeenCalledWith(
            '/apps/chat',
            { id: 1, q: 'billing' },
            { preserveState: true, preserveScroll: true },
        )
    })
})

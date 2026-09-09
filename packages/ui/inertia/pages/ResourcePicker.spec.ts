import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

const visit = vi.fn()

vi.mock('@inertiajs/vue3', () => ({
    Head: { name: 'Head', template: '<div />', props: ['title'] },
    Link: { name: 'Link', template: '<a><slot /></a>', props: ['href'] },
    router: { visit, get: vi.fn() },
}))

const { default: ResourcePicker } = await import('./ResourcePicker.vue')

afterEach(() => {
    visit.mockClear()
})

const baseProps = {
    schema: {
        key: 'clients',
        label: 'Client',
        labelPlural: 'Clients',
        table: { columns: [{ key: 'name', label: 'Name', type: 'text' }] },
    },
    field: 'client_id',
    chooseBase: '/clients/pick',
    returnUrl: '/orders/create',
    records: [{ id: 42, name: 'Quincy Otieno' }],
    search: '',
    breadcrumbs: [],
}

describe('ResourcePicker', () => {
    it('chooses the record on a row click, same destination as the Select link', async () => {
        const wrapper = mount(ResourcePicker, { props: baseProps })

        await wrapper.get('tbody tr').trigger('click')

        expect(visit).toHaveBeenCalledWith(
            `/clients/pick/42?return=${encodeURIComponent('/orders/create')}`,
        )
    })

    it('ignores a click on the Select link itself so it is not double-visited', async () => {
        const wrapper = mount(ResourcePicker, { props: baseProps })

        await wrapper.get('tbody tr a').trigger('click')

        expect(visit).not.toHaveBeenCalled()
    })

    it('ignores a modified click', async () => {
        const wrapper = mount(ResourcePicker, { props: baseProps })

        await wrapper.get('tbody tr').trigger('click', { ctrlKey: true })

        expect(visit).not.toHaveBeenCalled()
    })
})

import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useListTable } from './useListTable'

vi.mock('@inertiajs/vue3', () => ({
    router: {
        get: vi.fn(),
    },
}))

describe('useListTable request lifecycle', () => {
    it('keeps the newest request in control when an older one finishes late', async () => {
        const { router } = await import('@inertiajs/vue3')
        const get = vi.mocked(router.get)
        let table!: ReturnType<typeof useListTable>
        const wrapper = mount(
            defineComponent({
                setup() {
                    table = useListTable('/clients', {
                        records: [],
                        filters: {},
                        search: '',
                        sort: 'created_at',
                        direction: 'desc',
                        nextCursor: null,
                        perPage: 25,
                        perPageOptions: [25],
                        tab: null,
                        tabs: [],
                    })

                    return () => null
                },
            }),
        )

        table.setSearch('first')
        table.setSearch('second')

        expect(get).toHaveBeenCalledTimes(2)
        expect(table.loading.value).toBe(true)

        const firstOptions = get.mock.calls[0]?.[2] as { onFinish: () => void }
        const secondOptions = get.mock.calls[1]?.[2] as { onFinish: () => void }

        firstOptions.onFinish()
        expect(table.loading.value).toBe(true)

        secondOptions.onFinish()
        expect(table.loading.value).toBe(false)

        wrapper.unmount()
    })
})

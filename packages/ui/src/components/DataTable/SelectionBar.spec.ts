import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SelectionBar from './SelectionBar.vue'

describe('SelectionBar - selection mode', () => {
    it('gives an explicit selection a clear summary and escape hatch', async () => {
        const wrapper = mount(SelectionBar, {
            props: { count: 3, allMatching: false, total: 247 },
            attachTo: document.body,
        })

        expect(wrapper.text()).toContain('3 selected')
        expect(wrapper.text()).toContain('Ready for a bulk action')

        const selectAll = wrapper
            .findAll('button')
            .find((button) => button.text().includes('Select all 247'))
        expect(selectAll).toBeDefined()

        await selectAll?.trigger('click')
        expect(wrapper.emitted('select-all-matching')).toBeTruthy()

        const clear = wrapper.find('button[aria-label="Clear selection"]')
        await clear.trigger('click')
        expect(wrapper.emitted('clear')).toBeTruthy()
    })

    it('explains when the selection covers every matching record', () => {
        const wrapper = mount(SelectionBar, {
            props: { count: 10, allMatching: true, total: 1247 },
            attachTo: document.body,
        })

        expect(wrapper.text()).toContain('All 1,247 matching records')
        expect(wrapper.text()).toContain('Every matching record is included')
        expect(wrapper.find('[role="status"]').attributes('aria-live')).toBe('polite')
    })
})

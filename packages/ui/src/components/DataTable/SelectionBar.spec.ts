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

        const selectAll = wrapper
            .findAll('button')
            .find((button) => button.text().includes('Select all 247'))
        expect(selectAll).toBeDefined()

        await selectAll?.trigger('click')
        expect(wrapper.emitted('select-all-matching')).toBeTruthy()

        const clear = wrapper.findAll('button').find((button) => button.text() === 'Deselect all')
        expect(clear).toBeDefined()

        await clear?.trigger('click')
        expect(wrapper.emitted('clear')).toBeTruthy()
    })

    it('explains when the selection covers every matching record', () => {
        const wrapper = mount(SelectionBar, {
            props: { count: 10, allMatching: true, total: 1247 },
            attachTo: document.body,
        })

        expect(wrapper.text()).toContain('All 1,247 matching records')
        expect(wrapper.find('[role="status"]').attributes('aria-live')).toBe('polite')
    })

    /**
     * THE REGRESSION THIS PINS: a tinted, bordered banner with an icon badge
     * used to outweigh the toolbar it replaces for a state that is common
     * rather than exceptional. This stays a plain row - no card, no icon -
     * at the same visual weight as the rest of the table's toolbar.
     */
    it('renders as a plain row, not a tinted bordered card', () => {
        const wrapper = mount(SelectionBar, {
            props: { count: 3, allMatching: false, total: 247 },
        })

        const bar = wrapper.get('[data-slot="selection-bar"]')
        expect(bar.classes()).not.toContain('border')
        expect(bar.classes().join(' ')).not.toContain('bg-primary')

        // The mobile "Actions" trigger keeps its own icon; the summary text
        // itself no longer sits behind a decorative checkmark badge.
        const summary = bar.get('span')
        expect(summary.text()).toContain('selected')
        expect(summary.find('svg').exists()).toBe(false)
    })
})

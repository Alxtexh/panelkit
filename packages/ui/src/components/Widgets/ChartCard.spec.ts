import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ChartCard from './ChartCard.vue'

describe('ChartCard', () => {
    it('unmounts the body on collapse so no chart area is reserved', async () => {
        const wrapper = mount(ChartCard, {
            props: { label: 'Sessions' },
            slots: { default: '<p>plot</p>' },
        })

        expect(wrapper.text()).toContain('plot')
        expect(wrapper.get('[data-slot="chart-card"]').attributes('data-collapsed')).toBe('false')
        expect(wrapper.get('[aria-label="Collapse Sessions"] svg').classes()).toContain(
            'rotate-180',
        )

        await wrapper.get('[aria-label="Collapse Sessions"]').trigger('click')

        expect(wrapper.get('[aria-label="Expand Sessions"]').exists()).toBe(true)
        expect(wrapper.find('[data-slot="chart-card-body"]').exists()).toBe(false)
        expect(wrapper.text()).not.toContain('plot')
        expect(wrapper.get('[data-slot="chart-card"]').attributes('data-collapsed')).toBe('true')
        expect(wrapper.get('[aria-label="Expand Sessions"] svg').classes()).not.toContain(
            'rotate-180',
        )
    })

    it('emits hide when hideable', async () => {
        const wrapper = mount(ChartCard, {
            props: { label: 'Sessions', hideable: true },
        })

        await wrapper.get('[aria-label="Hide Sessions"]').trigger('click')

        expect(wrapper.emitted('hide')).toHaveLength(1)
    })

    it('does not offer hide unless asked', () => {
        const wrapper = mount(ChartCard, { props: { label: 'Sessions' } })

        expect(wrapper.find('[aria-label="Hide Sessions"]').exists()).toBe(false)
    })

    it('offers a retry action only for a failed, retryable chart', async () => {
        const wrapper = mount(ChartCard, {
            props: { label: 'Sessions', error: true, retryable: true },
        })

        const retry = wrapper.findAll('button').find((button) => button.text() === 'Try again')

        expect(retry).toBeDefined()

        expect(retry!.text()).toBe('Try again')
        expect(wrapper.get('[role="alert"]').text()).toContain('Could not load')

        await retry!.trigger('click')

        expect(wrapper.emitted('retry')).toHaveLength(1)
    })
})

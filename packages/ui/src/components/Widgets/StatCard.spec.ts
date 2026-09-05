import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StatCard from './StatCard.vue'

describe('StatCard', () => {
    it('offers an accessible retry action for a failed value', async () => {
        const wrapper = mount(StatCard, {
            props: { label: 'Subscribers', error: true, retryable: true },
        })

        const alert = wrapper.get('[role="alert"]')
        const retry = alert.get('button')

        expect(alert.text()).toContain('Could not load')
        expect(retry.text()).toBe('Retry')

        await retry.trigger('click')

        expect(wrapper.emitted('retry')).toHaveLength(1)
    })

    it('keeps the stable value frame while loading', () => {
        const wrapper = mount(StatCard, {
            props: { label: 'Subscribers', loading: true },
        })

        expect(wrapper.get('[data-slot="stat-card"]').attributes('aria-busy')).toBe('true')
        expect(wrapper.get('[role="status"]').attributes('aria-label')).toBe('Loading')
    })
})

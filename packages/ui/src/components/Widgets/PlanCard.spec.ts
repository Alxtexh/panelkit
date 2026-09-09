import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PlanCard from './PlanCard.vue'
import PlanEditor from './PlanEditor.vue'
import PlanGrid from './PlanGrid.vue'
import { cycleLabel, formatPerkValue } from './planTypes'
import type { PlanRecord } from './planTypes'

const starter: PlanRecord = {
    id: 'starter',
    name: 'Starter',
    days: 30,
    price: 9,
    priceFormatted: '$9',
    activeUsers: 2,
    perks: {
        devices: { value: 2, overview: 'Two devices' },
        storage: { value: -1, overview: 'No cap' },
        campaigns: { value: false, overview: '' },
        modules: { value: ['devices', 'storage'], overview: 'Core tools' },
    },
    extraPerks: [{ key: 'Email support', value: '48h' }],
}

describe('planTypes', () => {
    it('labels common billing cycles', () => {
        expect(cycleLabel(30)).toBe('Per month')
        expect(cycleLabel(365)).toBe('Per year')
        expect(cycleLabel(999999)).toBe('Lifetime')
    })

    it('renders -1 as Unlimited', () => {
        expect(formatPerkValue(-1)).toBe('Unlimited')
    })
})

describe('PlanCard', () => {
    it('shows name, price, cycle, seats and perk checkmarks', () => {
        const wrapper = mount(PlanCard, { props: { plan: starter } })

        expect(wrapper.text()).toContain('Starter')
        expect(wrapper.text()).toContain('$9')
        expect(wrapper.text()).toContain('Per month')
        expect(wrapper.text()).toContain('Active seats: 2')
        expect(wrapper.text()).toContain('Unlimited')
        expect(wrapper.text()).toContain('devices')
        expect(wrapper.text()).toContain('Email support')
        expect(wrapper.classes()).toContain('rounded-lg')
        expect(wrapper.classes()).not.toContain('border-primary')
    })

    it('outlines featured plans like landing PkPricing', () => {
        const wrapper = mount(PlanCard, {
            props: { plan: { ...starter, featured: true, recommended: true } },
        })

        expect(wrapper.classes()).toContain('border-primary')
        expect(wrapper.text()).toContain('Recommended')
    })

    it('emits edit and blocks delete while users are on the plan', async () => {
        const wrapper = mount(PlanCard, { props: { plan: starter } })

        await wrapper.findAll('button')[0]!.trigger('click')
        expect(wrapper.emitted('edit')?.[0]).toEqual(['starter'])

        const destroy = wrapper.findAll('button')[1]!
        expect(destroy.attributes('disabled')).toBeDefined()
    })

    it('opens the plan on a click anywhere on the card, not just the Edit button', async () => {
        const wrapper = mount(PlanCard, { props: { plan: starter } })

        await wrapper.get('[data-slot="plan-card"]').trigger('click')

        expect(wrapper.emitted('edit')?.[0]).toEqual(['starter'])
    })

    it('does not also open the card when Delete is clicked', async () => {
        const wrapper = mount(PlanCard, {
            props: { plan: { ...starter, activeUsers: 0 }, canDelete: true },
        })

        await wrapper.findAll('button')[1]!.trigger('click')

        expect(wrapper.emitted('delete')?.[0]).toEqual(['starter'])
        expect(wrapper.emitted('edit')).toBeUndefined()
    })

    it('allows delete for a plan with no active users even when the caller never mentions canDelete', () => {
        const wrapper = mount(PlanCard, { props: { plan: { ...starter, activeUsers: 0 } } })

        const destroy = wrapper.findAll('button')[1]!
        expect(destroy.attributes('disabled')).toBeUndefined()
    })

    it('still blocks delete when a caller explicitly opts out', () => {
        const wrapper = mount(PlanCard, {
            props: { plan: { ...starter, activeUsers: 0 }, canDelete: false },
        })

        const destroy = wrapper.findAll('button')[1]!
        expect(destroy.attributes('disabled')).toBeDefined()
    })
})

describe('PlanGrid', () => {
    it('emits create', async () => {
        const wrapper = mount(PlanGrid, { props: { plans: [starter], title: 'Plans' } })

        await wrapper.get('button').trigger('click')
        expect(wrapper.emitted('create')).toHaveLength(1)
    })

    it('has no page chrome by default so it can drop onto any screen', () => {
        const wrapper = mount(PlanGrid, { props: { plans: [starter], title: 'Plans' } })

        expect(wrapper.classes().join(' ')).not.toContain('max-w-5xl')
        expect(wrapper.classes().join(' ')).not.toContain('px-4')
        expect(wrapper.html()).toContain('gap-6')
    })

    it('opts into page chrome when embedded is false', () => {
        const wrapper = mount(PlanGrid, {
            props: { plans: [starter], title: 'Plans', embedded: false },
        })

        expect(wrapper.classes().join(' ')).toContain('w-full')
        expect(wrapper.classes().join(' ')).toContain('px-4')
        expect(wrapper.classes().join(' ')).not.toContain('max-w-5xl')
        expect(wrapper.classes().join(' ')).not.toContain('mx-auto')
    })
})

describe('PlanEditor', () => {
    it('has details and perks columns and emits save', async () => {
        const wrapper = mount(PlanEditor, {
            props: {
                plan: starter,
                mode: 'edit',
                modules: [
                    { key: 'devices', label: 'Devices' },
                    { key: 'storage', label: 'Storage' },
                ],
                limits: [{ key: 'devices', label: 'Devices', kind: 'number' }],
            },
        })

        expect(wrapper.text()).toContain('Plan details')
        expect(wrapper.text()).toContain('Plan perks')
        expect(wrapper.text()).toContain('Plans are organisation-wide.')
        expect(wrapper.text()).toContain('Use -1 for Unlimited.')
        expect(wrapper.classes().join(' ')).not.toContain('max-w-5xl')

        await wrapper.get('form').trigger('submit')

        const saved = wrapper.emitted('save')?.[0]?.[0] as PlanRecord
        expect(saved.name).toBe('Starter')
        expect(saved.perks?.devices?.value).toBe(2)
    })
})

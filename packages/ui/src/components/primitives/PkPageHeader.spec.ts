import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PkPageHeader from './PkPageHeader.vue'

describe('PkPageHeader', () => {
    it('renders a large title and muted purpose', () => {
        const wrapper = mount(PkPageHeader, {
            props: {
                title: 'Clients',
                purpose: 'People and organisations you bill.',
            },
            slots: {
                actions: '<button type="button">New Client</button>',
            },
        })

        const heading = wrapper.find('h1')

        expect(wrapper.attributes('data-slot')).toBe('page-header')
        expect(heading.text()).toBe('Clients')
        expect(heading.classes()).toContain('font-semibold')
        // Font-size, line-height, and letter-spacing come from
        // `.pk-shell [data-slot='page-header'] h1` in design-system.css (a
        // fluid clamp()), not from a fixed `text-2xl`/`tracking-tight`
        // utility. Tailwind's cascade layers put utilities after components,
        // so a `text-2xl` class here would always win over that rule
        // regardless of specificity, permanently overriding the intended
        // fluid scale. The size rule only reaches this heading inside its
        // real `.pk-shell` ancestor (PanelShell.vue/AppShell.vue), which every
        // production usage has.
        expect(heading.classes()).not.toContain('text-2xl')
        expect(heading.classes()).not.toContain('tracking-tight')
        expect(wrapper.text()).toContain('People and organisations you bill.')
        expect(wrapper.text()).toContain('New Client')
    })

    it('omits purpose and actions when absent', () => {
        const wrapper = mount(PkPageHeader, {
            props: { title: 'Clients' },
        })

        expect(wrapper.find('p').exists()).toBe(false)
        expect(wrapper.text()).toBe('Clients')
    })

    it('renders an optional status beside the title', () => {
        const wrapper = mount(PkPageHeader, {
            props: { title: 'Acme Fibre' },
            slots: {
                status: '<span data-test="status">Active</span>',
            },
        })

        expect(wrapper.find('[data-test="status"]').text()).toBe('Active')
        expect(wrapper.text()).toContain('Acme Fibre')
    })
})

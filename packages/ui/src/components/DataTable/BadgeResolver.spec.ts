import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import BadgeResolver from './BadgeResolver.vue'

const open = async () => {
    const wrapper = mount(BadgeResolver, {
        props: {
            value: 'open',
            label: 'Status',
            options: { open: 'Open', pending: 'Pending', resolved: 'Resolved' },
            colors: { open: 'warning', pending: 'neutral', resolved: 'success' },
        },
        attachTo: document.body,
    })

    await wrapper.get('button').trigger('click')

    return wrapper
}

describe('BadgeResolver', () => {
    afterEach(() => {
        document.body.innerHTML = ''
    })

    it('opens a select-status list with the current value checked', async () => {
        await open()

        const panel = document.body.querySelector('[data-pk-overlay]')

        expect(panel?.textContent).toContain('Select status')
        expect(panel?.textContent).toContain('Open')
        expect(panel?.textContent).toContain('Pending')
        expect(panel?.querySelector('[aria-label="Current"]')).not.toBeNull()
    })

    it('emits the picked value and not a no-op on the current one', async () => {
        const wrapper = await open()
        const items = [
            ...document.body.querySelectorAll('[role="menuitem"]'),
        ] as HTMLButtonElement[]
        const pending = items.find((el) => el.textContent?.includes('Pending'))

        expect(pending).toBeTruthy()
        pending?.click()
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('change')?.[0]).toEqual(['pending'])
    })

    it('does not turn a display-only badge into a button when disabled', () => {
        const wrapper = mount(BadgeResolver, {
            props: {
                value: 'open',
                disabled: true,
                options: { open: 'Open' },
                colors: { open: 'warning' },
            },
        })

        expect(wrapper.find('button').exists()).toBe(false)
        expect(wrapper.get('[data-slot="badge"]').text()).toBe('Open')
    })

    it('is soft by default, since a table repeats this pill down every row', () => {
        const wrapper = mount(BadgeResolver, {
            props: {
                value: 'open',
                disabled: true,
                options: { open: 'Open' },
                colors: { open: 'warning' },
            },
        })

        expect(wrapper.get('[data-slot="badge"]').classes()).toContain('bg-warning/15')
    })

    it('renders the solid fill when a caller opts out of soft', () => {
        const wrapper = mount(BadgeResolver, {
            props: {
                value: 'open',
                disabled: true,
                soft: false,
                options: { open: 'Open' },
                colors: { open: 'warning' },
            },
        })

        expect(wrapper.get('[data-slot="badge"]').classes()).toContain('bg-warning')
    })
})

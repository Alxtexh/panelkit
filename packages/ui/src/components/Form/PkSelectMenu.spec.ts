import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PkSelectMenu from './PkSelectMenu.vue'

const OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'lead', label: 'Lead' },
]

describe('PkSelectMenu', () => {
    it('shows a placeholder when nothing is selected', () => {
        const wrapper = mount(PkSelectMenu, { props: { modelValue: null, options: OPTIONS } })

        expect(wrapper.text()).toContain('Select…')
        expect(wrapper.find('[aria-label="Clear selection"]').exists()).toBe(false)
    })

    it('shows the matching option label when a value is set', () => {
        const wrapper = mount(PkSelectMenu, { props: { modelValue: 'active', options: OPTIONS } })

        expect(wrapper.text()).toContain('Active')
    })

    it('opens the listbox on trigger click', async () => {
        const wrapper = mount(PkSelectMenu, { props: { modelValue: null, options: OPTIONS } })

        expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

        await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

        expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
        expect(wrapper.findAll('[role="option"]')).toHaveLength(3)
    })

    it('does not open when disabled', async () => {
        const wrapper = mount(PkSelectMenu, {
            props: { modelValue: null, options: OPTIONS, disabled: true },
        })

        await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

        expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    /**
     * `PkTextInput`/`Input.vue` already draw a red border on
     * `aria-invalid="true"` via Tailwind's `aria-invalid:` variant. This
     * trigger button sets the same attribute but drew its own box rather
     * than rendering a native input, so it never picked up that styling -
     * confirmed missing by Phase 6's audit alongside `PkDatePicker`.
     */
    it('carries the invalid-border class when invalid', () => {
        const wrapper = mount(PkSelectMenu, {
            props: { modelValue: null, options: OPTIONS, invalid: true },
        })

        const trigger = wrapper.find('button[aria-haspopup="listbox"]')
        expect(trigger.attributes('aria-invalid')).toBe('true')
        expect(trigger.classes()).toContain('aria-invalid:border-destructive')
    })

    it('emits the picked value and closes', async () => {
        const wrapper = mount(PkSelectMenu, { props: { modelValue: null, options: OPTIONS } })

        await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')
        await wrapper.findAll('[role="option"]')[1]!.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toEqual([['inactive']])
        expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('marks the current value selected in the list', async () => {
        const wrapper = mount(PkSelectMenu, { props: { modelValue: 'lead', options: OPTIONS } })

        await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

        const selected = wrapper.find('[data-selected="true"]')
        expect(selected.text()).toBe('Lead')
    })

    it('clears the value', async () => {
        const wrapper = mount(PkSelectMenu, { props: { modelValue: 'active', options: OPTIONS } })

        await wrapper.find('[aria-label="Clear selection"]').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    })

    it('hides the clear affordance when not clearable', () => {
        const wrapper = mount(PkSelectMenu, {
            props: { modelValue: 'active', options: OPTIONS, clearable: false },
        })

        expect(wrapper.find('[aria-label="Clear selection"]').exists()).toBe(false)
    })

    it('closes on Escape from the list', async () => {
        const wrapper = mount(PkSelectMenu, { props: { modelValue: null, options: OPTIONS } })

        await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')
        await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'Escape' })

        expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('shows a message when there are no options', async () => {
        const wrapper = mount(PkSelectMenu, { props: { modelValue: null, options: [] } })

        await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

        expect(wrapper.text()).toContain('No options')
    })

    /**
     * WITHOUT THIS, closing the listbox - by Escape, by picking an option, or
     * by the backdrop - leaves focus on nothing in particular, the same gap
     * `PkDatePicker` had. `attachTo: document.body` is required for jsdom to
     * track real DOM focus at all.
     */
    it('returns focus to the trigger button after closing via Escape', async () => {
        const wrapper = mount(PkSelectMenu, {
            props: { modelValue: 'active', options: OPTIONS },
            attachTo: document.body,
        })

        const trigger = wrapper.find('button[aria-haspopup="listbox"]')
        await trigger.trigger('click')
        await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'Escape' })

        expect(document.activeElement).toBe(trigger.element)
        wrapper.unmount()
    })

    it('returns focus to the trigger button after picking an option', async () => {
        const wrapper = mount(PkSelectMenu, {
            props: { modelValue: null, options: OPTIONS },
            attachTo: document.body,
        })

        const trigger = wrapper.find('button[aria-haspopup="listbox"]')
        await trigger.trigger('click')
        await wrapper.findAll('[role="option"]')[0]!.trigger('click')

        expect(document.activeElement).toBe(trigger.element)
        wrapper.unmount()
    })

    /**
     * A standards-based semantic audit (WAI-ARIA APG's Collapsible Dropdown
     * Listbox pattern) found gaps beyond keyboard interaction and focus
     * restoration, which those were already covered by. These tests lock
     * in the fixes.
     */
    describe('accessibility - listbox semantics', () => {
        it('names the listbox for a screen reader landing inside it', async () => {
            const wrapper = mount(PkSelectMenu, {
                props: { modelValue: null, options: OPTIONS, label: 'Status' },
            })

            await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

            expect(wrapper.find('[role="listbox"]').attributes('aria-label')).toBe('Status')
        })

        it('exposes exactly one option as a Tab stop, the selected one', async () => {
            const wrapper = mount(PkSelectMenu, {
                props: { modelValue: 'lead', options: OPTIONS },
            })

            await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

            const options = wrapper.findAll('[role="option"]')
            const tabbable = options.filter((o) => o.attributes('tabindex') === '0')

            expect(tabbable).toHaveLength(1)
            expect(tabbable[0]!.text()).toBe('Lead')
            expect(options.filter((o) => o.attributes('tabindex') === '-1')).toHaveLength(
                OPTIONS.length - 1,
            )
        })

        it('exposes the first option as the Tab stop when nothing is selected', async () => {
            const wrapper = mount(PkSelectMenu, {
                props: { modelValue: null, options: OPTIONS },
            })

            await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

            const options = wrapper.findAll('[role="option"]')
            expect(options[0]!.attributes('tabindex')).toBe('0')
        })

        it('focuses the first option, not just the trigger, when nothing is selected', async () => {
            const wrapper = mount(PkSelectMenu, {
                props: { modelValue: null, options: OPTIONS },
                attachTo: document.body,
            })

            await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

            expect(document.activeElement).toBe(wrapper.findAll('[role="option"]')[0]!.element)
            wrapper.unmount()
        })

        /**
         * A listbox popup is not a modal dialog (unlike PkDatePicker's
         * calendar) - the expected behaviour matches a native <select>:
         * Tab moves on to the next field rather than being trapped.
         * Before this, the popup stayed open with no focus inside it while
         * real focus continued past it into whatever followed in the page.
         */
        it('closes (without trapping) on Tab, the same as Escape', async () => {
            const wrapper = mount(PkSelectMenu, {
                props: { modelValue: null, options: OPTIONS },
            })

            await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')
            expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

            await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'Tab' })

            expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
        })

        it('associates the field with its error message via aria-describedby', () => {
            const wrapper = mount(PkSelectMenu, {
                props: { modelValue: null, options: OPTIONS, invalid: true, describedBy: 'f-status-error' },
            })

            expect(wrapper.find('button[aria-haspopup="listbox"]').attributes('aria-describedby')).toBe(
                'f-status-error',
            )
        })
    })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PkDatePicker from './PkDatePicker.vue'

describe('PkDatePicker', () => {
    it('shows a placeholder when no value is set', () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: null } })

        expect(wrapper.text()).toContain('Pick a date')
        expect(wrapper.find('[aria-label="Clear date"]').exists()).toBe(false)
    })

    it('formats an ISO date for display', () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

        expect(wrapper.text()).toContain('2026')
        expect(wrapper.find('[aria-label="Clear date"]').exists()).toBe(true)
    })

    it('opens the calendar on trigger click', async () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: null } })

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

        expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    })

    it('does not open when disabled', async () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: null, disabled: true } })

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })

    /**
     * `PkTextInput`/`Input.vue` already draw a red border on
     * `aria-invalid="true"` via Tailwind's `aria-invalid:` variant. This
     * trigger draws its own box rather than rendering a native input, so it
     * never picked up that styling - confirmed missing by Phase 6's audit
     * alongside `PkSelectMenu`.
     */
    it('carries the invalid-border class when invalid', () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: null, invalid: true } })

        const frame = wrapper.find('[aria-invalid="true"]')
        expect(frame.exists()).toBe(true)
        expect(frame.classes()).toContain('aria-invalid:border-destructive')
    })

    it('emits an ISO date and closes the calendar when a day is picked', async () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')
        await wrapper.find('[data-selected="true"]').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toEqual([['2026-03-14']])
        expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })

    it('emits YYYY-MM-DDTHH:mm and stays open when withTime is set', async () => {
        const wrapper = mount(PkDatePicker, {
            props: { modelValue: '2026-03-14T09:30', withTime: true },
        })

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')
        await wrapper.find('[data-selected="true"]').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toEqual([['2026-03-14T09:30']])
        expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    })

    it('updates the time portion without losing the selected day', async () => {
        const wrapper = mount(PkDatePicker, {
            props: { modelValue: '2026-03-14T09:30', withTime: true },
        })

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')
        await wrapper.find('input[type="time"]').setValue('14:45')

        expect(wrapper.emitted('update:modelValue')).toEqual([['2026-03-14T14:45']])
    })

    it('clears the value', async () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

        await wrapper.find('[aria-label="Clear date"]').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    })

    it('navigates to the next and previous month without changing the value', async () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')
        const monthLabel = () => wrapper.find('.mb-2 span').text()
        const initial = monthLabel()

        await wrapper.find('[aria-label="Next month"]').trigger('click')
        expect(monthLabel()).not.toBe(initial)

        await wrapper.find('[aria-label="Previous month"]').trigger('click')
        expect(monthLabel()).toBe(initial)
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('disallows a day before min or after max', async () => {
        const wrapper = mount(PkDatePicker, {
            props: { modelValue: '2026-03-14', min: '2026-03-10', max: '2026-03-20' },
        })

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

        const early = wrapper.find('[data-iso="2026-03-05"]')
        expect(early.attributes('disabled')).toBeDefined()

        await early.trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('closes on Escape from the grid', async () => {
        const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')
        expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

        await wrapper.find('[role="grid"]').trigger('keydown', { key: 'Escape' })

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })

    /**
     * WITHOUT THIS, closing the calendar - by Escape, by picking a day, or by
     * clicking the backdrop - leaves focus on nothing in particular, since the
     * focused grid cell is removed from the DOM the moment `open` goes false.
     * A keyboard user's cursor effectively vanishes to `document.body`. Real
     * DOM focus needs `attachTo: document.body` - jsdom does not track focus
     * on a detached tree.
     */
    it('returns focus to the trigger button after closing via Escape', async () => {
        const wrapper = mount(PkDatePicker, {
            props: { modelValue: '2026-03-14' },
            attachTo: document.body,
        })

        const trigger = wrapper.find('button[aria-haspopup="dialog"]')
        await trigger.trigger('click')
        await wrapper.find('[role="grid"]').trigger('keydown', { key: 'Escape' })

        expect(document.activeElement).toBe(trigger.element)
        wrapper.unmount()
    })

    it('returns focus to the trigger button after picking a day', async () => {
        const wrapper = mount(PkDatePicker, {
            props: { modelValue: '2026-03-14' },
            attachTo: document.body,
        })

        const trigger = wrapper.find('button[aria-haspopup="dialog"]')
        await trigger.trigger('click')
        await wrapper.find('[data-selected="true"]').trigger('click')

        expect(document.activeElement).toBe(trigger.element)
        wrapper.unmount()
    })

    /**
     * A standards-based semantic audit (WAI-ARIA APG's Dialog and Grid
     * patterns) found several gaps beyond keyboard interaction and focus
     * restoration, which those were already covered by. These tests lock
     * in the fixes.
     */
    describe('accessibility - dialog and grid semantics', () => {
        it('marks the calendar dialog as modal', async () => {
            const wrapper = mount(PkDatePicker, { props: { modelValue: null } })

            await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

            expect(wrapper.find('[role="dialog"]').attributes('aria-modal')).toBe('true')
        })

        it('wraps each week in role="row", not bare gridcells under role="grid"', async () => {
            const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

            await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

            const rows = wrapper.findAll('[role="row"]')
            // One header row (weekday labels) plus at least 5 week rows.
            expect(rows.length).toBeGreaterThanOrEqual(6)

            const grid = wrapper.find('[role="grid"]')
            const directGridcellChildren = grid.element.querySelectorAll(':scope > [role="gridcell"]')
            expect(directGridcellChildren.length).toBe(0)
        })

        it('gives each day cell a full, unambiguous accessible name', async () => {
            const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

            await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

            const selectedCell = wrapper.find('[data-selected="true"]')
            const label = selectedCell.attributes('aria-label') ?? ''

            // The bare day number alone ("14") carries no month/year/weekday
            // context - the full label must say more than that.
            expect(label.length).toBeGreaterThan(2)
            expect(label).toMatch(/2026/)
        })

        it('marks the selected day with aria-selected', async () => {
            const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

            await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

            expect(wrapper.find('[data-selected="true"]').attributes('aria-selected')).toBe('true')

            const unselected = wrapper
                .findAll('[role="gridcell"]')
                .find((cell) => cell.attributes('data-selected') === 'false')

            expect(unselected?.attributes('aria-selected')).toBe('false')
        })

        it('disambiguates weekday headers that share a narrow glyph (S/S, T/T)', async () => {
            const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

            await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

            const headers = wrapper.findAll('[role="columnheader"]')
            const fullNames = headers.map((h) => h.attributes('aria-label'))

            expect(new Set(fullNames).size).toBe(7)
        })

        it('closes on Escape from the "Previous month" button, not only from the grid', async () => {
            const wrapper = mount(PkDatePicker, { props: { modelValue: '2026-03-14' } })

            await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')
            expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

            await wrapper.find('button[aria-label="Previous month"]').trigger('keydown', { key: 'Escape' })

            expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
        })

        /**
         * `aria-modal="true"` tells assistive tech everything outside the
         * dialog is inert - only honest if real keyboard focus cannot
         * escape it either. Without a trap, Tab from "Next month" (the
         * natural DOM successor when no day is selected) left the dialog
         * for whatever followed in the page.
         */
        it('traps Tab within the dialog, wrapping from the last focusable element to the first', async () => {
            const wrapper = mount(PkDatePicker, {
                props: { modelValue: '2026-03-14' },
                attachTo: document.body,
            })

            await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

            const previousMonth = wrapper.find('button[aria-label="Previous month"]')
            const selectedDay = wrapper.find('[data-selected="true"]')

            ;(selectedDay.element as HTMLElement).focus()
            expect(document.activeElement).toBe(selectedDay.element)

            await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Tab' })

            expect(document.activeElement).toBe(previousMonth.element)
            wrapper.unmount()
        })

        it('wraps Shift+Tab from the first focusable element to the last', async () => {
            const wrapper = mount(PkDatePicker, {
                props: { modelValue: '2026-03-14' },
                attachTo: document.body,
            })

            await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')

            const previousMonth = wrapper.find('button[aria-label="Previous month"]')
            const selectedDay = wrapper.find('[data-selected="true"]')

            ;(previousMonth.element as HTMLElement).focus()
            expect(document.activeElement).toBe(previousMonth.element)

            await wrapper.find('[role="dialog"]').trigger('keydown', { key: 'Tab', shiftKey: true })

            expect(document.activeElement).toBe(selectedDay.element)
            wrapper.unmount()
        })

        it('associates the field with its error message via aria-describedby', () => {
            const wrapper = mount(PkDatePicker, {
                props: { modelValue: null, invalid: true, describedBy: 'f-due_at-error' },
            })

            expect(wrapper.find('button[aria-haspopup="dialog"]').attributes('aria-describedby')).toBe(
                'f-due_at-error',
            )
        })
    })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PkRepeater from './PkRepeater.vue'
import type { FormField } from './types'

const instruction: FormField = {
    key: 'text',
    label: 'Instruction',
    type: 'text',
} as FormField

const contactChildren: FormField[] = [
    { key: 'name', label: 'Name', type: 'text' } as FormField,
    { key: 'phone', label: 'Phone', type: 'text' } as FormField,
]

function mountSingle(value: Record<string, unknown>[] | null, extra: Record<string, unknown> = {}) {
    return mount(PkRepeater, {
        props: {
            modelValue: value,
            children: [instruction],
            fieldKey: 'steps',
            itemLabel: 'Step',
            ...extra,
        },
    })
}

describe('PkRepeater - rows, not cards', () => {
    /**
     * DESIGN_RULES rule 6: an item is one row - ordinal badge, input,
     * controls - never a bordered card with its own heading. The heading
     * ("Step 1") is what made three short entries taller than the rest of
     * the form; the badge carries the number now.
     */
    it('renders one row per item with an ordinal badge and no per-item heading', () => {
        const wrapper = mountSingle([{ text: 'Connect.' }, { text: 'Open.' }, { text: 'Enter.' }])

        const badges = wrapper.findAll('span[aria-hidden="true"].rounded-full')
        expect(badges.map((b) => b.text())).toEqual(['1', '2', '3'])

        // No "Step 1" heading anywhere - the words appear only in aria-labels.
        expect(wrapper.text()).not.toContain('Step 1')
    })

    /**
     * A single-child repeater hides the repeated label VISUALLY ONLY. The
     * label stays in the DOM as `sr-only`, because it is the input's
     * accessible name - dropping it entirely would trade visual noise for a
     * nameless field.
     */
    it('hides a single child label visually but keeps it for screen readers', () => {
        const wrapper = mountSingle([{ text: 'Connect.' }])

        const label = wrapper.find('label')
        expect(label.exists()).toBe(true)
        expect(label.text()).toContain('Instruction')
        expect(label.classes()).toContain('sr-only')
    })

    it('keeps visible labels when a row has two or more children', () => {
        const wrapper = mount(PkRepeater, {
            props: {
                modelValue: [{ name: 'Amina', phone: '0700' }],
                children: contactChildren,
                fieldKey: 'contacts',
                itemLabel: 'Contact',
            },
        })

        const labels = wrapper.findAll('label').filter((l) => !l.classes().includes('sr-only'))
        expect(labels.map((l) => l.text())).toEqual(['Name', 'Phone'])
    })

    /**
     * DESIGN_RULES rule 5: at the limit, Add disappears rather than sitting
     * disabled next to a live counter. The counter is gone entirely - it
     * described a state instead of offering an action.
     */
    it('hides the add button at maxItems and never shows a counter', () => {
        const below = mountSingle([{ text: 'One.' }], { maxItems: 2 })
        expect(below.text()).toContain('Add step')
        expect(below.text()).not.toContain('of 2')

        const at = mountSingle([{ text: 'One.' }, { text: 'Two.' }], { maxItems: 2 })
        expect(at.text()).not.toContain('Add step')
    })

    it('still moves and removes rows from the inline controls', async () => {
        const wrapper = mountSingle([{ text: 'First.' }, { text: 'Second.' }])

        await wrapper.find('button[aria-label="Move Step 2 up"]').trigger('click')

        let emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.at(-1)?.[0]).toEqual([{ text: 'Second.' }, { text: 'First.' }])

        await wrapper.find('button[aria-label="Remove Step 1"]').trigger('click')

        emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.at(-1)?.[0]).toEqual([{ text: 'First.' }])
    })

    it('shows the empty state when there are no rows', () => {
        const wrapper = mountSingle(null)

        expect(wrapper.text()).toContain('No steps yet.')
    })

    it('reorders rows by dragging the handle, the same splice `move` uses', async () => {
        const wrapper = mountSingle([{ text: 'First.' }, { text: 'Second.' }, { text: 'Third.' }])

        const handles = wrapper.findAll('[aria-label^="Drag to reorder"]')
        expect(handles).toHaveLength(3)

        await handles[0]!.trigger('dragstart')

        const rows = wrapper.findAll('.flex.items-start.gap-2')
        await rows[2]!.trigger('drop')

        const emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.at(-1)?.[0]).toEqual([
            { text: 'Second.' },
            { text: 'Third.' },
            { text: 'First.' },
        ])
    })

    it('does not emit a drop onto the same row that started the drag', async () => {
        const wrapper = mountSingle([{ text: 'First.' }, { text: 'Second.' }])

        const handles = wrapper.findAll('[aria-label^="Drag to reorder"]')
        await handles[0]!.trigger('dragstart')

        const rows = wrapper.findAll('.flex.items-start.gap-2')
        await rows[0]!.trigger('drop')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
})

describe('PkRepeater - relationship rows', () => {
    it('preserves child ids while still omitting them for JSON repeaters', async () => {
        const relationship = mountSingle([{ _id: '7', text: 'Existing' }], {
            relationship: 'comments',
        })

        await relationship.find('input').setValue('Changed')
        expect(relationship.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([
            { _id: '7', text: 'Changed' },
        ])

        const json = mountSingle([{ _id: '7', text: 'Existing' }])
        await json.find('input').setValue('Changed')
        expect(json.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([{ text: 'Changed' }])
    })
})

describe('PkRepeater - collapsible', () => {
    function mountCollapsible(value: Record<string, unknown>[] | null) {
        return mount(PkRepeater, {
            props: {
                modelValue: value,
                children: [instruction],
                fieldKey: 'steps',
                itemLabel: 'Step',
                collapsible: true,
            },
        })
    }

    it('shows every field expanded by default even when collapsible', () => {
        const wrapper = mountCollapsible([{ text: 'Connect.' }])

        expect(wrapper.find('input, textarea').exists()).toBe(true)
    })

    it('folds a row to its summary line on click and keeps the data intact', async () => {
        const wrapper = mountCollapsible([{ text: 'Connect the router.' }])

        await wrapper.find('[aria-label="Collapse Step 1"]').trigger('click')

        expect(wrapper.find('input, textarea').exists()).toBe(false)
        expect(wrapper.text()).toContain('Step 1')
        expect(wrapper.text()).toContain('Connect the router.')

        // Collapsing is presentation only - nothing was emitted.
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('expands again from the summary row', async () => {
        const wrapper = mountCollapsible([{ text: 'Connect.' }])

        await wrapper.find('[aria-label="Collapse Step 1"]').trigger('click')
        await wrapper.find('button.hover\\:bg-accent.min-w-0').trigger('click')

        expect(wrapper.find('input, textarea').exists()).toBe(true)
    })

    it('collapse-all and expand-all toggle every row at once', async () => {
        const wrapper = mountCollapsible([{ text: 'One.' }, { text: 'Two.' }])

        const toggle = () => wrapper.find('button.text-xs.font-medium')

        expect(toggle().text()).toBe('Collapse all')
        await toggle().trigger('click')

        expect(wrapper.find('input, textarea').exists()).toBe(false)
        expect(toggle().text()).toBe('Expand all')

        await toggle().trigger('click')
        expect(wrapper.find('input, textarea').exists()).toBe(true)
    })

    it('is not offered at all when the field did not opt in', () => {
        const wrapper = mountSingle([{ text: 'One.' }])

        expect(wrapper.find('[aria-label="Collapse Step 1"]').exists()).toBe(false)
    })
})

describe('PkRepeater - addable, deletable, cloneable', () => {
    /**
     * These three are declared capabilities, not count bounds - `minItems`/
     * `maxItems` are what a request is actually validated against.
     * `addable(false)`/`deletable(false)` only decide which buttons an
     * honest form offers, mirroring `RepeaterField`'s own docblock.
     */
    it('hides Add when the field is not addable, independent of maxItems', () => {
        const wrapper = mountSingle([{ text: 'One.' }], { addable: false })

        expect(wrapper.text()).not.toContain('Add step')
    })

    it('shows Add by default', () => {
        const wrapper = mountSingle([{ text: 'One.' }])

        expect(wrapper.text()).toContain('Add step')
    })

    it('hides every row remove control when the field is not deletable', () => {
        const wrapper = mountSingle([{ text: 'One.' }, { text: 'Two.' }], { deletable: false })

        expect(wrapper.find('[aria-label^="Remove"]').exists()).toBe(false)
    })

    it('shows remove controls by default', () => {
        const wrapper = mountSingle([{ text: 'One.' }])

        expect(wrapper.find('[aria-label="Remove Step 1"]').exists()).toBe(true)
    })

    it('offers no duplicate control unless cloneable is set', () => {
        const wrapper = mountSingle([{ text: 'One.' }])

        expect(wrapper.find('[aria-label^="Duplicate"]').exists()).toBe(false)
    })

    it('duplicates a row with its values, right after itself, when cloneable', async () => {
        const wrapper = mountSingle([{ text: 'First.' }, { text: 'Second.' }], { cloneable: true })

        await wrapper.find('[aria-label="Duplicate Step 1"]').trigger('click')

        const emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.at(-1)?.[0]).toEqual([
            { text: 'First.' },
            { text: 'First.' },
            { text: 'Second.' },
        ])
    })

    /**
     * A clone is still a new row, so it answers to the same ceiling `add()`
     * does - proven by disabling rather than hiding, since `maxItems` alone
     * (with no explicit `cloneable` gate) is the thing under test here.
     */
    it('disables duplicate at maxItems, the same ceiling Add respects', () => {
        const wrapper = mountSingle([{ text: 'One.' }, { text: 'Two.' }], {
            cloneable: true,
            maxItems: 2,
        })

        const duplicate = wrapper.find('[aria-label="Duplicate Step 1"]')
        expect(duplicate.attributes('disabled')).toBeDefined()
    })

    it('still allows cloning when addable is false - the two are independent', async () => {
        const wrapper = mountSingle([{ text: 'One.' }], { addable: false, cloneable: true })

        expect(wrapper.text()).not.toContain('Add step')

        await wrapper.find('[aria-label="Duplicate Step 1"]').trigger('click')

        const emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.at(-1)?.[0]).toEqual([{ text: 'One.' }, { text: 'One.' }])
    })
})

describe('PkRepeater - table mode', () => {
    function mountTable(
        value: Record<string, unknown>[] | null,
        extra: Record<string, unknown> = {},
    ) {
        return mount(PkRepeater, {
            props: {
                modelValue: value,
                children: contactChildren,
                fieldKey: 'contacts',
                itemLabel: 'Contact',
                table: true,
                ...extra,
            },
        })
    }

    it('renders a table with one header cell per child, in schema order', () => {
        const wrapper = mountTable([{ name: 'Amina', phone: '0700' }])

        const headers = wrapper.findAll('th').map((h) => h.text())
        expect(headers).toContain('Name')
        expect(headers).toContain('Phone')
        expect(headers.indexOf('Name')).toBeLessThan(headers.indexOf('Phone'))
    })

    it('marks a required child column with the same asterisk fields use', () => {
        const required: FormField[] = [
            { key: 'name', label: 'Name', type: 'text', required: true } as FormField,
            { key: 'phone', label: 'Phone', type: 'text' } as FormField,
        ]
        const wrapper = mount(PkRepeater, {
            props: {
                modelValue: [{ name: 'Amina', phone: '0700' }],
                children: required,
                fieldKey: 'contacts',
                itemLabel: 'Contact',
                table: true,
            },
        })

        const nameHeader = wrapper.findAll('th').find((h) => h.text().startsWith('Name'))
        expect(nameHeader?.find('.text-destructive').exists()).toBe(true)
    })

    it('renders one row per item with every child field inline, no per-item ordinal or label', () => {
        const wrapper = mountTable([
            { name: 'Amina', phone: '0700' },
            { name: 'Baraka', phone: '0711' },
        ])

        expect(wrapper.findAll('tbody tr')).toHaveLength(2)
        // The badge/ordinal from stacked mode has no table-mode equivalent.
        expect(wrapper.find('span.rounded-full').exists()).toBe(false)
        // Column headers name the field, so a per-cell label would repeat it.
        expect(wrapper.findAll('td label').every((l) => l.classes().includes('sr-only'))).toBe(true)
    })

    it('shows no collapse affordance even when collapsible is also set', () => {
        const wrapper = mountTable([{ name: 'Amina', phone: '0700' }], { collapsible: true })

        expect(wrapper.text()).not.toContain('Collapse all')
        expect(wrapper.find('[aria-label^="Collapse"]').exists()).toBe(false)
    })

    it('still moves, removes, and clones rows from the table row controls', async () => {
        const wrapper = mountTable(
            [
                { name: 'Amina', phone: '0700' },
                { name: 'Baraka', phone: '0711' },
            ],
            { cloneable: true },
        )

        await wrapper.find('button[aria-label="Move Contact 2 up"]').trigger('click')
        let emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.at(-1)?.[0]).toEqual([
            { name: 'Baraka', phone: '0711' },
            { name: 'Amina', phone: '0700' },
        ])

        await wrapper.find('button[aria-label="Duplicate Contact 1"]').trigger('click')
        emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.at(-1)?.[0]).toEqual([
            { name: 'Baraka', phone: '0711' },
            { name: 'Baraka', phone: '0711' },
            { name: 'Amina', phone: '0700' },
        ])

        await wrapper.find('button[aria-label="Remove Contact 1"]').trigger('click')
        emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.at(-1)?.[0]).toEqual([
            { name: 'Baraka', phone: '0711' },
            { name: 'Amina', phone: '0700' },
        ])
    })

    it('shows the same empty state and Add control below the table', () => {
        const wrapper = mountTable(null)

        expect(wrapper.find('table').exists()).toBe(false)
        expect(wrapper.text()).toContain('No contacts yet.')
        expect(wrapper.text()).toContain('Add contact')
    })
})

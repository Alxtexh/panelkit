import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import FormFieldControl from './FormFieldControl.vue'
import type { FormField } from './types'

const daysField: FormField = {
    key: 'days',
    label: 'Valid for',
    type: 'number',
    presets: [1, 7, 30],
} as FormField

describe('FormFieldControl - number presets', () => {
    /**
     * BESIDE THE INPUT, NOT INSTEAD OF IT. The presets are shortcuts that write
     * into the same field the bare input edits - not a separate control - so a
     * number field's presence alone must not conjure them out of nothing.
     */
    it('renders no preset chips for a number field that declares none', () => {
        const wrapper = mount(FormFieldControl, {
            props: { field: { key: 'x', label: 'X', type: 'number' } as FormField, value: null },
        })

        expect(wrapper.findAll('button[type="button"]').length).toBe(0)
    })

    it('renders no preset chips for a non-number field, even with presets set', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'x', label: 'X', type: 'text', presets: [1, 2] } as FormField,
                value: null,
            },
        })

        expect(wrapper.findAll('button[type="button"]').length).toBe(0)
    })

    it('renders one chip per preset, labelled with the number', () => {
        const wrapper = mount(FormFieldControl, { props: { field: daysField, value: null } })

        const chips = wrapper.findAll('button[type="button"]')
        expect(chips.map((c) => c.text())).toEqual(['1', '7', '30'])
    })

    /**
     * `type="button"`, PINNED. The component's own comment calls this
     * load-bearing: the default inside a form is `submit`, so a regression here
     * would make every chip save the form instead of filling the input.
     */
    it('gives every preset chip an explicit type="button"', () => {
        const wrapper = mount(FormFieldControl, { props: { field: daysField, value: null } })

        for (const chip of wrapper.findAll('.flex.flex-wrap.gap-1\\.5 button')) {
            expect(chip.attributes('type')).toBe('button')
        }
    })

    /**
     * CLICKING WRITES THE VALUE, as a string - the same shape the bare number
     * input emits on `@input`, so a preset click and a typed value are
     * indistinguishable to whatever handles `change`.
     */
    it('emits change with the preset value, as a string, when clicked', async () => {
        const wrapper = mount(FormFieldControl, { props: { field: daysField, value: null } })

        await wrapper.findAll('button[type="button"]')[1].trigger('click')

        expect(wrapper.emitted('change')).toEqual([['7']])
    })

    /**
     * COMPARED LOOSELY, ON PURPOSE - mirrors PkVisualSelect's own note. The
     * input's value arrives as the string `"7"` after a round trip; strict
     * equality against the preset number `7` would show nothing pressed on a
     * field that has a perfectly good matching value.
     */
    it('marks the matching preset pressed, comparing loosely', () => {
        const wrapper = mount(FormFieldControl, { props: { field: daysField, value: '7' } })

        const chips = wrapper.findAll('button[type="button"]')
        expect(chips[1].attributes('aria-pressed')).toBe('true')
        expect(chips[0].attributes('aria-pressed')).toBe('false')
        expect(chips[2].attributes('aria-pressed')).toBe('false')
    })

    it('marks no preset pressed when the value matches none of them', () => {
        const wrapper = mount(FormFieldControl, { props: { field: daysField, value: '47' } })

        for (const chip of wrapper.findAll('button[type="button"]')) {
            expect(chip.attributes('aria-pressed')).toBe('false')
        }
    })
})

const messageField: FormField = {
    key: 'body',
    label: 'Body',
    type: 'textarea',
    chips: { '@user': "The reader's name", '@organisation': 'The organisation name' },
} as FormField

describe('FormFieldControl - message chips', () => {
    /** Mirrors the number-preset tests above: nothing renders without a declared token map. */
    it('renders no chips for a textarea with no chips declared', () => {
        const wrapper = mount(FormFieldControl, {
            props: { field: { key: 'x', label: 'X', type: 'textarea' } as FormField, value: null },
        })

        expect(wrapper.findAll('button[type="button"]').length).toBe(0)
    })

    it('renders no chips for a non-textarea field, even with chips set', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'x', label: 'X', type: 'text', chips: { '@a': 'A' } } as FormField,
                value: null,
            },
        })

        expect(wrapper.findAll('button[type="button"]').length).toBe(0)
    })

    it('renders one chip per token', () => {
        const wrapper = mount(FormFieldControl, { props: { field: messageField, value: '' } })

        const chips = wrapper.findAll('button[type="button"]')
        expect(chips.map((c) => c.text())).toEqual(['@user', '@organisation'])
    })

    /**
     * ATTACHED TO THE REAL DOCUMENT, deliberately - `insertChip` finds this
     * field's own textarea by `document.getElementById`, which only resolves
     * against elements actually in the document. A detached mount (Vue Test
     * Utils' default) would make the lookup fail silently and this test would
     * pass for the wrong reason: nothing to insert into, nothing asserted.
     */
    it('inserts the token at the cursor and emits the new value', async () => {
        const wrapper = mount(FormFieldControl, {
            props: { field: messageField, value: 'Hi , welcome.' },
            attachTo: document.body,
        })

        const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
        textarea.setSelectionRange(3, 3) // "Hi |, welcome." - cursor after "Hi "

        await wrapper.find('button[type="button"]').trigger('click')

        expect(wrapper.emitted('change')?.[0]).toEqual(['Hi @user, welcome.'])

        wrapper.unmount()
    })
})

describe('FormFieldControl - affixes', () => {
    it('renders prefix and suffix text in the schema chrome', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'price',
                    label: 'Price',
                    type: 'text',
                    prefix: 'KES',
                    suffix: '.00',
                } as FormField,
                value: '10',
            },
        })

        expect(wrapper.text()).toContain('KES')
        expect(wrapper.text()).toContain('.00')
    })

    it('renders a copy suffix action as a button', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'slug',
                    label: 'Slug',
                    type: 'text',
                    suffixAction: { label: 'Copy', copy: true },
                } as FormField,
                value: 'acme',
            },
        })

        const copy = wrapper.find('button[aria-label="Copy"]')
        expect(copy.exists()).toBe(true)
        expect(copy.attributes('type')).toBe('button')
    })

    it('does not emit affix-action for a copy suffix', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined)
        Object.assign(navigator, { clipboard: { writeText } })

        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'slug',
                    label: 'Slug',
                    type: 'text',
                    suffixAction: { label: 'Copy', copy: true },
                } as FormField,
                value: 'acme',
            },
        })

        await wrapper.find('button[aria-label="Copy"]').trigger('click')

        expect(wrapper.emitted('affix-action')).toBeUndefined()
        expect(writeText).toHaveBeenCalledWith('acme')
    })

    it('emits affix-action for a named POST suffix', async () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'slug',
                    label: 'Slug',
                    type: 'text',
                    suffixAction: { key: 'generate', label: 'Generate', post: true },
                } as FormField,
                value: '',
            },
        })

        await wrapper.find('button[aria-label="Generate"]').trigger('click')

        expect(wrapper.emitted('affix-action')).toEqual([['generate']])
    })

    it('emits affix-action for a named POST prefix', async () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'slug',
                    label: 'Slug',
                    type: 'text',
                    prefixAction: { key: 'upper', label: 'Upper', post: true },
                } as FormField,
                value: 'hello',
            },
        })

        await wrapper.find('button[aria-label="Upper"]').trigger('click')

        expect(wrapper.emitted('affix-action')).toEqual([['upper']])
    })

    it('renders field help with normal weight muted copy', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'bio',
                    label: 'Bio',
                    type: 'textarea',
                    help: 'A short public summary.',
                } as FormField,
                value: '',
            },
        })

        const help = wrapper.find('p.text-xs')
        expect(help.text()).toBe('A short public summary.')
        expect(help.classes()).toContain('font-normal')
        expect(help.classes()).toContain('text-muted-foreground')
    })

    it('renders text inputs with muted normal weight placeholders', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'name',
                    label: 'Name',
                    type: 'text',
                    placeholder: 'Full name',
                } as FormField,
                value: '',
            },
        })

        const input = wrapper.get('input')
        expect(input.classes()).toContain('placeholder:font-normal')
        expect(input.classes()).toContain('placeholder:text-muted-foreground')
        expect(input.classes()).toContain('font-normal')
        expect(input.classes()).toContain('text-foreground')
    })
})

/**
 * `date`/`datetime` used to fall through to a bare `<input type="date">`/
 * `<input type="datetime-local">` in the generic-input branch below - the one
 * field on a page that rendered in the browser's own visual language instead
 * of this kit's. PkDatePicker replaces both; these lock in the routing so a
 * future edit to the generic branch cannot silently swallow it back.
 */
describe('FormFieldControl - date/datetime routing', () => {
    it('routes a date field to PkDatePicker, not a native date input', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'launch_date', label: 'Launch date', type: 'date' } as FormField,
                value: '2026-03-14',
            },
        })

        expect(wrapper.find('input[type="date"]').exists()).toBe(false)
        expect(wrapper.find('button[aria-haspopup="dialog"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('2026')
    })

    it('routes a datetime field to PkDatePicker with time support, not a native datetime-local input', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'starts_at', label: 'Starts at', type: 'datetime' } as FormField,
                value: '2026-03-14T09:30',
            },
        })

        expect(wrapper.find('input[type="datetime-local"]').exists()).toBe(false)
        expect(wrapper.find('button[aria-haspopup="dialog"]').exists()).toBe(true)
    })

    it('emits change with the date picker value', async () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'launch_date', label: 'Launch date', type: 'date' } as FormField,
                value: '2026-03-14',
            },
        })

        await wrapper.find('button[aria-haspopup="dialog"]').trigger('click')
        await wrapper.find('[data-selected="true"]').trigger('click')

        expect(wrapper.emitted('change')).toEqual([['2026-03-14']])
    })
})

/**
 * A static (non-searchable) `select` field used to fall through to a bare
 * native `<select>` - the searchable variant already got a themed overlay,
 * the far more common plain-option-list case did not. PkSelectMenu closes
 * that gap; this locks in the routing.
 */
describe('FormFieldControl - select routing', () => {
    const STATUS_OPTIONS = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ]

    it('routes a plain select field to PkSelectMenu, not a native select', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'status', label: 'Status', type: 'select' } as FormField,
                value: 'active',
                options: STATUS_OPTIONS,
            },
        })

        expect(wrapper.find('select').exists()).toBe(false)
        expect(wrapper.find('button[aria-haspopup="listbox"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('Active')
    })

    it('still uses the searchable overlay when searchOptions is supplied', async () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'status', label: 'Status', type: 'select' } as FormField,
                value: 'active',
                searchOptions: async () => STATUS_OPTIONS,
            },
        })

        expect(wrapper.find('button[aria-haspopup="listbox"]').exists()).toBe(false)

        await wrapper.find('button').trigger('click')

        expect(wrapper.find('input[type="search"]').exists()).toBe(true)
    })

    /**
     * An Edit page arrives with a value already set and nothing yet picked
     * via `pick()` - without reading `options` for the current value, the
     * trigger showed the raw id (`94`) instead of the related record's name
     * until you opened the search and re-chose it. Confirmed live on
     * Invoices'/Tickets' relationship selects by Phase 6's audit; see
     * `ResourceController::edit()` for where `options` gets that one entry.
     */
    it('shows the related label for an already-set searchable value, not the raw id', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'customer_id', label: 'Customer', type: 'select' } as FormField,
                value: 94,
                options: [{ value: 94, label: 'Kay White' }],
                searchOptions: async () => [],
            },
        })

        expect(wrapper.text()).toContain('Kay White')
        expect(wrapper.text()).not.toContain('94')
    })

    it('emits change with the picked option value', async () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'status', label: 'Status', type: 'select' } as FormField,
                value: null,
                options: STATUS_OPTIONS,
            },
        })

        await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')
        await wrapper.findAll('[role="option"]')[1]!.trigger('click')

        expect(wrapper.emitted('change')).toEqual([['inactive']])
    })
})

/**
 * `PkSelectMenu`/`PkDatePicker` draw their own box and needed their own
 * `INVALID_BORDER` class (see their specs); this file's four remaining
 * native-input render paths build their own class strings/wrappers
 * independently and each needed the same fix separately - confirmed missing
 * on a real submitted Create form by Phase 6's audit before this file was
 * touched (`document.querySelectorAll('[aria-invalid="true"]')` showed no
 * `invalid`-related class on the plain text/email inputs).
 */
describe('FormFieldControl - invalid-state border', () => {
    it('carries the invalid-border class on a plain input with no affixes', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'email', label: 'Email', type: 'text' } as FormField,
                value: '',
                error: 'The email field is required.',
            },
        })

        const input = wrapper.find('input')
        expect(input.attributes('aria-invalid')).toBe('true')
        expect(input.classes()).toContain('aria-invalid:border-destructive')
    })

    it('carries the invalid-border class on a plain textarea with no affixes', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'notes', label: 'Notes', type: 'textarea' } as FormField,
                value: '',
                error: 'The notes field is required.',
            },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.attributes('aria-invalid')).toBe('true')
        expect(textarea.classes()).toContain('aria-invalid:border-destructive')
    })

    it('carries the invalid-border class on the wrapper of an input with affixes', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'amount',
                    label: 'Amount',
                    type: 'text',
                    prefix: '$',
                } as FormField,
                value: '',
                error: 'The amount field is required.',
            },
        })

        const wrapperDiv = wrapper.find('[aria-invalid="true"]')
        expect(wrapperDiv.exists()).toBe(true)
        expect(wrapperDiv.classes()).toContain('aria-invalid:border-destructive')
    })

    it('carries the invalid-border class on the wrapper of a textarea with affixes', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: {
                    key: 'notes',
                    label: 'Notes',
                    type: 'textarea',
                    prefixIcon: '#',
                } as FormField,
                value: '',
                error: 'The notes field is required.',
            },
        })

        const wrapperDiv = wrapper.find('[aria-invalid="true"]')
        expect(wrapperDiv.exists()).toBe(true)
        expect(wrapperDiv.classes()).toContain('aria-invalid:border-destructive')
    })
})

/**
 * A standards-based accessibility audit of `PkSelectMenu`/`PkDatePicker`
 * (see each component's own spec for the fixes) found the shared error
 * message (`role="alert"`, below every field) was never referenced by
 * `aria-describedby` - so a screen reader announces it the MOMENT it
 * appears, but not when tabbing into an already-invalid field later. These
 * prove the wiring reaches all the way from the error prop to the control.
 */
describe('FormFieldControl - error message aria-describedby wiring', () => {
    const STATUS_OPTIONS = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ]

    it('wires a select field to its error message id', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'status', label: 'Status', type: 'select' } as FormField,
                value: null,
                options: STATUS_OPTIONS,
                error: 'The status field is required.',
            },
        })

        const trigger = wrapper.find('button[aria-haspopup="listbox"]')
        expect(trigger.attributes('aria-describedby')).toBe('f-status-error')
        expect(wrapper.find('#f-status-error').text()).toBe('The status field is required.')
    })

    it('wires a date field to its error message id', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'due_at', label: 'Due date', type: 'date' } as FormField,
                value: null,
                error: 'The due at field is required.',
            },
        })

        const trigger = wrapper.find('button[aria-haspopup="dialog"]')
        expect(trigger.attributes('aria-describedby')).toBe('f-due_at-error')
        expect(wrapper.find('#f-due_at-error').text()).toBe('The due at field is required.')
    })

    it('leaves aria-describedby unset when there is no error', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'status', label: 'Status', type: 'select' } as FormField,
                value: null,
                options: STATUS_OPTIONS,
            },
        })

        expect(wrapper.find('button[aria-haspopup="listbox"]').attributes('aria-describedby')).toBeUndefined()
    })
})

/**
 * `SelectField::morphTo()`'s type picker - the last remaining native
 * `<select>` in this file, migrated to `PkSelectMenu` once it existed and
 * had its own test coverage, so the polymorphic type choice looks and
 * behaves like every other themed select in the kit instead of the one
 * browser-native holdout.
 */
describe('FormFieldControl - morphTo() type picker', () => {
    const morphField: FormField = {
        key: 'notable',
        label: 'Notable',
        type: 'select',
        morphTo: [
            { value: 'App\\Models\\Article', label: 'Article' },
            { value: 'App\\Models\\Tag', label: 'Tag' },
        ],
    } as FormField

    it('renders the themed select menu, not a native <select>', () => {
        const wrapper = mount(FormFieldControl, {
            props: { field: morphField, value: null },
        })

        expect(wrapper.find('select').exists()).toBe(false)
        expect(wrapper.find('button[aria-haspopup="listbox"]').exists()).toBe(true)
    })

    it('lists both morph types and emits {type, id: null} on pick', async () => {
        const wrapper = mount(FormFieldControl, {
            props: { field: morphField, value: null },
        })

        await wrapper.find('button[aria-haspopup="listbox"]').trigger('click')

        const options = wrapper.findAll('[role="option"]')
        expect(options.map((o) => o.text())).toEqual(['Article', 'Tag'])

        await options[1]!.trigger('click')

        expect(wrapper.emitted('change')).toEqual([[{ type: 'App\\Models\\Tag', id: null }]])
    })

    it('shows the current type as selected', async () => {
        const wrapper = mount(FormFieldControl, {
            props: { field: morphField, value: { type: 'App\\Models\\Article', id: 5 } },
        })

        expect(wrapper.text()).toContain('Article')
    })
})

/**
 * Release-candidate Phase 1: the shared `fieldAria`/`describedBy` contract
 * (see the component's own docblock above `errorId`) applied to EVERY public
 * field type, not just the two overlay controls it was first built for. Each
 * case below locates that field type's actual interactive control - a
 * `<button>` for the overlay pickers, the real `<input>`/`<textarea>` for the
 * native branches, the inner control for an affixed wrapper - and drives the
 * same six checks the release request named explicitly.
 */
describe('FormFieldControl - systemic field accessibility contract', () => {
    type Case = {
        name: string
        field: FormField
        options?: { value: any; label: string }[]
        searchOptions?: (term: string) => Promise<{ value: any; label: string }[]>
        value?: unknown
        locate: (wrapper: ReturnType<typeof mount>) => ReturnType<ReturnType<typeof mount>['find']>
    }

    const CASES: Case[] = [
        {
            name: 'text',
            field: { key: 'name', label: 'Name', type: 'text' } as FormField,
            value: '',
            locate: (w) => w.get('input'),
        },
        {
            name: 'email',
            field: { key: 'email', label: 'Email', type: 'text', inputType: 'email' } as FormField,
            value: '',
            locate: (w) => w.get('input[type="email"]'),
        },
        {
            name: 'number',
            field: { key: 'qty', label: 'Qty', type: 'number' } as FormField,
            value: '',
            locate: (w) => w.get('input[type="number"]'),
        },
        {
            name: 'money (affixed number)',
            field: { key: 'amount', label: 'Amount', type: 'number', prefix: '$' } as FormField,
            value: '',
            locate: (w) => w.get('#f-amount'),
        },
        {
            name: 'textarea',
            field: { key: 'notes', label: 'Notes', type: 'textarea' } as FormField,
            value: '',
            locate: (w) => w.get('textarea'),
        },
        {
            name: 'select',
            field: { key: 'status', label: 'Status', type: 'select' } as FormField,
            options: [{ value: 'active', label: 'Active' }],
            value: null,
            locate: (w) => w.get('button[aria-haspopup="listbox"]'),
        },
        {
            name: 'searchable select',
            field: { key: 'owner_id', label: 'Owner', type: 'select' } as FormField,
            searchOptions: async () => [],
            value: null,
            locate: (w) => w.get('#f-owner_id'),
        },
        {
            name: 'relationship field',
            field: { key: 'customer_id', label: 'Customer', type: 'select' } as FormField,
            searchOptions: async () => [],
            value: null,
            locate: (w) => w.get('#f-customer_id'),
        },
        {
            name: 'date',
            field: { key: 'due_at', label: 'Due', type: 'date' } as FormField,
            value: null,
            locate: (w) => w.get('button[aria-haspopup="dialog"]'),
        },
        {
            name: 'datetime',
            field: { key: 'starts_at', label: 'Starts at', type: 'datetime' } as FormField,
            value: null,
            locate: (w) => w.get('button[aria-haspopup="dialog"]'),
        },
        {
            name: 'toggle',
            field: { key: 'active', label: 'Active', type: 'toggle' } as FormField,
            value: false,
            locate: (w) => w.get('#f-active'),
        },
        {
            name: 'morph field',
            field: {
                key: 'notable',
                label: 'Notable',
                type: 'select',
                morphTo: [{ value: 'App\\Models\\Article', label: 'Article' }],
            } as FormField,
            value: null,
            locate: (w) => w.get('#f-notable-type'),
        },
        {
            name: 'checkbox',
            field: { key: 'terms', label: 'I agree', type: 'checkbox' } as FormField,
            value: false,
            locate: (w) => w.get('#f-terms'),
        },
    ]

    for (const testCase of CASES) {
        describe(testCase.name, () => {
            /** Checklist 1: `aria-invalid="true"` on the real control when invalid. */
            it('sets aria-invalid on the control when there is an error', () => {
                const wrapper = mount(FormFieldControl, {
                    props: {
                        field: testCase.field,
                        value: testCase.value,
                        options: testCase.options,
                        searchOptions: testCase.searchOptions,
                        error: 'This field is invalid.',
                    },
                })

                expect(testCase.locate(wrapper).attributes('aria-invalid')).toBe('true')
            })

            it('leaves aria-invalid false when there is no error', () => {
                const wrapper = mount(FormFieldControl, {
                    props: {
                        field: testCase.field,
                        value: testCase.value,
                        options: testCase.options,
                        searchOptions: testCase.searchOptions,
                    },
                })

                expect(testCase.locate(wrapper).attributes('aria-invalid')).toBe('false')
            })

            /** Checklist 2 & 3: a stable, unique error id, referenced by the control. */
            it('gives the error message a stable id referenced via aria-describedby', () => {
                const wrapper = mount(FormFieldControl, {
                    props: {
                        field: testCase.field,
                        value: testCase.value,
                        options: testCase.options,
                        searchOptions: testCase.searchOptions,
                        error: 'This field is invalid.',
                    },
                })

                const errorId = `f-${testCase.field.key}-error`
                const errorEl = wrapper.get(`#${errorId}`)
                expect(errorEl.text()).toBe('This field is invalid.')
                expect(errorEl.attributes('role')).toBe('alert')

                const describedBy = testCase.locate(wrapper).attributes('aria-describedby') ?? ''
                expect(describedBy.split(' ')).toContain(errorId)
            })

            /** Checklist 6: disabled fields keep their aria-invalid/aria-describedby wiring. */
            it('stays semantically correct - disabled and marked invalid at once', () => {
                const wrapper = mount(FormFieldControl, {
                    props: {
                        field: { ...testCase.field, disabled: true },
                        value: testCase.value,
                        options: testCase.options,
                        searchOptions: testCase.searchOptions,
                        error: 'This field is invalid.',
                    },
                })

                const control = testCase.locate(wrapper)
                expect(control.attributes('aria-invalid')).toBe('true')
                expect(
                    (control.attributes('aria-describedby') ?? '').split(' '),
                ).toContain(`f-${testCase.field.key}-error`)
                expect(control.element.hasAttribute('disabled')).toBe(true)
            })
        })
    }

    /**
     * Checklist 4 & 5: help and error coexist rather than one deleting the
     * other, and a control can be described by both ids at once. `toggle` is
     * excluded here - its `help` renders as the switch's own inline label,
     * never as a separate paragraph, so it is covered by its own test below
     * instead of this shared loop.
     */
    for (const testCase of CASES.filter((c) => c.field.type !== 'toggle')) {
        it(`${testCase.name}: keeps both help and error text, describedBy referencing both`, () => {
            const wrapper = mount(FormFieldControl, {
                props: {
                    field: { ...testCase.field, help: 'A short explanation.' },
                    value: testCase.value,
                    options: testCase.options,
                    searchOptions: testCase.searchOptions,
                    error: 'This field is invalid.',
                },
            })

            const errorId = `f-${testCase.field.key}-error`
            const helpId = `f-${testCase.field.key}-help`

            expect(wrapper.get(`#${errorId}`).text()).toBe('This field is invalid.')
            expect(wrapper.get(`#${helpId}`).text()).toBe('A short explanation.')

            const describedBy = (testCase.locate(wrapper).attributes('aria-describedby') ?? '').split(
                ' ',
            )
            expect(describedBy).toContain(errorId)
            expect(describedBy).toContain(helpId)
        })
    }

    /** Uniqueness across two fields on the same form, not just one field in isolation. */
    it('gives two different fields two different, non-colliding error ids', () => {
        const wrapperA = mount(FormFieldControl, {
            props: {
                field: { key: 'first_name', label: 'First name', type: 'text' } as FormField,
                value: '',
                error: 'Required.',
            },
        })
        const wrapperB = mount(FormFieldControl, {
            props: {
                field: { key: 'last_name', label: 'Last name', type: 'text' } as FormField,
                value: '',
                error: 'Required.',
            },
        })

        expect(wrapperA.find('#f-first_name-error').exists()).toBe(true)
        expect(wrapperB.find('#f-last_name-error').exists()).toBe(true)
        expect(wrapperA.find('#f-last_name-error').exists()).toBe(false)
        expect(wrapperB.find('#f-first_name-error').exists()).toBe(false)
    })

    /**
     * `toggle`'s help text is not a description of the control, it is the
     * sentence next to it ("Notifications: on") - rendering it a second time
     * as an `aria-describedby` paragraph would duplicate what a screen reader
     * already reads as the switch's own label.
     */
    it('toggle: renders help inline beside the switch, not as a separate described-by paragraph', () => {
        const wrapper = mount(FormFieldControl, {
            props: {
                field: { key: 'active', label: 'Active', type: 'toggle', help: 'Visible to customers.' } as FormField,
                value: false,
                error: 'This field is invalid.',
            },
        })

        expect(wrapper.text()).toContain('Visible to customers.')
        expect(wrapper.find('#f-active-help').exists()).toBe(false)

        const describedBy = (wrapper.get('#f-active').attributes('aria-describedby') ?? '').split(' ')
        expect(describedBy).toContain('f-active-error')
        expect(describedBy).not.toContain('f-active-help')
    })

})

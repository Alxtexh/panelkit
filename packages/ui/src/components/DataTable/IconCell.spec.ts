import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import IconCell from './IconCell.vue'

const BOOLEAN_ICONS = { icons: { '1': 'check', '': 'x' }, colors: { '1': 'success', '': 'danger' } }

describe('IconCell', () => {
    it('resolves a JS boolean true to the true icon and label', () => {
        const wrapper = mount(IconCell, {
            props: { value: true, ...BOOLEAN_ICONS, labels: { '1': 'Yes', '': 'No' } },
        })

        expect(wrapper.attributes('title')).toBe('Yes')
    })

    it('resolves a JS boolean false to the false icon and label, not the word "false"', () => {
        const wrapper = mount(IconCell, {
            props: { value: false, ...BOOLEAN_ICONS, labels: { '1': 'Yes', '': 'No' } },
        })

        expect(wrapper.attributes('title')).toBe('No')
    })

    /**
     * `IconColumn::boolean()`/`IconEntry::boolean()` both say the client
     * "normalises" a raw integer OR boolean to the same two lookup keys -
     * but a Product's View page, whose `active` column IS cast to `boolean`
     * on the model, still arrived at the client as a raw `0`: the record is
     * read through `ListQuery::find()`'s `Builder::toBase()` path, which
     * returns an uncast row. Before this fix, `0` fell through to
     * `String(value)` -> the lookup key `"0"`, which matches neither
     * `boolean()`'s `'1'` nor its `''` key, so the cell rendered the
     * literal text "0" instead of a red cross - confirmed live.
     */
    it('resolves a raw 0 (uncast boolean column) the same as a JS false', () => {
        const wrapper = mount(IconCell, {
            props: { value: 0, ...BOOLEAN_ICONS, labels: { '1': 'Yes', '': 'No' } },
        })

        expect(wrapper.attributes('title')).toBe('No')
        expect(wrapper.text()).not.toContain('0')
    })

    it('resolves a raw 1 (uncast boolean column) the same as a JS true', () => {
        const wrapper = mount(IconCell, {
            props: { value: 1, ...BOOLEAN_ICONS, labels: { '1': 'Yes', '': 'No' } },
        })

        expect(wrapper.attributes('title')).toBe('Yes')
    })

    it('resolves a stringified "0"/"1" the same way', () => {
        const off = mount(IconCell, { props: { value: '0', ...BOOLEAN_ICONS } })
        const on = mount(IconCell, { props: { value: '1', ...BOOLEAN_ICONS } })

        expect(off.find('svg').classes().join(' ')).toContain('rose')
        expect(on.find('svg').classes().join(' ')).toContain('emerald')
    })

    it('falls back to the default icon for a null/undefined value', () => {
        const wrapper = mount(IconCell, { props: { value: null, ...BOOLEAN_ICONS } })

        expect(wrapper.find('svg').classes().join(' ')).toContain('rose')
    })

    it('passes through a non-boolean enum value unchanged', () => {
        const wrapper = mount(IconCell, {
            props: {
                value: 'draft',
                icons: { draft: 'clock', published: 'check' },
                labels: { draft: 'Draft', published: 'Published' },
            },
        })

        expect(wrapper.attributes('title')).toBe('Draft')
    })
})

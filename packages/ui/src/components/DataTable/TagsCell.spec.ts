import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TagsCell from './TagsCell.vue'

describe('TagsCell', () => {
    it('renders array tags as chips', () => {
        const wrapper = mount(TagsCell, {
            props: { value: ['alpha', 'beta'] },
        })

        expect(wrapper.text()).toContain('alpha')
        expect(wrapper.text()).toContain('beta')
        expect(wrapper.text()).not.toContain('None')
    })

    it('limits visible chips and shows remainder', () => {
        const wrapper = mount(TagsCell, {
            props: { value: ['a', 'b', 'c', 'd'], limit: 2 },
        })

        expect(wrapper.text()).toContain('a')
        expect(wrapper.text()).toContain('b')
        expect(wrapper.text()).toContain('+2')
        expect(wrapper.text()).not.toContain('c')
    })

    it('splits a plain string on the separator', () => {
        const wrapper = mount(TagsCell, {
            props: { value: 'red, green, blue', separator: ',' },
        })

        expect(wrapper.text()).toContain('red')
        expect(wrapper.text()).toContain('green')
        expect(wrapper.text()).toContain('blue')
    })

    it('parses a JSON array string', () => {
        const wrapper = mount(TagsCell, {
            props: { value: '["one","two"]' },
        })

        expect(wrapper.text()).toContain('one')
        expect(wrapper.text()).toContain('two')
    })

    it('shows a muted dash, not the word "None", when empty', () => {
        const wrapper = mount(TagsCell, {
            props: { value: null },
        })

        expect(wrapper.text()).toBe('-')
    })
})

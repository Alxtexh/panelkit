import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import PkMultiSelect from './PkMultiSelect.vue'

describe('PkMultiSelect', () => {
    afterEach(() => {
        document.body.innerHTML = ''
    })

    it('connects the combobox to its listbox and highlighted option', async () => {
        const wrapper = mount(PkMultiSelect, {
            props: {
                modelValue: [],
                options: [
                    { value: 'one', label: 'One' },
                    { value: 'two', label: 'Two' },
                ],
            },
            attachTo: document.body,
        })

        const combobox = wrapper.find('[role="combobox"]')
        await combobox.trigger('click')

        const listbox = document.body.querySelector('[role="listbox"]')
        const activeId = combobox.attributes('aria-activedescendant')
        const activeOption = document.getElementById(activeId!)

        expect(listbox).not.toBeNull()
        expect(combobox.attributes('aria-controls')).toBe(listbox?.id)
        expect(activeId).toBeTruthy()
        expect(activeOption?.getAttribute('role')).toBe('option')
        expect(activeOption?.getAttribute('aria-selected')).toBe('false')

        wrapper.unmount()
    })

    it('keeps the parent open when a pointer lands in another overlay', async () => {
        const wrapper = mount(PkMultiSelect, {
            props: {
                modelValue: [],
                options: [{ value: 'one', label: 'One' }],
            },
            attachTo: document.body,
        })

        await wrapper.find('[role="combobox"]').trigger('click')

        const nestedOverlay = document.createElement('div')
        nestedOverlay.dataset.pkOverlay = ''
        document.body.append(nestedOverlay)
        nestedOverlay.dispatchEvent(new Event('pointerdown', { bubbles: true }))

        expect(document.body.querySelector('[role="listbox"]')).not.toBeNull()

        wrapper.unmount()
    })
})

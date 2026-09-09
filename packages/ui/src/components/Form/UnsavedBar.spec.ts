import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { FORM_MEASURE } from '../../lib/pageShell'
import UnsavedBar from './UnsavedBar.vue'

describe('UnsavedBar', () => {
    it('pins inside #pk-main with FORM_MEASURE, not full-viewport body chrome', async () => {
        const shell = document.createElement('main')
        shell.id = 'pk-main'
        document.body.appendChild(shell)

        const wrapper = mount(UnsavedBar, {
            props: { show: true, message: 'New client', saveLabel: 'Create Client' },
            attachTo: document.body,
        })
        await nextTick()
        await nextTick()
        const frame = document.querySelector('[data-slot="unsaved-bar"]') as HTMLElement | null
        expect(frame).not.toBeNull()
        expect(shell.contains(frame)).toBe(true)
        expect(frame!.className).toContain('fixed')
        expect(frame!.className).not.toContain('sticky')
        const chrome = frame!.firstElementChild as HTMLElement
        expect(chrome.className).toContain('max-w-7xl')
        expect(chrome.className).toContain(FORM_MEASURE.split(' ')[0])
        wrapper.unmount()
        shell.remove()
    })

    it('clears the mobile bottom nav rather than painting under it', async () => {
        const shell = document.createElement('main')
        shell.id = 'pk-main'
        document.body.appendChild(shell)

        const wrapper = mount(UnsavedBar, { props: { show: true }, attachTo: document.body })
        await nextTick()
        await nextTick()
        const frame = document.querySelector('[data-slot="unsaved-bar"]') as HTMLElement | null
        expect(frame).not.toBeNull()
        // PkBottomNav is `min-h-14` (3.5rem) and only renders `sm:hidden`, so
        // the bar must clear exactly that on mobile and drop the offset at
        // the same breakpoint the nav disappears.
        expect(frame!.className).toContain('bottom-[calc(3.5rem+env(safe-area-inset-bottom))]')
        expect(frame!.className).toContain('sm:bottom-0')
        wrapper.unmount()
        shell.remove()
    })

    it('actually removes the element when `show` flips back to false', async () => {
        const shell = document.createElement('main')
        shell.id = 'pk-main'
        document.body.appendChild(shell)

        const wrapper = mount(UnsavedBar, { props: { show: true }, attachTo: document.body })
        await nextTick()
        await nextTick()
        expect(document.querySelector('[data-slot="unsaved-bar"]')).not.toBeNull()

        /*
         * A REAL BUG, ONCE: `<Transition>`'s default CSS-class/`transitionend`
         * detection - combined with this component's dynamic `Teleport`
         * target - left the leaving element stuck in the DOM forever with
         * both its "from" and "to" classes applied and nothing removing it,
         * even though `show` had genuinely gone false. The fix drives the
         * same animation from `:css="false"` + explicit JS hooks, where
         * `done()` is a plain `setTimeout` that is guaranteed to fire. This
         * test is the one that would have caught it.
         */
        await wrapper.setProps({ show: false })
        await new Promise((resolve) => setTimeout(resolve, 250))

        expect(document.querySelector('[data-slot="unsaved-bar"]')).toBeNull()
        wrapper.unmount()
        shell.remove()
    })

    it('renders the primary button as destructive when the bar warns rather than saves', () => {
        const wrapper = mount(UnsavedBar, {
            props: { show: true, saveLabel: 'Leave page', destructive: true },
        })

        const save = wrapper.findAll('button').at(-1)!
        expect(save.text()).toBe('Leave page')
        expect(save.classes()).toContain('bg-destructive')
        expect(save.classes()).not.toContain('bg-primary')
    })

    it('keeps the primary button on the brand colour by default', () => {
        const wrapper = mount(UnsavedBar, { props: { show: true } })

        const save = wrapper.findAll('button').at(-1)!
        expect(save.classes()).toContain('bg-primary')
        expect(save.classes()).not.toContain('bg-destructive')
    })

    it('falls back to sticky in-tree when the panel shell is absent', async () => {
        document.getElementById('pk-main')?.remove()
        const wrapper = mount(UnsavedBar, { props: { show: true }, attachTo: document.body })
        await nextTick()
        await nextTick()
        const frame = wrapper.find('[data-slot="unsaved-bar"]')
        expect(frame.classes()).toContain('sticky')
        expect(frame.classes()).not.toContain('fixed')
        wrapper.unmount()
    })
})

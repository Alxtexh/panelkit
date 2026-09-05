import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
    MODAL_PANEL,
    MODAL_PANEL_FORM,
    OVERLAY_FORM_MEASURE,
    SLIDEOVER_BODY,
    SLIDEOVER_WIDTH,
} from '../../lib/pageShell'
import PkSlideover from './PkSlideover.vue'

describe('PkSlideover', () => {
    it('does not release another overlay scroll lock when mounted closed', () => {
        document.body.style.overflow = 'hidden'

        const wrapper = mount(PkSlideover, {
            props: {
                open: false,
                title: 'Deferred panel',
            },
            attachTo: document.body,
        })

        expect(document.body.style.overflow).toBe('hidden')

        wrapper.unmount()
        document.body.style.overflow = ''
    })

    it('keeps header and footer fixed while the body scrolls', () => {
        const wrapper = mount(PkSlideover, {
            props: {
                open: true,
                title: 'Filter list',
                description: 'Applies to this table.',
                size: 'sm',
            },
            slots: {
                default: '<p>Long filter body</p>',
                footer: '<button type="button">Apply</button>',
            },
            attachTo: document.body,
        })

        const panel = document.body.querySelector('[role="dialog"]') as HTMLElement | null

        expect(panel).not.toBeNull()
        expect(panel!.className).toContain('flex-col')
        expect(panel!.className).toContain(SLIDEOVER_WIDTH.sm.split(' ')[0])
        expect(panel!.textContent).toContain('Filter list')
        expect(panel!.textContent).toContain('Long filter body')
        expect(panel!.textContent).toContain('Apply')
        expect(panel!.getAttribute('aria-labelledby')).toBe(
            panel!.querySelector('h2')?.getAttribute('id'),
        )
        expect(panel!.getAttribute('aria-describedby')).toBe(
            panel!.querySelector('p')?.getAttribute('id'),
        )

        const bands = Array.from(panel!.children) as HTMLElement[]

        expect(bands).toHaveLength(3)
        expect(bands[0].tagName).toBe('HEADER')
        expect(bands[0].className).toContain('shrink-0')
        expect(bands[1].className).toContain('overflow-y-auto')
        expect(bands[1].className).toContain('flex-1')
        expect(bands[2].tagName).toBe('FOOTER')
        expect(bands[2].className).toContain('shrink-0')
        expect(bands[2].className).toContain('border-t')

        const body = bands[1].firstElementChild as HTMLElement

        expect(body.className).toContain(OVERLAY_FORM_MEASURE.split(' ')[0])
        expect(body.className).toContain(SLIDEOVER_BODY.split(' ')[0])

        wrapper.unmount()
    })

    it('uses size presets and allows a raw width override', () => {
        const sized = mount(PkSlideover, {
            props: { open: true, title: 'Form', size: 'xl' },
            attachTo: document.body,
        })

        const sizedPanel = document.body.querySelector('[role="dialog"]') as HTMLElement

        expect(sizedPanel.className).toContain('max-w-2xl')
        sized.unmount()

        const override = mount(PkSlideover, {
            props: { open: true, title: 'Custom', width: 'w-[22rem]' },
            attachTo: document.body,
        })

        const overridePanel = document.body.querySelector('[role="dialog"]') as HTMLElement

        expect(overridePanel.className).toContain('w-[22rem]')
        override.unmount()
    })

    it('blocks Escape and backdrop close while busy', async () => {
        const wrapper = mount(PkSlideover, {
            props: {
                open: true,
                title: 'Saving',
                busy: true,
            },
            attachTo: document.body,
        })

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('close')).toBeUndefined()

        const close = document.body.querySelector('[aria-label="Close"]') as HTMLButtonElement

        expect(close.disabled).toBe(true)

        wrapper.unmount()
    })
})

describe('overlay design-freeze tokens', () => {
    it('keeps page FORM_MEASURE out of overlay panels', () => {
        expect(OVERLAY_FORM_MEASURE).toBe('w-full min-w-0')
        expect(OVERLAY_FORM_MEASURE).not.toMatch(/max-w-7xl/)
        expect(OVERLAY_FORM_MEASURE).not.toMatch(/mx-auto/)
        expect(MODAL_PANEL).toContain('max-w-lg')
        expect(MODAL_PANEL_FORM).toContain('max-w-xl')
        expect(SLIDEOVER_WIDTH.sm).toContain('w-full')
        expect(SLIDEOVER_WIDTH.xl).toContain('max-w-2xl')
    })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
    MODAL_PANEL,
    MODAL_PANEL_FORM,
    MODAL_WIDTH,
    OVERLAY_FORM_MEASURE,
} from '../../lib/pageShell'
import PkModal from './PkModal.vue'
import PkSlideover from './PkSlideover.vue'

describe('PkModal', () => {
    it('locks page scrolling while open and restores it when closed', async () => {
        document.body.style.overflow = 'auto'

        const wrapper = mount(PkModal, {
            props: {
                open: true,
                title: 'Delete record',
            },
            attachTo: document.body,
        })

        expect(document.body.style.overflow).toBe('hidden')

        await wrapper.setProps({ open: false })

        expect(document.body.style.overflow).toBe('auto')

        wrapper.unmount()
    })

    it('does not release another overlay scroll lock when mounted closed', () => {
        document.body.style.overflow = 'hidden'

        const wrapper = mount(PkModal, {
            props: {
                open: false,
                title: 'Deferred dialog',
            },
            attachTo: document.body,
        })

        expect(document.body.style.overflow).toBe('hidden')

        wrapper.unmount()
        document.body.style.overflow = ''
    })

    it('keeps the page locked until the last modal closes', async () => {
        document.body.style.overflow = 'auto'

        const older = mount(PkModal, {
            props: { open: true, title: 'Older dialog' },
            attachTo: document.body,
        })
        const newer = mount(PkModal, {
            props: { open: true, title: 'Newer dialog' },
            attachTo: document.body,
        })

        await older.setProps({ open: false })

        expect(document.body.style.overflow).toBe('hidden')

        await newer.setProps({ open: false })

        expect(document.body.style.overflow).toBe('auto')

        older.unmount()
        newer.unmount()
    })

    it('shares scroll locking with a slideover', async () => {
        document.body.style.overflow = 'auto'

        const modal = mount(PkModal, {
            props: { open: true, title: 'Confirm' },
            attachTo: document.body,
        })
        const slideover = mount(PkSlideover, {
            props: { open: true, title: 'Details' },
            attachTo: document.body,
        })

        await modal.setProps({ open: false })

        expect(document.body.style.overflow).toBe('hidden')

        await slideover.setProps({ open: false })

        expect(document.body.style.overflow).toBe('auto')

        modal.unmount()
        slideover.unmount()
    })

    it('initializes focus and scroll locking when mounted already open', async () => {
        document.body.style.overflow = ''

        const wrapper = mount(PkModal, {
            props: {
                open: true,
                title: 'Confirm action',
            },
            slots: {
                default: '<input aria-label="Confirmation input" />',
            },
            attachTo: document.body,
        })

        await wrapper.vm.$nextTick()

        expect(document.activeElement).toBe(
            document.querySelector('[aria-label="Confirmation input"]'),
        )

        wrapper.unmount()
        expect(document.body.style.overflow).toBe('')
    })

    it('keeps header and footer sticky while the body scrolls', () => {
        const wrapper = mount(PkModal, {
            props: {
                open: true,
                title: 'Bulk update',
                description: 'Apply to the selected rows.',
            },
            slots: {
                default: '<p>Long form body</p>',
                footer: '<button type="button">Run</button>',
            },
            attachTo: document.body,
        })

        const panel = document.body.querySelector('[role="dialog"]') as HTMLElement | null

        expect(panel).not.toBeNull()
        expect(panel!.className).toContain('max-h-[min(85vh,720px)]')
        expect(panel!.className).toContain('flex-col')
        expect(panel!.className).toContain(
            MODAL_PANEL.split(' ').find((c) => c.startsWith('max-w-'))!,
        )
        expect(panel!.textContent).toContain('Bulk update')
        expect(panel!.textContent).toContain('Long form body')
        expect(panel!.textContent).toContain('Run')
        expect(panel!.getAttribute('aria-labelledby')).toBe(
            panel!.querySelector('h2')?.getAttribute('id'),
        )
        expect(panel!.getAttribute('aria-describedby')).toBe(
            panel!.querySelector('p')?.getAttribute('id'),
        )

        const bands = Array.from(panel!.children) as HTMLElement[]

        expect(bands).toHaveLength(3)
        expect(bands[0].className).toContain('sticky')
        expect(bands[0].className).toContain('top-0')
        expect(bands[1].className).toContain('overflow-y-auto')
        expect(bands[1].className).toContain(OVERLAY_FORM_MEASURE.split(' ')[0])
        expect(bands[2].className).toContain('sticky')
        expect(bands[2].className).toContain('bottom-0')
        expect(bands[2].getAttribute('data-slot')).toBe('modal-footer')
        expect(bands[2].className).toContain("[&>[data-slot='button']]:min-h-10")
        expect(bands[2].className).toContain(
            "[&>[data-slot='button'][data-variant='destructive']]:min-w-24",
        )

        wrapper.unmount()
    })

    it('widens for form size without becoming a page', () => {
        const wrapper = mount(PkModal, {
            props: {
                open: true,
                title: 'Refund',
                size: 'form',
            },
            slots: {
                default: '<p>Amount</p>',
                footer: '<button type="button">Refund</button>',
            },
            attachTo: document.body,
        })

        const panel = document.body.querySelector('[role="dialog"]') as HTMLElement

        expect(panel.className).toContain(
            MODAL_PANEL_FORM.split(' ').find((c) => c.startsWith('max-w-'))!,
        )
        expect(panel.className).not.toContain('max-w-7xl')

        wrapper.unmount()
    })

    /**
     * `sm`/`lg`/`xl` are new - `RecordAction::modalWidth()` needed somewhere
     * to land other than the two sizes `confirm`/`form` were sized for.
     */
    it.each(['sm', 'lg', 'xl'] as const)('supports the new %s size', (size) => {
        const wrapper = mount(PkModal, {
            props: { open: true, title: 'Wide action', size },
            slots: { default: '<p>Body</p>' },
            attachTo: document.body,
        })

        const panel = document.body.querySelector('[role="dialog"]') as HTMLElement

        expect(panel.className).toContain(
            MODAL_WIDTH[size].split(' ').find((c) => c.startsWith('max-w-'))!,
        )

        wrapper.unmount()
    })

    it('falls back to the confirm width for an unrecognised size', () => {
        const wrapper = mount(PkModal, {
            props: { open: true, title: 'X', size: 'not-a-real-size' as never },
            slots: { default: '<p>Body</p>' },
            attachTo: document.body,
        })

        const panel = document.body.querySelector('[role="dialog"]') as HTMLElement

        expect(panel.className).toContain(
            MODAL_PANEL.split(' ').find((c) => c.startsWith('max-w-'))!,
        )

        wrapper.unmount()
    })
})

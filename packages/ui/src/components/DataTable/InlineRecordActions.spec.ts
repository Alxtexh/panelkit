import { DOMWrapper, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import PkDropdown from '../primitives/PkDropdown.vue'
import InlineRecordActions from './InlineRecordActions.vue'

const body = () => new DOMWrapper(document.body)

afterEach(() => {
    document.body.innerHTML = ''
})

describe('InlineRecordActions', () => {
    it('docks labelled action groups to the action column', () => {
        const wrapper = mount(InlineRecordActions, {
            props: {
                title: 'Ada',
                groups: [{ label: 'More', actions: [{ key: 'archive', label: 'Archive' }] }],
            },
        })

        expect(wrapper.findComponent(PkDropdown).props('placement')).toBe('left')
        wrapper.unmount()
    })

    it('renders an unlabelled action inline, not inside a menu', () => {
        const wrapper = mount(InlineRecordActions, {
            props: {
                title: 'Ada',
                groups: [{ actions: [{ key: 'view', label: 'View' }] }],
            },
        })

        expect(wrapper.find('[role="menuitem"]').exists()).toBe(false)

        const inline = wrapper.find('.hidden.sm\\:flex')

        expect(inline.text()).toContain('View')
    })

    it('renders a labelled ActionGroup as its own dropdown trigger, not inline text', async () => {
        const wrapper = mount(InlineRecordActions, {
            props: {
                title: 'Ada',
                groups: [
                    {
                        label: 'More',
                        actions: [
                            { key: 'archive', label: 'Archive' },
                            { key: 'duplicate', label: 'Duplicate' },
                        ],
                    },
                ],
            },
            attachTo: document.body,
        })

        const trigger = wrapper.find('button[aria-haspopup="menu"]')

        expect(trigger.exists()).toBe(true)
        expect(trigger.text()).toBe('More')
        expect(wrapper.find('.hidden.sm\\:flex').text()).not.toContain('Archive')

        await trigger.trigger('click')

        const items = body().findAll('[role="menuitem"]')

        expect(items.map((item) => item.text())).toEqual(['Archive', 'Duplicate'])
    })

    it('orders standalone destructive actions last, ordinary actions first', () => {
        const wrapper = mount(InlineRecordActions, {
            props: {
                title: 'Ada',
                groups: [
                    { actions: [{ key: '__delete', label: 'Delete', destructive: true }] },
                    { actions: [{ key: 'view', label: 'View' }] },
                ],
            },
        })

        const labels = wrapper
            .find('.hidden.sm\\:flex')
            .findAll('a, button')
            .map((el) => el.text())

        expect(labels).toEqual(['View', 'Delete'])
    })

    it('emits run when an inline non-link action is clicked', async () => {
        const wrapper = mount(InlineRecordActions, {
            props: {
                title: 'Ada',
                groups: [{ actions: [{ key: 'archive', label: 'Archive' }] }],
            },
        })

        await wrapper.find('button').trigger('click')

        expect(wrapper.emitted('run')?.[0]?.[0]).toMatchObject({ key: 'archive' })
    })

    it('renders a link action as a real anchor rather than a run-emitting button', () => {
        const wrapper = mount(InlineRecordActions, {
            props: {
                title: 'Ada',
                groups: [
                    { actions: [{ key: 'open', label: 'Open', link: true, url: '/records/1' }] },
                ],
            },
        })

        const link = wrapper.find('a')

        expect(link.exists()).toBe(true)
        expect(link.attributes('href')).toBe('/records/1')
        expect(wrapper.find('button:not([aria-haspopup])').exists()).toBe(false)
    })

    it('still exposes openContextMenu, delegating to the narrow-viewport fallback menu', async () => {
        const wrapper = mount(InlineRecordActions, {
            props: {
                title: 'Ada',
                groups: [{ actions: [{ key: 'view', label: 'View' }] }],
            },
            attachTo: document.body,
        })

        ;(wrapper.vm as unknown as { openContextMenu: (e: MouseEvent) => void }).openContextMenu(
            new MouseEvent('contextmenu', { clientX: 10, clientY: 10 }),
        )
        await wrapper.vm.$nextTick()

        expect(body().find('[role="menuitem"]').exists()).toBe(true)

        wrapper.unmount()
    })
})

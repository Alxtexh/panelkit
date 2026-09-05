import { DOMWrapper, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ICON_PATHS } from '../primitives/icons'
import PkDropdown from '../primitives/PkDropdown.vue'
import RecordActions from './RecordActions.vue'

function openMenu(wrapper: ReturnType<typeof mount>) {
    return wrapper.find('button[aria-haspopup="menu"]').trigger('click')
}

const body = () => new DOMWrapper(document.body)

afterEach(() => {
    document.body.innerHTML = ''
})

describe('RecordActions icons', () => {
    it('draws coins and log-in for recharge / impersonate without declared icons', async () => {
        const wrapper = mount(RecordActions, {
            props: {
                title: 'Ada',
                groups: [
                    {
                        actions: [
                            {
                                key: 'recharge-credits',
                                label: 'Recharge Credits',
                                color: 'success',
                            },
                            {
                                key: 'impersonate',
                                label: 'Log in as user',
                            },
                            {
                                key: '__delete',
                                label: 'Delete',
                                destructive: true,
                            },
                        ],
                    },
                ],
            },
            attachTo: document.body,
        })

        await openMenu(wrapper)

        const paths = body()
            .findAll('[role="menuitem"] path')
            .map((node) => node.attributes('d'))

        expect(paths).toContain(ICON_PATHS.coins)
        expect(paths).toContain(ICON_PATHS['log-in'])
        expect(paths).toContain(ICON_PATHS.trash)
        expect(paths.every((d) => d !== ICON_PATHS.dot)).toBe(true)
    })
})

describe('RecordActions positioning', () => {
    it('docks the row menu to the action column instead of flipping vertically', () => {
        const wrapper = mount(RecordActions, {
            props: {
                title: 'Ada',
                groups: [{ actions: [{ key: 'delete', label: 'Delete' }] }],
            },
        })

        expect(wrapper.findComponent(PkDropdown).props('placement')).toBe('left')
        wrapper.unmount()
    })
})

describe('RecordActions key bindings', () => {
    it('runs the bound action while the menu is open', async () => {
        const wrapper = mount(RecordActions, {
            props: {
                title: 'Ada',
                groups: [
                    {
                        actions: [
                            { key: 'duplicate', label: 'Duplicate', keyBindings: ['mod+d'] },
                            { key: 'view', label: 'View' },
                        ],
                    },
                ],
            },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        await body().find('[role="menuitem"]').trigger('keydown', { key: 'd', ctrlKey: true })

        expect(wrapper.emitted('run')?.[0]?.[0]).toMatchObject({ key: 'duplicate' })

        wrapper.unmount()
    })

    it('matches mod against either ctrl or meta', async () => {
        const wrapper = mount(RecordActions, {
            props: {
                title: 'Ada',
                groups: [
                    { actions: [{ key: 'duplicate', label: 'Duplicate', keyBindings: ['mod+d'] }] },
                ],
            },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        await body().find('[role="menuitem"]').trigger('keydown', { key: 'd', metaKey: true })

        expect(wrapper.emitted('run')?.[0]?.[0]).toMatchObject({ key: 'duplicate' })

        wrapper.unmount()
    })

    it('requires the declared modifiers, not just the key', async () => {
        const wrapper = mount(RecordActions, {
            props: {
                title: 'Ada',
                groups: [
                    { actions: [{ key: 'duplicate', label: 'Duplicate', keyBindings: ['mod+d'] }] },
                ],
            },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        // Plain "d", no modifier - must not match a "mod+d" binding.
        await body().find('[role="menuitem"]').trigger('keydown', { key: 'd' })

        expect(wrapper.emitted('run')).toBeUndefined()

        wrapper.unmount()
    })

    it('does not run a disabled (busy) action from its binding', async () => {
        const wrapper = mount(RecordActions, {
            props: {
                title: 'Ada',
                busy: 'duplicate',
                groups: [
                    { actions: [{ key: 'duplicate', label: 'Duplicate', keyBindings: ['e'] }] },
                ],
            },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        await body().find('[role="menuitem"]').trigger('keydown', { key: 'e' })

        expect(wrapper.emitted('run')).toBeUndefined()

        wrapper.unmount()
    })

    it('navigates same-tab for a bound link action instead of emitting run', async () => {
        const assign = vi.fn()
        const original = window.location
        // @ts-expect-error -- narrowing window.location for the assertion
        delete window.location
        window.location = { ...original, assign } as unknown as Location

        const wrapper = mount(RecordActions, {
            props: {
                title: 'Ada',
                groups: [
                    {
                        actions: [
                            {
                                key: 'open',
                                label: 'Open',
                                link: true,
                                url: '/records/1',
                                keyBindings: ['o'],
                            },
                        ],
                    },
                ],
            },
            attachTo: document.body,
        })

        await openMenu(wrapper)
        await body().find('[role="menuitem"]').trigger('keydown', { key: 'o' })

        expect(assign).toHaveBeenCalledWith('/records/1')
        expect(wrapper.emitted('run')).toBeUndefined()

        wrapper.unmount()
        window.location = original
    })
})

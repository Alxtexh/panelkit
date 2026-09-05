import { mount, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const page = {
    props: {
        notificationCount: 1,
        panel: { path: '/' },
    },
}

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    router: { post: vi.fn() },
}))

vi.mock('@alxtexh-enterprise/panel', () => ({
    PkModal: {
        props: ['open', 'title', 'description'],
        template: '<div v-if="open"><slot /><slot name="footer" /></div>',
    },
    PkSlideover: {
        props: ['open', 'side', 'title', 'width'],
        template: '<div v-if="open"><slot /><slot name="footer" /></div>',
    },
}))

const { default: PanelNotificationBell } = await import('./PanelNotificationBell.vue')

describe('PanelNotificationBell', () => {
    beforeEach(() => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => ({
                ok: true,
                json: async () => ({
                    alerts: [],
                    unread: 1,
                    canAnnounce: false,
                    notifications: [
                        {
                            id: 'n1',
                            title: 'Invoice posted',
                            body: 'INV-12',
                            href: '/invoices/12',
                            severity: 'success',
                            read: false,
                            at: 'now',
                            actions: [
                                { key: 'view', label: 'View', href: '/invoices/12' },
                                {
                                    key: 'download',
                                    label: 'Download',
                                    href: '/invoices/12.pdf',
                                    newTab: true,
                                },
                            ],
                        },
                    ],
                }),
            })),
        )
    })

    it('renders action hrefs on an inbox row', async () => {
        const wrapper = mount(PanelNotificationBell)

        await wrapper.get('[data-notification-bell]').trigger('click')
        await flushPromises()

        const inbox = wrapper.findAll('button').find((button) => button.text().includes('Inbox'))
        await inbox?.trigger('click')

        const hrefs = wrapper
            .findAll('[data-notification-action]')
            .map((el) => el.attributes('href'))

        expect(hrefs).toEqual(['/invoices/12', '/invoices/12.pdf'])
    })

    it('still renders a row that has no actions', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => ({
                ok: true,
                json: async () => ({
                    alerts: [],
                    unread: 0,
                    canAnnounce: false,
                    notifications: [
                        {
                            id: 'n2',
                            title: 'Ready',
                            body: 'Exported.',
                            href: null,
                            severity: 'info',
                            read: true,
                            at: null,
                        },
                    ],
                }),
            })),
        )

        const wrapper = mount(PanelNotificationBell)

        await wrapper.get('[data-notification-bell]').trigger('click')
        await flushPromises()

        const inbox = wrapper.findAll('button').find((button) => button.text().includes('Inbox'))
        await inbox?.trigger('click')

        expect(wrapper.text()).toContain('Ready')
        expect(wrapper.findAll('[data-notification-action]')).toHaveLength(0)
    })

    it('loads and appends the next page without dropping what is already shown', async () => {
        const fetchMock = vi.fn(async (url: string) => {
            if (String(url).includes('page=2')) {
                return {
                    ok: true,
                    json: async () => ({
                        notifications: [
                            {
                                id: 'n2',
                                title: 'Older note',
                                body: '',
                                href: null,
                                severity: 'info',
                                read: true,
                                at: null,
                            },
                        ],
                        hasMore: false,
                    }),
                }
            }

            return {
                ok: true,
                json: async () => ({
                    alerts: [],
                    unread: 1,
                    canAnnounce: false,
                    hasMore: true,
                    notifications: [
                        {
                            id: 'n1',
                            title: 'Newest note',
                            body: '',
                            href: null,
                            severity: 'info',
                            read: false,
                            at: null,
                        },
                    ],
                }),
            }
        })

        vi.stubGlobal('fetch', fetchMock)

        const wrapper = mount(PanelNotificationBell)

        await wrapper.get('[data-notification-bell]').trigger('click')
        await flushPromises()

        const inbox = wrapper.findAll('button').find((button) => button.text().includes('Inbox'))
        await inbox?.trigger('click')

        expect(wrapper.text()).toContain('Newest note')
        expect(wrapper.text()).not.toContain('Older note')

        await wrapper.get('[data-load-more]').trigger('click')
        await flushPromises()

        // BOTH pages, not the second replacing the first.
        expect(wrapper.text()).toContain('Newest note')
        expect(wrapper.text()).toContain('Older note')
        // No more pages left, so the button itself is gone.
        expect(wrapper.find('[data-load-more]').exists()).toBe(false)

        const lastCallUrl = String(fetchMock.mock.calls[fetchMock.mock.calls.length - 1]![0])
        expect(lastCallUrl).toContain('page=2')
    })

    it('flips a read note back to unread and restores the badge count', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => ({
                ok: true,
                json: async () => ({
                    alerts: [],
                    unread: 0,
                    canAnnounce: false,
                    hasMore: false,
                    notifications: [
                        {
                            id: 'n1',
                            title: 'Already read',
                            body: '',
                            href: null,
                            severity: 'info',
                            read: true,
                            at: null,
                        },
                    ],
                }),
            })),
        )

        const wrapper = mount(PanelNotificationBell)

        await wrapper.get('[data-notification-bell]').trigger('click')
        await flushPromises()

        const inbox = wrapper.findAll('button').find((button) => button.text().includes('Inbox'))
        await inbox?.trigger('click')

        const unreadButton = wrapper.get('[aria-label="Mark Already read as unread"]')
        await unreadButton.trigger('click')

        expect(wrapper.get('[aria-label="Notifications, 1 unread"]')).toBeTruthy()
    })

    it('asks for confirmation before clearing every notification', async () => {
        vi.stubGlobal(
            'confirm',
            vi.fn(() => false),
        )

        const wrapper = mount(PanelNotificationBell)

        await wrapper.get('[data-notification-bell]').trigger('click')
        await flushPromises()

        const inbox = wrapper.findAll('button').find((button) => button.text().includes('Inbox'))
        await inbox?.trigger('click')

        expect(wrapper.text()).toContain('Invoice posted')

        await wrapper.get('[data-clear-all]').trigger('click')
        await flushPromises()

        // Declined the confirm, so nothing was removed.
        expect(wrapper.text()).toContain('Invoice posted')
    })
})

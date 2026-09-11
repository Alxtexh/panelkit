import { describe, expect, it } from 'vitest'
import { ICON_PATHS, iconPath, resolveActionIcon } from './icons'

describe('resolveActionIcon', () => {
    it('uses a declared icon when the path is known', () => {
        expect(resolveActionIcon({ key: 'x', icon: 'trash' })).toBe(ICON_PATHS.trash)
    })

    it('maps Filament-shaped aliases onto kit paths', () => {
        expect(resolveActionIcon({ key: 'pay', icon: 'currency-dollar' })).toBe(ICON_PATHS.coins)
        expect(resolveActionIcon({ key: 'swap', icon: 'impersonate' })).toBe(ICON_PATHS['log-in'])
    })

    it('defaults common keys when the host omitted icon', () => {
        expect(resolveActionIcon({ key: 'recharge-credits', label: 'Recharge Credits' })).toBe(
            ICON_PATHS.coins,
        )
        expect(resolveActionIcon({ key: 'impersonate', label: 'Log in as user' })).toBe(
            ICON_PATHS['log-in'],
        )
        expect(resolveActionIcon({ key: 'delete', destructive: true })).toBe(ICON_PATHS.trash)
    })

    it('reads the label when the key is custom and icon is missing', () => {
        expect(
            resolveActionIcon({
                key: 'topup',
                label: 'Recharge Credits',
                color: 'success',
            }),
        ).toBe(ICON_PATHS.coins)

        expect(
            resolveActionIcon({
                key: 'become',
                label: 'Log in as user',
            }),
        ).toBe(ICON_PATHS['log-in'])
    })

    it('never returns the microscopic dot for a coloured menu action', () => {
        const path = resolveActionIcon({
            key: 'mystery',
            label: 'Do something',
            color: 'success',
        })

        expect(path).not.toBe(ICON_PATHS.dot)
        expect(path).toBe(ICON_PATHS.coins)
    })

    it('falls back to a hollow circle rather than a speck', () => {
        expect(resolveActionIcon({ key: 'mystery', label: 'Odd thing' })).toBe(ICON_PATHS.circle)
    })
})

describe('iconPath', () => {
    it('still uses the deliberate speck for a truly unknown chrome name', () => {
        expect(iconPath('not-a-real-glyph')).toBe(ICON_PATHS.dot)
    })

    /**
     * The exact failure this file's own "destinations" comment describes for
     * `home`/`users`/`router`/`mail`: a nav destination declared server-side
     * with no path here renders the fallback speck on every phone, looking
     * like a finished design rather than a missing icon. `settings` repeated
     * it - present in the sidebar's Lucide map (`panelIcons.ts`) but absent
     * from this one, so only the bottom bar showed a dot. `user`/`receipt`/
     * `shopping-bag`/`shopping-cart`/`life-buoy` repeated it again: present
     * in `panelIcons.ts` (or added alongside it) for a Users/Invoices/
     * Products/Orders/Tickets-shaped resource, but missing here, so the
     * mobile bottom bar showed a dot for a resource whose desktop sidebar
     * icon was correct.
     */
    it('resolves every destination the navigation set documents, including settings', () => {
        for (const name of [
            'home',
            'users',
            'router',
            'mail',
            'settings',
            'user',
            'receipt',
            'shopping-bag',
            'shopping-cart',
            'life-buoy',
        ]) {
            expect(iconPath(name)).not.toBe(ICON_PATHS.dot)
        }
    })
})

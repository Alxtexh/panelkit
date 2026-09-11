import { describe, expect, it } from 'vitest'
import { ICON_PATHS, iconPath } from '../../src/components/primitives/icons'
import { PANEL_ICONS } from './panelIcons'

/**
 * Two independently-maintained icon registries exist for the same semantic
 * navigation-icon vocabulary: `PANEL_ICONS` (this file's sibling,
 * `@lucide/vue` components for the desktop sidebar) and `ICON_PATHS`
 * (`icons.ts`, raw SVG path strings for the mobile bottom bar). See
 * `icons.ts`'s own docblock for why the two shapes cannot simply be unified
 * into one registry without either losing desktop's tree-shaken per-icon
 * components or blowing the kit's bundle budget with every icon
 * `@lucide/vue` ships (`scripts/check-bundle-budget.sh`).
 *
 * A NAME CAN DRIFT SILENTLY BETWEEN THEM OTHERWISE. Five names (`user`,
 * `receipt`, `shopping-bag`, `shopping-cart`, `life-buoy`) were already found
 * missing from `icons.ts` once, by hand. A release-candidate audit went
 * looking for more the same way - reading both files and diffing the key
 * lists by eye - and found thirteen (`list`, `layout-grid`, `circle-check`,
 * `flag`, `folder`, `map`, `rocket`, `scroll-text`, `user-plus`, `webhook`,
 * `help`, `faq`, `building`). Writing THIS test instead of trusting that
 * second by-hand pass caught two more the manual read missed (`file`,
 * `message-circle`) on its very first run - which is the whole argument for
 * a test over a periodic re-read: every prior pass "looked complete" too.
 * Every time, a resource's icon looked correct on the desktop sidebar and
 * silently fell back to the generic dot on the mobile bottom bar, with
 * nothing red anywhere to say so. This test is what makes the NEXT such gap
 * fail a build instead of a phone screen.
 */
describe('icon registry parity (desktop PANEL_ICONS vs mobile ICON_PATHS)', () => {
    it('resolves every desktop navigation icon name to a real mobile path, not the fallback dot', () => {
        const missing = Object.keys(PANEL_ICONS).filter((name) => iconPath(name) === ICON_PATHS.dot)

        expect(missing).toEqual([])
    })
})

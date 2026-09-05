import { beforeEach, describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { applyAppearance, readAppearance } from './useAppearance'
import { useTenantTheme } from './useTenantTheme'

/**
 * Per-tenant branding, and the property name that decides whether it exists.
 *
 * WHY THIS TEST EXISTS. This composable set `--color-{token}` for its whole
 * life and branding never applied once. The stylesheet declares
 * `--color-primary: var(--primary)` inside `@theme`, which Tailwind resolves at
 * BUILD time - `bg-primary` compiles to `background-color: var(--primary)`. So
 * `--color-primary` had no reader: setting it succeeded, computed, inherited
 * down the entire tree, and changed nothing.
 *
 * A TEST ASSERTING "the property was set" WOULD HAVE PASSED THE WHOLE TIME.
 * That is the trap this file is written against: the observable behaviour of a
 * custom property nothing reads is identical to one that works, right up to the
 * screenshot. So what is pinned here is the NAME, against the names
 * `useAppearance` writes - the ones demonstrably wired to the stylesheet.
 *
 * Measured in the live panel before changing it, on a probe element:
 *
     *     before                     oklch(0.24 0.02 260)
     *     with --color-primary set   oklch(0.24 0.02 260)   <- no effect
 *     with --primary set         rgb(0, 0, 255)         <- applies
 */
describe('useTenantTheme', () => {
    beforeEach(() => {
        document.documentElement.removeAttribute('style')
    })

    const apply = (colors: Record<string, string>) => {
        useTenantTheme(ref(colors))

        return document.documentElement.style
    }

    it('writes the token the stylesheet actually reads', () => {
        const style = apply({ primary: '#b91c1c' })

        expect(style.getPropertyValue('--primary')).toBe('#b91c1c')
    })

    /**
     * AND NOT THE ONE IT DOES NOT. Kept as its own case because this is the
     * regression: the prefixed name is not merely redundant, it is the bug.
     */
    it('does not write the prefixed name, which nothing consumes', () => {
        const style = apply({ primary: '#b91c1c' })

        expect(style.getPropertyValue('--color-primary')).toBe('')
    })

    /**
     * VALUES PASS THROUGH UNCHANGED - antipatterns §6.2. A token was once
     * wrapped in `rgb()` on the assumption it held a space-separated triple; it
     * held a complete colour, the result was invalid CSS, and the element
     * rendered transparent: invisible in light mode, fine in dark, so it
     * shipped.
     */
    it('passes a value through exactly as stored', () => {
        expect(apply({ primary: 'oklch(0.55 0.22 300)' }).getPropertyValue('--primary')).toBe(
            'oklch(0.55 0.22 300)',
        )
    })

    /*
     * THE VALUES COME FROM A DATABASE COLUMN AN ADMINISTRATOR EDITS, so they
     * are attacker-adjacent input on their way into a style attribute.
     */
    it('skips a token or value that could inject CSS', () => {
        const style = apply({
            'primary;color': '#fff',
            ring: 'red; background: url(https://example.test/x)',
            primary: '#00ff00',
        })

        /*
         * `--ring` HAS A VALUE - the appearance defaults set one - so what is
         * asserted is that the REJECTED string did not land, not that the
         * property is empty. Checking for emptiness would pass for the wrong
         * reason and go red the day the accent stopped setting a ring colour.
         */
        expect(style.cssText).not.toContain('example.test')
        expect(style.getPropertyValue('--ring')).not.toContain('url(')

        // A bad neighbour does not stop a good one: the panel still themes.
        expect(style.getPropertyValue('--primary')).toBe('#00ff00')
    })

    it('writes nothing when a tenant has set no colours', () => {
        expect(apply({}).cssText).toBe('')
    })

    /*
     * THE BRAND IS THE DEFAULT, NOT AN OVERRIDE - the three cases below are
     * that rule, and they are worth spelling out because the first version got
     * it wrong in a way tests would not have caught.
     *
     * "The brand always wins" is coherent and passes every assertion you would
     * think to write. It also makes the drawer's Primary swatches a control
     * that responds to a click and changes nothing, which is only visible by
     * looking at the panel.
     *
     * ASSERTED THROUGH `applyAppearance`, not by inspecting the registry: a
     * test that checked the variable was recorded would pass whether or not
     * anything ever read it.
     */
    it('applies the brand while nobody has chosen an accent', () => {
        apply({ primary: '#b91c1c' })

        applyAppearance({ ...readAppearance(), primaryChosen: false })

        expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#b91c1c')
    })

    it('gives way once somebody picks an accent of their own', () => {
        apply({ primary: '#b91c1c' })

        applyAppearance({ ...readAppearance(), primary: 'emerald', primaryChosen: true })

        const style = document.documentElement.style

        expect(style.getPropertyValue('--primary')).toBe('oklch(0.60 0.14 163)')

        // The rest of the preference applies either way.
        expect(style.getPropertyValue('--pk-font-size')).not.toBe('')
    })

    /**
     * AND CHOOSING THE DEFAULT COLOUR IS STILL CHOOSING.
     *
     * This is the case the first version got wrong. `slate` was inferred to
     * mean "untouched", so clicking the first swatch showed the organisation's
     * colour instead - a picker whose first option does something else.
     */
    it('honours slate when slate is what somebody picked', () => {
        apply({ primary: '#b91c1c' })

        applyAppearance({ ...readAppearance(), primary: 'slate', primaryChosen: true })

        expect(document.documentElement.style.getPropertyValue('--primary')).toBe(
            'oklch(0.24 0.02 260)',
        )
    })
})

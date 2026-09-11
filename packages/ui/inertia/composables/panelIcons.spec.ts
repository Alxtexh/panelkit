import { Package, Settings } from '@lucide/vue'
import { describe, expect, it } from 'vitest'
import panelIconNames from './panel-icon-names.json'
import { PANEL_ICONS, resolvePanelIcon } from './panelIcons'

/**
 * `resolvePanelIcon()` falls back to `Package` for any key it does not
 * recognise - which is correct for a genuinely unknown resource icon, and
 * silent for a KNOWN nav key nobody registered here. `SettingsNav.php` sent
 * `'icon' => 'settings'` for a full release with no `settings` entry in
 * `PANEL_ICONS`, so the sidebar's Settings row rendered a plain box: the
 * fallback, not a mistake anyone could see without knowing the map's keys.
 *
 * ONE ENTRY PER SERVER-DECLARED NAV ICON KEY, not every icon this file could
 * carry - `PANEL_ICONS` also serves resource/page icons a host chooses
 * freely, which have no fixed set to enumerate.
 */
describe('panelIcons', () => {
    it('resolves the settings nav icon to Settings, not the Package fallback', () => {
        expect(PANEL_ICONS.settings).toBe(Settings)
        expect(resolvePanelIcon('settings')).toBe(Settings)
        expect(resolvePanelIcon('settings')).not.toBe(Package)
    })

    it('still falls back to Package for a genuinely unknown key', () => {
        expect(resolvePanelIcon('not-a-real-icon')).toBe(Package)
        expect(resolvePanelIcon(null)).toBe(Package)
        expect(resolvePanelIcon(undefined)).toBe(Package)
    })

    /**
     * `panel-icon-names.json` is the vocabulary `panel:doctor` (PHP) validates
     * a resource's `$icon` against, since PHP cannot `import` this file. A
     * name added or removed here without updating that JSON would make the
     * PHP-side check either miss a real typo or flag a perfectly valid one -
     * this is what keeps the two lists from drifting apart silently.
     */
    it('keeps panel-icon-names.json in sync with PANEL_ICONS', () => {
        expect([...panelIconNames].sort()).toEqual(Object.keys(PANEL_ICONS).sort())
    })
})

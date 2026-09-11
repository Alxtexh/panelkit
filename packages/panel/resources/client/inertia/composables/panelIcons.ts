import {
    Activity,
    Archive,
    AppWindow,
    AppWindowMac,
    BookOpen,
    Building,
    Calendar,
    ChevronsUpDown,
    CircleCheck,
    File,
    FileQuestion,
    Flag,
    Folder,
    FolderTree,
    Gauge,
    HelpCircle,
    Info,
    KeyRound,
    Layers,
    LayoutGrid,
    LayoutTemplate,
    LifeBuoy,
    List,
    Lock,
    Mail,
    Map as MapIcon,
    Megaphone,
    MessageCircle,
    MessageCircleQuestion,
    MessagesSquare,
    Package,
    PanelLeft,
    PanelLeftClose,
    Receipt,
    CreditCard,
    Coins,
    House,
    FileText,
    LogIn,
    Rocket,
    Router as RouterIcon,
    ScrollText,
    ShoppingBag,
    ServerCrash,
    Settings,
    ShieldAlert,
    ShoppingCart,
    SlidersHorizontal,
    Smartphone,
    Sparkles,
    Square,
    TimerOff,
    Trash2,
    User,
    UserCheck,
    UserPlus,
    Users,
    Wallet,
    Webhook,
    Wrench,
} from '@lucide/vue'
import type { Component } from 'vue'

/**
 * Lucide components keyed by the string icons resources and pages share.
 *
 * KEPT IN ONE PLACE so the sidebar, the top bar, and Quick Create cannot drift
 * onto different glyphs for the same resource.
 *
 * THIS MAP USED TO COVER ONLY ~37 NAMES out of the full Lucide set `@lucide/vue`
 * (already a dependency) actually ships. A resource or page declaring any name
 * outside it - `message-circle`, `layout-template`, `webhook`, `scroll-text`,
 * `flag`, `building`, `rocket`, `map`, `user-plus`, `folder`, `file`,
 * `circle-check` were all in real use and all missing - silently fell back to
 * `Package` with no warning anywhere (`resolvePanelIcon` below), and because
 * `package` is *also* a legitimately-declared icon for other resources, the
 * fallback was invisible: every new resource just looked like it got "the box
 * icon" again. `apps/playground/tests/Feature/DeclaredIconsExistTest.php`
 * checked declared names against `icons.ts`'s `ICON_PATHS` (a deliberately
 * small, curated set for action glyphs, by design - see that file's own
 * docblock) rather than against this map, the one the desktop sidebar
 * actually renders through - so nothing caught the gap. Extended here to
 * cover every name declared anywhere in the monorepo as of this fix; keep
 * doing that going forward rather than reaching for a fully dynamic
 * `import { icons } from '@lucide/vue'` lookup, which pulls in the entire
 * ~1600-icon set and cannot be tree-shaken (it would blow the kit's JS
 * bundle budget - see `scripts/check-bundle-budget.sh` - for icons nothing
 * uses).
 *
 * THE KEY LIST ALSO LIVES AT `./panel-icon-names.json`, kept in sync by
 * `panelIcons.spec.ts` - `panel:doctor` (PHP, so it cannot `import` this
 * file) reads that JSON to validate a resource's declared `$icon` against
 * the same curated vocabulary this map enforces client-side, naming the
 * resource and the bad value rather than letting it silently collide with
 * `Package` the way an unrecognised name used to.
 */
export const PANEL_ICONS: Record<string, Component> = {
    users: Users,
    user: User,
    router: RouterIcon,
    package: Package,
    activity: Activity,
    archive: Archive,
    sliders: SlidersHorizontal,
    list: List,
    'layout-grid': LayoutGrid,
    'layout-template': LayoutTemplate,
    'shopping-bag': ShoppingBag,
    'shopping-cart': ShoppingCart,
    'life-buoy': LifeBuoy,
    receipt: Receipt,
    'credit-card': CreditCard,
    coins: Coins,
    wallet: Wallet,
    'log-in': LogIn,
    login: LogIn,
    impersonate: LogIn,
    home: House,
    'file-text': FileText,
    file: File,
    'book-open': BookOpen,
    chat: MessagesSquare,
    'message-circle': MessageCircle,
    faq: MessageCircleQuestion,
    'file-question': FileQuestion,
    gauge: Gauge,
    help: HelpCircle,
    info: Info,
    key: KeyRound,
    lock: Lock,
    mail: Mail,
    megaphone: Megaphone,
    sparkles: Sparkles,
    'server-crash': ServerCrash,
    settings: Settings,
    'shield-alert': ShieldAlert,
    smartphone: Smartphone,
    'timer-off': TimerOff,
    trash: Trash2,
    wrench: Wrench,
    building: Building,
    'circle-check': CircleCheck,
    flag: Flag,
    folder: Folder,
    map: MapIcon,
    rocket: Rocket,
    'scroll-text': ScrollText,
    'user-plus': UserPlus,
    webhook: Webhook,
    'user-check': UserCheck,
    'panel-left': PanelLeft,
    square: Square,
    layers: Layers,
    'panel-left-close': PanelLeftClose,
    'app-window': AppWindow,
    'chevrons-up-down': ChevronsUpDown,
    'folder-tree': FolderTree,
    calendar: Calendar,
    'app-window-mac': AppWindowMac,
}

/**
 * WARNS ONCE PER NAME, not silently, on a miss - this exact class of bug has
 * now shipped twice: a resource declares a real, sensible icon name
 * (`'user'`, `'shopping-cart'`, `'life-buoy'`), the name is not (yet) one of
 * the ~60 this map curates out of Lucide's ~1600, and `?? Package` quietly
 * substitutes the generic box - with `package` ALSO being a legitimately
 * declared icon elsewhere, so every miss reads as "this resource just uses
 * the box icon" rather than "this name was never registered." Six
 * independently-built resources ended up with three visually distinct icons
 * and three identical fallbacks for exactly this reason, and nothing said
 * so anywhere - not a lint, not a test against THAT application, not a
 * console line. `apps/playground/tests/Feature/DeclaredIconsExistTest.php`
 * only ever protected the bundled demo app's own declarations; a real
 * PanelKit consumer's resource has no equivalent test to catch it.
 *
 * A per-name warning is what makes the FIRST page load say so, in the one
 * place every developer already looks when a page renders wrong - matching
 * the same "warn once, on the actual miss" shape `PkLandingSections.vue`
 * already uses for an unknown declared section type.
 */
const warnedAbout = new Set<string>()

export function resolvePanelIcon(name: string | null | undefined): Component {
    if (!name) {
        return Package
    }

    const icon = PANEL_ICONS[name]

    if (!icon && name !== 'package' && !warnedAbout.has(name)) {
        warnedAbout.add(name)
        console.warn(
            `[alxtexhpanel] Unknown navigation icon "${name}" - falling back to the generic package `
                + 'icon. Check PANEL_ICONS in panelIcons.ts for the supported names, or pick a different one.',
        )
    }

    return icon ?? Package
}

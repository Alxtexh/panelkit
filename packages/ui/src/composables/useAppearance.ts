import { computed, onMounted, ref } from 'vue'

/**
 * Per-user appearance: colour, scheme, density, font size, sidebar side.
 *
 * MOST OF THIS GOES BEYOND FILAMENT, where font and sidebar behaviour are
 * developer panel-config decided once for everyone. Per-user costs almost
 * nothing - every value is a CSS custom property on :root, the same mechanism
 * per-tenant branding uses - and an operator staring at a table for eight hours
 * has opinions a developer cannot pre-empt.
 *
 * THE ACCOUNT IS THE SOURCE OF TRUTH once somebody is signed in. Values persist
 * on PUT `{panel}/settings/appearance` (`users.appearance` JSON). localStorage
 * is a per-browser cache so the theme can apply before Vue boots; a second
 * browser adopts the saved theme from `window.__panelAppearance` or the Inertia
 * `appearance` shared prop on first load and after login.
 */
/**
 * Light or dark, and nothing else.
 *
 * `system` USED TO BE HERE AND WAS THE DEFAULT, which meant the panel's own
 * appearance was decided by whatever the operating system happened to be set
 * to - the same account looked different on two machines, a screenshot in a
 * ticket did not match what the next person saw, and a dark panel nobody chose
 * was the first impression for anyone whose laptop was in dark mode.
 *
 * The panel now starts LIGHT for everybody and follows nothing. Dark remains a
 * deliberate choice a person makes, which is a different thing from a default
 * inherited from elsewhere.
 */
export type Theme = 'light' | 'dark'
/**
 * How much air a row gets.
 *
 * THREE LEVELS, because two industries want opposite things from the same
 * table. A dispatcher scanning 200 rows wants every one of them on screen;
 * somebody working a touch screen in a van wants a target they can hit while
 * standing up. `comfortable` is the default because it is wrong for neither.
 */
export type Density = 'comfortable' | 'compact' | 'spacious'
/**
 * Where the navigation lives.
 *
 * `horizontal` is a different LAYOUT, not a different side - the nav becomes a
 * top bar with dropdown groups and there is no vertical rail at all. It shares
 * this setting because to the person choosing it, all three are the same
 * question: "where do I want the menu".
 */
export type SidebarSide = 'left' | 'right' | 'horizontal'
export type CardStyle = 'transparent' | 'filled'
/**
 * Full-bleed content, or a centred column with margin either side.
 *
 * `centered` matters most on a wide monitor with a list of five columns - full
 * width stretches a form to a line length nobody can read in one pass. It is
 * per-user rather than per-page because the same person wants it everywhere or
 * nowhere; a page-by-page override would be a setting nobody remembers exists.
 */
export type ContentLayout = 'full' | 'centered'
/**
 * How a sidebar group with children behaves when opened.
 *
 * `collapsible` is what the panel has always done - the group expands in
 * place, an accordion. `drilldown` replaces the sidebar's own contents with
 * that group's items and a back button, which is the shape a group with many
 * children needs: an accordion nests forever and dense trees still look
 * cramped, where a drill-down keeps every level as flat and as roomy as the
 * top one.
 */
export type MenuStyle = 'collapsible' | 'drilldown'

export interface Appearance {
    theme: Theme
    density: Density
    /** Root font size in PIXELS. Everything else is rem, so one value scales the panel. */
    fontSize: number
    sidebarSide: SidebarSide
    cardStyle: CardStyle
    /** In REM. Drives `--radius`; Tailwind's `--radius-sm/md/lg` are already `calc()` off it. */
    radius: number
    contentLayout: ContentLayout
    menuStyle: MenuStyle
    /** Key into PRIMARY_COLORS. */
    primary: string
    /**
     * Whether `primary` is a DELIBERATE choice or just the shipped default.
     *
     * A separate field because the value cannot say this on its own. The first
     * version inferred it - "if the accent is not `slate`, they chose it" -
     * which made the first swatch a lie: click the black one and the panel
     * showed the organisation's purple, because slate and "untouched" were the
     * same state. A picker whose first option does something else is worse than
     * no picker.
     */
    primaryChosen?: boolean
    /** Key into SURFACE_TINTS. */
    surface: string
}

/**
 * Accent palette, in oklch.
 *
 * oklch because it is perceptually uniform: the same lightness value looks
 * equally light across hues, so a generated hover or muted variant stays legible
 * on every colour. The same reason the spec picked it for tenant branding.
 *
 * Each entry carries its own foreground, because contrast is not derivable from
 * the accent alone - yellow needs dark text where indigo needs light, and
 * getting that wrong produces unreadable buttons rather than ugly ones.
 */
export const PRIMARY_COLORS: Record<string, { label: string; value: string; foreground: string }> =
    {
        slate: {
            label: 'Slate',
            // Keep the default action surface dark enough for white 14px text
            // in Chromium's contrast calculation, including antialiased glyphs.
            value: 'oklch(0.24 0.02 260)',
            foreground: 'oklch(0.98 0 0)',
        },
        emerald: {
            label: 'Emerald',
            value: 'oklch(0.60 0.14 163)',
            foreground: 'oklch(0.99 0 0)',
        },
        green: {
            label: 'Green',
            value: 'oklch(0.63 0.17 145)',
            foreground: 'oklch(0.99 0 0)',
        },
        lime: {
            label: 'Lime',
            value: 'oklch(0.72 0.18 130)',
            foreground: 'oklch(0.20 0 0)',
        },
        orange: {
            label: 'Orange',
            value: 'oklch(0.68 0.18 45)',
            foreground: 'oklch(0.99 0 0)',
        },
        amber: {
            label: 'Amber',
            value: 'oklch(0.75 0.15 75)',
            foreground: 'oklch(0.20 0 0)',
        },
        yellow: {
            label: 'Yellow',
            value: 'oklch(0.82 0.16 95)',
            foreground: 'oklch(0.20 0 0)',
        },
        teal: {
            label: 'Teal',
            value: 'oklch(0.62 0.11 190)',
            foreground: 'oklch(0.99 0 0)',
        },
        cyan: {
            label: 'Cyan',
            value: 'oklch(0.68 0.12 215)',
            foreground: 'oklch(0.20 0 0)',
        },
        sky: {
            label: 'Sky',
            value: 'oklch(0.63 0.15 240)',
            foreground: 'oklch(0.99 0 0)',
        },
        blue: {
            label: 'Blue',
            value: 'oklch(0.55 0.20 262)',
            foreground: 'oklch(0.99 0 0)',
        },
        indigo: {
            label: 'Indigo',
            value: 'oklch(0.51 0.22 277)',
            foreground: 'oklch(0.99 0 0)',
        },
        violet: {
            label: 'Violet',
            value: 'oklch(0.56 0.24 295)',
            foreground: 'oklch(0.99 0 0)',
        },
        fuchsia: {
            label: 'Fuchsia',
            value: 'oklch(0.63 0.26 320)',
            foreground: 'oklch(0.99 0 0)',
        },
        pink: {
            label: 'Pink',
            value: 'oklch(0.63 0.22 355)',
            foreground: 'oklch(0.99 0 0)',
        },
        rose: {
            label: 'Rose',
            value: 'oklch(0.62 0.22 15)',
            foreground: 'oklch(0.99 0 0)',
        },
    }

/**
 * Surface tint - the hue of greys, not their lightness.
 *
 * A neutral grey next to a warm accent reads as slightly wrong in a way people
 * notice without being able to name. Tinting the surface toward the accent hue
 * fixes it, which is why this is a separate choice rather than derived.
 */
export const SURFACE_TINTS: Record<string, { label: string; hue: number; chroma: number }> = {
    neutral: { label: 'Neutral', hue: 0, chroma: 0 },
    slate: { label: 'Slate', hue: 260, chroma: 0.012 },
    gray: { label: 'Gray', hue: 250, chroma: 0.006 },
    zinc: { label: 'Zinc', hue: 280, chroma: 0.006 },
    stone: { label: 'Stone', hue: 60, chroma: 0.008 },
    warm: { label: 'Warm', hue: 40, chroma: 0.014 },
    cool: { label: 'Cool', hue: 220, chroma: 0.014 },
    sand: { label: 'Sand', hue: 80, chroma: 0.016 },
}

export const FONT_SIZE_MIN = 12
export const FONT_SIZE_MAX = 20

/** A fixed set of stops, not a slider - a radius is a brand decision, not a dial somebody sweeps. */
export const RADIUS_OPTIONS = [0, 0.25, 0.5, 0.75, 1] as const

const STORAGE_KEY = 'alxtexhpanel.appearance'

const DEFAULTS: Appearance = {
    // LIGHT, NOT THE OPERATING SYSTEM'S. See the Theme type - this is the whole
    // of the "mandatory light default": there is no branch that can produce
    // anything else before somebody chooses it.
    theme: 'light',
    density: 'comfortable',
    fontSize: 16,
    sidebarSide: 'left',
    cardStyle: 'transparent',
    // Matches the static `--radius: 0.5rem` app.css already shipped, so
    // nobody's panel visibly changes shape the first time this loads.
    radius: 0.5,
    contentLayout: 'full',
    menuStyle: 'collapsible',
    primary: 'slate',
    // Untouched. `reset()` restores these defaults, so Reset is also the way
    // back to the organisation's colour.
    primaryChosen: false,
    surface: 'neutral',
}

/**
 * Module-level, so every consumer shares one source of truth.
 *
 * A per-component ref would let the drawer and the layout disagree about the
 * current theme - the control showing one thing and the page rendering another.
 */
const state = ref<Appearance>({ ...DEFAULTS })
/** Set once `initializeAppearance()` or `bootstrapAppearance()` has run. */
let appearanceBootstrapped = false

/** Where the COMPUTED custom properties are cached for the pre-paint script. */
const VARS_KEY = 'alxtexhpanel.appearance.vars'

/** DOM node id for the critical CSS sheet Blade and live edits share. */
export const APPEARANCE_STYLE_ID = 'pk-appearance'

/**
 * Same shape PHP `AppearancePrepaint::payload()` embeds for the head script.
 * Live edits and first paint both flow through this so the paths cannot diverge
 * on field names.
 */
export interface AppearancePayload {
    dark: boolean
    theme: Theme
    vars: Record<string, string>
    sidebar: SidebarSide
    contentLayout: ContentLayout
}

type PanelAppearanceWindow = Window & {
    __panelAppearance?: Partial<Appearance> | null
    __panelAppearanceApplied?: boolean
}

function panelAppearanceWindow(): PanelAppearanceWindow | null {
    if (typeof window === 'undefined') {
        return null
    }

    return window as PanelAppearanceWindow
}

/** Last applied preference fingerprint; used to skip no-op Inertia re-applies. */
let appliedFingerprint: string | null = null

function appearanceFingerprint(next: Appearance): string {
    return JSON.stringify({
        theme: next.theme,
        density: next.density,
        fontSize: next.fontSize,
        sidebarSide: next.sidebarSide,
        cardStyle: next.cardStyle,
        radius: next.radius,
        contentLayout: next.contentLayout,
        menuStyle: next.menuStyle,
        primary: next.primary,
        primaryChosen: !!next.primaryChosen,
        surface: next.surface,
    })
}

function writeInlineAppearance(next: Appearance): void {
    const win = panelAppearanceWindow()

    if (!win) {
        return
    }

    win.__panelAppearance = { ...next }
}

function writeAppearanceStyle(vars: Record<string, string>): void {
    if (typeof document === 'undefined') {
        return
    }

    let style = document.getElementById(APPEARANCE_STYLE_ID) as HTMLStyleElement | null

    if (!style) {
        style = document.createElement('style')
        style.id = APPEARANCE_STYLE_ID
        document.head.appendChild(style)
    }

    const body = Object.entries(vars)
        .map(([name, value]) => `${name}: ${value};`)
        .join(' ')

    style.textContent = `:root { ${body} }`
}

/** Vitest helper: module state survives between cases in the same file. */
export function resetAppearanceBootstrapForTests(): void {
    appearanceBootstrapped = false
    appliedFingerprint = null
    state.value = { ...DEFAULTS }

    const win = panelAppearanceWindow()

    if (win) {
        win.__panelAppearanceApplied = false
    }

    if (typeof document !== 'undefined') {
        document.getElementById(APPEARANCE_STYLE_ID)?.remove()
    }
}

export function isDark(next: Appearance): boolean {
    /*
     * ONE COMPARISON, with no `matchMedia` anywhere in it. While `system`
     * existed this function could return dark for a preference that said
     * nothing about dark, so a light-defaulting panel still rendered dark on a
     * dark-mode laptop - which is exactly the behaviour being removed.
     */
    return next.theme === 'dark'
}

/**
 * The CSS custom properties a preference resolves to.
 *
 * SEPARATED FROM APPLYING THEM so the same mapping can be cached for the inline
 * script that runs before Vue boots. The alternative - reimplementing the
 * palette in Blade - would be two copies of the colour tables that drift the
 * first time one is edited.
 */
/** Vertical padding per row, by density. */
const ROW_PADDING: Record<Density, string> = {
    compact: '0.25rem',
    comfortable: '0.5rem',
    spacious: '0.875rem',
}

/** Stack gap for form fields / sections, by density. */
const FORM_GAP: Record<Density, string> = {
    compact: '0.75rem',
    comfortable: '1rem',
    spacious: '1.5rem',
}

export function appearanceVars(next: Appearance): Record<string, string> {
    const accent = PRIMARY_COLORS[next.primary] ?? PRIMARY_COLORS.slate
    const tint = SURFACE_TINTS[next.surface] ?? SURFACE_TINTS.neutral
    const c = tint.chroma
    const h = tint.hue
    // Neutral must remain neutral. A minimum chroma at hue 0 makes the whole
    // light workspace visibly pink; use a cool-grey fallback only to keep the
    // canvas distinct from white cards.
    const canvasChroma = c > 0 ? c : 0.006
    const canvasHue = c > 0 ? h : 250
    const dark = isDark(next)

    const surfaces = dark
        ? {
              '--background': `oklch(0.15 ${c} ${h})`,
              '--card': `oklch(${next.cardStyle === 'filled' ? 0.19 : 0.15} ${c} ${h})`,
              '--popover': `oklch(0.18 ${c} ${h})`,
              '--muted': `oklch(0.24 ${c} ${h})`,
              '--muted-foreground': 'oklch(0.78 0 0)',
              '--accent': `oklch(0.24 ${c} ${h})`,
              '--border': `oklch(0.27 ${c} ${h})`,
              '--input': `oklch(0.27 ${c} ${h})`,
          }
        : {
              '--background': `oklch(0.975 ${canvasChroma} ${canvasHue})`,
              '--card': `oklch(${next.cardStyle === 'filled' ? 0.985 : 1} ${c} ${h})`,
              '--popover': 'oklch(1 0 0)',
              '--muted': `oklch(0.965 ${c} ${h})`,
              '--muted-foreground': 'oklch(0.28 0 0)',
              '--accent': `oklch(0.965 ${c} ${h})`,
              '--border': `oklch(0.925 ${c} ${h})`,
              '--input': `oklch(0.90 ${c} ${h})`,
          }

    return {
        '--primary': accent.value,
        '--primary-foreground': accent.foreground,
        '--ring': accent.value,
        ...surfaces,
        '--pk-font-size': `${next.fontSize}px`,
        '--radius': `${next.radius}rem`,
        /*
         * A LOOKUP, not a ternary chain. The two-level version was
         * `compact ? a : b`, which silently treats every unrecognised value as
         * comfortable - including a third level added later, which is exactly
         * what happened. A map with an explicit fallback fails visibly instead:
         * the row simply does not change, rather than changing to something
         * plausible.
         */
        '--pk-row-padding': ROW_PADDING[next.density] ?? ROW_PADDING.comfortable,
        '--pk-form-gap': FORM_GAP[next.density] ?? FORM_GAP.comfortable,
    }
}

/**
 * Token payload matching PHP `AppearancePrepaint::payload()`.
 *
 * Keep the oklch tables in AppearancePrepaint.php in lockstep with
 * PRIMARY_COLORS / SURFACE_TINTS / appearanceVars above.
 */
export function appearancePayload(next: Appearance): AppearancePayload {
    return {
        dark: isDark(next),
        theme: next.theme,
        vars: appearanceVars(next),
        sidebar: next.sidebarSide,
        contentLayout: next.contentLayout,
    }
}

/**
 * Read the stored preference, migrating anything an older version wrote.
 *
 * Exported and callable OUTSIDE a component, because the appearance has to be
 * applied on pages that mount no panel component at all - the sign-in screen
 * being the one people notice.
 */
export function readAppearance(): Appearance {
    if (typeof window === 'undefined') {
        return { ...DEFAULTS }
    }

    try {
        const saved = localStorage.getItem(STORAGE_KEY)

        if (!saved) {
            return { ...DEFAULTS }
        }

        const parsed = { ...DEFAULTS, ...JSON.parse(saved) } as Appearance

        /*
         * MIGRATION. An earlier version stored fontSize as a NAME
         * ('small' | 'normal' | 'large'); it is a pixel number now. A stored
         * string sailed straight through and rendered "smallpx" as the label
         * and an invalid CSS value.
         */
        /*
         * MIGRATION. `system` is no longer a theme, and a browser that stored
         * it before this change would otherwise fail every comparison and
         * render as light while REPORTING a value the drawer cannot show as
         * selected - a control with nothing highlighted and no way to explain
         * it. Rewritten to the new default on first read.
         */
        if ((parsed.theme as string) === 'system') {
            parsed.theme = DEFAULTS.theme
        }

        const legacy: Record<string, number> = { small: 14, normal: 16, large: 18 }

        if (typeof parsed.fontSize === 'string') {
            parsed.fontSize = legacy[parsed.fontSize] ?? DEFAULTS.fontSize
        }

        if (
            typeof parsed.fontSize !== 'number' ||
            Number.isNaN(parsed.fontSize) ||
            parsed.fontSize < FONT_SIZE_MIN ||
            parsed.fontSize > FONT_SIZE_MAX
        ) {
            parsed.fontSize = DEFAULTS.fontSize
        }

        return parsed
    } catch {
        // Corrupt storage falls back to defaults rather than breaking the page.
        return { ...DEFAULTS }
    }
}

/**
 * Apply the stored appearance at APP BOOT, before any component mounts.
 *
 * This is the fix for two related bugs. The preference used to be applied in
 * `onMounted` of a component that only exists in the authenticated shell, so
 * (a) the sign-in and registration screens rendered with no theme at all, and
 * (b) signing out and back in appeared to lose the settings - nothing had been
 * lost, but nothing re-applied them until a panel page mounted.
 *
 * It also fights nothing: this is now the ONLY writer of the theme class.
 */
/**
 * Read the account appearance the server embedded before the bundle runs.
 *
 * `window.__panelAppearance` is set in the root Blade view. Inertia's initial
 * `data-page` payload is the fallback when the inline script is absent.
 */
export function readServerAppearance(): Partial<Appearance> | null {
    const win = panelAppearanceWindow()

    if (!win) {
        return null
    }

    const fromInline = win.__panelAppearance

    if (fromInline && typeof fromInline === 'object') {
        return fromInline
    }

    try {
        const raw = document.getElementById('app')?.dataset.page

        if (!raw) {
            return null
        }

        const appearance = JSON.parse(raw)?.props?.appearance

        return appearance && typeof appearance === 'object'
            ? (appearance as Partial<Appearance>)
            : null
    } catch {
        return null
    }
}

export function initializeAppearance(fromServer?: Partial<Appearance> | null): void {
    /*
     * THE SERVER VALUE WINS when there is one.
     *
     * localStorage is per browser profile, so signing into the same account
     * from a second browser showed a different theme - nothing was broken, the
     * preference simply had no way to travel with the account. The stored
     * account value is therefore authoritative, and the local copy is a cache
     * that gets corrected on the first page load.
     *
     * A GUEST still gets their local preference: the sign-in screen has no user
     * to read from, and the person choosing a dark login page is the same
     * person who set it last time.
     */
    const local = readAppearance()
    const merged = fromServer
        ? ({ ...DEFAULTS, ...local, ...fromServer } as Appearance)
        : ({ ...DEFAULTS, ...local } as Appearance)

    const isFirstBoot = !appearanceBootstrapped
    const fingerprint = appearanceFingerprint(merged)

    state.value = merged
    appearanceBootstrapped = true

    // Write the reconciled value back so the pre-paint script agrees next time.
    if (fromServer) {
        writeInlineAppearance(merged)

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        } catch {
            // Private mode. The theme still applies this session.
        }
    }

    const win = panelAppearanceWindow()
    const prepaintDone = win?.__panelAppearanceApplied === true

    /*
     * Skip a DOM write when nothing changed:
     *  - First boot after Blade prepaint already painted the account theme.
     *  - Later Inertia visits whose shared appearance matches what is applied
     *    (avoids a remount flash after an admin live-edit).
     * Guests still call applyAppearance on first boot so a localStorage
     * preference can correct empty/default prepaint.
     */
    if (appliedFingerprint === fingerprint) {
        return
    }

    if (isFirstBoot && prepaintDone && fromServer) {
        appliedFingerprint = fingerprint

        try {
            const payload = appearancePayload(merged)

            localStorage.setItem(VARS_KEY, JSON.stringify(payload))
        } catch {
            // Private mode.
        }

        return
    }

    applyAppearance(merged)
}

/** Boot appearance from the server inline script or the initial Inertia payload. */
export function bootstrapAppearance(): void {
    initializeAppearance(readServerAppearance())
}

/**
 * Reconcile after an Inertia navigation (sign-in, portal switch).
 *
 * When `appearance` is null the visitor signed out: keep the local guest theme.
 */
export function syncAppearanceFromInertiaPage(page: { props?: Record<string, unknown> }): void {
    const appearance = page?.props?.appearance

    if (appearance === null || appearance === undefined) {
        return
    }

    if (typeof appearance !== 'object') {
        return
    }

    initializeAppearance(appearance as Partial<Appearance>)
}

/**
 * Persist a change to the account.
 *
 * Supplied by the app, because @alxtexh-enterprise/panel ships no HTTP client (§4). Set to
 * null for an unauthenticated page, where there is nobody to save against.
 */
let persist: ((patch: Partial<Appearance>) => void) | null = null

export function setAppearancePersister(fn: ((patch: Partial<Appearance>) => void) | null): void {
    persist = fn
}

/**
 * The organisation's colours - the DEFAULT accent, not an override of it.
 *
 * BOTH WANT `--primary`, so one has to win, and it should not be whichever
 * mounted later. The first version of this rule was "the brand always wins",
 * which is coherent right up until you look at the drawer: the Primary swatches
 * sit there, respond to a click, and change nothing. A control that does
 * nothing is worse than a colour somebody disagrees with.
 *
 * So the rule is DEFAULT-AND-OVERRIDE. While the accent is the shipped one, the
 * organisation's colour applies - a new colleague sees company branding without
 * touching anything. Pick any other swatch and that is a deliberate choice
 * about your own panel, so it wins.
 *
 * `slate` IS THEREFORE ALSO "USE THE COMPANY COLOUR", because it is the
 * default, and Reset returns to it. That is the way back to the brand, and it
 * is the one wrinkle in an otherwise invisible rule: somebody who genuinely
 * wants slate on a branded panel cannot have it.
 *
 * Nothing else the drawer controls - dark mode, density, font size, surfaces -
 * is affected either way.
 */
let tenantVars: Record<string, string> = {}

/**
 * IT RECORDS AND DOES NOT RE-APPLY, which is not a detail.
 *
 * The first version called `applyAppearance` here so the brand took effect
 * immediately. `useTenantTheme` calls this from inside a `watchEffect`, so that
 * turned a reactive effect into something that reached back into the state the
 * effect was watching - the panel mounted into a synchronous loop and rendered
 * a blank page, with no console error at all, because the thread never yielded.
 *
 * The caller writes the properties itself. This exists so that the NEXT
 * `applyAppearance` - somebody changing a colour in the drawer - does not undo
 * them.
 */
export function setTenantVars(vars: Record<string, string>): void {
    tenantVars = vars

    if (typeof document === 'undefined') {
        return
    }

    /*
     * READ FROM STORAGE, NOT FROM THE REACTIVE STATE. This is called from
     * inside `useTenantTheme`'s `watchEffect`, so touching `state` here would
     * make the effect depend on something it also causes to change. An earlier
     * version re-applied the whole appearance from this function and the panel
     * mounted into a synchronous loop: a blank page, and NO console error,
     * because the thread never yielded.
     */
    if (readAppearance().primaryChosen) {
        return
    }

    for (const [property, value] of Object.entries(vars)) {
        document.documentElement.style.setProperty(property, value)
    }
}

/**
 * Apply a preference to the document.
 *
 * Same path live drawer edits and post-login sync use: CSS vars on <html>,
 * rewrite `#pk-appearance`, refresh `window.__panelAppearance`, and cache the
 * payload for the next guest first paint. Inline setProperty beats later
 * app.css `:root` rules; the style node is the shared sheet Blade started.
 */
export function applyAppearance(next: Appearance): void {
    if (typeof document === 'undefined') {
        return
    }

    const root = document.documentElement
    const baseVars = appearanceVars(next)
    const vars = { ...baseVars, ...(next.primaryChosen ? {} : tenantVars) }
    const payload: AppearancePayload = {
        dark: isDark(next),
        theme: next.theme,
        vars,
        sidebar: next.sidebarSide,
        contentLayout: next.contentLayout,
    }

    root.classList.toggle('dark', payload.dark)

    for (const [property, value] of Object.entries(vars)) {
        root.style.setProperty(property, value)
    }

    root.dataset.sidebar = payload.sidebar
    root.dataset.contentLayout = payload.contentLayout

    writeAppearanceStyle(baseVars)
    writeInlineAppearance(next)
    appliedFingerprint = appearanceFingerprint(next)

    const win = panelAppearanceWindow()

    if (win) {
        win.__panelAppearanceApplied = true
    }

    try {
        // Cached so the pre-paint script can replay it without knowing the
        // palette - which is what removes the flash of default theme.
        // `theme` is cached alongside the computed values so the pre-paint
        // script can tell whether this browser's cache still agrees with the
        // account - without it, a theme changed elsewhere would be replayed
        // from a stale cache on every first paint.
        localStorage.setItem(VARS_KEY, JSON.stringify(payload))
    } catch {
        // Private mode. Only the flash-prevention is lost.
    }
}

export function useAppearance() {
    function apply(next: Appearance) {
        applyAppearance(next)
    }

    function set(patch: Partial<Appearance>) {
        /*
         * TOUCHING THE ACCENT IS WHAT MAKES IT A CHOICE. Recorded here rather
         * than in the drawer so every caller gets it - a swatch, a keyboard
         * shortcut, anything added later - and so the flag cannot drift from
         * the value it describes.
         */
        const chosen = patch.primary !== undefined ? { primaryChosen: true } : {}

        state.value = { ...state.value, ...patch, ...chosen }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
        } catch {
            // Private mode or quota. The preference still applies for this
            // session; only persistence is lost, which is not worth failing on.
        }

        // Instant: DOM + __panelAppearance + #pk-appearance before the PUT.
        // Inertia sync later skips when the fingerprint still matches.
        apply(state.value)

        // Local first, account second: the change is visible immediately and
        // the request is fire-and-forget. A failed save costs this browser
        // nothing and only means another browser will not see the change yet.
        // The flag travels with the value it describes, or a second browser
        // signs in and shows the company colour over a choice already made.
        persist?.({ ...patch, ...chosen })
    }

    function reset() {
        set({ ...DEFAULTS })
    }

    /*
     * Applied at APP BOOT by initializeAppearance(), not here.
     *
     * The load used to live in onMounted, so it only ran once a component
     * calling this composable mounted - and no such component exists on the
     * sign-in screen. A first mount still re-reads storage, in case another tab
     * changed it while this one was open.
     */
    onMounted(() => {
        if (appearanceBootstrapped || panelAppearanceWindow()?.__panelAppearanceApplied) {
            appearanceBootstrapped = true

            return
        }

        appearanceBootstrapped = true

        state.value = readAppearance()
        applyAppearance(state.value)
    })

    return {
        appearance: computed(() => state.value),
        set,
        reset,
        PRIMARY_COLORS,
        SURFACE_TINTS,
        FONT_SIZE_MIN,
        FONT_SIZE_MAX,
        RADIUS_OPTIONS,
    }
}

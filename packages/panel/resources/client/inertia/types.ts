import type { InertiaLinkProps } from '@inertiajs/vue3'
/**
 * Payload shapes the server sends that MORE THAN ONE component reads.
 *
 * Every other type in this package is declared in the single file that uses it,
 * which is right: a shape used once is documentation for that file and moving
 * it away costs a jump. This module is for the exception - `announcements`
 * arrives on `PanelDashboard` and is handed to `AnnouncementBanners`, so the
 * shape is spelled in two places, and two copies of a server payload drift in
 * the direction nothing catches. The server adds a field, one copy learns about
 * it, and the other keeps compiling.
 */

/**
 * A notice addressed to everybody in an organisation, as `Announcement::
 * toBanner()` serialises it.
 *
 * `display` IS THE AUTHOR'S CHOICE AND NOT A DETAIL. A toast is gone in
 * seconds, so anyone who was making coffee never saw it - right for "the new
 * export format is live" and wrong for "billing is down".
 */
export interface Announcement {
    id: number
    title: string
    body: string | null
    severity: 'info' | 'success' | 'warning' | 'danger'
    display: 'banner' | 'toast'
    actionLabel: string | null
    actionUrl: string | null
}

/**
 * A navigation entry, as the moved shell components consume it.
 *
 * FROM THE REFERENCE APP's `@/types`. `href` is loose because Inertia accepts a
 * string or a route object and the shell normalises with `toUrl`; `icon` is a
 * component rather than a name because these components render it directly.
 */
export interface NavItem {
    title: string
    /*
     * INERTIA'S OWN TYPE, not `string`. A link may be a route object with a
     * method, which is what `Link` accepts and what the demo's helpers return -
     * widening it to `unknown` made every `<Link :href>` in the moved shell fail
     * to type-check, and narrowing it to `string` would refuse the objects the
     * reference app actually passes.
     */
    href: NonNullable<InertiaLinkProps['href']>
    icon?: unknown
    isActive?: boolean
    items?: NavItem[]
    group?: string | null
    badge?: string | number | null
    /** True when the destination owns the whole document, outside Inertia. */
    external?: boolean
}

/** The signed-in person, as the account menu and avatar read them. */
export interface User {
    id?: number | string
    name?: string
    email?: string
    avatar?: string | null
}

/** A crumb in the trail the shell's headers draw. */
export interface BreadcrumbItem {
    title: string
    href?: NonNullable<InertiaLinkProps['href']>
}

/**
 * A registered passkey, as the account's security screen lists it.
 *
 * THE "diff" FIELDS ARE FORMATTED SERVER-SIDE and deliberately so: "3 days ago"
 * depends on a timezone the browser guesses and the account already declared.
 */
export type Passkey = {
    id: number
    name: string
    authenticator: string | null
    created_at_diff: string
    last_used_at_diff: string | null
}

/** The wording on the two-factor card, which an installation may rewrite. */
export type TwoFactorConfigContent = {
    title: string
    description: string
    buttonText: string
}

import { usePage } from '@inertiajs/vue3'
import { HelpCircle, House, MessageCircleQuestion, Sparkles } from '@lucide/vue'
import { computed } from 'vue'
import type { NavItem } from '../types'
import { resolvePanelIcon } from './panelIcons'

/**
 * The navigation model, shared by the vertical sidebar and the horizontal bar.
 *
 * EXTRACTED BECAUSE THERE ARE NOW THREE LAYOUTS SHOWING THE SAME MENU. Left,
 * right and top are three renderings of one structure; duplicating the
 * group-building into each is how a resource ends up visible in two layouts and
 * missing from the third, with nothing failing.
 *
 * NOTHING IS DECLARED HERE ANY MORE. Both halves of the menu arrive as shared
 * props: `panelNav` from the resource registry, `panelPages` from
 * `App\Panel\Pages`. Everything that is not a resource used to be a hardcoded
 * array in this file, and that is exactly how finished screens - backups, logs,
 * the connections workspace - ended up reachable from nowhere, silently, with
 * their own tests still green. Moving the declaration to the server put it
 * somewhere `NavigationCoverageTest` can see it, which is the entire point.
 *
 * Resources are permission-filtered server-side, so one the user may not open
 * never reaches the client at all - the client never decides who sees what.
 * Declared pages carry no ability, because the guarded screens are reached from
 * the account menu instead and are deliberately not repeated here. Operations
 * (Backups, Logs, Monitoring) arrive in `panelPages` under the Operations group
 * when the panel offers them. Settings arrives under the Settings group by
 * default (`Panel::sidebarSettings()`); opt out with `->sidebarSettings(false)`.
 */

interface NavPayload {
    title: string
    href: string
    icon: string
    group: string | null
}

export interface NavGroup {
    name: string
    items: NavItem[]
    /**
     * A group NESTED inside this one - a dropdown under a heading rather than
     * beside it. ONE LEVEL, not arbitrary depth: a resource declares it by
     * putting a `/` in its `group` string (`'Screens/Errors'`), and only the
     * first `/` is ever split. A second-level group asking for a third would
     * just extend its own name rather than nest again - the reference shape
     * this follows (a plain section containing dropdowns, never a dropdown
     * containing dropdowns) does not need more than that.
     */
    groups: NavGroup[]
    /**
     * Whether the group renders as a dropdown at all.
     *
     * `false` makes it a plain, always-open SECTION - heading, items, no
     * chevron, no open/closed state. Declared server-side in
     * `panel.navigation.static_groups`, because which groups earn permanence
     * is the installation's call, not the component's. Absent means `true`,
     * which is the behaviour every group has always had.
     *
     * MATCHED BY THE FULL PATH for a nested group - `'Screens/Errors'`, not
     * `'Errors'` alone - so two different sections can each nest a group with
     * the same short name without one's static declaration leaking into the
     * other's.
     */
    collapsible: boolean
}

export function usePanelNav() {
    const page = usePage()

    const nav = computed(() => {
        const resources = (page.props.panelNav as NavPayload[] | undefined) ?? []
        const pages = (page.props.panelPages as NavPayload[] | undefined) ?? []

        const ungrouped: NavItem[] = []

        /*
         * A Map, so insertion order is the order groups appear.
         *
         * Resources go in first and therefore set the running order; a page
         * declaring an existing group name JOINS it rather than opening a
         * second heading with the same words. That is what puts Connections
         * under the Network heading the Routers resource already created,
         * instead of splitting one subject across two places in the column.
         *
         * ONE ENTRY PER TOP-LEVEL SECTION, holding both its OWN items and a
         * second map for whatever is nested under it - see `NavGroup.groups`.
         */
        /*
         * NAMED, because the `??` fallback below builds one of these as a bare
         * literal and a contextual type does not reach through `??` into it:
         * `new Map()` there infers `Map<never, never>`, and the first `.set()`
         * is then an error against `never`. Annotating the variable is what
         * gives the literal a type to satisfy.
         */
        type Section = { items: NavItem[]; subgroups: Map<string, NavItem[]> }

        const grouped = new Map<string, Section>()

        const add = (item: NavPayload) => {
            const entry: NavItem = {
                title: item.title,
                href: item.href,
                icon: resolvePanelIcon(item.icon),
            }

            // Ungrouped resources stay at the top level rather than landing in a
            // catch-all "Other": a group of one is noise.
            if (!item.group) {
                ungrouped.push(entry)

                return
            }

            /*
             * ONLY THE FIRST `/` SPLITS. `'Screens/Errors'` nests "Errors"
             * under "Screens"; a group whose own name happens to contain a
             * second `/` is not asking for a third level, so `split('/', 2)`
             * - not an unbounded split - is what keeps that from silently
             * producing one.
             */
            const [sectionName, subName] = item.group.split('/', 2)
            const section: Section = grouped.get(sectionName) ?? {
                items: [],
                subgroups: new Map<string, NavItem[]>(),
            }

            if (subName) {
                section.subgroups.set(subName, [...(section.subgroups.get(subName) ?? []), entry])
            } else {
                section.items.push(entry)
            }

            grouped.set(sectionName, section)
        }

        resources.forEach(add)
        pages.forEach(add)

        return {
            primary: [
                /*
                 * THE PANEL'S OWN HOME, not a fixed path. `/` is the admin
                 * panel's root and `/platform` is the platform portal's - a
                 * hardcoded href sends every portal's Home link to whichever
                 * panel happens to be mounted at the root, which is somebody
                 * else's screen and may refuse.
                 */
                {
                    title: 'Dashboard',
                    href: (page.props.panel as { home?: string } | undefined)?.home ?? '/',
                    icon: House,
                },
                ...ungrouped,
            ] as NavItem[],
            groups: (() => {
                /*
                 * The server names which groups are permanent sections; a name
                 * it does not mention keeps the collapsible behaviour. Matched
                 * by the same group string the items declare, so a typo in the
                 * config produces a group that still collapses rather than one
                 * that errors - visible on the first look, harmless until then.
                 */
                const statics = new Set(
                    (page.props.panelStaticGroups as string[] | undefined) ?? [],
                )

                return [...grouped.entries()].map(([name, { items, subgroups }]): NavGroup => ({
                    name,
                    items,
                    collapsible: !statics.has(name),
                    groups: [...subgroups.entries()].map(([subName, subItems]): NavGroup => ({
                        name: subName,
                        items: subItems,
                        groups: [],
                        // Matched on the FULL PATH - see the type's own note.
                        collapsible: !statics.has(`${name}/${subName}`),
                    })),
                }))
            })(),
        }
    })

    /**
     * In-panel content pages. Static, because they are not resources.
     *
     * These occupy the sidebar footer, which previously held links out to the
     * starter kit's GitHub repository and the Laravel docs. Those were
     * scaffolding: they leave the panel entirely, and an operator has no use for
     * either. The footer is prime real estate - permanently visible, never
     * scrolled away - so it should hold the panel's own help, not somebody
     * else's.
     *
     * They stay client-side because the footer is a FIXED set of four, not a
     * list anything appends to; `Pages::intentionallyUnlinked()` records that
     * they are reached from here, so the coverage test still accounts for them.
     */
    const supportItems = computed<NavItem[]>(() => [
        { title: 'Help', href: '/help', icon: HelpCircle },
        { title: 'FAQ', href: '/faq', icon: MessageCircleQuestion },
        { title: "What's new", href: '/whats-new', icon: Sparkles },
    ])

    return { nav, supportItems }
}

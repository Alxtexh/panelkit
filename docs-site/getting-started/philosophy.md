# Philosophy

A handful of decisions run through every part of PanelKit. Knowing them makes
the rest of the framework predictable instead of memorized.

## Definitions describe; they do not query

`table()` and `form()` build a cached *description* of a screen — which
columns, which fields, which validation rules. Nothing in that description
runs a database query while it is being built. A query only runs once a
request actually asks for a row, and it runs scoped to *that* request's tenant
and user.

This matters because a definition method is evaluated once and its result can
be cached and served to any user. An option list that comes from the database
has to be a closure (`SelectFilter::options(fn () => …)`), not an eagerly
computed array — otherwise the first request to build the cache bakes its own
tenant's data into every other tenant's screen.

## Page-first CRUD, not a component tree

Create, edit, view and attach are dedicated routes, rendered as separate
Inertia pages — never a Livewire modal, never `window.confirm`. A screen is
either a real URL you can bookmark, refresh, and link to, or it isn't a
PanelKit screen. This is a deliberate rejection of the Livewire/Alpine modal
pattern Filament uses for the same operations.

## Fail closed, always

A resource with no policy registered is invisible to everyone. That looks
identical to a bug from the outside — an empty list where you expected rows —
but it is the safe default: PanelKit would rather show nothing than guess who
should see something. The same posture holds for tenancy: a null tenant is
a deny, never "all tenants," and `panel:doctor` is built to surface exactly
this class of silent failure before it reaches a user.

## Semantic values, not markup

A column or field emits an icon *name*, a colour *intent* (`success`,
`danger`), or a count — never a CSS class or a component reference. The Vue
client decides what an intent looks like. This keeps a resource definition
portable across a theme change, and it's why you configure appearance in one
place (design tokens) rather than in every resource that happens to use a
badge.

## Generated over hand-maintained

Two things in a PanelKit application are generated from the live application
rather than hand-written: the navigation ability names (derived from a
resource's key), and the `AGENTS.md` file every install writes (built by
reading the actual registered resources, panels and commands). Both would
drift if hand-maintained; both are guaranteed accurate because they're a
by-product of introspecting code that already has to be correct for the app
to run.

## Domain-neutral

Nothing shipped assumes an industry. A fresh install has no sample orders, no
seeded revenue chart, no copy referencing a specific business. The framework
is exercised in this repository by an ISP back-office demo application, but
that demo is a *fixture*, not the product's default shape.

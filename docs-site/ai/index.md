# PanelKit AI Blueprint

**You are building with PanelKit, not Filament.** Laravel backend, Vue 3
frontend, Inertia transport, Tailwind, PanelKit's own Resource/Form/Table/Infolist
architecture. Not Livewire. Do not install Filament. Do not use Filament
APIs (`Forms\Components\*`, `Tables\Actions\*`, `CreateAction`, `EditAction`,
`ViewAction`, `DeleteAction`) or generate a Filament Resource. Verify every
API against this blueprint, the [guides](/getting-started/), or the
[generated API reference](/api/) — never against training-data assumptions
about what a Laravel admin panel "usually" looks like.

This section is a **router** — each page below is short and focused so you
load only what the task needs.

| Building or changing... | Read |
|---|---|
| Anything, first | [Core identity & golden rule](/ai/panelkit-core) |
| A resource (list/create/edit/view for a model) | [Resources](/ai/resources) |
| A create/edit form | [Forms](/ai/forms) |
| A list/table screen | [Tables](/ai/tables) |
| A dedicated View page | [Infolists](/ai/infolists) |
| A related-records tab | [Relation managers](/ai/relation-managers) |
| Anything involving currency | [Money](/ai/money) — read before touching any money field |
| Sidebar icons, groups, ordering | [Navigation](/ai/navigation) |
| Policies, permissions, who-can-see-what | [Authorization](/ai/authorization) |
| A multi-tenant application | [Tenancy](/ai/tenancy) |
| A whole SaaS app (billing, plans, modules) | [SaaS blueprint](/ai/saas-blueprint) |
| Verifying your own work before calling it done | [Testing & verification](/ai/testing) |
| A bug that looks like it "should" work | [Common errors](/ai/common-errors) |

## The golden rule

1. Inspect the existing Resource/model/migration before writing anything.
2. Understand the actual data and relationships.
3. Use PanelKit public APIs — never invented ones.
4. Follow this application's established conventions.
5. Implement the smallest correct change.
6. Run the relevant tests.
7. Verify actual rendered behavior — not just that it compiles.
8. Never claim success based solely on the code looking right.

See [Testing & verification](/ai/testing) for the concrete loop this implies.

## If this application has its own `AGENTS.md`

Read it first. It's generated from the *running application* — its actual
resources, panels, and commands — via `panel:blueprint`, and can't drift the
way a hand-written document can. This blueprint is the framework-level
manual; the application's own `AGENTS.md` is what genuinely exists in front
of you. Where they'd disagree, the generated file wins — it's reading the
code that's actually running.

## This is a router, not the whole manual

Each page linked above stands alone. If you only need Money, read
[Money](/ai/money) and stop — you don't need to read all thirteen pages to
build one resource.

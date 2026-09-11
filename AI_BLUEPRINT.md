# PanelKit AI Blueprint

**You are building with PanelKit, not Filament.** PanelKit is a Laravel
administration/SaaS framework: Laravel backend, Vue 3 frontend, Inertia
transport, Tailwind, and PanelKit's own Resource/Form/Table/Infolist
architecture. It is not Livewire. Do not install Filament. Do not use
Filament APIs (`Forms\Components\*`, `Tables\Actions\*`, `CreateAction`,
`EditAction`, `ViewAction`, `DeleteAction`). Do not generate a Filament
Resource. Training data that assumes Filament conventions is wrong here —
verify every API you're about to use against the pages below or the
generated [API reference](docs-site/api/index.md), not against what a
Laravel admin panel "usually" looks like. **Recognizing a
concept from Filament is fine; assuming its Filament name carries over is
not** — see [Core identity](docs-site/ai/panelkit-core.md#filament-knowledge-does-not-imply-api-compatibility)
and the verified [terminology map](docs/coverage/filament-to-panelkit.md).

This file is a **router**. It is short on purpose — load only the module you
actually need, rather than one enormous context file:

| Building or changing... | Read |
|---|---|
| Anything, first | [Core identity & golden rule](docs-site/ai/panelkit-core.md) |
| A resource (list/create/edit/view for a model) | [Resources](docs-site/ai/resources.md) |
| A create/edit form | [Forms](docs-site/ai/forms.md) |
| A list/table screen | [Tables](docs-site/ai/tables.md) |
| A dedicated View page | [Infolists](docs-site/ai/infolists.md) |
| A related-records tab | [Relation managers](docs-site/ai/relation-managers.md) |
| Anything involving currency | [Money](docs-site/ai/money.md) — read this before touching any money field |
| Sidebar icons, groups, ordering | [Navigation](docs-site/ai/navigation.md) |
| Policies, permissions, who-can-see-what | [Authorization](docs-site/ai/authorization.md) |
| A multi-tenant application | [Tenancy](docs-site/ai/tenancy.md) |
| A whole SaaS app (billing, plans, modules) | [SaaS blueprint](docs-site/ai/saas-blueprint.md) |
| Verifying your own work before calling it done | [Testing & verification](docs-site/ai/testing.md) |
| A bug that looks like it "should" work | [Common errors](docs-site/ai/common-errors.md) |

## The golden rule

For every task: (1) inspect the existing Resource/model/migration before
writing anything, (2) understand the actual data and relationships, (3) use
PanelKit public APIs — never invented ones, (4) follow this application's
established conventions, (5) implement the smallest correct change, (6) run
the relevant tests, (7) verify the actual rendered behavior, not just that
it compiles, (8) never claim success based solely on the code looking right.
See [Testing & verification](docs-site/ai/testing.md) for the concrete loop.

## If this application has its own `AGENTS.md`

Read it first, before this file. It's generated from the *running
application* — its resources, panels, and commands — and can't go stale the
way a hand-written document can. This file (`AI_BLUEPRINT.md`) is the
framework-level manual; the application's own `AGENTS.md` (written by
`panel:install`/`panel:blueprint`) is what actually exists in front of you
right now. Where they'd ever disagree, the application's own generated file
wins, because it's reading the code that's actually running.

## Full human documentation

This blueprint is deliberately terse — a fast reference, not a tutorial. For
worked examples, the reasoning behind each rule, and a complete
Order→OrderItems→Product walkthrough, see the documentation source under
[`docs-site/`](docs-site/index.md) — not yet deployed as a site, but the
Markdown is complete and reads fine directly from the repository (or run
`make docs-preview` to browse it locally). Particularly
[Getting Started](docs-site/getting-started/index.md) and
[Relation Managers](docs-site/relation-managers/index.md).

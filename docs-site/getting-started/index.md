# What is PanelKit?

PanelKit is a schema-driven administration framework for Laravel. You describe
a screen — a list, a form, a detail view — as a single PHP class. The panel
turns that description into a route, a navigation entry, a set of permission
abilities, and an Inertia page rendered by a Vue kit. Nothing about the screen
is registered by hand anywhere else.

It targets the same territory as FilamentPHP — a full admin/SaaS back office
on top of Laravel — but with a different stack and a different set of
conventions:

| | PanelKit |
|---|---|
| Backend | Laravel |
| Frontend transport | **Inertia**, not Livewire |
| Frontend rendering | **Vue 3**, not Blade/Alpine components |
| CRUD screens | **Dedicated pages** (list, create, edit, view are separate routes) |
| State management | Server-rendered props per request, not a persistent Livewire component tree |

If you already know Filament, most of PanelKit's *shape* will feel familiar —
resources, tables, forms, actions, filters, policies — but the class and
property names are frequently different, and some Filament patterns (dot-notation
relationship access in infolists, Livewire action modals) do not exist here at
all. See [15-filament-gaps.md](https://github.com/Alxtexh/panelkit/blob/main/docs/15-filament-gaps.md)
in the repository for an explicit list, and the [AI Blueprint](/ai/) if you are
generating PanelKit code with an AI agent that has Filament in its training
data.

## What ships in the box

- **Resources** — the class that declares a model's table, form, and (optionally)
  infolist, lifecycle hooks, and navigation identity.
- **Two RelationManager shapes** — a read-only child list, or a full
  resource-backed child CRUD with its own routes and policy. See
  [Relation Managers](/relation-managers/).
- **Pages** — non-resource screens (dashboards, settings, custom tools) that
  still get routing, navigation and permissions for free.
- **Authorization** — deny-by-default policies, tenant scoping, and generated
  ability names per resource.
- **A design system** — tokens, density settings, and a Vue component kit, so
  every resource looks like part of one application instead of accumulating
  its own bespoke CSS.
- **Money, badges, dates** as first-class column/field/entry types with a
  single shared storage convention — see the [money guide](/money/).
- **Generated AI guidance** — every install writes an `AGENTS.md` reflecting
  the *running application's* resources, panels and commands, so an AI coding
  agent doesn't have to guess.

## What does not ship

PanelKit is domain-neutral. A fresh install is chrome and an empty canvas —
no sample orders, no sample revenue widgets, no industry-specific copy. If you
see an ISP back office when browsing this project's own repository
(`apps/playground`), that is one demo application built *on* PanelKit, not the
framework's default shape.

Continue to [Installation](/getting-started/installation) or jump straight to
[Your first resource](/getting-started/first-resource).

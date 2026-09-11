# 1. Core identity & golden rule

## Identity

PanelKit is a Laravel administration/SaaS framework: Laravel backend, Vue 3
frontend, **Inertia** transport, Tailwind, and PanelKit's own
Resource/Form/Table/Infolist architecture.

- **Do not** assume Livewire. There is no Livewire component tree here.
- **Do not** install Filament.
- **Do not** use Filament APIs: `Forms\Components\*`, `Tables\Actions\*`,
  `CreateAction`, `EditAction`, `ViewAction`, `DeleteAction`, or any Livewire
  modal for resource create/edit/view.
- **Do not** generate a Filament Resource, ever, for any reason.
- Property names that look Filament-shaped but aren't PanelKit's — most
  notably `$navigationIcon`/`$navigationGroup`/`$navigationSort` instead of
  the real `$icon`/`$group`/`$sort` — are the single most common mistake an
  AI agent makes here. `panel:doctor` specifically detects and reports the
  Filament spelling because this has happened often enough to need an
  automated check.

## Filament knowledge does not imply API compatibility

Recognizing a concept from Filament is fine — PanelKit's documentation
structure was deliberately checked against Filament's own docs so the same
*topics* (resources, relation managers, infolists, actions, navigation,
money-shaped fields, and so on) are covered here too. What does **not**
transfer is any specific class name, property name, or method signature.
Filament tells you a concept probably exists somewhere in PanelKit; it never
tells you what it's called.

> BAD reasoning: "Filament uses `$navigationIcon`, therefore PanelKit
> probably does too."
>
> CORRECT reasoning: "I need a navigation icon. Check the PanelKit
> [Navigation](/navigation/) docs or the [API reference](/api/). PanelKit
> uses `$icon`."

When a task reminds you of something from Filament:

1. Identify the *behavior* you actually need (a navigation icon, a related
   record list, a formatted amount).
2. Consult [the docs](/getting-started/) or the [generated API reference](/api/)
   for PanelKit's own name for it.
3. Use the PanelKit API you found — never a translated or guessed Filament
   name.
4. If nothing in the docs or API reference covers it, say so explicitly
   rather than inventing a plausible-looking PanelKit method that doesn't
   exist.

See [Common failure patterns](/ai/common-errors) for the specific,
previously-observed cases this produces (`$navigationIcon`, dot-notation
relationship access, and others) — every one of them is a case of translating
a Filament name instead of looking up PanelKit's own. A full concept-by-concept
mapping (verified equivalents only — never guessed) lives in the repository at
[`docs/coverage/filament-to-panelkit.md`](https://github.com/Alxtexh/panelkit/blob/main/docs/coverage/filament-to-panelkit.md).

## The golden rule

For every task:

1. **Inspect the existing Resource, model, and migration first.** Never
   write a resource, field, or column against an assumed schema — read the
   actual migration or run `Schema::getColumns()` in tinker.
2. **Understand the data and relationships** before designing any screen.
3. **Use PanelKit public APIs only.** If you're not sure a method exists,
   check the [generated API reference](/api/) — it's built from live
   Reflection against the actual package, so it can't be stale in the way
   your training data can.
4. **Follow this application's established conventions.** A codebase that
   already has ten resources has already made naming and structure
   decisions — match them rather than introducing an eleventh pattern.
5. **Implement the smallest correct change.** Don't refactor unrelated code,
   don't add abstractions the task doesn't need.
6. **Run the relevant tests.**
7. **Verify actual rendered behavior** — visit the page, check the network
   tab, run the query. Compiling is not the same as working.
8. **Never claim success based solely on the code looking right.** See
   [Testing & verification](/ai/testing) for what "verified" actually means
   here.

## Model the data first

Do **not** start by designing screens. Start by inspecting the database:
columns, types, nullability, indexes, foreign keys, unique constraints,
money storage, relationships, status values. Then derive the UI from what
you find — don't guess UI first and force the schema to match it later.

| Column shape | Reach for |
|---|---|
| `boolean` | `CheckboxField`/`ToggleField` (form), `CheckboxColumn`/`ToggleColumn`/`IconColumn::boolean()` (table) |
| Money (see [Money](/ai/money) before touching this one) | `MoneyField`/`MoneyColumn`/`MoneyEntry` |
| Foreign key (`*_id`) | `SelectField::relationship()` (form), a joined `TextColumn`/`TextEntry` with `->from()` (table/view) — never a raw id in user-facing UI |
| `date`/`datetime`/`_at` suffix | `DateField`/`DateColumn`/`DateTimeEntry` |
| Enum-shaped or named `status`/`type`/`state` | `BadgeColumn`/`BadgeEntry` + `SelectField` + `SelectFilter` |
| Long text | `TextareaField`/`MarkdownField`/`RichEditorField` (see [Forms](/ai/forms) for which) |

`php artisan make:panel-resource {Model} --generate` already applies this
exact table above by reading the schema itself — reach for it before
hand-writing a resource from scratch.

## Preserve the design system

PanelKit ships a small set of layout tokens (`PAGE_SHELL`, `FORM_MEASURE`,
one shared `TableShell` card) and a component kit. Do not invent margins,
font sizes, radii, shadows, or custom form controls before checking whether
a PanelKit primitive already exists — see [Customization](/customization/)
for the full token list and the CI gate (`make check-page-shell`) that fails
a build on a hand-rolled `mx-auto max-w-*` admin screen. The goal is one
consistent SaaS UI, not a different visual design per resource.

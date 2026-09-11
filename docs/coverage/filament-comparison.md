# PanelKit vs. Filament documentation coverage

**Purpose.** This is a coverage checklist, not a specification. Filament is a
mature Laravel administration framework with mature documentation; its
navigation structure was used to check whether PanelKit's own documentation
had forgotten a topic area, not to make PanelKit imitate Filament's design.
**PanelKit's own source code remains the sole authority for PanelKit's
behavior.** Where a row below says "PanelKit does not support this," that is
a factual note for product planning, not an action item — this comparison
does not authorize adding a feature to PanelKit merely because Filament has
it.

- **Filament version compared:** v5.x (v5.7.8, Livewire v4-compatible; v5
  shipped 2026-01-16, is described by the Filament team as a Livewire-version
  bump rather than a feature overhaul over v4)
- **Filament docs base URL:** https://filamentphp.com/docs/5.x/
- **Comparison performed:** 2026-09-11
- **PanelKit version:** 1.5.0 (this comparison was performed against `main`
  at the same commit as that release)

Every Filament documentation area below is classified into exactly one of:

| Code | Meaning |
|---|---|
| **A** | PanelKit has an equivalent — documented |
| **B** | PanelKit has a different solution — documented, with the conceptual difference called out |
| **C** | Laravel or an external package's responsibility — documented as a boundary |
| **D** | Not currently supported by PanelKit — recorded, not implemented as a result of this comparison |
| **E** | Not applicable — Filament's Livewire/server-driven architecture doesn't have a PanelKit/Vue+Inertia equivalent to compare |
| **Gap→Fixed** | A real PanelKit capability existed but had no documentation before this comparison; a guide was added as part of this task |
| **Investigate** | Genuinely unverified — PanelKit may or may not have an equivalent; recorded honestly rather than guessed, pending a source-verification pass this task didn't have budget to complete |

---

## 1. Top-level section matrix

| Filament section | Filament docs it? | PanelKit equivalent? | PanelKit docs exist? | Class | Notes |
|---|---|---|---|---|---|
| Introduction / Installation | Yes | Yes | Yes | A | [Getting Started](../../docs-site/getting-started/) |
| AI-assisted development | Yes (new in v5, their "Blueprint" tool) | Yes | Yes | A | PanelKit's [AI Blueprint](../../AI_BLUEPRINT.md) predates and is broader in scope (18 sections vs. a scaffolding tool) |
| Version support policy | Yes, dedicated page | No dedicated page | D→Investigate | Investigate | PanelKit has an active semver-ish tagging history (see `CHANGELOG.md`) but no published support-window policy page. Worth adding if PanelKit gains multiple maintained major versions; not urgent at v1.x. |
| Contributing | Yes, dedicated page | Not part of this docs site | N/A | E | Contribution process is a repository/community-governance concern, out of scope for a technical documentation site; no claim either way. |
| Resources (CRUD basics) | Yes | Yes | Yes | A | [Resources](../../docs-site/resources/) |
| Managing relationships | Yes | Yes, two mechanisms | Yes | B | Filament has one "relation manager" concept; PanelKit deliberately splits this into [Relation Managers](../../docs-site/relation-managers/) (simple vs. resource-backed) and [Nested resources](../../docs-site/resources/nested-resources) as a third, distinct mechanism — see the [terminology map](filament-to-panelkit.md) |
| Nested resources | Yes | Yes | Yes | A | [Nested resources](../../docs-site/resources/nested-resources) |
| Singular resources | Yes | Yes | **Gap→Fixed** | A | `SingularResource` existed, undocumented as a standalone guide until this comparison; added [Singular resources](../../docs-site/resources/singular-resources) |
| Global search | Yes | Yes | **Gap→Fixed** | A | `Resource::searchWeight()`/`searchSort()`/`modifySearchQuery()` etc. existed, undocumented; added [Global search](../../docs-site/resources/global-search) |
| Using widgets on resource pages | Yes | Yes | Yes | A | Covered in [Resources — Beyond the basics](../../docs-site/resources/#beyond-the-basics) and [Extending — Custom pages](../../docs-site/extending/custom-pages) (`headerWidgets()`/`footerWidgets()`) |
| Custom resource pages | Yes (extra pages scoped to one resource) | Investigate | Investigate | Investigate | PanelKit's `Page` system and `make:panel-page` are confirmed; a page scoped specifically *under* one resource's own navigation (distinct from a top-level custom `Page`) was not independently verified in this pass. |
| Code quality tips | Yes, a dedicated meta page | No dedicated page | D | D | PanelKit's authoring conventions are threaded through [Resources](../../docs-site/resources/), [Philosophy](../../docs-site/getting-started/philosophy), and the [AI Blueprint](../../AI_BLUEPRINT.md) rather than one consolidated "tips" page. Low priority to consolidate. |
| Tables — overview/columns/filters | Yes | Yes | Yes | A | [Tables](../../docs-site/tables/) — see component matrix below; PanelKit's column catalogue is larger than Filament's current v5 list |
| Table actions | Yes | Yes | Yes | A | [Actions](../../docs-site/actions/) |
| Table layout (responsive column stacking) | Yes | Investigate | Investigate | Investigate | Not independently verified whether `Table` has a documented responsive-stacking layout mode distinct from ordinary column visibility toggling. |
| Table summaries | Yes | Yes | Yes | A | `Summarizer` — mentioned in [Tables](../../docs-site/tables/#column-types) footer-aggregate note; see [API reference](../../docs-site/api/classes/summarizer) |
| Table grouping rows | Yes | Yes | Yes | A | `Grouping\Group`, `Table::groupBy()` — see [API reference](../../docs-site/api/classes/group) (not yet in a prose guide beyond the API page — **Supported but under-documented**) |
| Table empty state | Yes, customizable | Comes with the table, customization unverified | Investigate | Investigate | [Tables](../../docs-site/tables/) states the empty state "comes with the table," but per-resource customization of its copy/action was not independently verified. |
| Table custom data (non-Eloquent source) | Yes | Yes | **Gap, noted not fixed** | A | `DataProvider` interface exists (`Alxtexh\Panel\Tables\DataProvider`) for a non-Eloquent table source — confirmed in source, not yet documented in a guide. Recorded here as **supported but under-documented**; not written up in this pass due to thin verified detail on its exact contract beyond the interface signature. |
| Schemas (Section/Tabs/Wizard/Grid/Callout/…) | Yes, unified layer | Yes | Yes | A | [Forms — Layout primitives](../../docs-site/forms/#layout-primitives) |
| Schemas — "Prime" static components (Text/Icon/Image/List as layout, not fields) | Yes | Investigate | Investigate | Investigate | Not verified whether PanelKit's `Schema` namespace has an equivalent to a purely-decorative static text/image/list node inside a form layout. |
| Forms — field types | Yes | Yes | Yes | A | [Forms](../../docs-site/forms/) — see component matrix below; PanelKit's 34-field catalogue is larger |
| Forms — validation | Yes | Yes | Yes | A | [Validation](../../docs-site/forms/validation) |
| Forms — custom fields | Yes | Yes | Yes | A | [Custom fields](../../docs-site/forms/custom-fields) |
| Reactive/dependent fields (`live()`, `$get()`/`$set()`) | Yes | Yes, different mechanism | Yes | B | PanelKit's `Field::live()` + `afterStateUpdated()` achieve the same reactive-dependency outcome over an Inertia round-trip rather than a Livewire one — see [Forms — Live fields](../../docs-site/forms/#live-fields) |
| Infolists — entry types | Yes | Yes | Yes | A | [Infolists](../../docs-site/infolists/) — see component matrix below |
| Infolists — custom entries | Yes | Yes | Yes | A | [Extending — Custom columns & entries](../../docs-site/extending/custom-columns-and-entries) |
| Actions — generic patterns, modals, grouping | Yes | Yes | Yes | A | [Actions](../../docs-site/actions/) |
| Actions — prebuilt Create/Edit/View/Delete | Yes, dedicated action classes | Yes, different mechanism | Yes | B | PanelKit generates these as real routed pages from a `Resource`, not as attachable action objects — see [Creating resources](../../docs-site/resources/) |
| Actions — Replicate | Yes | Yes | Yes | A | [`ReplicateAction`](../../docs-site/api/classes/replicate-action) |
| Actions — Force-delete / Restore | Yes, dedicated action classes | Different solution | Investigate | B/Investigate | PanelKit has `TrashedFilter` for viewing soft-deleted rows; a dedicated Force-delete/Restore *action* class was not independently confirmed to exist as such — likely expressed via `RecordAction::mutate()`/`handle()` instead, but not verified. |
| Actions — Import | Yes | Optional external package | Yes | C | `Resource::importable()` is core; the concrete importer classes live in the optional `alxtexh-enterprise/panel-operations` package — see [AI Blueprint — SaaS blueprint](../../docs-site/ai/saas-blueprint) |
| Actions — Export | Yes | Optional external package | Yes | C | Same package boundary as Import |
| Notifications — flash/toast + actions | Yes | Yes | Yes | A | [`Notification`](../../docs-site/api/classes/notification) |
| Notifications — database (persistent, bell) | Yes | Yes | Yes | A | Laravel's own `->notify()` + `BellText`, see [AI Blueprint — Testing](../../docs-site/ai/testing) and the notification/alert distinction in source |
| Notifications — broadcast (real-time push) | Yes | Investigate | Investigate | Investigate | PanelKit documents real-time **dashboard widget** updates via Reverb/Echo ([Deployment](../../docs-site/deployment/#live-updates-poll-or-push-pick-one-per-widget)); whether the notification bell itself has a broadcast channel (vs. only polling on next request) was not independently verified. |
| Widgets — stats/chart/table | Yes | Yes | Yes | A | [Customization](../../docs-site/customization/) references; full catalogue in [API reference](../../docs-site/api/all) (`StatWidget`, `ChartWidget` with **24** chart types, `TableWidget`) |
| Widgets — fully custom | Yes (any Livewire component) | Yes, different mechanism | Yes | B | A custom Vue component registered via the kit's extension points — see [Vue extension points](../../docs-site/extending/vue-extension-points) |
| Panel configuration — path/domain/guard/middleware | Yes | Yes | Yes | A | [Authentication](../../docs-site/authentication/) + `Panel` [API reference](../../docs-site/api/classes/panel) |
| Panel configuration — DB transaction wrapping | Yes | Yes | **Gap, noted not fixed** | A | `Panel::databaseTransactions()` confirmed in source, not yet in a prose guide — **supported but under-documented** |
| Panel configuration — SPA mode / prefetch | Yes (`wire:navigate`) | Yes, different mechanism | Yes | B | Inertia is inherently SPA-transport; hover-prefetch documented in [Deployment](../../docs-site/deployment/#navigation-feel-inertia-hops) — no page-by-page "SPA mode toggle" needed since it's not a Livewire app to begin with |
| Panel configuration — unsaved-changes alerts | Yes | Yes | **Gap, noted not fixed** | A | Confirmed present via recent commit history (a bottom-bar "leave without saving" prompt); not yet described in a guide — **supported but under-documented** |
| Panel configuration — strict authorization mode | Yes (fails loudly if a check is missing) | Investigate | Investigate | Investigate | PanelKit's `Resource::can()` already denies-and-logs when no policy is registered (see [Authorization](../../docs-site/authorization/#deny-by-default)), which achieves a similar "fail loud, not open" outcome by a different mechanism — but an explicit opt-in "strict mode" toggle equivalent to Filament's was not verified to exist. |
| Panel configuration — custom asset registration | Yes | Investigate | Investigate | Investigate | Not independently verified. |
| Navigation — icon/group/sort | Yes (different property names) | Yes | Yes | A | [Navigation](../../docs-site/navigation/) — see the [terminology map](filament-to-panelkit.md) for the exact name differences |
| Navigation — custom pages | Yes | Yes | Yes | A | [Extending — Custom pages](../../docs-site/extending/custom-pages) |
| Navigation — user menu | Yes | Yes | Yes | A | `Panel::userMenuItems()` — see [API reference](../../docs-site/api/classes/panel) |
| Navigation — clusters | Yes | Yes | Yes | A | [Creating resources — Clustering](../../docs-site/resources/#clustering-resources-under-one-sidebar-entry) |
| Authentication (login, registration, password reset, verification) | Yes | Yes | Yes | A | [Authentication](../../docs-site/authentication/) |
| Multi-factor authentication | Yes (TOTP + email, recovery codes) | Yes (the same two providers) | Yes | A | [MFA & passwordless](../../docs-site/authentication/mfa) — near feature parity, verified independently on both sides |
| Multi-tenancy | Yes | Yes, PanelKit-native + optional package for multi-DB | Yes | B | [Authorization — Tenancy](../../docs-site/authorization/#tenancy) — PanelKit ships its own `TenantContext`/`TenantScope`, not solely an external-package integration; multi-database isolation specifically depends on `stancl/tenancy` |
| Styling — CSS hooks | Yes (semantic classes to style Blade views without forking them) | N/A | E | E | PanelKit renders Vue components, not server-rendered Blade partials — there is no template to attach a CSS hook class to in the same sense. Styling extension is via [Customization](../../docs-site/customization/) tokens and Vue component registration instead. |
| Styling — colors | Yes | Yes | Yes | A | `Panel::colors()` — [Customization — Branding](../../docs-site/customization/#branding) |
| Styling — icons | Yes (swappable icon sets) | Yes, fixed curated set | B | B | PanelKit validates against one curated ~60-name allowlist rather than supporting swappable icon packs — see [Navigation — Icons](../../docs-site/navigation/#icons) |
| Advanced — render hooks | Yes (~57 panel + table + action + widget hooks) | Yes, 12 positions | Yes | B | PanelKit's [`RenderHooks`](../../docs-site/api/classes/render-hooks) is a smaller, curated set (12) rather than Filament's much larger enumerated surface — a real, honest scope difference, not a doc gap; see [Vue extension points](../../docs-site/extending/vue-extension-points) |
| Advanced — registering assets | Yes | Investigate | Investigate | Investigate | Not independently verified. |
| Advanced — modular architecture (DDD) | Yes, a dedicated guide | No dedicated guide | D | D | PanelKit's discovery-based resource/page registration (see [Project structure](../../docs-site/getting-started/project-structure)) doesn't prevent a DDD folder layout, but there's no dedicated worked example the way Filament has one. |
| Advanced — security | Yes, one consolidated page | Threaded through multiple guides | B | B | PanelKit's security-relevant guidance lives in [Authorization](../../docs-site/authorization/), [Authentication](../../docs-site/authentication/), and [Money](../../docs-site/money/) rather than one consolidated page — a deliberate choice given how central these concerns are to each of those topics, not an oversight. |
| Testing | Yes, per-area guides | Yes | **Gap→Fixed** | A | `InteractsWithPanels` (28 assertions) existed and was documented for AI agents ([AI Blueprint — Testing](../../docs-site/ai/testing)) but had no human-facing guide until this comparison; added [Testing](../../docs-site/testing/) |
| Plugins | Yes, panel + standalone | Yes | **Gap→Fixed** | A | `PanelPlugin`/`Plugin`/`PluginContext` existed, documented only for AI agents building a SaaS ([AI Blueprint — SaaS blueprint](../../docs-site/ai/saas-blueprint)); added a proper human guide, [Plugins](../../docs-site/extending/plugins) |
| Components (use the UI kit outside a panel) | Yes | Investigate | Investigate | Investigate | Not verified whether `packages/ui`'s Vue components are supported for use entirely outside a PanelKit-mounted screen; genuinely unexplored, recorded honestly rather than guessed either way. |
| Deployment | Yes | Yes | Yes | A | [Deployment](../../docs-site/deployment/) |
| Upgrade guide | Yes | Yes | Yes | A | [Installation — Upgrading](../../docs-site/getting-started/installation#upgrading), `panel:update` in the [command reference](../../docs-site/commands/) |

---

## 2. Component-level matrices

### 2a. Form fields

| Filament field | PanelKit equivalent | Documented? |
|---|---|---|
| Text input | [`TextField`](../../docs-site/api/classes/text-field) | Yes |
| Select | [`SelectField`](../../docs-site/api/classes/select-field) | Yes |
| Checkbox | [`CheckboxField`](../../docs-site/api/classes/checkbox-field) | Yes |
| Toggle | [`ToggleField`](../../docs-site/api/classes/toggle-field) | Yes |
| Checkbox list | `CheckboxListField` | Yes (catalogue) |
| Radio | `RadioField` | Yes (catalogue) |
| Date-time picker | [`DateField`](../../docs-site/api/classes/date-field) (`->withTime()`) | Yes |
| File upload | [`FileUploadField`](../../docs-site/api/classes/file-upload-field) | Yes |
| Rich editor | [`RichEditorField`](../../docs-site/api/classes/rich-editor-field) | Yes |
| Markdown editor | [`MarkdownField`](../../docs-site/api/classes/markdown-field) | Yes |
| Repeater | [`RepeaterField`](../../docs-site/api/classes/repeater-field) | Yes |
| Builder | [`BuilderField`](../../docs-site/api/classes/builder-field) | Yes |
| Tags input | `TagsField` | Yes (catalogue) |
| Textarea | [`TextareaField`](../../docs-site/api/classes/textarea-field) | Yes |
| Key-value | `KeyValueField` | Yes (catalogue) |
| Color picker | `ColourField` | Yes (catalogue) |
| Toggle buttons | `ToggleButtonsField` | Yes (catalogue) |
| Slider | `SliderField` | Yes (catalogue) |
| Code editor | `CodeField` | Yes |
| Hidden | [`HiddenField`](../../docs-site/api/classes/hidden-field) | Yes |
| *(no Filament equivalent)* | `MoneyField` | Yes — [dedicated guide](../../docs-site/money/) |
| *(no Filament equivalent)* | `PhoneField`, `MapField`, `QrCodeField`, `BarcodeField`, `DiffField`, `CountryField`, `VisualSelectField`, `IconPickerField`, `TreeSelectField`, `RatingField` | Yes (catalogue) |

PanelKit's field catalogue (34) is larger than Filament's current v5 list
(20) — the extras above are PanelKit-specific, not gaps.

### 2b. Table columns

| Filament column | PanelKit equivalent | Documented? |
|---|---|---|
| Text column | [`TextColumn`](../../docs-site/api/classes/text-column) | Yes |
| Icon column | [`IconColumn`](../../docs-site/api/classes/icon-column) | Yes |
| Image column | [`ImageColumn`](../../docs-site/api/classes/image-column) | Yes |
| Color column | `ColourColumn` | Yes (catalogue) |
| Select column (editable) | [`SelectColumn`](../../docs-site/api/classes/select-column) | Yes |
| Toggle column (editable) | [`ToggleColumn`](../../docs-site/api/classes/toggle-column) | Yes |
| Text input column (editable) | `TextInputColumn` | Yes (catalogue) |
| Checkbox column | `CheckboxColumn` | Yes (catalogue) |
| *(folded into Text column in Filament v3+; PanelKit keeps as own classes)* | [`BadgeColumn`](../../docs-site/api/classes/badge-column), `TagsColumn` | Yes |
| *(no Filament v5 equivalent)* | [`MoneyColumn`](../../docs-site/api/classes/money-column), `CodeColumn`, `KeyValueColumn`, `RatingColumn`, `ColumnGroup` | Yes |

### 2c. Table filters

| Filament filter | PanelKit equivalent | Documented? |
|---|---|---|
| Select filters | [`SelectFilter`](../../docs-site/api/classes/select-filter) | Yes |
| Ternary filters (tri-state) | [`BooleanFilter`](../../docs-site/api/classes/boolean-filter) | Yes |
| Query builder | `QueryBuilderFilter` | Yes (catalogue; flagged advanced/security-sensitive) |
| Custom filters | `Filter` base class | Yes |
| *(no direct Filament equivalent as a named type)* | `MultiSelectFilter`, `DateRangeFilter`, `NumberRangeFilter`, `TrashedFilter` | Yes |

### 2d. Infolist entries

| Filament entry | PanelKit equivalent | Documented? |
|---|---|---|
| Text entry | [`TextEntry`](../../docs-site/api/classes/text-entry) | Yes |
| Icon entry | `IconEntry` | Yes (catalogue) |
| Image entry | [`ImageEntry`](../../docs-site/api/classes/image-entry) | Yes |
| Color entry | `ColorEntry` | Yes (catalogue) |
| Code entry | `CodeEntry` | Yes (catalogue) |
| Key-value entry | `KeyValueEntry` | Yes (catalogue) |
| Repeatable entry | [`RepeatableEntry`](../../docs-site/api/classes/repeatable-entry) | Yes |
| *(no Filament v5 equivalent)* | [`BadgeEntry`](../../docs-site/api/classes/badge-entry), `DateTimeEntry`, [`MoneyEntry`](../../docs-site/api/classes/money-entry), [`ViewEntry`](../../docs-site/api/classes/view-entry) | Yes |

### 2e. Actions

| Filament action | PanelKit equivalent | Documented? |
|---|---|---|
| Action (base) | [`Action`](../../docs-site/api/classes/action) | Yes |
| Modals | `RecordAction`/`BulkAction` confirmation and form modals | Yes |
| Grouping actions | `ActionGroup` | Yes |
| Create/Edit/View/Delete | Real routed pages generated by `Resource`, not attachable action objects | Yes (**B** — different mechanism) |
| Replicate | [`ReplicateAction`](../../docs-site/api/classes/replicate-action) | Yes |
| Force-delete / Restore | Investigate | Investigate |
| Import | Optional `panel-operations` package | Yes (**C** — package boundary) |
| Export | Optional `panel-operations` package | Yes (**C** — package boundary) |
| *(no Filament equivalent)* | [`ImpersonateAction`](../../docs-site/api/classes/impersonate-action) | Yes |

### 2f. Widgets

| Filament widget | PanelKit equivalent | Documented? |
|---|---|---|
| Stats overview | [`StatWidget`](../../docs-site/api/classes/stat-widget) | Yes |
| Chart | [`ChartWidget`](../../docs-site/api/classes/chart-widget) (24 chart types) | Yes |
| Table (dashboard-embedded) | [`TableWidget`](../../docs-site/api/classes/table-widget) | Yes |
| Fully custom (any Livewire component) | A registered Vue component | Yes (**B** — different mechanism) |

---

## 3. Documentation gap report

### Covered equally or better
Resources, Forms (34 fields vs. 20), Tables (larger column catalogue), Infolists,
Actions (core CRUD + Replicate + Impersonate), Navigation, Authentication, MFA,
Deployment, Upgrade guide, AI-assisted development (PanelKit's AI Blueprint
predates and is more extensive than Filament's newly-added equivalent).

### PanelKit-specific coverage (requires its own deeper explanation)
Money (minor-vs-major units — a failure class Filament's generic number/text
inputs don't have), RelationManager's simple-vs-resource-backed split, the
independence (and shared-join subtlety) between table and infolist data,
`$icon`/`$group`/`$sort` vs. Filament's differently-named properties, and the
Vue/Inertia architecture note explaining why several Livewire-tied patterns
don't have a 1:1 PanelKit equivalent by design.

### Documentation gaps fixed during this task
- [Singular resources](../../docs-site/resources/singular-resources) (was entirely undocumented for humans)
- [Global search](../../docs-site/resources/global-search) (was entirely undocumented for humans)
- [Plugins](../../docs-site/extending/plugins) (was AI-blueprint-only)
- [Testing](../../docs-site/testing/) (was AI-blueprint-only)
- The `$icon` type bug (see the main final report) was also caught by this
  overall documentation effort, not specifically by the Filament comparison —
  noted here because fixing it was of comparable urgency to any of the above.

### Supported but still under-documented
These exist and were confirmed in source, but don't yet have guide-level
prose beyond a generated API reference page or a passing mention — normally
these should be resolved before calling documentation complete a second time:
- `Table::groupBy()` / row grouping
- `Panel::databaseTransactions()`
- The unsaved-changes-alert bottom bar
- `DataProvider` (non-Eloquent table data source)

### Unsupported PanelKit capabilities (Filament has, PanelKit currently does not — recorded for product planning only, not implemented as a result of this comparison)
- A dedicated Force-delete/Restore *action* class (soft-delete restore is
  likely achievable via `RecordAction`, but no named equivalent was confirmed)
- Swappable icon packs (PanelKit validates against one fixed curated set)
- A published version-support-policy page
- A dedicated "code quality tips" / modular-architecture (DDD) guide

### Not applicable
- Filament's CSS-hook styling system (Blade-template-specific; PanelKit
  renders Vue, not server-rendered partials)
- Livewire-runtime-specific mechanisms — `live()`'s wire round-trip,
  `$get()`/`$set()` property mutation, partial re-render optimization,
  `wire:navigate` SPA mode, Livewire-event-dispatching notification actions,
  and Livewire-component-based testing helpers. PanelKit achieves the same
  *outcomes* (reactive field dependencies, SPA-like navigation, component
  lifecycle hooks) through Inertia/Vue-native mechanisms instead — see each
  outcome's own PanelKit guide rather than looking for a mechanism match.

---

## 4. Terminology

See [filament-to-panelkit.md](filament-to-panelkit.md) for the concept-name
mapping — built specifically to prevent an AI agent (or a developer) from
assuming a Filament name transfers unchanged.

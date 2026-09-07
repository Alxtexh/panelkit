# Panel modernization plan

This plan compares PanelKit with current Filament 5 capabilities and modern
admin-platform expectations. It deliberately preserves PanelKit's strongest
choices: transport independence, schema/data separation, tenant-safe scoped
bindings, keyset pagination, deferred props, and queued large operations.

## Unified execution board — 2026-09-05

This is the single source of truth for the modernization work. The tracks are
planned together because they share the same contracts: one design-token layer
feeds the shell, overlays, widgets and forms; one action lifecycle feeds inline
actions, bulk actions and trash; and one release gate checks the package, its
published mirror, a real consumer and a real browser. A change is not complete
until its source, consumer mirror and relevant browser journey agree.

All validation described here is intentionally local and explicit through the
Makefile. No GitHub Actions workflow or recurring automation is part of the
PanelKit release surface.

| Track | Scope | Status | Proof gate |
|---|---|---:|---|
| Visual system | Tailwind tokens, 14px body baseline, density/radius, widget hierarchy, combined stat strips, responsive packing | DONE | UI suite, CSS parity, browser shell screenshots |
| Navigation | Closed-by-default groups, remembered state, active states, collapsed-rail flyouts, mobile bottom navigation, command palette | DONE | `PanelShellRenderTest`, navigation coverage |
| Overlays | Fixed/teleported menus with flip and viewport clamping, nested-overlay safety, modal/slideover focus return, focus trap, Escape, scroll lock, semantic ARIA, usable footer targets | DONE | overlay unit tests and destructive browser journey |
| Records and tables | Search/filter/sort/pagination state, stale-request guards, toolbar cleanup, action loading, delete confirmation, trash restore | DONE | UI suite, feature tests, destructive browser journey |
| Dashboard | Deferred-query grouping, retries and partial failures, widget loading/error states, persisted layout feedback and responsive minimums | DONE | dashboard component/feature tests and browser accessibility |
| Operations | Queue thresholds, checkpoints, cancellation, idempotency, unified job status, upload limits/scanning, safe private URLs | DONE | package and playground feature gates |
| Security and accessibility | Panel guard isolation, tenant boundaries, headers/CSP, payload limits, auth throttling, absolute session lifetime, contrast/ARIA sweep | DONE | security suite and 7-screen axe sweep |
| Distribution | Client mirror sync, consumer install/build, typecheck, CSS/page-shell parity, browser runner URL isolation | DONE | `make check-client check-css-parity check-page-shell`, build and Dusk |
| Release tooling | Keep the Playground feature suite isolated and make dependency/static-analysis debt visible without weakening release gates | DONE | sharded feature run, dependency gate, PHPStan gate, release/full checks |

### Current acceptance record

- 101 UI test files / 950 tests pass.
- Overlay, multiselect, request-race and accessibility-focused tests pass.
- Shared modal/slideover ownership keeps page scroll locked until the final
  overlay closes, and restores focus only to a still-valid owner.
- Browser accessibility sweep: 7 tests pass.
- Browser destructive-action journey: 21 assertions pass, including menu
  viewport geometry and modal button sizing.
- Browser shell journey: 6 tests / 13 assertions pass.
- Isolated performance suite: 22 tests / 84 assertions pass in about 6 seconds.
- Package build, published client mirror, typecheck, CSS parity and page-shell
  checks pass; the final package suite is 1,083 passed / 44 skipped with 4,208
  assertions.
- Chromium contrast sweep passes after darkening the shared muted-copy and
  default action tokens; the change is mirrored into the shipped kit stylesheet
  and pre-paint variables.
- Package formatting now passes across `src/` and `inertia/`.
- Tagged package metadata now agrees with `v1.4.71`; the check is part of
  `make release-check`.
- A 1 MiB initial JavaScript and 512 KiB total CSS budget is now enforced by the
  release check. The initial kit entry is now lazy-route split and is about
  606 KiB JavaScript; the shell CSS is about 16 KiB, with route-only CSS emitted
  as separate chunks.
- `make release-check-full` now provides one command for the extended feature,
  performance, consumer-install, broadcast, and browser journeys.
- Existing screenshot sets compare successfully by count, but 12 screens have
  visual drift between the historical `after-phase1` and `playground` sets.
- The screenshot comparator now treats missing screenshots and empty captures as
  failures, so a partial browser run cannot report a false visual pass.
  Those differences need an intentional design review before either set becomes
  the canonical baseline.
- The kit resolver now lazy-loads page components, keeping API documentation and
  other infrequently used screens out of the first download.
- The application UI duplicate sweep is complete; application UI shims now
  re-export the package contract where a shim is still useful.
- Generator output no longer emits TODO placeholders for unknown relationships,
  custom pages, or dashboards; it now gives direct next-step guidance.
- The four-shard feature runner is now the standard local
  `test-playground-feature` target. Its route inventory ignores orphaned
  generated-panel routes left in Laravel's in-memory route collection after a
  provider is removed, so the formerly order-dependent run passes in four
  isolated processes.
- `make check-dependencies` validates both Composer manifests, installed
  production platform requirements, and lockfiles locally. Setting
  `PANELKIT_AUDIT_NETWORK=1` additionally runs Composer and pnpm advisories;
  the network audit is intentionally opt-in so an offline release check stays
  deterministic.

The static-analysis gate now runs with the same non-interactive environment as
the test gates. The package/application scan has no outstanding code findings;
the two retained `trait.unused` records are the consumer-only `HasSeo` and
`InteractsWithPanels` extension traits, whose usage lives in host models and
consumer test suites outside the shipped source paths. They remain explicitly
recorded in the existing package baseline rather than being hidden by a new
baseline.

## Completed in this pass

- Removed invalid testimonial figure markup.
- Removed Vue fragment attribute-inheritance warnings from form layout spans.
- Added a canvas context shim for deterministic signature-pad tests.
- Silenced expected JSDOM navigation noise in passkey tests.
- Made lifecycle composables safe when called outside component setup, which is
  useful to consumers and removes misleading test warnings.
- Added a repository-level modernization roadmap with acceptance criteria.
- Added `panel:validate` as an operator-facing alias for the full doctor
  report, including JSON output and production checks.
- Added resource validation and persistence lifecycle hooks with transaction
  boundaries, and verified their ordering through package HTTP tests.
- Added owner- and operation-scoped idempotency keys for queued imports,
  exports, and bulk actions; retries reuse the original job without a second
  dispatch, with an atomic cache lock around the claim. Request fingerprints
  now reject reuse for different selections, filters, mappings, or files, and
  failed dispatches release the claim for retry.
- Added optional plugin `dependencies()` and `health()` contracts, with
  `panel:doctor` validation that preserves compatibility for direct
  `PanelPlugin` implementations.
- Added optional plugin configuration schemas (`configKey()` and
  `configRules()`), validated by `panel:doctor` before deployment.
- Added owner-checked cancellation for queued bulk actions, exports, and
  imports, with cooperative chunk boundaries and cleanup of partial exports.
- Added relationship-aware repeaters for `HasMany` and `MorphMany` resources,
  including child-field sanitization, parent-scoped row updates/deletes,
  tenant stamping, and transactional synchronization.
- Added atomic inbound billing-webhook idempotency using provider event ids
  (or a stable body hash fallback), scoped per panel and adapter.
- Added conservative security headers to Panel-managed routes, including
  content-type sniffing, framing, referrer, and device-permission protections.
- Added opt-in host-configured `Content-Security-Policy` support so CSP can be
  enabled without hardcoding application-specific asset origins.
- Extended resource generation to create a non-destructive factory stub and a
  resource contract smoke test alongside the policy and resource class.
- Made Telegram an optional integration instead of a core Composer dependency;
  provider registration and alert calls now fail closed when it is absent.
- Added an opt-in host file-scanning callback that runs after MIME/extension
  validation and fails closed before a pending upload is stored.
- Added per-deferred-widget query-budget observation with structured warnings,
  while preserving existing widget fallback and broadcast/poll behavior.
- Added owner/tenant-bound chunked uploads with bounded chunk counts, total-size
  enforcement, ordered assembly, and reuse of the existing upload scanner path.
- Extended `panel:prune-uploads` to clean inactive chunk sessions without
  touching active uploads.
- Added a read-only `DataProvider`/`DataProviderResult` table seam for host-owned
  non-Eloquent sources, while retaining the existing Eloquent operations path.
- Fixed the clean distribution verifier to package the current worktree, and
  verified Composer installation and autoloading in a scratch consumer.
- Added an application-level payload-size middleware for authenticated Panel
  routes with an explicit 413 response and configurable limit.
- Added tenant-bound temporary private-file URL issuance that delegates signing
  to storage adapters and refuses paths outside the active tenant.
- Added a validated X-Request-ID correlation contract to every Panel-managed
  response, replacing unsafe or overlong incoming values with a fresh UUID.
- Added production doctor checks for APP_KEY strength, APP_DEBUG, Secure and
  HttpOnly cookies, SameSite validity, and partitioned-cookie compatibility.
- Added a local locked-dependency/platform gate with optional network advisory
  audits, and tightened internal Playground package constraints from unbounded
  @dev to exact dev-main references.

## Phase 1 — reliability and release quality

Priority: immediate. These are release blockers for a framework.

 [x] Diagnose and fix the Playground PHP feature-suite hang (benchmark-heavy
 work is excluded from the fast gate, and the remaining screen-inventory
 order dependency is removed by ignoring orphaned generated-panel routes).
- [x] Split test commands into unit, package feature, playground feature, browser,
  security, integration, and release checks.
- [x] Make `panel:doctor` and the release check fail on stale client mirrors,
  missing policies, invalid routes, missing indexes, and unsafe configuration.
- [x] Add a clean distribution-install job that uses the Composer archive and
  the mirrored client rather than the local path repository.
- [x] Make `SetupWizard.vue` and all package sources pass formatting checks.
- [x] Add PHPStan/Psalm checks and a public-API compatibility check. The public
  API, dependency, and PHPStan gates are active; current analysis is clean
  apart from the two documented consumer-only trait notices.
- [x] Add a dependency-free public API manifest check for the package's core
  extension surfaces and include static analysis in `make release-check`.

Acceptance: a clean checkout can run the fast suite in under two minutes, the
full suite has a bounded timeout, and the published artifact is tested exactly
as a consumer receives it.

## Phase 2 — resource and developer experience

- [x] Add `php artisan panel:validate` for schema, route, policy, relationship,
  plugin, index, and cache-contract validation.
- [x] Generate a policy, feature test, factory, and resource scaffold together.
- [x] Add stable public API compatibility checks and centrally configurable
  deprecation reporting for backwards-compatible aliases.
- [x] Standardize resource lifecycle hooks:
  `beforeValidate`, `afterValidate`, `beforeCreate`, `afterCreate`,
  `beforeUpdate`, `afterUpdate`, `beforeDelete`, and `afterDelete`.
- [x] Lifecycle hooks are implemented for record requests and writes.
- [x] Add configurable success/failure notifications and save flows such as
  save-and-close and create-another. `ResourceForm.vue` already provides
  success/error toasts, create-another, cancel protection, and controlled
  return navigation.

Acceptance: a generated resource has a useful test and policy immediately,
and common resource mistakes are reported before a browser request.

## Phase 3 — table maturity

- [x] Add custom summaries: count, sum, average, min, max, and custom callbacks.
- [x] Add grouped rows with safe, stable cursor behavior.
- [x] Add reorderable columns and responsive column priorities.
- [x] Add configurable filter placement and reset behavior.
- [x] Add saved views for filters, sorting, visible columns, grouping, layout, and
  page size, with owner/shared permissions.
- [x] Add custom read-only data providers for non-Eloquent sources.
- [x] Add explicit exact-match and relevance-ranked global search modes while
  retaining the safe prefix-search default.

Acceptance: resources can support operational reporting without hand-written
Vue pages or controller-specific table implementations.

## Phase 4 — forms and infolists

- [x] Make infolists a first-class public schema, separate from forms and tables.
- [x] Add responsive schema columns and skippable wizard steps.
- [x] Add relationship-aware repeaters with explicit transaction and authorization
  semantics; retain JSON repeaters as the simpler default.
- [x] Add cancellation for stale async live-validation requests and preserve
  optimistic form-version conflict detection.
- [x] Add opt-in version-aware local autosave/draft recovery.
- [x] Add chunked uploads and host-provided file scanning hooks.

Acceptance: a resource can express create, edit, view, and nested child data
without custom page code for the common case.

## Phase 5 — safe extensibility

- [x] Extend the add-only plugin API with custom fields, columns, filters,
  infolist entries, widgets, commands, translations, migrations, dependencies,
  and health checks (the add-only registration surface already covered the
  component kinds; dependency and health metadata are now validated).
- [x] Add plugin configuration schemas and enablement per panel (configuration
  schemas are validated; panel enablement continues to use the existing
  `appliesTo()` contract).
- [x] Keep plugins unable to mutate guard, tenancy, middleware, or authorization
  defaults directly.
- [x] Version render-hook positions and expose a compatibility report.

Acceptance: first-party and host-owned plugins can add complete vertical slices
without reaching into internal classes or weakening security boundaries.

## Phase 6 — operations and enterprise scale

- [x] Unify import, export, backup, bulk-action, and scheduled-report job status.
- [x] Add cancellation, idempotency keys, and failure reports.
- [x] Add durable, owner-scoped retry-failed-only imports that retain and
  integrity-check the original source file while issuing a fresh job token.
- [x] Add resumable import execution with owner-scoped checkpoints and bounded
  retry backoff so worker restarts do not replay processed source lines.
- [x] Add inbound billing-webhook idempotency with atomic duplicate delivery
  protection.
- [x] Idempotency keys and duplicate-dispatch protection are implemented for
  imports, exports, and queued bulk actions.
- [x] Add realtime notification delivery with fallback polling and delivery audit.
- [x] Add per-widget cache policy, retry boundaries, and drill-down links for
  stat, chart, and table widgets.
- [x] Add signed private-file URLs.
- [x] Add application-level payload limits.
- [x] Add secret rotation guidance and tenant-aware operational metrics.

Acceptance: long-running work is observable, repeatable, cancellable, and safe
under retries and worker restarts.

## Phase 7 — package modularity

Keep the current meta-package, but split implementation and dependencies into
clear optional modules:

- core, tables, forms, infolists, widgets
- auth, tenancy, notifications
- documents, billing, AI, operations

Current progress: optional Telegram delivery has been removed from the core
`require` set and remains available through `suggest`. The implementation
boundaries are now represented by standalone path-compatible packages. A capability manifest and
`panel:modules` dependency diagnostic now provide the compatibility seam and
make optional-module availability observable. Telegram has now been physically
extracted into `packages/panel-telegram` and is consumed through a path
repository with its own Composer dependency boundary. AI SDK integration has
also been extracted into `packages/panel-ai`, keeping core AI-safe abstractions
available without requiring the provider SDK. Document templates and renderers
have now been extracted into `packages/panel-documents`, with core route,
doctor, blueprint, and branding fallbacks for installations that omit it.
Provider-agnostic billing webhook adapters now live in
`packages/panel-billing`; subscription state and access gates remain in core as
the stable billing contract. Operations jobs, import readers, scheduled reports,
report mail, and completion notifications now live in `packages/panel-operations`;
core retains the shared status/storage contracts and route fallbacks.

Acceptance: a consumer installing only the core table/form panel does not need
AI, billing, document, or operations dependencies, while the meta-package
remains a convenient full install.

## Explicit non-goals

- Do not replace Inertia/Vue with Livewire.
- Do not weaken the add-only plugin boundary.
- Do not make every action an inline button by default.
- Do not remove keyset pagination for arbitrary page jumping.
- Do not put tenant data into cached schema definitions.

# Alxtexhpanel — run everything from the monorepo root.
#
# artisan lives in apps/playground. JS is a pnpm workspace rooted here
# (pnpm-workspace.yaml lists apps/playground and packages/ui;
# packages/panel/resources/client is a build copy, not a third install
# target — see `sync-client` below) with one lockfile at the repo root.
# Rather than remember which directory each command belongs to, use these.

PLAYGROUND := apps/playground
ARTISAN    := cd $(PLAYGROUND) && php artisan

.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

.PHONY: dev
dev: ## Start the playground (serve + vite) on http://127.0.0.1:8899
	@$(ARTISAN) dev

.PHONY: seed
seed: ## Seed demo data. Override scale: make seed SCALE=medium
	@$(ARTISAN) panel:seed-demo --scale=$(or $(SCALE),large) --fresh

.PHONY: migrate
migrate: ## Run migrations
	@$(ARTISAN) migrate

.PHONY: fresh
fresh: ## Drop everything, re-migrate, re-seed
	@$(ARTISAN) migrate:fresh
	@$(MAKE) seed

.PHONY: test
test: ## Run the playground test suite
	@$(ARTISAN) test

.PHONY: test-fast
test-fast: ## Run the fast application unit and focused feature gate
	@cd $(PLAYGROUND) && timeout 120s php artisan test --testsuite=Unit --stop-on-failure
	@cd $(PLAYGROUND) && timeout 120s php artisan test --testsuite=Feature --filter='RecordWrite|CrossTenant|Authorization|ExportOwnership|ImportHttp|BulkAction' --stop-on-failure

.PHONY: test-playground-feature
test-playground-feature: ## Run the deterministic playground feature suite with a hard bound
	@cd $(PLAYGROUND) && timeout 180s php artisan test --testsuite=FeatureFast --stop-on-failure

.PHONY: test-playground-performance
test-playground-performance: ## Run the benchmark-heavy playground performance suite with a hard bound
	@cd $(PLAYGROUND) && timeout 180s php artisan test --testsuite=Performance --stop-on-failure

.PHONY: test-security
test-security: ## Run tenant, authorization, auth, upload, API, and webhook checks
	@cd $(PLAYGROUND) && timeout 120s php artisan test --testsuite=Feature --filter='Tenant|Authorization|Auth|Security|Upload|Api|Webhook|CrossTenant' --stop-on-failure

.PHONY: browser
browser: ## Run the browser tests (needs Chrome - see scripts/dusk.sh)
	@scripts/dusk.sh

.PHONY: tinker
tinker: ## Open a REPL against the playground
	@$(ARTISAN) tinker

.PHONY: counts
counts: ## Print seeded row counts
	@$(ARTISAN) tinker --execute="\
		foreach (['tenants','plans','routers','clients','client_sessions'] as \$$t) \
			printf('%-18s %s'.PHP_EOL, \$$t, number_format(DB::table(\$$t)->count()));"

# `pnpm --filter <name> run <script>` FROM THE ROOT, NEVER `cd dir && pnpm
# run`. pnpm 11.24's pre-run dependency check breaks when invoked from a
# workspace member's own directory - it reports zero packages in the
# workspace and fails outright. See the comment in .npmrc for the full story.
.PHONY: build
build: ## Production asset build
	@pnpm --filter playground run build

.PHONY: install
install: ## Install PHP and JS dependencies
	@cd $(PLAYGROUND) && composer install
	@pnpm install

.PHONY: sync-client
sync-client: ## Build packages/ui (lib + kit SPA) and mirror it into packages/panel/resources/client
	@pnpm --filter @alxtexh-enterprise/panel run build
	@rm -rf packages/panel/resources/client
	@mkdir -p packages/panel/resources/client
	@cp packages/ui/package.json packages/panel/resources/client/
	@cp -r packages/ui/dist packages/panel/resources/client/dist
	@cp -r packages/ui/inertia packages/panel/resources/client/inertia
# THE SAME EXCLUSION THE NPM TARBALL MAKES. `package.json` drops
# `inertia/**/*.spec.ts` from what npm publishes, and this mirror copied the
# directory wholesale - so the two halves of one release disagreed about
# whether test files ship, and the composer half was the one carrying them.
	@find packages/panel/resources/client -name '*.spec.ts' -delete
	@echo "Mirrored packages/ui into packages/panel/resources/client. Commit both."

.PHONY: check-client
check-client: ## Fail if packages/panel/resources/client is out of sync with packages/ui
	@scripts/check-client-sync.sh

.PHONY: check-page-shell
check-page-shell: ## Fail on new mx-auto + max-w-* congested admin chrome (design freeze)
	@scripts/check-page-shell.sh

.PHONY: check-public-api
check-public-api: ## Verify the documented package extension surface remains present
	@php scripts/check-public-api.php

.PHONY: test-package
test-package: ## Run packages/panel's own suite - Testbench, fixture models, no playground
	@cd packages/panel && [ -d vendor ] || composer install --no-interaction --no-progress
	@cd packages/panel && timeout 180s vendor/bin/pest --no-coverage

# THE RELEASE GATE FOR DEMO = KIT. Playground Vite aliases packages/ui source,
# so a green demo can hide a stale Composer mirror. Before tagging:
#   1. make sync-client   (rebuild packages/ui dist + mirror into resources/client)
#   2. rebuild playground assets if you changed Vue hosts see
#   3. make release-check (this target)
.PHONY: check-css-parity
check-css-parity: ## Fail when stub, kit, and playground CSS drift on critical blocks
	@scripts/check-css-parity.sh

.PHONY: release-check
release-check: check-client check-css-parity check-page-shell check-public-api test-fast test-package ## Pre-tag: client/CSS/design checks plus fast app, API, and package tests
	@echo "release-check ok: client mirror matches packages/ui; CSS parity ok; page-shell freeze ok; package tests passed."
	@echo "Remember: demo UI must match the published kit (sync-client before tag)."

.PHONY: split
split: ## Build the standalone package branches (see scripts/split.sh; nothing is pushed)
	@scripts/split.sh

# THE ONLY CHECK THAT SEES WHAT IS PUBLISHED. Everything else in this
# repository reads `packages/ui` as SOURCE through a Vite alias and
# `packages/panel` as a path repository, so `dist/` and the pruned archive - the
# only things a consumer receives - are never loaded here at all.
.PHONY: verify-install
verify-install: ## Install both packages as a stranger would and build against them
	@scripts/verify-install.sh

# THE ONE THING `BroadcastChannelTest` CANNOT TELL YOU. It proves who may
# subscribe to what; this proves a message actually travels. The two failures
# look identical from the application - `useLiveUpdates` degrades to polling
# when the socket is absent, so a broken transport renders as a working panel.
.PHONY: verify-broadcast
verify-broadcast: ## Prove a broadcast reaches a subscriber over a real socket
	@scripts/verify-broadcast.sh

# THE ORDER IS THE WHOLE POINT OF THIS TARGET.
#
# `inertia:start-ssr` reads `inertia.ssr.enabled` and exits with "Inertia SSR is
# not enabled" when it is false - so the flag has to be set BEFORE the server is
# started, not after. `config/inertia.php` documented it the other way round and
# the failure lands on the step that looks least likely to fail.
#
# Serve the app with INERTIA_SSR_ENABLED=true as well, or requests still render
# client-only against a server that is running perfectly.
.PHONY: ssr
ssr: ## Build the SSR bundle and start the SSR server (flag first - see the note)
	@pnpm --filter playground run build:ssr
	@echo
	@echo "SSR bundle built. Starting the server; serve the app with INERTIA_SSR_ENABLED=true:"
	@echo "    cd $(PLAYGROUND) && INERTIA_SSR_ENABLED=true php artisan serve"
	@echo
	@cd $(PLAYGROUND) && INERTIA_SSR_ENABLED=true php artisan inertia:start-ssr

# WHAT A CONSUMER ACTUALLY DOWNLOADS, printed rather than assumed.
#
# `.gitattributes` decides this, and it is invisible in every other view: the
# repository, the working tree and a source install all still show `tests/`.
# Only `git archive` applies `export-ignore` - which is exactly what GitHub's
# zipball endpoint runs, and where Composer gets a dist from.
#
# IT IS NOT TESTABLE THROUGH A LOCAL COMPOSER INSTALL, and that is worth knowing
# before somebody tries: a file-path VCS repository has no dist URL, so Composer
# clones the source instead and every excluded file reappears. That looks like
# the exclusions failing when it is the install method differing.
.PHONY: publish-preview
publish-preview: ## Show exactly what a Composer dist install would fetch (maintainer check)
	@echo "== alxtexh-enterprise/panel (composer dist) =="
	@git archive HEAD:packages/panel | tar -t | awk -F/ 'NF>1{print "  "$$1"/"} NF==1{print "  "$$1}' | sort -u
	@echo
	@echo "== @alxtexh-enterprise/panel (client tarball shape, maintainer verify only; not npm registry) =="
	@cd packages/ui && npm pack --dry-run 2>&1 | grep -E "package size|unpacked size|total files" | sed 's/npm notice/ /'

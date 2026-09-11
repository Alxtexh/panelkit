#!/usr/bin/env bash
#
# Fail when the BUILT, PUBLISHED kit CSS is missing rules that exist in
# packages/ui/src/kit/design-system.css.
#
# WHY THIS EXISTS: `check-client-sync.sh` only diffs source-level files
# (package.json, inertia/) between packages/ui and the Composer mirror - it
# explicitly does not byte-compare dist output ("Vite rebuilds are not
# bit-identical across runs"). `check-css-parity.sh` (StylesheetParityTest)
# only checks a small fixed marker list across three SOURCE app.css files,
# never the built/published bundle. Neither would have caught a real incident
# where `packages/ui/vite.kit.config.ts` had `cssCodeSplit: true` combined
# with an `assetFileNames` callback that named every CSS chunk the same
# literal `app.css` - Rollup silently disambiguated the collision into
# app.css/app2.css/app3.css once there were enough lazy route chunks to force
# more than one physical CSS emission, and design-system.css's shell rules
# (`.pk-shell`, `[data-slot='page-header']`, `.pk-control`, etc.) ended up in
# app3.css - a file `KitAssets::publish()` (packages/panel/src/Support/
# KitAssets.php) never copies to a fresh install's public/vendor/panel/.
# `check-client-sync.sh`'s "kit present" check only verifies app.css *exists*,
# not that it's complete. Every fresh install silently shipped without the
# page-header type scale, section-heading sizing, and control tokens - while
# every automated gate stayed green.
#
# This check has two parts:
#   1. Exactly one CSS file in dist/kit/ - guards the naming-collision
#      mechanism directly, so the failure mode can't recur even in a
#      different shape (a renamed selector, a new lazy chunk, etc.).
#   2. Every `.pk-*` class and `data-slot='*'` attribute selector literally
#      present in design-system.css must appear as a substring in the built,
#      MIRRORED dist/kit/app.css (packages/panel/resources/client, the file a
#      fresh Composer install actually receives). The selector list is
#      extracted from source on every run, not hand-maintained, so it can't
#      go stale the way a fixed marker list did.
#
# Exit 0 when complete. Exit 1 with a specific, actionable list when not.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_CSS="${ROOT}/packages/ui/src/kit/design-system.css"
DIST_DIR="${ROOT}/packages/panel/resources/client/dist/kit"
DIST_CSS="${DIST_DIR}/app.css"

if [[ ! -f "${SOURCE_CSS}" ]]; then
    echo "Missing ${SOURCE_CSS#"${ROOT}/"}; run this from the panelkit monorepo." >&2
    exit 1
fi

if [[ ! -d "${DIST_DIR}" ]]; then
    echo "Missing ${DIST_DIR#"${ROOT}/"}." >&2
    echo "Run: make sync-client" >&2
    exit 1
fi

fail=0

# --- Part 1: exactly one CSS file, no app2.css/app3.css siblings. ---
css_count="$(find "${DIST_DIR}" -maxdepth 1 -name '*.css' | wc -l | tr -d ' ')"

if [[ "${css_count}" -ne 1 ]]; then
    echo "Expected exactly one CSS file in ${DIST_DIR#"${ROOT}/"}, found ${css_count}:" >&2
    find "${DIST_DIR}" -maxdepth 1 -name '*.css' -printf '  %f\n' >&2
    echo "This is the exact failure mode that hid design-system.css's shell rules from" >&2
    echo "every fresh install (see this script's header comment). Check whether" >&2
    echo "packages/ui/vite.kit.config.ts still has cssCodeSplit: false." >&2
    fail=1
fi

if [[ ! -f "${DIST_CSS}" ]]; then
    echo "Missing ${DIST_CSS#"${ROOT}/"}." >&2
    echo "Run: make sync-client" >&2
    exit 1
fi

# --- Part 2: every design-system.css selector survives into the shipped CSS. ---
# CSS minifiers (Lightning CSS, used by the Tailwind v4 Vite plugin) drop
# attribute-selector quotes when they're not syntactically required, turning
# `[data-slot='page-header']` into `[data-slot=page-header]` in the built
# output. Check both the quoted source form and the unquoted minified form so
# this doesn't false-positive on a minifier's own (harmless) normalization.
missing=()

while IFS= read -r selector; do
    [[ -z "${selector}" ]] && continue
    unquoted="${selector//\'/}"
    if ! grep -qF -- "${selector}" "${DIST_CSS}" && ! grep -qF -- "${unquoted}" "${DIST_CSS}"; then
        missing+=("${selector}")
    fi
done < <(grep -oE "\.pk-[a-zA-Z0-9_-]+|data-slot='[a-zA-Z0-9_-]+'" "${SOURCE_CSS}" | sort -u)

if [[ "${#missing[@]}" -gt 0 ]]; then
    echo "Built kit CSS (${DIST_CSS#"${ROOT}/"}) is missing ${#missing[@]} selector(s) present" >&2
    echo "in packages/ui/src/kit/design-system.css:" >&2
    printf '  %s\n' "${missing[@]}" >&2
    echo "Rebuild with: pnpm --filter @alxtexh-enterprise/panel run build && make sync-client" >&2
    fail=1
fi

if [[ "${fail}" -eq 0 ]]; then
    echo "Kit CSS complete: 1 file, all $(grep -oE "\.pk-[a-zA-Z0-9_-]+|data-slot='[a-zA-Z0-9_-]+'" "${SOURCE_CSS}" | sort -u | wc -l | tr -d ' ') design-system.css selectors present."
fi

exit "${fail}"

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

validate_composer() {
    local directory="$1"
    echo "==> composer validate: $directory"
    (
        cd "$ROOT/$directory"
        composer validate --strict --no-check-publish
        composer check-platform-reqs --no-dev
    )
}

validate_composer "packages/panel"
validate_composer "apps/playground"

for lockfile in "$ROOT/apps/playground/composer.lock" "$ROOT/pnpm-lock.yaml"; do
    if [[ ! -f "$lockfile" ]]; then
        echo "Missing lockfile: $lockfile" >&2
        exit 1
    fi
done

echo "Locked dependency metadata and installed platform requirements are valid."

if [[ "${PANELKIT_AUDIT_NETWORK:-0}" != "1" ]]; then
    echo "Network vulnerability audits not run (set PANELKIT_AUDIT_NETWORK=1 to run composer audit and pnpm audit)."
    exit 0
fi

echo "==> composer audit"
(
    cd "$ROOT/apps/playground"
    composer audit --locked --no-interaction
)

echo "==> pnpm audit"
(
    cd "$ROOT"
    pnpm audit --prod --audit-level high
)

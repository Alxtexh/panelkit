#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JS="$ROOT/packages/ui/dist/kit/app.js"
CSS="$ROOT/packages/ui/dist/kit/app.css"
MAX_JS_BYTES=$((1 * 1024 * 1024))
MAX_CSS_BYTES=$((512 * 1024))

for asset in "$JS" "$CSS"; do
    if [[ ! -f "$asset" ]]; then
        echo "Missing built asset: ${asset#"$ROOT/"}. Run make sync-client first." >&2
        exit 1
    fi
done

js_bytes="$(stat -c '%s' "$JS")"
css_bytes="$(stat -c '%s' "$CSS")"

printf 'Kit bundle: JS %s bytes, CSS %s bytes\n' "$js_bytes" "$css_bytes"

if (( js_bytes > MAX_JS_BYTES )); then
    echo "Initial JavaScript bundle exceeds the 1 MiB release budget." >&2
    exit 1
fi

if (( css_bytes > MAX_CSS_BYTES )); then
    echo "CSS bundle exceeds the 512 KiB release budget." >&2
    exit 1
fi

echo "Bundle budgets ok."

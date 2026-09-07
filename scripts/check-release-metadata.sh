#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TAG="$(git describe --tags --exact-match HEAD 2>/dev/null || true)"
if [[ -z "$TAG" ]]; then
    echo "No exact tag at HEAD; release metadata check skipped for an untagged checkout."
    exit 0
fi

if [[ "$TAG" != v[0-9]* ]]; then
    echo "Skipping non-version tag: $TAG"
    exit 0
fi

TAG_VERSION="${TAG#v}"
PACKAGE_VERSION="$(node -p "JSON.parse(require('fs').readFileSync('packages/ui/package.json', 'utf8')).version")"

if [[ "$PACKAGE_VERSION" != "$TAG_VERSION" ]]; then
    echo "Release metadata mismatch: tag $TAG expects packages/ui/package.json version $TAG_VERSION, found $PACKAGE_VERSION." >&2
    exit 1
fi

echo "Release metadata ok: $TAG and packages/ui/package.json agree."

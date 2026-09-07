#!/usr/bin/env bash
set -euo pipefail

BASELINE="${1:-}"
CURRENT="${2:-}"
DIFF_DIR="${3:-.shots/diff}"

if [[ -z "$BASELINE" || -z "$CURRENT" ]]; then
    echo "Usage: make visual-regression BASELINE=.shots/baseline CURRENT=.shots/current [DIFF_DIR=.shots/diff]" >&2
    exit 2
fi

if [[ ! -d "$BASELINE" || ! -d "$CURRENT" ]]; then
    echo "Both screenshot directories are required: $BASELINE and $CURRENT" >&2
    exit 2
fi

node "$(dirname "$0")/shots-diff.mjs" "$BASELINE" "$CURRENT" "$DIFF_DIR"

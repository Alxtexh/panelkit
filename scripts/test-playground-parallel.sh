#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLAYGROUND="$ROOT/apps/playground"
SHARDS="${PANEL_TEST_SHARDS:-4}"
TIMEOUT="${PANEL_TEST_TIMEOUT:-180}"

if ! [[ "$SHARDS" =~ ^[1-9][0-9]*$ ]]; then
    echo "PANEL_TEST_SHARDS must be a positive integer." >&2
    exit 2
fi

if ! [[ "$TIMEOUT" =~ ^[1-9][0-9]*$ ]]; then
    echo "PANEL_TEST_TIMEOUT must be a positive integer." >&2
    exit 2
fi

mapfile -t files < <(
    cd "$PLAYGROUND"
    rg --files tests/Feature -g '*.php' -g '!Performance/**' | sort
)

if (( ${#files[@]} == 0 )); then
    echo "No deterministic feature tests were found." >&2
    exit 2
fi

WORK="$(mktemp -d -t panelkit-feature-shards.XXXXXX)"
PIDS=()

cleanup() {
    for pid in "${PIDS[@]:-}"; do
        kill "$pid" 2>/dev/null || true
    done
    rm -rf "$WORK"
}
trap cleanup EXIT INT TERM

status=0
for ((shard = 0; shard < SHARDS; shard++)); do
    shard_files=()
    for ((index = shard; index < ${#files[@]}; index += SHARDS)); do
        shard_files+=("${files[index]}")
    done

    if (( ${#shard_files[@]} == 0 )); then
        continue
    fi

    log="$WORK/shard-$((shard + 1)).log"
    echo "==> Feature shard $((shard + 1))/${SHARDS}: ${#shard_files[@]} files"
    (
        cd "$PLAYGROUND"
        PAO_DISABLE=1 timeout "${TIMEOUT}s" php artisan test --stop-on-failure "${shard_files[@]}"
    ) >"$log" 2>&1 &
    PIDS+=("$!")
done

for index in "${!PIDS[@]}"; do
    if ! wait "${PIDS[index]}"; then
        status=1
        echo "FAILED: feature shard $((index + 1))" >&2
        log="$WORK/shard-$((index + 1)).log"
        echo "--- shard failure tail ---" >&2
        tail -120 "$log" >&2
    else
        tail -5 "$WORK/shard-$((index + 1)).log"
    fi
done

if (( status != 0 )); then
    echo "Deterministic Playground feature suite failed." >&2
    exit "$status"
fi

echo "Deterministic Playground feature suite passed in ${SHARDS} local shards."

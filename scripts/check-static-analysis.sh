#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
playground="${repo_root}/apps/playground"
timeout_seconds="${PANELKIT_PHPSTAN_TIMEOUT:-300}"

if ! [[ "${timeout_seconds}" =~ ^[1-9][0-9]*$ ]]; then
    echo "PANELKIT_PHPSTAN_TIMEOUT must be a positive integer (seconds)." >&2
    exit 2
fi

if [[ ! -x "${playground}/vendor/bin/phpstan" ]]; then
    echo "PHPStan is not installed in apps/playground; run make install first." >&2
    exit 2
fi

echo "Running PHPStan against the playground and shipped panel package (timeout: ${timeout_seconds}s)."
echo "The configured baselines suppress known legacy findings; new findings still fail this check."

output_file="$(mktemp "${TMPDIR:-/tmp}/panelkit-phpstan.XXXXXX")"
trap 'rm -f "${output_file}"' EXIT

set +e
(
    cd "${playground}"
    PAO_DISABLE=1 timeout "${timeout_seconds}s" php vendor/bin/phpstan analyse \
        --debug \
        --no-progress \
        --error-format=table
) >"${output_file}" 2>&1
status=$?
set -e

if [[ -s "${output_file}" ]]; then
    cat "${output_file}"
fi

if [[ "${status}" -eq 124 ]]; then
    echo "PHPStan exceeded ${timeout_seconds}s. Increase PANELKIT_PHPSTAN_TIMEOUT for a slower local machine, or narrow the configured paths." >&2
    exit 124
fi

if [[ "${status}" -ne 0 ]]; then
    if [[ ! -s "${output_file}" ]]; then
        echo "PHPStan exited with status ${status} without diagnostics. Check the PHP/Composer bootstrap and rerun with --debug." >&2
    fi
    echo "PHPStan reported findings or could not complete; resolve the output above before promoting this check into release-check." >&2
    exit "${status}"
fi

echo "Static analysis passed."

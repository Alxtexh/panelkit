#!/usr/bin/env bash
#
# Design-freeze gate: admin chrome must not reintroduce congested centred columns.
#
# Forbidden pattern on kit admin shells: both `mx-auto` and `max-w-*` on the same
# class string (or the same non-comment line). That centres a skinny column beside
# empty gutters. See docs/14-design-layout.md (PAGE_SHELL / FORM_MEASURE).
#
# Scoped to packages/ui/inertia layouts + pages (source of truth; client mirror
# is kept in sync by make check-client). Auth, onboarding, print, and a
# few intentional reading/gate pages are allow-listed.
#
# Usage:
#   scripts/check-page-shell.sh              # scan the kit; exit 1 on violations
#   scripts/check-page-shell.sh --self-test  # prove detection on a synthetic file
#   make check-page-shell
#
# Exit 0 when clean (or self-test passed). Exit 1 on violations / failed self-test.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INERTIA="${ROOT}/packages/ui/inertia"
SELF_TEST=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --self-test) SELF_TEST=true; shift ;;
        -h|--help)
            sed -n '2,22p' "$0" | sed 's/^# \?//'
            exit 0
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 2
            ;;
    esac
done

# Paths relative to packages/ui/inertia/. Intentionally narrow centres.
# Keep this list short and documented; prefer PAGE_SHELL for new admin screens.
is_allowlisted() {
    local rel="$1"
    case "$rel" in
        pages/auth/*|pages/panel/auth/*) return 0 ;;
        pages/Onboarding.vue) return 0 ;;
        pages/BillingSuspended.vue) return 0 ;;
        pages/documents/DocumentPrint.vue) return 0 ;;
        pages/errors/*) return 0 ;;
        # Support articles are reading pages, not CRUD chrome.
        pages/support/*) return 0 ;;
        *) return 1 ;;
    esac
}

# True when a line looks like a comment-only mention of the ban (not markup).
is_comment_line() {
    local line="$1"
    local trimmed="${line#"${line%%[![:space:]]*}"}"
    [[ "$trimmed" == //* ]] && return 0
    [[ "$trimmed" == \** ]] && return 0
    [[ "$trimmed" == \#* ]] && return 0
    [[ "$trimmed" == \'\'\'* ]] && return 0
    [[ "$trimmed" == \'* ]] && return 0
    [[ "$trimmed" == '<!--'* ]] && return 0
    # Block-comment prose inside <script> that mentions the ban.
    if [[ "$trimmed" == *'no mx-auto'* ]] || [[ "$trimmed" == *'max-w-* + mx-auto'* ]]; then
        return 0
    fi
    return 1
}

# A class attribute / binding that contains both mx-auto and max-w-*.
class_string_congested() {
    local line="$1"
    local cls=""
    if [[ "$line" =~ class=\"([^\"]*)\" ]]; then
        cls="${BASH_REMATCH[1]}"
        if [[ "$cls" == *mx-auto* && "$cls" == *max-w-* ]]; then
            return 0
        fi
    fi
    if [[ "$line" =~ class=\'([^\']*)\' ]]; then
        cls="${BASH_REMATCH[1]}"
        if [[ "$cls" == *mx-auto* && "$cls" == *max-w-* ]]; then
            return 0
        fi
    fi
    if [[ "$line" =~ :class=\"\'([^\']*)\'\" ]] || [[ "$line" =~ :class=\"\`([^\`]*)\`\" ]]; then
        cls="${BASH_REMATCH[1]}"
        if [[ "$cls" == *mx-auto* && "$cls" == *max-w-* ]]; then
            return 0
        fi
    fi
    return 1
}

# Same-line Tailwind classes outside allow-listed comments.
line_congested() {
    local line="$1"
    if is_comment_line "$line"; then
        return 1
    fi
    if [[ "$line" == *mx-auto* && "$line" == *max-w-* ]]; then
        return 0
    fi
    return 1
}

# Prints violations to stdout. Returns 0 when clean, 1 when any hit.
run_scan() {
    local base="$1"
    local fail=0
    local file rel lineno line hits

    if [[ ! -d "${base}/layouts" || ! -d "${base}/pages" ]]; then
        echo "Missing inertia layouts/pages under ${base}" >&2
        return 1
    fi

    while IFS= read -r -d '' file; do
        rel="${file#"${base}/"}"
        if is_allowlisted "$rel"; then
            continue
        fi
        [[ "$file" == *.vue ]] || continue

        hits=0
        lineno=0
        while IFS= read -r line || [[ -n "$line" ]]; do
            lineno=$((lineno + 1))
            if class_string_congested "$line" || line_congested "$line"; then
                printf '  %s:%s: congested mx-auto + max-w-* on admin chrome\n' "$rel" "$lineno"
                hits=$((hits + 1))
            fi
        done < "$file"

        if [[ "$hits" -gt 0 ]]; then
            fail=1
        fi
    done < <(find "${base}/layouts" "${base}/pages" -type f -name '*.vue' -print0 | sort -z)

    return "$fail"
}

if [[ "$SELF_TEST" == true ]]; then
    WORK="$(mktemp -d)"
    trap 'rm -rf "${WORK}"' EXIT
    mkdir -p "${WORK}/layouts" "${WORK}/pages/auth"

    cat > "${WORK}/pages/PanelPage.vue" <<'VUE'
<template>
    <div class="w-full min-w-0 px-4 py-6">ok</div>
</template>
VUE

    cat > "${WORK}/pages/ResourceForm.vue" <<'VUE'
<template>
    <div class="mx-auto max-w-3xl space-y-4">congested</div>
</template>
VUE

    cat > "${WORK}/pages/auth/Login.vue" <<'VUE'
<template>
    <div class="mx-auto max-w-sm">login</div>
</template>
VUE

    if run_scan "${WORK}"; then
        echo "SELF-TEST FAILED: expected a violation in pages/ResourceForm.vue" >&2
        exit 1
    fi

    rm -f "${WORK}/pages/ResourceForm.vue"
    if ! run_scan "${WORK}"; then
        echo "SELF-TEST FAILED: clean PanelPage + allow-listed Login should pass" >&2
        exit 1
    fi

    echo "check-page-shell self-test ok (synthetic violation caught; allow-list honored)."
    exit 0
fi

if [[ ! -d "${INERTIA}" ]]; then
    echo "packages/ui/inertia is missing; run from the panelkit monorepo." >&2
    exit 1
fi

echo "Scanning admin chrome under packages/ui/inertia (layouts + pages)..."
if ! run_scan "${INERTIA}"; then
    echo >&2
    echo "Design freeze: do not wrap admin shells in mx-auto + max-w-*." >&2
    echo "Use PAGE_SHELL / PAGE_SHELL_STACK / FORM_MEASURE (left-aligned). See docs/14-design-layout.md." >&2
    echo "Allow-listed only: auth, onboarding, landing, print, errors, support, BillingSuspended." >&2
    exit 1
fi

echo "Page shell freeze ok: no congested mx-auto + max-w-* on scanned admin chrome."

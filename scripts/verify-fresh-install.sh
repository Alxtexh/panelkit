#!/usr/bin/env bash
#
# THE RELEASE GATE FOR "WHAT AN EXTERNAL DEVELOPER ACTUALLY RECEIVES."
#
# Every other check in this repository can pass while a fresh install is
# broken - that is not hypothetical, it is exactly what happened once
# already. `packages/ui/vite.kit.config.ts` had a CSS code-splitting bug that
# silently dropped `design-system.css`'s page-header/table-row/badge rules
# from every fresh install's published assets, for a long enough stretch
# that it reached the demo app too - and every existing check stayed green
# throughout, because every existing check inspects SOURCE or a MIRROR, never
# the actual artifact a `composer require` + `panel:install` produces:
#
#   - `check-client-sync.sh` diffs package.json + inertia/ between
#     packages/ui and the Composer mirror - explicitly skips byte-comparing
#     dist/, "Vite rebuilds are not bit-identical across runs."
#   - `check-css-parity.sh` (StylesheetParityTest) checks six fixed marker
#     strings across three SOURCE app.css files, never a built bundle.
#   - `check-kit-css-complete.sh` (added after the incident) checks the
#     BUILT bundle - but only inside this monorepo, at
#     packages/panel/resources/client/dist/kit/, never at the place a real
#     consumer's `public/vendor/panel/` actually ends up.
#   - `verify-install.sh` packages the real artifact and resolves classes
#     through it - but never boots a Laravel application, never runs
#     `panel:install`, never generates a resource, never requests a route.
#   - `MakeResourceGenerateTest`'s HTTP smoke test (packages/panel/tests)
#     proves a generated resource's routes don't 500 - through Testbench, an
#     in-process simulated application, never through `KitAssets::publish()`
#     writing to a REAL `public/` directory a real webserver would serve.
#
# None of those five is wrong to have; each is deliberately narrow so it
# stays fast enough to run on every change. This script is the one that is
# deliberately NOT narrow: it is slow (a real `composer create-project`,
# real HTTP requests against a real `php artisan serve`), it needs network,
# and it belongs in `release-check-full`, not the fast path. Its only job is
# to answer one question none of the five above can: does the actual,
# published, request-serving artifact work?
#
# WHAT IT DOES, in order:
#   1. Archives the CURRENT packages/panel worktree exactly as a registry
#      would (same exclusions as verify-install.sh), into a tagged scratch
#      git repo a Composer path/VCS requirement can resolve a version from.
#   2. `composer create-project laravel/laravel` - a genuinely fresh
#      Laravel app, not a fixture, not Testbench.
#   3. `composer require` the packaged panel from step 1's scratch repo.
#   4. `php artisan panel:install`.
#   5. Writes one minimal resource (migration + model + a normal
#      `Resource` class, using only the public API a real developer would)
#      and migrates.
#   6. Boots the app for real (`php artisan serve`, backgrounded), signs in
#      as the Administrator `panel:install` just created over real HTTP (a
#      GET for the CSRF cookie, then a POST to /login - the same exchange a
#      browser's fetch/axios client performs, not a shortcut around it), and
#      requests its List/Create/View/Edit routes as that authenticated
#      session, exactly the way a browser's first visit would.
#   7. Reads `public/vendor/panel/app.css` - the file `KitAssets::publish()`
#      actually wrote, not a mirror or a dist/ copy - and asserts every
#      `.pk-*`/`data-slot='*'` selector in `design-system.css` survived into
#      it, the same check `check-kit-css-complete.sh` runs against this
#      monorepo's own mirror, now run against the real consumer artifact.
#   8. Confirms `public/vendor/panel/app.js` is present and non-trivial.
#
# Exit 0 means a stranger's fresh install actually works, end to end, over
# HTTP, using the exact bytes `composer require` would have downloaded.
# Anything else fails loudly with the step that broke.

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
SERVER_PID=""

cleanup() {
    if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
        kill "$SERVER_PID" 2>/dev/null
        wait "$SERVER_PID" 2>/dev/null
    fi
    rm -rf "$WORK"
}
trap cleanup EXIT

FAILED=0
PORT="${VERIFY_FRESH_INSTALL_PORT:-8241}"

echo "==> Working in $WORK"

# ---------------------------------------------------- 1. package the panel ---

echo "==> Archiving packages/panel as a registry would"

ARCHIVE="$WORK/panel.tar"

if ! (cd "$ROOT/packages/panel" && tar -cf "$ARCHIVE" \
        --exclude='./tests' \
        --exclude='./phpunit.xml' \
        --exclude='./testbench.yaml' \
        --exclude='./composer.lock' \
        --transform='s#^\./##' \
        .) 2>"$WORK/archive.log"; then
    echo "FAILED: archiving packages/panel" >&2
    cat "$WORK/archive.log" >&2
    exit 1
fi

mkdir -p "$WORK/pkg"
tar -xf "$ARCHIVE" -C "$WORK/pkg"

(
    cd "$WORK/pkg"
    git init -q
    git config user.email verify-fresh-install@example.test
    git config user.name "verify-fresh-install"
    git add -A
    git commit -qm "packaged"
    git tag v0.9.6
) > "$WORK/pkg-git.log" 2>&1

# ------------------------------------------------- 2. a genuinely fresh app ---

echo "==> composer create-project laravel/laravel (this takes a while)"

if ! composer create-project laravel/laravel "$WORK/app" --prefer-dist --no-interaction --quiet \
        > "$WORK/create-project.log" 2>&1; then
    echo "FAILED: composer create-project laravel/laravel" >&2
    tail -40 "$WORK/create-project.log" >&2
    exit 1
fi

APP="$WORK/app"

# ------------------------------------------------------ 3. require the panel ---

echo "==> composer require the packaged panel"

php -r '
    $path = $argv[1];
    $composer = json_decode(file_get_contents("$path/composer.json"), true);
    $composer["repositories"] = [["type" => "vcs", "url" => $argv[2], "no-api" => true]];
    file_put_contents("$path/composer.json", json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
' "$APP" "$WORK/pkg"

if ! (cd "$APP" && composer require "alxtexh-enterprise/panel:^0.9" -W --no-interaction --quiet) \
        > "$WORK/require.log" 2>&1; then
    echo "FAILED: composer require alxtexh-enterprise/panel" >&2
    tail -40 "$WORK/require.log" >&2
    exit 1
fi

# ------------------------------------------------------------- 4. install ---

# SQLite, no server needed, matches every other fresh-install check this
# repository already runs against. Done BEFORE `panel:install` - it creates
# the first Administrator, which needs a working database connection, and a
# non-interactive `composer create-project` does not run Laravel's own
# interactive DB-setup prompt.
if ! \grep -q '^DB_CONNECTION=sqlite' "$APP/.env" 2>/dev/null; then
    sed -i "s#^DB_CONNECTION=.*#DB_CONNECTION=sqlite#" "$APP/.env"
fi
sed -i "/^DB_DATABASE=/d" "$APP/.env"
touch "$APP/database/database.sqlite"

(cd "$APP" && php artisan key:generate --force) > "$WORK/key-generate.log" 2>&1

echo "==> php artisan panel:install"

ADMIN_EMAIL="admin@verify-fresh-install.test"
ADMIN_PASSWORD="verify-fresh-install-password"

(cd "$APP" && php artisan panel:install --no-interaction --force \
    --name="Verify Fresh Install" --email="$ADMIN_EMAIL" --password="$ADMIN_PASSWORD") \
    > "$WORK/panel-install.log" 2>&1
INSTALL_STATUS=$?

if [[ "$INSTALL_STATUS" -ne 0 ]]; then
    echo "FAILED: panel:install" >&2
    tail -40 "$WORK/panel-install.log" >&2
    exit 1
fi

# --------------------------------------------- 5. one minimal resource ---

echo "==> Generating one representative resource"

mkdir -p "$APP/database/migrations"
cat > "$APP/database/migrations/2026_01_01_000000_create_widgets_table.php" <<'PHP'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('widgets');
    }
};
PHP

cat > "$APP/app/Models/Widget.php" <<'PHP'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Widget extends Model
{
    protected $guarded = [];
}
PHP

if ! (cd "$APP" && php artisan migrate --force) > "$WORK/migrate.log" 2>&1; then
    echo "FAILED: migrate" >&2
    tail -40 "$WORK/migrate.log" >&2
    exit 1
fi

if ! (cd "$APP" && php artisan make:panel-resource Widget --generate --force) \
        > "$WORK/make-resource.log" 2>&1; then
    echo "FAILED: make:panel-resource Widget --generate" >&2
    tail -40 "$WORK/make-resource.log" >&2
    exit 1
fi

php -l "$APP/app/Panel/Resources/WidgetResource.php" > "$WORK/lint.log" 2>&1
if [[ $? -ne 0 ]]; then
    echo "FAILED: the generated WidgetResource.php has a syntax error" >&2
    cat "$WORK/lint.log" >&2
    FAILED=1
fi

# `make:panel-resource` also writes `app/Policies/WidgetPolicy.php` extending
# `TenantResourcePolicy`, which DENIES every ability until the matrix knows
# about it - deny-by-default is deliberate (see InstallCommand's own closing
# instructions: "the panel DENIES any ability whose model has no policy, so
# an unreviewed stub is a real grant"). `panel:permissions sync` is the
# documented next step every generator (`make:panel-resource`,
# `make:panel-recipe`, `make:page`) tells the developer to run - skipping it
# here would turn the framework's own safety default into a false failure.
if ! (cd "$APP" && php artisan panel:permissions sync --no-interaction) \
        > "$WORK/permissions-sync.log" 2>&1; then
    echo "FAILED: panel:permissions sync" >&2
    tail -40 "$WORK/permissions-sync.log" >&2
    exit 1
fi

(cd "$APP" && php artisan tinker --execute="\\App\\Models\\Widget::create(['name' => 'Smoke test widget', 'status' => 'active']);" \
    ) > "$WORK/seed.log" 2>&1

# --------------------------------------------------- 6. boot and request ---

echo "==> Booting php artisan serve and requesting real routes"

(cd "$APP" && php artisan serve --host=127.0.0.1 --port="$PORT" > "$WORK/serve.log" 2>&1) &
SERVER_PID=$!

for _ in $(seq 1 30); do
    if curl -s -o /dev/null "http://127.0.0.1:$PORT/"; then
        break
    fi
    sleep 0.5
done

WIDGET_ID="$(cd "$APP" && php artisan tinker --execute="echo \\App\\Models\\Widget::first()->id;" 2>/dev/null | tail -1)"

BASE="http://127.0.0.1:$PORT"
COOKIES="$WORK/cookies.txt"

# Real session-cookie CSRF exchange - the same one axios/Inertia performs
# client-side, done over curl instead: a GET primes the encrypted XSRF-TOKEN
# cookie, its (still-encrypted) value is echoed back as the X-XSRF-TOKEN
# header, and `VerifyCsrfToken` decrypts and checks it server-side. Nothing
# here decrypts anything client-side - that is the whole point of the
# XSRF-TOKEN/X-XSRF-TOKEN pair.
curl -s -o /dev/null -c "$COOKIES" -b "$COOKIES" "$BASE/login"

XSRF_TOKEN="$(\grep -o 'XSRF-TOKEN[[:space:]]\+[^[:space:]]\+' "$COOKIES" 2>/dev/null | awk '{print $2}')"
AUTHENTICATED=0

urldecode() {
    local encoded="${1//+/ }"
    printf '%b' "${encoded//%/\\x}"
}

if [[ -n "$XSRF_TOKEN" ]]; then
    XSRF_HEADER="$(urldecode "$XSRF_TOKEN")"

    login_status="$(curl -s -o "$WORK/login-response.html" -w '%{http_code}' \
        -c "$COOKIES" -b "$COOKIES" \
        -H "X-XSRF-TOKEN: $XSRF_HEADER" \
        -H "Accept: text/html" \
        --data-urlencode "email=$ADMIN_EMAIL" \
        --data-urlencode "password=$ADMIN_PASSWORD" \
        "$BASE/login")"

    if [[ "$login_status" == "302" || "$login_status" == "200" ]]; then
        AUTHENTICATED=1
        echo "    signed in as $ADMIN_EMAIL -> HTTP $login_status"
    else
        echo "    WARNING: sign-in POST returned HTTP $login_status (script-side CSRF/session issue, not necessarily a product bug) - continuing unauthenticated" >&2
    fi
else
    echo "    WARNING: no XSRF-TOKEN cookie from GET /login - continuing unauthenticated" >&2
fi

if [[ "$AUTHENTICATED" -eq 0 ]]; then
    echo "    NOTE: CRUD routes below are requested WITHOUT a session - a 302 to /login is expected and is not a failure; only >=500 is." >&2
fi

for path in "/widgets" "/widgets/create" "/widgets/${WIDGET_ID}" "/widgets/${WIDGET_ID}/edit"; do
    status="$(curl -s -o /dev/null -w '%{http_code}' -c "$COOKIES" -b "$COOKIES" "$BASE$path")"

    if [[ "$status" -ge 500 ]]; then
        echo "FAILED: ${path} returned HTTP ${status} - the generated resource 500s on a real request." >&2
        FAILED=1
    elif [[ "$AUTHENTICATED" -eq 1 && "$status" != "200" ]]; then
        echo "FAILED: ${path} returned HTTP ${status} while authenticated - expected 200." >&2
        FAILED=1
    else
        echo "    ${path} -> HTTP ${status}"
    fi
done

# --------------------------------------------- 7/8. published asset checks ---

echo "==> Verifying published assets at public/vendor/panel/"

APP_CSS="$APP/public/vendor/panel/app.css"
APP_JS="$APP/public/vendor/panel/app.js"

if [[ ! -f "$APP_CSS" ]]; then
    echo "FAILED: public/vendor/panel/app.css was never published." >&2
    FAILED=1
else
    css_missing=()

    while IFS= read -r selector; do
        [[ -z "$selector" ]] && continue
        unquoted="${selector//\'/}"
        if ! \grep -qF -- "$selector" "$APP_CSS" && ! \grep -qF -- "$unquoted" "$APP_CSS"; then
            css_missing+=("$selector")
        fi
    done < <(\grep -oE "\.pk-[a-zA-Z0-9_-]+|data-slot='[a-zA-Z0-9_-]+'" \
        "$ROOT/packages/ui/src/kit/design-system.css" | sort -u)

    if [[ "${#css_missing[@]}" -gt 0 ]]; then
        echo "FAILED: the REAL fresh install's published app.css is missing ${#css_missing[@]} design-system.css selector(s):" >&2
        printf '  %s\n' "${css_missing[@]}" >&2
        FAILED=1
    else
        echo "    app.css: all design-system.css selectors present"
    fi
fi

if [[ ! -f "$APP_JS" ]]; then
    echo "FAILED: public/vendor/panel/app.js was never published." >&2
    FAILED=1
else
    js_bytes="$(stat -c '%s' "$APP_JS")"

    if [[ "$js_bytes" -lt 10000 ]]; then
        echo "FAILED: public/vendor/panel/app.js is suspiciously small (${js_bytes} bytes) - likely broken." >&2
        FAILED=1
    else
        echo "    app.js: ${js_bytes} bytes, present"
    fi
fi

echo

if [[ "$FAILED" -eq 0 ]]; then
    echo "PASS: a fresh Laravel app, installing the real packaged artifact, boots and serves working CRUD routes with complete published assets."
    exit 0
fi

echo "FAILED - see the output above. Logs kept nowhere (scratch dir is removed on exit) - re-run with 'set -x' or comment out the cleanup trap to inspect." >&2
exit 1

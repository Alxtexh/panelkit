{{--
    Blocking appearance bootstrap for the document head.

    Include this BEFORE any stylesheet or Vite/kit script tag:

        @include('panel::appearance-prepaint')

    Long-term contract (v1.4.13+):
      1. Account JSON on window.__panelAppearance (users.appearance).
      2. PHP-computed token payload (same oklch tables as the client).
      3. Critical style#pk-appearance :root vars for first paint.
      4. Synchronous script: dark class, dataset, setProperty (beats later
         app.css :root), and rewrite #pk-appearance. Guests may replay a
         localStorage cache; signed-in accounts never do (cross-browser).

    Live admin edits use the same payload shape via applyAppearance() and
    update __panelAppearance + #pk-appearance + localStorage without a reload.
--}}
@php
    $panelAppearance = auth()->user()?->appearance;
    $panelAppearancePayload = is_array($panelAppearance)
        ? \Alxtexh\Panel\Support\AppearancePrepaint::payload($panelAppearance)
        : null;
    $panelAppearanceDefaults = \Alxtexh\Panel\Support\AppearancePrepaint::defaults();
    $panelAppearanceCss = \Alxtexh\Panel\Support\AppearancePrepaint::cssFromPayload(
        $panelAppearancePayload ?? $panelAppearanceDefaults
    );
@endphp
<script>
    window.__panelAppearance = @json($panelAppearance);
    window.__panelAppearanceServerVars = @json($panelAppearancePayload);
    window.__panelAppearanceDefaultVars = @json($panelAppearanceDefaults);
</script>
<style id="pk-appearance">{!! $panelAppearanceCss !!}</style>
<script>
    (function () {
        var root = document.documentElement;

        function cssText(vars) {
            var css = ':root { ';
            for (var name in vars) {
                if (Object.prototype.hasOwnProperty.call(vars, name)) {
                    css += name + ': ' + vars[name] + '; ';
                }
            }
            return css + '}';
        }

        function apply(payload) {
            if (!payload || !payload.vars) {
                return;
            }

            root.classList.toggle('dark', !!payload.dark);

            for (var name in payload.vars) {
                if (Object.prototype.hasOwnProperty.call(payload.vars, name)) {
                    root.style.setProperty(name, payload.vars[name]);
                }
            }

            if (payload.sidebar) {
                root.dataset.sidebar = payload.sidebar;
            }

            if (payload.contentLayout) {
                root.dataset.contentLayout = payload.contentLayout;
            }

            var style = document.getElementById('pk-appearance');

            if (style) {
                style.textContent = cssText(payload.vars);
            }

            window.__panelAppearanceApplied = true;
        }

        try {
            /*
             * Signed-in: the account value from PHP wins. Never replay a
             * localStorage cache here; a theme changed in another browser
             * would flash the stale accent until the bundle corrected it.
             */
            if (window.__panelAppearanceServerVars) {
                apply(window.__panelAppearanceServerVars);

                return;
            }

            var raw = localStorage.getItem('alxtexhpanel.appearance.vars');

            if (raw) {
                var cached = JSON.parse(raw);

                apply({
                    dark: !!cached.dark,
                    theme: cached.theme || 'light',
                    vars: cached.vars || {},
                    sidebar: cached.sidebar || null,
                    contentLayout: cached.contentLayout || null,
                });

                return;
            }
        } catch (e) {
            // Fall through to panel defaults.
        }

        /*
         * Guests with an empty cache, and any parse failure: apply the same
         * oklch defaults the client uses so app.css hsl tokens never paint.
         */
        apply(window.__panelAppearanceDefaultVars);
    })();
</script>
<style>
    html {
        background-color: oklch(0.975 0.008 250);
    }

    html.dark {
        background-color: oklch(0.145 0 0);
    }
</style>

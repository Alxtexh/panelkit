<?php

declare(strict_types=1);

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Every icon a resource names has a path in the UI package.
 *
 * THE FAILURE THIS CATCHES IS SILENT, which is the only reason it is worth a
 * test. `iconPath()` falls back to a dot for an unknown name, so an action that
 * declares `->icon('undo')` when the map has no `undo` renders a 4px dot next to
 * its label. Nothing errors, nothing logs, and it reads as an unfinished icon
 * rather than a missing one - it survived in the Restore bulk action until
 * somebody happened to look at the menu.
 *
 * IT CROSSES THE PHP/TS BOUNDARY DELIBERATELY. The names are declared in PHP and
 * resolved in TypeScript, so nothing inside either language can see both halves;
 * a test that reads the map as text is the only place the two can be compared.
 * Parsing is crude on purpose - it needs to know which keys exist, not what the
 * paths mean, and a stricter parser would break on formatting rather than on
 * anything real.
 */
final class DeclaredIconsExistTest extends TestCase
{
    public function test_every_declared_icon_has_a_path(): void
    {
        $map = file_get_contents(base_path('../../packages/ui/src/components/primitives/icons.ts'));

        $this->assertNotFalse($map, 'The icon map moved; this test points at the wrong file.');

        $declared = [];

        foreach (glob(app_path('Panel/Resources/*.php')) as $file) {
            preg_match_all("/->icon\('([a-z0-9-]+)'\)/", (string) file_get_contents($file), $matches);

            foreach ($matches[1] as $name) {
                $declared[$name] = basename($file);
            }
        }

        // A sanity floor: if the pattern above ever stops matching, this test
        // would pass by finding nothing to check.
        $this->assertGreaterThan(5, count($declared), 'No icons were found to check.');

        $missing = [];

        foreach ($declared as $name => $file) {
            $quoted = preg_quote($name, '/');

            // Keys are written bare when they are valid identifiers and quoted
            // when they contain a hyphen; both forms are legal TypeScript.
            if (preg_match("/(^|\s)'?{$quoted}'?\s*:/m", $map) !== 1) {
                $missing[] = "{$name} (declared in {$file})";
            }
        }

        $this->assertSame([], $missing, 'These icons render as a fallback dot.');
    }

    /**
     * AND EVERY NAVIGATION ICON, which is where this test had a hole.
     *
     * The method above reads `->icon('name')` - the ACTION vocabulary, declared
     * fluently inside a resource. A destination's icon is declared differently:
     * `protected static string $icon = 'router'` on a resource, and
     * `'icon' => 'mail'` in the page list. None of those were checked.
     *
     * IT COST A WHOLE NAVIGATION. The sidebar resolves icons through Lucide
     * components and never noticed; the phone's bottom bar resolves them through
     * this map, and not one navigation name was in it - so every item rendered
     * the fallback dot and the bar was five identical specks above five labels.
     * The failure is invisible on a desktop, which is where it was written.
     */
    public function test_every_navigation_icon_has_a_path(): void
    {
        $map = file_get_contents(base_path('../../packages/ui/src/components/primitives/icons.ts'));

        $this->assertNotFalse($map, 'The icon map moved; this test points at the wrong file.');

        $declared = [];

        // A resource's own icon: the static property or the accessor.
        foreach (glob(app_path('Panel/Resources/*.php')) as $file) {
            $source = (string) file_get_contents($file);

            preg_match_all("/\\\$icon\s*=\s*'([a-z0-9-]+)'/", $source, $property);
            preg_match_all("/function icon\(\): string\s*\{\s*return '([a-z0-9-]+)'/", $source, $accessor);

            foreach ([...$property[1], ...$accessor[1]] as $name) {
                $declared[$name] = basename($file);
            }
        }

        // Non-resource pages, and the bin the package contributes.
        foreach ([app_path('Panel/Pages.php'), base_path('../../packages/panel/src/Trash/TrashBin.php')] as $file) {
            preg_match_all("/'icon'\s*=>\s*'([a-z0-9-]+)'/", (string) file_get_contents($file), $matches);

            foreach ($matches[1] as $name) {
                $declared[$name] = basename($file);
            }
        }

        /*
         * THE HANDSET BAR PREPENDS ONE OF ITS OWN. It is the only icon named in
         * a Vue file rather than in PHP, and it was among the missing ones.
         */
        $declared['home'] = 'AppLayout.vue';

        $this->assertGreaterThan(8, count($declared), 'No navigation icons were found to check.');

        $missing = [];

        foreach ($declared as $name => $file) {
            $quoted = preg_quote($name, '/');

            if (preg_match("/(^|\s)'?{$quoted}'?\s*:/m", $map) !== 1) {
                $missing[] = "{$name} (declared in {$file})";
            }
        }

        $this->assertSame(
            [],
            $missing,
            'These render as a fallback dot in the handset navigation, which has no other icon source.',
        );
    }

    /**
     * AND THE DESKTOP SIDEBAR - the map the test above never checked.
     *
     * `test_every_navigation_icon_has_a_path()` compares declared navigation
     * icons against `icons.ts`, which is what the HANDSET bar resolves
     * through. The desktop sidebar resolves the exact same declared names
     * through a SEPARATE map - `panelIcons.ts`'s `PANEL_ICONS`, a curated
     * `Record<string, Component>` of `@lucide/vue` imports - and nothing
     * compared the two. The failure mode is worse here than a fallback dot:
     * `resolvePanelIcon()` falls back to the `Package` component, which is
     * ALSO a real, legitimately-declared icon for other resources
     * (`PlanResource`, `Cluster.php`) - so a missing icon doesn't read as
     * broken, it reads as "every new resource gets the box icon", which is
     * exactly the bug report that led here: most declared names (`webhook`,
     * `message-circle`, `layout-template`, `scroll-text`, `flag`, `building`,
     * `rocket`, `map`, `user-plus`, `folder`, `file`, `circle-check`) were
     * simply absent from a 37-entry map while `@lucide/vue` - already a
     * dependency - ships the icon for every one of them.
     */
    public function test_every_navigation_icon_exists_in_the_desktop_sidebar_map(): void
    {
        $map = file_get_contents(
            base_path('../../packages/ui/inertia/composables/panelIcons.ts'),
        );

        $this->assertNotFalse($map, 'The desktop sidebar icon map moved; this test points at the wrong file.');

        $declared = [];

        foreach (glob(app_path('Panel/Resources/*.php')) as $file) {
            $source = (string) file_get_contents($file);

            preg_match_all("/\\\$icon\s*=\s*'([a-z0-9-]+)'/", $source, $property);
            preg_match_all("/function icon\(\): string\s*\{\s*return '([a-z0-9-]+)'/", $source, $accessor);

            foreach ([...$property[1], ...$accessor[1]] as $name) {
                $declared[$name] = basename($file);
            }
        }

        foreach ([app_path('Panel/Pages.php'), base_path('../../packages/panel/src/Trash/TrashBin.php')] as $file) {
            preg_match_all("/'icon'\s*=>\s*'([a-z0-9-]+)'/", (string) file_get_contents($file), $matches);

            foreach ($matches[1] as $name) {
                $declared[$name] = basename($file);
            }
        }

        $this->assertGreaterThan(8, count($declared), 'No navigation icons were found to check.');

        $missing = [];

        foreach ($declared as $name => $file) {
            $quoted = preg_quote($name, '/');

            // PANEL_ICONS keys are always quoted when hyphenated and often
            // bare otherwise - same dual form as icons.ts above.
            if (preg_match("/(^|\s)'?{$quoted}'?\s*:/m", $map) !== 1) {
                $missing[] = "{$name} (declared in {$file})";
            }
        }

        $this->assertSame(
            [],
            $missing,
            'These render as the generic Package/box icon in the DESKTOP sidebar - invisibly, because '
            .'Package is also a legitimately-declared icon elsewhere, so a missing entry looks like a '
            .'correct one rather than an obvious fallback.',
        );
    }
}

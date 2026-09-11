<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\TestCase;

/**
 * `checkResourceIconNames()` - see its own docblock on `DoctorCommand` for
 * the bug this catches: `$icon = 'user-cog'` is the RIGHT property, holding
 * a real, plausible Lucide name that simply isn't in PanelKit's curated
 * ~60-icon set. It compiles and runs; the sidebar silently falls back to the
 * generic `Package` icon, indistinguishable from every other resource doing
 * the same - the "everything looks like the same icon" problem a curated
 * set exists to prevent, recreated by a different mistake than
 * `DoctorNavigationIconTest` covers.
 */
final class DoctorResourceIconNamesTest extends TestCase
{
    public function test_it_reports_a_resource_with_an_unsupported_icon_name(): void
    {
        $this->artisan('panel:doctor')
            ->expectsOutputToContain('declares an unsupported panel icon');
    }

    /** Only the finding title reaches console output - see `DoctorNavigationIconTest`'s own note on why. */
    public function test_it_names_the_resource_in_the_title(): void
    {
        $this->artisan('panel:doctor')
            ->expectsOutputToContain('Unsupported Icons declares an unsupported panel icon');
    }

    /**
     * A RESOURCE THAT NEVER OVERRODE `$icon` AT ALL must not trip this - the
     * inherited default (`'list'`) is a real, curated name, not a mistake.
     * `Resource::icon()` returning that default for every OTHER fixture is
     * also what proves a supported icon stays quiet: nothing here reports
     * for `ArticleResource`, `NoteResource`, or any of the rest.
     */
    public function test_it_stays_quiet_for_a_resource_using_the_inherited_default_icon(): void
    {
        $this->artisan('panel:doctor')
            ->doesntExpectOutputToContain('Notes declares an unsupported panel icon');
    }
}

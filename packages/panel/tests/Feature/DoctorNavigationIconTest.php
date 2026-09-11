<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\TestCase;

/**
 * `checkNavigationIconPropertyName()` - see its own docblock on
 * `DoctorCommand` for the bug this catches: `$navigationIcon` is Filament's
 * `Resource` property name, not PanelKit's (`$icon`), so a resource
 * declaring it compiles cleanly and silently keeps the inherited default
 * icon forever. Six independently-built resources made exactly this
 * mistake at once.
 */
final class DoctorNavigationIconTest extends TestCase
{
    private const TITLE = 'declares $navigationIcon, which PanelKit never reads';

    public function test_it_reports_a_resource_that_declares_navigation_icon(): void
    {
        $this->artisan('panel:doctor')
            ->expectsOutputToContain(self::TITLE);
    }

    /**
     * ONLY THE FINDING TITLE reaches console output (`DoctorCommand::
     * handle()` prints `$finding['title']` alone; `detail`/`suggested` are
     * for the dashboard SetupChecklist - see `checkPolicies()`'s own
     * comment on that split), so this checks what an operator running
     * `panel:doctor` in a terminal actually sees: the resource named, and
     * the exact wrong property name called out.
     */
    public function test_it_names_the_resource_and_the_wrong_property_in_the_title(): void
    {
        $this->artisan('panel:doctor')
            ->expectsOutputToContain('Misnamed Icons declares $navigationIcon');
    }

    /**
     * A RESOURCE THAT NEVER TOUCHED `$icon`/`$navigationIcon` AT ALL must
     * not trip this check - the base class's own inherited default is a
     * legitimate, unremarkable choice, not a mistake to report on every
     * resource that simply uses it.
     */
    public function test_it_stays_quiet_for_a_resource_with_no_icon_property_at_all(): void
    {
        $this->artisan('panel:doctor')
            ->doesntExpectOutputToContain('Notes declares $navigationIcon');
    }
}

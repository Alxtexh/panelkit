<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use Illuminate\Http\Request;
use Alxtexh\Panel\Models\ContentEntry;
use Alxtexh\Panel\Support\Changelog;
use Alxtexh\Panel\Support\OnboardingSteps;
use Alxtexh\Panel\Support\SupportEditing;

/**
 * The in-panel changelog, routed by declaring nothing.
 *
 * READY TO USE, NOT A BASE CLASS. Every other page in this package is something
 * a consumer extends; this one is complete, because the only thing that varies
 * between installations is the CONTENT, and that comes from
 * `panel.changelog` rather than from a subclass. Drop it in
 * `app/Panel/Pages`, or point `panel.discover_pages` at the package - either
 * way it routes itself.
 *
 * ITS ABILITY IS NULL. Release notes are for everybody who uses the panel; a
 * grant here would mean somebody who cannot see why the export button moved,
 * which is the one question this screen exists to answer.
 *
 * IT HIDES ITSELF WHEN THERE IS NOTHING TO SAY. A fresh installation has no
 * releases, and a menu entry leading to an empty page is worse than no entry -
 * it reads as a broken screen rather than an unused feature.
 */
final class ChangelogPage extends Page
{
    protected static string $icon = 'sparkles';

    public static function slug(): string
    {
        return 'whats-new';
    }

    public static function label(): string
    {
        return "What's new";
    }

    public static function ability(): ?string
    {
        return null;
    }

    /**
     * NOT PRESENT AT ALL until an installation declares releases.
     *
     * Registering unconditionally took `/whats-new` from an application that
     * already had its own changelog there - same URI, later registration wins,
     * and real content was replaced by an empty state.
     */
    public static function isEnabled(): bool
    {
        return ! Changelog::isEmpty();
    }

    public static function component(): string
    {
        return 'Changelog';
    }

    public static function heading(): string
    {
        return "What's new";
    }

    public static function data(Request $request): array
    {
        return [
            'releases' => Changelog::releases(),
            'support' => SupportEditing::props(ContentEntry::KIND_RELEASE),
            ...OnboardingSteps::whatsNewProps($request),
        ];
    }
}

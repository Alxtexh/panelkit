<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\Page;
use Alxtexh\Panel\Support\Ability;
use Alxtexh\Panel\Support\PanelSettings;
use App\Panel\Pages as NavigationPages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * One place to manage the single public landing page.
 *
 * The imported documents remain full-document presets. The public site never
 * exposes this catalogue; the administrator edits one active page here and
 * publishes its host-owned CMS content safely.
 */
final class LandingPagesPage extends Page
{
    protected static string $panel = 'admin';

    protected static string $icon = 'layout-template';

    protected static ?string $group = 'Landing pages';

    protected static ?int $sort = -100;

    public static function label(): string
    {
        return 'Landing page';
    }

    public static function ability(): string
    {
        return 'view_landing_pages';
    }

    /**
     * The app navigation owns the curated Landing pages group. Keeping this
     * generated page out of the automatic page list prevents a duplicate
     * gallery entry while retaining the normal page route and permissions.
     */
    public static function shouldShowInNavigation(): bool
    {
        return false;
    }

    public static function component(): string
    {
        return 'LandingPages';
    }

    public static function heading(): string
    {
        return 'Landing page';
    }

    public static function description(): string
    {
        return 'Manage the one public landing page your visitors see. Choose a shipped design, edit its conversion content, preview it outside the dashboard shell, and publish safely.';
    }

    /** @return array<string, mixed> */
    public static function data(Request $request): array
    {
        $configuration = NavigationPages::landingConfiguration();

        return [
            'templates' => NavigationPages::landingTemplates(),
            'selectedSlug' => $configuration['selected'],
            'enabledSlugs' => $configuration['enabled'],
            'orderSlugs' => $configuration['order'],
            'content' => $configuration['draft'],
            'publishedContent' => $configuration['published'],
            'contentBySlug' => $configuration['drafts'],
            'publishedContentBySlug' => $configuration['publishedPages'],
            'contentIsCustomBySlug' => collect($configuration['drafts'])
                ->map(fn (array $content): bool => NavigationPages::landingContentIsCustom($content))
                ->all(),
            'activeTemplate' => collect(NavigationPages::landingTemplates())
                ->firstWhere('slug', $configuration['selected']),
            'previewHref' => collect(NavigationPages::landingTemplates())
                ->firstWhere('slug', $configuration['selected'])['href'] ?? null,
            'canManage' => Ability::allows($request->user(), 'manage_landing_pages'),
        ];
    }

    public static function actions(): array
    {
        return [
            'save' => 'manage_landing_pages',
            'publish' => 'manage_landing_pages',
            'uploadMedia' => 'manage_landing_pages',
        ];
    }

    public static function actionUris(): array
    {
        return [
            'save' => 'save',
            'publish' => 'publish',
            'uploadMedia' => 'media/upload',
        ];
    }

    public static function save(Request $request): mixed
    {
        return self::persist($request, false);
    }

    public static function publish(Request $request): mixed
    {
        return self::persist($request, true);
    }

    /** Store an editor-selected image on the application's public media disk. */
    public static function uploadMedia(Request $request): mixed
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
        ]);

        $file = $validated['file'];
        $path = $file->store('landing-media', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
        ], 201);
    }

    private static function persist(Request $request, bool $publish): mixed
    {
        $slugs = array_column(NavigationPages::landingTemplates(), 'slug');
        $validated = $request->validate([
            'selected' => ['nullable', 'string'],
            'enabled' => ['present', 'array'],
            'enabled.*' => ['string'],
            'order' => ['present', 'array'],
            'order.*' => ['string'],
            'content' => ['sometimes', 'array'],
            'content.siteName' => ['sometimes', 'required', 'string', 'max:80'],
            'content.eyebrow' => ['sometimes', 'required', 'string', 'max:120'],
            'content.headline' => ['sometimes', 'required', 'string', 'max:160'],
            'content.description' => ['sometimes', 'required', 'string', 'max:320'],
            'content.primaryLabel' => ['sometimes', 'required', 'string', 'max:60'],
            'content.primaryHref' => ['sometimes', 'required', 'string', 'max:2048', 'regex:/^(\/|https?:\/\/)/i'],
            'content.secondaryLabel' => ['sometimes', 'required', 'string', 'max:60'],
            'content.secondaryHref' => ['sometimes', 'required', 'string', 'max:2048', 'regex:/^(\/|https?:\/\/)/i'],
            'content.logoUrl' => ['sometimes', 'nullable', 'string', 'max:2048', 'regex:/^(\/|https?:\/\/)/i'],
            'content.heroImageUrl' => ['sometimes', 'nullable', 'string', 'max:2048', 'regex:/^(\/|https?:\/\/)/i'],
            'content.socialImageUrl' => ['sometimes', 'nullable', 'string', 'max:2048', 'regex:/^(\/|https?:\/\/)/i'],
            'content.seoTitle' => ['sometimes', 'required', 'string', 'max:160'],
            'content.seoDescription' => ['sometimes', 'required', 'string', 'max:320'],
            'content.overrides' => ['sometimes', 'array', 'max:50'],
            'content.overrides.*.label' => ['sometimes', 'nullable', 'string', 'max:80'],
            'content.overrides.*.selector' => ['required', 'string', 'max:240'],
            'content.overrides.*.type' => ['required', 'string', 'in:text,image,link'],
            'content.overrides.*.value' => ['required', 'string', 'max:2048'],
            'content.overrides.*.alt' => ['sometimes', 'nullable', 'string', 'max:160'],
        ]);

        $current = NavigationPages::landingConfiguration();

        $enabled = array_values(array_unique(array_intersect(
            $slugs,
            $validated['enabled'],
        )));
        $order = array_values(array_unique(array_intersect(
            $slugs,
            $validated['order'],
        )));

        foreach ($slugs as $slug) {
            if (! in_array($slug, $order, true)) {
                $order[] = $slug;
            }
        }

        $selected = $validated['selected'] ?? $current['selected'];

        if (! in_array($selected, $enabled, true)) {
            return back()->withErrors([
                'selected' => 'The public landing page must be enabled before it can be selected.',
            ]);
        }

        $draft = array_key_exists('content', $validated)
            ? NavigationPages::normaliseLandingContent($validated['content'])
            : $current['draft'];
        $drafts = $current['drafts'];
        $publishedPages = $current['publishedPages'];
        $drafts[$selected] = $draft;

        if ($publish) {
            $publishedPages[$selected] = $draft;
        }

        // Keep the active legacy keys for older integrations while the
        // slug-keyed maps become the source of truth for the CMS.
        $published = $publishedPages[$selected];

        app(PanelSettings::class)->put(
            NavigationPages::LANDING_SETTING,
            compact('selected', 'enabled', 'order', 'draft', 'published', 'drafts', 'publishedPages'),
            (string) $request->user()->getAuthIdentifier(),
        );

        return back()->with('success', $publish
            ? 'Landing page published.'
            : 'Landing page draft saved.');
    }
}

<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use InvalidArgumentException;
use Alxtexh\Panel\Files\FileStore;
use Alxtexh\Panel\Media\PanelMediaItem;
use Alxtexh\Panel\Notifications\Notification;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\TenantContext;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Media library on local disk. OFF until `apps(['media-library'])`.
 *
 * Tenant-scoped paths under `{tenant}/media/`. Host may swap disk via Laravel
 * config. Preview and download URLs use disk temporary URLs when the driver
 * supports them, otherwise kit signed routes. Override `resolveItemUrl()` to
 * supply a host URL (or return an empty string to hide links).
 */
class MediaLibraryPage extends Page
{
    protected static string $icon = 'folder';

    protected static ?string $group = 'Files';

    /** Minutes a generated preview/download URL remains valid. */
    protected static int $urlTtlMinutes = 30;

    public static function uri(): string
    {
        return 'files/media-library';
    }

    public static function label(): string
    {
        return 'Media library';
    }

    public static function component(): string
    {
        return 'MediaLibrary';
    }

    public static function isEnabled(): bool
    {
        $panel = app(PanelManager::class)->panel(static::panel());

        return $panel !== null && $panel->offersApp('media-library');
    }

    public static function actions(): array
    {
        return [
            'upload' => 'manage_media_library',
            'move' => 'manage_media_library',
            'delete' => 'manage_media_library',
            'preview' => 'view_media_library',
            'download' => 'view_media_library',
        ];
    }

    public static function actionUris(): array
    {
        return [
            'upload' => 'upload',
            'move' => 'move',
            'delete' => 'delete',
            'preview' => 'preview',
            'download' => 'download',
        ];
    }

    public static function actionMethods(): array
    {
        return [
            'preview' => 'get',
            'download' => 'get',
        ];
    }

    public static function description(): ?string
    {
        return 'Tenant-scoped files. Preview and download use temporary signed URLs on private disks.';
    }

    /**
     * @return list<string>
     */
    public static function folders(Request $request): array
    {
        $tenantId = app(TenantContext::class)->currentKey();

        if ($tenantId === null) {
            return [];
        }

        $folders = PanelMediaItem::query()
            ->where('tenant_id', $tenantId)
            ->distinct()
            ->orderBy('folder')
            ->pluck('folder')
            ->all();

        $result = [];
        foreach ($folders as $folder) {
            $result[] = (string) $folder;
        }

        return $result;
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        $tenantId = app(TenantContext::class)->currentKey();
        $folder = (string) $request->query('folder', '');
        $base = static::pageHref();

        $items = $tenantId === null ? [] : PanelMediaItem::query()
            ->where('tenant_id', $tenantId)
            ->where('folder', $folder)
            ->orderByDesc('id')
            ->get()
            ->map(static function (PanelMediaItem $row): array {
                $mime = $row->mime;
                $isImage = is_string($mime) && str_starts_with($mime, 'image/');
                $preview = static::itemUrl($row, 'inline');
                $download = static::itemUrl($row, 'attachment');

                return [
                    'id' => $row->id,
                    'name' => $row->name,
                    'path' => $row->path,
                    'mime' => $mime,
                    'size' => $row->size,
                    'folder' => $row->folder,
                    'url' => $preview !== '' ? $preview : null,
                    'download_url' => $download !== '' ? $download : null,
                    'is_image' => $isImage,
                ];
            })
            ->all();

        return [
            'folder' => $folder,
            'folders' => static::folders($request),
            'items' => $items,
            'uploadHref' => $base.'/upload',
            'moveHref' => $base.'/move',
            'deleteHref' => $base.'/delete',
        ];
    }

    /**
     * Host hook: return a URL string to use as-is, `''` to hide the link, or
     * `null` to fall through to kit temporary / signed URL generation.
     */
    protected static function resolveItemUrl(PanelMediaItem $row, string $disposition): ?string
    {
        return null;
    }

    /**
     * Preview (`inline`) or download (`attachment`) URL for one media row.
     */
    public static function itemUrl(PanelMediaItem $row, string $disposition = 'inline'): ?string
    {
        $custom = static::resolveItemUrl($row, $disposition);

        if ($custom !== null) {
            return $custom === '' ? null : $custom;
        }

        $path = $row->path;

        if ($path === '' || ! FileStore::belongsToCurrentTenant($path)) {
            return null;
        }

        $disk = Storage::disk(FileStore::disk());

        if (! $disk->exists($path)) {
            return null;
        }

        $expires = now()->addMinutes(max(1, static::$urlTtlMinutes));

        try {
            if ($disk->providesTemporaryUrls()) {
                $options = [];

                if ($disposition === 'attachment') {
                    $options['ResponseContentDisposition'] = 'attachment; filename="'.addslashes($row->name).'"';
                }

                return $disk->temporaryUrl($path, $expires, $options);
            }
        } catch (\Throwable) {
            // Fall through to kit signed routes.
        }

        $action = $disposition === 'attachment' ? 'download' : 'preview';
        $routeName = static::actionRouteName($action);

        if ($routeName !== null && Route::has($routeName)) {
            try {
                return URL::temporarySignedRoute($routeName, $expires, ['id' => $row->id]);
            } catch (\Throwable) {
                // Fall through to an auth-gated relative URL.
            }
        }

        return static::pageHref().'/'.$action.'?id='.$row->id;
    }

    public static function preview(Request $request): StreamedResponse
    {
        return self::stream($request, disposition: 'inline');
    }

    public static function download(Request $request): StreamedResponse
    {
        return self::stream($request, disposition: 'attachment');
    }

    private static function stream(Request $request, string $disposition): StreamedResponse
    {
        if ($request->query->has('signature') && ! $request->hasValidSignature()) {
            abort(403);
        }

        $tenantId = app(TenantContext::class)->currentKey();
        abort_if($tenantId === null, 403);

        $id = (int) $request->query('id', 0);
        abort_if($id < 1, 404);

        $item = PanelMediaItem::query()
            ->where('tenant_id', $tenantId)
            ->whereKey($id)
            ->firstOrFail();

        abort_unless(FileStore::belongsToCurrentTenant($item->path), 404);

        $disk = Storage::disk(FileStore::disk());
        abort_unless($disk->exists($item->path), 404);

        $headers = [
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, max-age=60',
        ];

        if ($disposition === 'attachment') {
            return $disk->download($item->path, $item->name, $headers);
        }

        return $disk->response($item->path, $item->name, [
            ...$headers,
            'Content-Disposition' => 'inline; filename="'.$item->name.'"',
        ]);
    }

    public static function upload(Request $request): RedirectResponse
    {
        $tenantId = app(TenantContext::class)->currentKey();
        $user = $request->user();

        abort_if($tenantId === null, 403);

        $validated = $request->validate([
            'file' => ['required', 'file', 'max:10240'],
            'folder' => ['nullable', 'string', 'max:120'],
        ]);

        /** @var UploadedFile $file */
        $file = $validated['file'];
        $folder = (string) ($validated['folder'] ?? '');

        try {
            $pending = FileStore::acceptPending($file, FileStore::knownExtensions(), FileStore::maxKilobytes());
            $path = FileStore::promote($pending->handle, 'media');
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['file' => $e->getMessage()]);
        }

        PanelMediaItem::query()->create([
            'tenant_id' => $tenantId,
            'folder' => $folder,
            'path' => $path,
            'name' => $file->getClientOriginalName(),
            'mime' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $user !== null ? (int) $user->getAuthIdentifier() : null,
        ]);

        Notification::make()->title('File uploaded')->success()->send();

        return back();
    }

    public static function move(Request $request): RedirectResponse
    {
        $tenantId = app(TenantContext::class)->currentKey();

        abort_if($tenantId === null, 403);

        $validated = $request->validate([
            'id' => ['required', 'integer'],
            'folder' => ['required', 'string', 'max:120'],
        ]);

        PanelMediaItem::query()
            ->where('tenant_id', $tenantId)
            ->whereKey($validated['id'])
            ->update(['folder' => $validated['folder']]);

        Notification::make()->title('File moved')->success()->send();

        return back();
    }

    public static function delete(Request $request): RedirectResponse
    {
        $tenantId = app(TenantContext::class)->currentKey();

        abort_if($tenantId === null, 403);

        $validated = $request->validate([
            'id' => ['required', 'integer'],
        ]);

        $item = PanelMediaItem::query()
            ->where('tenant_id', $tenantId)
            ->whereKey($validated['id'])
            ->firstOrFail();

        if (FileStore::belongsToCurrentTenant($item->path)) {
            Storage::disk(FileStore::disk())->delete($item->path);
        }

        $item->delete();

        Notification::make()->title('File deleted')->success()->send();

        return back();
    }

    protected static function actionRouteName(string $action): ?string
    {
        $panel = app(PanelManager::class)->currentPanel()
            ?? app(PanelManager::class)->panel(static::panel());

        if ($panel === null) {
            return null;
        }

        return $panel->getRouteName().'.pages.'.static::slug().'.'.$action;
    }

    protected static function pageHref(): string
    {
        $path = '/'.trim(static::navigationPath(), '/');
        $prefix = app(PanelManager::class)->currentPanel()?->getPath() ?? '';

        if ($prefix !== '' && $prefix !== '/') {
            $path = rtrim($prefix, '/').$path;
        }

        if (! str_starts_with($path, '/')) {
            $path = '/'.$path;
        }

        return $path;
    }
}

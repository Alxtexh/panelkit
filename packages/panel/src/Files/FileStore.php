<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Files;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use DateTimeInterface;
use InvalidArgumentException;
use Alxtexh\Panel\Support\TenantContext;
use RuntimeException;
use Throwable;

/**
 * Where uploaded files go, and what is allowed to become one.
 *
 * AN UPLOAD IS UNTRUSTED INPUT THAT THE SERVER THEN STORES AND LATER SERVES,
 * which makes it the highest-leverage input in a panel. Everything here exists
 * because one of these is what turns a file field into remote code execution or
 * stored XSS:
 *
 *   1. THE TYPE IS SNIFFED, NEVER TAKEN FROM THE REQUEST. The browser sends a
 *      `Content-Type` and a filename, and an attacker sends whatever they like
 *      - `image/jpeg` on a PHP script costs nothing to claim. `getMimeType()`
 *      reads the bytes through finfo, which is the only statement about the
 *      file the client cannot author.
 *
 *   2. THE EXTENSION IS AN ALLOWLIST, and it must AGREE with the sniffed type.
 *      A denylist is a promise to have thought of every dangerous extension,
 *      and it is always missing one - `.phtml`, `.php5`, `.pht`, `.phar`. And
 *      checking the two independently is not enough either: a polyglot with a
 *      valid JPEG header and PHP in its tail passes a MIME check while named
 *      `.php`, so the pair has to be consistent, not merely individually
 *      acceptable.
 *
 *   3. THE STORED NAME IS GENERATED. A client filename is an attack surface in
 *      its own right - `../../.env`, a null byte, a right-to-left override that
 *      makes `gpj.php` render as `php.jpg`. The original is kept as DATA, for
 *      display and for the download filename, and never as a path.
 *
 *   4. THE DISK IS PRIVATE. A file under `public/` is served by the web server
 *      with whatever handler its extension maps to, and no amount of care above
 *      matters if the deployment hands it to PHP-FPM. Reading goes through a
 *      controller that checks authorization first.
 *
 * SVG IS NOT AN IMAGE HERE, and its absence from the default set is deliberate.
 * It is a document format that executes script, so accepting it as "an image"
 * is accepting stored XSS from anyone who can upload an avatar. A panel that
 * genuinely needs it must ask for it, and sanitise on the way out.
 */
final class FileStore
{
    /**
     * Extension => the MIME types finfo may legitimately report for it.
     *
     * Written this way round because the extension is what the filesystem and
     * the web server will act on, and the sniffed type is the evidence that the
     * extension is honest.
     *
     * @var array<string, list<string>>
     */
    private const TYPES = [
        'jpg' => ['image/jpeg'],
        'jpeg' => ['image/jpeg'],
        'png' => ['image/png'],
        'gif' => ['image/gif'],
        'webp' => ['image/webp'],
        'avif' => ['image/avif'],
        'pdf' => ['application/pdf'],
        'csv' => ['text/csv', 'text/plain', 'application/csv'],
        'txt' => ['text/plain'],
        'zip' => ['application/zip'],
        'doc' => ['application/msword'],
        'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
        'xls' => ['application/vnd.ms-excel'],
        'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'],
    ];

    /** Extensions that count as an image when a field asks for images. */
    public const IMAGES = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];

    public static function disk(): string
    {
        return (string) config('panel.uploads.disk', 'local');
    }

    /** The largest file the panel will accept at all, in kilobytes. */
    public static function maxKilobytes(): int
    {
        return (int) config('panel.uploads.max_kilobytes', 10240);
    }

    /**
     * Every extension the panel knows how to vet.
     *
     * A field may narrow this; it may not widen it. An extension with no
     * sniffed-type entry cannot be checked for consistency, and something this
     * code cannot vet must not be storable through it.
     *
     * @return list<string>
     */
    public static function knownExtensions(): array
    {
        return array_keys(self::TYPES);
    }

    /**
     * Accept an upload into the PENDING area and return its handle.
     *
     * Pending, not final, because the form it belongs to has not been validated
     * yet - and a file that only survives a successful submit is a file the
     * user has to pick again every time another field fails. The handle is what
     * the form carries; promotion happens on save.
     *
     * @param  list<string>  $extensions  Allowed extensions, already narrowed by the field.
     */
    public static function acceptPending(UploadedFile $file, array $extensions, int $maxKilobytes): PendingFile
    {
        self::assertAcceptable($file, $extensions, $maxKilobytes);

        // The handle is random, not derived from anything about the file: a
        // predictable id would let one user guess another's pending upload and
        // attach it to their own record.
        $handle = (string) Str::uuid();

        $path = self::pendingPath($handle);

        Storage::disk(self::disk())->putFileAs(dirname($path), $file, basename($path));

        $meta = [
            'name' => self::safeDisplayName($file->getClientOriginalName()),
            'extension' => self::extensionOf($file),
            'size' => $file->getSize(),
            'mime' => $file->getMimeType(),
            // Whose upload this is. Checked again at promotion time, because
            // the handle travels through the client and comes back.
            'owner' => (string) (auth()->id() ?? ''),
            'tenant' => self::tenantSegment(),
        ];

        Storage::disk(self::disk())->put($path.'.json', json_encode($meta, JSON_THROW_ON_ERROR));

        return new PendingFile($handle, $meta['name'], (int) $meta['size']);
    }

    /**
     * Accept one chunk and assemble the normal pending-file handle on the last.
     *
     * Chunk metadata is tenant- and owner-bound. Chunks are never trusted as a
     * complete file: the assembled bytes go through acceptPending(), so the
     * existing size, MIME, extension, and host scanner checks remain the final
     * authority.
     *
     * @param  list<string>  $extensions
     * @return array{uploadId: string, complete: bool, handle?: string, name?: string, size?: int}
     */
    public static function acceptChunk(
        UploadedFile $file,
        ?string $uploadId,
        int $chunk,
        int $total,
        string $name,
        array $extensions,
        int $maxKilobytes,
    ): array {
        $maxChunks = max(1, (int) config('panel.uploads.max_chunks', 1000));

        if ($total < 1 || $total > $maxChunks || $chunk < 0 || $chunk >= $total) {
            throw new InvalidArgumentException('The upload chunk sequence is invalid.');
        }

        if ($uploadId === null) {
            $uploadId = (string) Str::uuid();
        }

        if (preg_match('/^[0-9a-f-]{36}$/i', $uploadId) !== 1) {
            throw new InvalidArgumentException('The upload session is invalid.');
        }

        $disk = Storage::disk(self::disk());
        $directory = self::tenantSegment().'/pending-chunks/'.$uploadId;
        $metadataPath = $directory.'/meta.json';
        $metadata = $disk->exists($metadataPath)
            ? json_decode((string) $disk->get($metadataPath), true)
            : null;

        if (! is_array($metadata)) {
            $metadata = [
                'owner' => (string) (auth()->id() ?? ''),
                'tenant' => self::tenantSegment(),
                'name' => self::safeDisplayName($name),
                'total' => $total,
                'received' => [],
                'size' => 0,
            ];
        }

        if (($metadata['owner'] ?? null) !== (string) (auth()->id() ?? '')
            || ($metadata['tenant'] ?? null) !== self::tenantSegment()
            || (int) ($metadata['total'] ?? 0) !== $total) {
            throw new InvalidArgumentException('The upload session does not belong to the current user.');
        }

        $path = $directory.'/chunk-'.$chunk;
        $oldSize = $disk->exists($path) ? $disk->size($path) : 0;
        $disk->makeDirectory($directory);
        $disk->putFileAs($directory, $file, 'chunk-'.$chunk);
        $newSize = $disk->size($path);
        $metadata['size'] = (int) ($metadata['size'] ?? 0) - $oldSize + $newSize;

        if ($metadata['size'] > $maxKilobytes * 1024) {
            self::forgetChunked($uploadId);
            throw new InvalidArgumentException("The file is larger than {$maxKilobytes} KB.");
        }

        $received = array_fill_keys(array_map('intval', (array) ($metadata['received'] ?? [])), true);
        $received[$chunk] = true;
        $metadata['received'] = array_map('intval', array_keys($received));
        sort($metadata['received']);
        $disk->put($metadataPath, json_encode($metadata, JSON_THROW_ON_ERROR));

        if (count($metadata['received']) !== $total) {
            return ['uploadId' => $uploadId, 'complete' => false];
        }

        $assembled = tempnam(sys_get_temp_dir(), 'panel-upload-');
        $output = $assembled === false ? false : fopen($assembled, 'wb');

        if ($output === false) {
            self::forgetChunked($uploadId);
            throw new InvalidArgumentException('The upload could not be assembled.');
        }

        try {
            for ($index = 0; $index < $total; $index++) {
                $input = fopen($disk->path($directory.'/chunk-'.$index), 'rb');

                if ($input === false) {
                    throw new InvalidArgumentException('The upload chunk is unavailable.');
                }

                stream_copy_to_stream($input, $output);
                fclose($input);
            }

            fclose($output);
            $pending = self::acceptPending(
                new UploadedFile($assembled, $metadata['name'], null, null, true),
                $extensions,
                $maxKilobytes,
            );
        } finally {
            if (is_resource($output)) {
                fclose($output);
            }

            @unlink($assembled);
            self::forgetChunked($uploadId);
        }

        return [
            'uploadId' => $uploadId,
            'complete' => true,
            ...$pending->toArray(),
        ];
    }

    public static function forgetChunked(string $uploadId): void
    {
        if (preg_match('/^[0-9a-f-]{36}$/i', $uploadId) !== 1) {
            return;
        }

        Storage::disk(self::disk())->deleteDirectory(self::tenantSegment().'/pending-chunks/'.$uploadId);
    }

    /**
     * Move a pending upload to its permanent home and return the stored path.
     *
     * OWNERSHIP IS RE-CHECKED HERE, not only at upload. The handle makes a round
     * trip through the browser, so by the time it comes back the only thing
     * known about it is that somebody sent it - and "somebody" is exactly the
     * person who must not be able to attach a colleague's pending scan to their
     * own record by pasting an id.
     */
    public static function promote(string $handle, string $directory): string
    {
        $meta = self::readPending($handle);

        if ($meta === null) {
            throw new RuntimeException("Upload [{$handle}] has expired or does not exist.");
        }

        $owner = (string) (auth()->id() ?? '');

        if ($meta['owner'] !== $owner) {
            throw new RuntimeException("Upload [{$handle}] does not belong to the current user.");
        }

        $disk = Storage::disk(self::disk());
        $source = self::pendingPath($handle);

        // Directory comes from the field definition, never from the request,
        // but it is validated anyway: a traversal segment here would escape the
        // tenant prefix that is the whole basis of isolation.
        $target = sprintf(
            '%s/%s/%s.%s',
            self::tenantSegment(),
            self::assertSafeSegment($directory),
            Str::uuid(),
            $meta['extension'],
        );

        $disk->move($source, $target);

        // The sidecar travels with the file rather than being thrown away.
        // The stored name is a uuid, deliberately, so this is the only record
        // of what the user actually called it - and without it a download is
        // served as `9f3c1e....pdf`, which is not the file they uploaded as far
        // as they are concerned.
        $disk->move($source.'.json', $target.'.json');

        return $target;
    }

    /**
     * The rules a file must satisfy, checked against its BYTES.
     *
     * @param  list<string>  $extensions
     */
    private static function assertAcceptable(UploadedFile $file, array $extensions, int $maxKilobytes): void
    {
        if (! $file->isValid()) {
            throw new InvalidArgumentException('The upload did not complete.');
        }

        if ($file->getSize() > $maxKilobytes * 1024) {
            throw new InvalidArgumentException("The file is larger than {$maxKilobytes} KB.");
        }

        $extension = self::extensionOf($file);

        if (! in_array($extension, $extensions, true)) {
            throw new InvalidArgumentException("Files of type [{$extension}] are not accepted here.");
        }

        // Sniffed from the bytes by finfo. `getClientMimeType()` is the header
        // the browser sent and is worth exactly what the sender says it is.
        $mime = (string) $file->getMimeType();

        if (! in_array($mime, self::TYPES[$extension] ?? [], true)) {
            throw new InvalidArgumentException(
                "The file's contents ({$mime}) do not match its .{$extension} extension.",
            );
        }

        $scanner = config('panel.uploads.scanner');

        if (is_callable($scanner)) {
            try {
                if ($scanner($file) === false) {
                    throw new InvalidArgumentException('The file was rejected by the security scanner.');
                }
            } catch (InvalidArgumentException $e) {
                throw $e;
            } catch (Throwable) {
                // A scanner outage must fail closed, without exposing scanner
                // internals or allowing an uninspected file into storage.
                throw new InvalidArgumentException('The file could not be cleared by the security scanner.');
            }
        }
    }

    /**
     * The extension, taken from the client name but never trusted on its own.
     *
     * `guessExtension()` would derive it from the sniffed type instead, which
     * sounds safer and is worse: it silently RENAMES the file the user chose,
     * so a `.phtml` upload becomes `.txt` and is accepted rather than refused.
     * The point is to reject the mismatch, not to paper over it.
     */
    private static function extensionOf(UploadedFile $file): string
    {
        return strtolower((string) pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION));
    }

    /**
     * The original name, reduced to something safe to render and to echo back
     * in a Content-Disposition header.
     *
     * Kept as DATA only. It never becomes part of a path.
     */
    public static function safeDisplayName(string $name): string
    {
        // Strip directory parts, control characters, and the bidirectional
        // overrides that make `txt.exe` render as `exe.txt`.
        $name = basename($name);
        $name = preg_replace('/[\x00-\x1F\x7F\p{Cf}]/u', '', $name) ?? '';
        $name = trim($name);

        return $name === '' ? 'file' : Str::limit($name, 120, '');
    }

    /** @return array<string, mixed>|null */
    public static function readPending(string $handle): ?array
    {
        if (preg_match('/^[0-9a-f-]{36}$/i', $handle) !== 1) {
            return null;
        }

        $disk = Storage::disk(self::disk());
        $meta = self::pendingPath($handle).'.json';

        if (! $disk->exists($meta)) {
            return null;
        }

        $decoded = json_decode((string) $disk->get($meta), true);

        return is_array($decoded) ? $decoded : null;
    }

    public static function forget(string $handle): void
    {
        if (preg_match('/^[0-9a-f-]{36}$/i', $handle) !== 1) {
            return;
        }

        $disk = Storage::disk(self::disk());

        $disk->delete([self::pendingPath($handle), self::pendingPath($handle).'.json']);
    }

    /**
     * What is known about a stored file: its original name and size.
     *
     * Returns null when the path is not this tenant's, so a caller cannot use
     * this to probe for the existence of someone else's file.
     *
     * @return array{name: string, size: int}|null
     */
    public static function describe(string $path): ?array
    {
        if (! self::belongsToCurrentTenant($path)) {
            return null;
        }

        $disk = Storage::disk(self::disk());

        if (! $disk->exists($path)) {
            return null;
        }

        $meta = [];

        if ($disk->exists($path.'.json')) {
            $decoded = json_decode((string) $disk->get($path.'.json'), true);
            $meta = is_array($decoded) ? $decoded : [];
        }

        return [
            'name' => self::safeDisplayName((string) ($meta['name'] ?? basename($path))),
            'size' => (int) ($meta['size'] ?? $disk->size($path)),
        ];
    }

    /**
     * Issue a short-lived signed URL from a private-capable storage adapter.
     *
     * This method does not authorize a record; callers must do that first.
     * It does enforce the current tenant prefix, so an authorized caller still
     * cannot mint a link for another tenant's path by mistake.
     *
     * @param  array<string, string>  $options
     */
    public static function temporaryUrl(string $path, DateTimeInterface $expiration, array $options = []): string
    {
        if (! self::belongsToCurrentTenant($path)) {
            throw new RuntimeException('The file does not belong to the current tenant.');
        }

        $disk = Storage::disk(self::disk());

        return (string) $disk->temporaryUrl($path, $expiration, $options);
    }

    /**
     * Whether a stored path belongs to the tenant making the request.
     *
     * THE PREFIX TEST ALONE WAS NOT AN OWNERSHIP CHECK, because it and the
     * filesystem disagreed about what a path means. `str_starts_with` reads the
     * string literally; Flysystem NORMALISES `.` and `..` before touching the
     * disk, and only refuses when the result escapes the disk root. So
     *
     *     tenants/1/../../backups/2026-08-11.zip
     *
     * started with `tenants/1/`, passed as this tenant's, and then resolved to
     * a file outside any tenant at all.
     *
     * IT WAS REACHABLE, NOT THEORETICAL. `FileUploadField::transformForStorage`
     * stores any string this method accepts, verbatim, and validates it only as
     * `string|max:2048` - so an operator could write such a path onto their own
     * record and then fetch it through the ordinary download route, which
     * treats this method as the sole authority on the path.
     *
     * REFUSING TRAVERSAL HERE RATHER THAN AT EACH CALLER is the point: three
     * places consult this - the download, `describe()`, and the field's storage
     * transform - and a check that has to be remembered separately in each is
     * one that will be missed in the fourth.
     *
     * Backslashes are refused outright. They are not a path separator on the
     * disks this writes to, so a stored path containing one is not a file this
     * package created - and normalising it is a guess about which layer will
     * translate it.
     */
    public static function belongsToCurrentTenant(string $path): bool
    {
        if (str_contains($path, '\\') || str_contains($path, "\0")) {
            return false;
        }

        // Any `.` or `..` as a whole segment, anywhere in the path.
        if (preg_match('#(^|/)\.\.?(/|$)#', $path) === 1) {
            return false;
        }

        return str_starts_with($path, self::tenantSegment().'/');
    }

    private static function pendingPath(string $handle): string
    {
        return self::tenantSegment().'/pending/'.$handle;
    }

    /**
     * The tenant prefix every path carries.
     *
     * Files are the one kind of tenant data with no global scope to fall back
     * on - a filesystem has no WHERE clause - so isolation has to be structural,
     * and the download route checks this prefix rather than assuming the path
     * it was handed is one the caller may read.
     */
    private static function tenantSegment(): string
    {
        $key = app(TenantContext::class)->currentKey();

        return 'tenants/'.self::assertSafeSegment((string) ($key ?? 'shared'));
    }

    private static function assertSafeSegment(string $segment): string
    {
        if (preg_match('/^[A-Za-z0-9_-]+$/', $segment) !== 1) {
            throw new InvalidArgumentException("[{$segment}] is not a valid storage path segment.");
        }

        return $segment;
    }
}

<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\Actions\ExportedFile;
use Alxtexh\Panel\Actions\JobStatus;
use Alxtexh\Panel\Imports\Importer;
use Alxtexh\Panel\Imports\ImportRetry;
use Alxtexh\Panel\Imports\RowsReader;
use Alxtexh\Panel\Jobs\ImportRecords;
use Alxtexh\Panel\PanelManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Opt-in CSV import (Excel optional). Inspect, dry-run, queue, failed-row CSV.
 */
final class ImportController extends Controller
{
    public function inspect(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);
        $path = $this->uploadedPath($request, $class);

        try {
            $headers = RowsReader::open($path)->headers();
        } finally {
            @unlink($path);
        }

        $fields = array_map(
            static fn ($field): array => [
                'key' => $field->key,
                'label' => $field->resolvedLabel(),
                'required' => $field->isRequired(),
            ],
            $class::importForm()->fields(),
        );

        return response()->json(['headers' => $headers, 'fields' => $fields]);
    }

    public function store(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);

        $validated = $request->validate([
            'file' => ['required', 'file'],
            'mapping' => ['required', 'array'],
            'mapping.*' => ['required', 'string'],
            'dryRun' => ['sometimes'],
            'idempotencyKey' => ['sometimes', 'nullable', 'string', 'max:128'],
        ]);

        $dryRun = filter_var($validated['dryRun'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $mapping = array_filter(
            $validated['mapping'],
            static fn (string $field): bool => $field !== '',
        );

        $path = $this->uploadedPath($request, $class);

        if ($dryRun) {
            try {
                $result = (new Importer($class::importForm(), $mapping))
                    ->process(RowsReader::open($path)->rows());
            } finally {
                @unlink($path);
            }

            return response()->json($result->toArray());
        }

        $stored = $this->keepUpload($path);
        $userId = Auth::id();

        abort_if($userId === null, 403);

        $dispatched = false;
        $token = JobStatus::startFor(
            $userId,
            "import:{$resource}",
            isset($validated['idempotencyKey'])
                ? (string) $validated['idempotencyKey']
                : ($request->header('Idempotency-Key') ?: null),
            function (string $token) use (&$dispatched, $resource, $stored, $mapping, $userId): void {
                $dispatched = true;
                ImportRecords::dispatch($resource, $stored, $mapping, $userId, $token, false);
            },
            hash('sha256', json_encode([
                'resource' => $resource,
                'mapping' => $mapping,
                'file' => hash_file('sha256', $stored) ?: basename($stored),
            ], JSON_THROW_ON_ERROR)),
        );

        if ($dispatched === false) {
            // A retry with the same key created a temporary copy before the
            // shared job store could tell us it was already running. Do not
            // accumulate orphaned uploads while correctly avoiding a second
            // dispatch.
            @unlink($stored);
        }

        $state = JobStatus::get($token, $userId);

        if ($state !== null && $state['status'] === JobStatus::DONE) {
            return response()->json([
                'importable' => $state['importable'] ?? 0,
                'failed' => $state['failed'] ?? 0,
                'failures' => $state['failures'] ?? [],
                'truncated' => $state['truncated'] ?? false,
                'written' => $state['written'] ?? 0,
                'token' => $token,
                'failuresDownload' => ($state['file'] ?? null) === null
                    ? null
                    : $class::baseUrl("import/failures/{$token}"),
            ]);
        }

        return response()->json([
            'queued' => true,
            'token' => $token,
            'status' => $state['status'] ?? JobStatus::PENDING,
        ]);
    }

    public function failures(Request $request, string $resource, string $token): StreamedResponse
    {
        $class = $this->guard($resource);
        abort_unless($class::can('create'), 403);

        $userId = Auth::id();
        abort_if($userId === null, 403);

        $export = ExportedFile::find($token, $userId);

        if ($export === null) {
            throw new NotFoundHttpException('No such import report.');
        }

        $disk = Storage::disk($export['disk']);

        if (! $disk->exists($export['path'])) {
            throw new NotFoundHttpException('That report is no longer available.');
        }

        return $disk->download($export['path'], 'import-failures.csv');
    }

    public function retry(Request $request, string $resource, string $token): JsonResponse
    {
        $class = $this->guard($resource);
        $userId = Auth::id();
        abort_if($userId === null, 403);

        $retry = ImportRetry::find($token, $userId);

        if ($retry === null || $retry['resource'] !== $resource) {
            throw new NotFoundHttpException('No retryable import.');
        }

        abort_unless(is_file($retry['source']), 404, 'The original import file is no longer available.');

        $newToken = JobStatus::startFor(
            $userId,
            "import-retry:{$resource}:{$token}",
            $request->header('Idempotency-Key'),
            function (string $newToken) use ($retry, $resource, $userId, $token): void {
                ImportRecords::dispatch(
                    $resource,
                    $retry['source'],
                    $retry['mapping'],
                    $userId,
                    $newToken,
                    false,
                    true,
                    $retry['failed_lines'],
                    $token,
                );
            },
            hash('sha256', json_encode($retry, JSON_THROW_ON_ERROR)),
        );

        $state = JobStatus::get($newToken, $userId);

        return response()->json([
            'queued' => true,
            'token' => $newToken,
            'status' => $state['status'] ?? JobStatus::PENDING,
            'resource' => $class::key(),
        ]);
    }

    /** @return class-string<\Alxtexh\Panel\Resources\Resource> */
    private function guard(string $resource): string
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null || ! $class::isEnabled()) {
            throw new NotFoundHttpException("No panel resource registered for [{$resource}].");
        }

        abort_unless($class::isAccessible(), 403);
        abort_unless($class::importable() && $class::can('create'), 404);

        return $class;
    }

    /** @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class */
    private function uploadedPath(Request $request, string $class): string
    {
        $file = $request->file('file');

        abort_if($file === null || ! $file->isValid(), 422, 'A CSV file is required.');

        $path = $file->getRealPath();

        abort_if($path === false, 422, 'That file could not be read.');

        $extension = strtolower($file->getClientOriginalExtension() ?: 'csv');

        if (! in_array($extension, [...RowsReader::CSV, ...RowsReader::EXCEL], true)) {
            abort(422, 'A CSV file is required.');
        }

        if (in_array($extension, RowsReader::EXCEL, true)) {
            abort_unless($class::excelImport(), 422, 'This resource imports CSV only. Call excelImport() and require phpoffice/phpspreadsheet to accept Excel.');
            abort_unless(
                class_exists(IOFactory::class),
                422,
                'Excel import needs phpoffice/phpspreadsheet. composer require phpoffice/phpspreadsheet',
            );
        }

        $copy = sys_get_temp_dir().'/panel-import-'.uniqid('', true).'.'.$extension;
        copy($path, $copy);

        return $copy;
    }

    private function keepUpload(string $path): string
    {
        $disk = Storage::disk(config('panel.exports.disk', 'local'));
        $disk->makeDirectory('panel-imports');
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION) ?: 'csv');
        $stored = 'panel-imports/pending-'.uniqid('', true).'.'.$extension;
        $disk->put($stored, (string) file_get_contents($path));
        @unlink($path);

        return $disk->path($stored);
    }
}

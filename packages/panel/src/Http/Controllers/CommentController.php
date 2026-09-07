<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\Comments\MentionParser;
use Alxtexh\Panel\Events\CommentCreated;
use Alxtexh\Panel\Http\NestedContext;
use Alxtexh\Panel\Http\NestedRelation;
use Alxtexh\Panel\Models\PanelComment;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\TenantContext;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Threaded comments on a resource record. Opt-in per resource via `comments()`.
 */
final class CommentController extends Controller
{
    public function index(Request $request, string $resource, string $id): JsonResponse
    {
        [$class, $record] = $this->resolve($request, $resource, $id);

        abort_unless($class::can('view', $record), 403);

        $comments = PanelComment::query()
            ->where('commentable_type', $record->getMorphClass())
            ->where('commentable_id', $record->getKey())
            ->with('author:id,name,email')
            ->orderBy('created_at')
            ->limit(200)
            ->get();

        return response()->json([
            'comments' => $comments->map(static fn (PanelComment $comment): array => self::serialize($comment))->all(),
            'canCreate' => $class::canComment($record),
        ]);
    }

    public function store(Request $request, string $resource, string $id): JsonResponse
    {
        [$class, $record] = $this->resolve($request, $resource, $id);

        abort_unless($class::canComment($record), 403);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:10000'],
        ]);

        $author = Auth::user();

        if ($author === null) {
            abort(403);
        }

        $mentions = app(MentionParser::class)->parse($validated['body'], $author);

        $comment = PanelComment::query()->create([
            'tenant_id' => self::tenantId($record),
            'commentable_type' => $record->getMorphClass(),
            'commentable_id' => $record->getKey(),
            'user_id' => $author->getAuthIdentifier(),
            'body' => $validated['body'],
            'mentions' => $mentions !== [] ? $mentions : null,
        ]);

        $comment->load('author:id,name,email');

        event(new CommentCreated(
            comment: $comment,
            record: $record,
            resourceKey: $class::key(),
            recordUrl: self::recordUrl($class, $record, $request),
            mentionedUserIds: $mentions,
        ));

        return response()->json([
            'comment' => self::serialize($comment),
        ], 201);
    }

    /**
     * @return array{0: class-string<Resource>, 1: Model}
     */
    private function resolve(Request $request, string $resource, string $id): array
    {
        $class = $this->guard($resource);

        if (! $class::hasComments()) {
            throw new NotFoundHttpException('Comments are not enabled for this resource.');
        }

        $record = $class::model()::query()->findOrFail($id);

        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            abort_unless(self::childBelongs($class, $parent, $record), 404);
        }

        return [$class, $record];
    }

    /**
     * @param  class-string<Resource>  $class
     */
    private static function childBelongs(string $class, Model $parent, Model $record): bool
    {
        if (NestedRelation::belongsToMany($class)) {
            return NestedRelation::of($parent, $class)->whereKey($record->getKey())->exists();
        }

        return (string) $record->getAttribute($class::parentColumn()) === (string) $parent->getKey();
    }

    /** @return class-string<Resource> */
    private function guard(string $resource): string
    {
        $class = app(PanelManager::class)->resources()[$resource] ?? null;

        if ($class === null) {
            throw new NotFoundHttpException("Resource [{$resource}] is not registered.");
        }

        abort_unless($class::isEnabled(), 404);
        abort_unless($class::isAccessible(), 403);

        return $class;
    }

    /** @return array<string, mixed> */
    private static function serialize(PanelComment $comment): array
    {
        $author = $comment->author;

        return [
            'id' => $comment->getKey(),
            'body' => (string) $comment->getAttribute('body'),
            'mentions' => $comment->mentions ?? [],
            'author' => [
                'id' => $author?->getKey(),
                'name' => (string) ($author?->getAttribute('name') ?? 'Unknown'),
            ],
            'createdAt' => $comment->created_at?->toIso8601String(),
        ];
    }

    private static function tenantId(Model $record): ?int
    {
        if ($record->getAttribute('tenant_id') !== null) {
            return (int) $record->getAttribute('tenant_id');
        }

        $tenant = app(TenantContext::class)->tenant();

        return $tenant?->getKey() !== null ? (int) $tenant->getKey() : null;
    }

    /**
     * @param  class-string<Resource>  $class
     */
    private static function recordUrl(string $class, Model $record, Request $request): string
    {
        $panel = app(PanelManager::class)->panel($class::panel());
        $prefix = rtrim('/'.trim($panel?->getPath() ?? '', '/'), '/');
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            $parentKey = $class::parentResource()::key();

            return "{$prefix}/{$parentKey}/{$parent->getKey()}/{$class::key()}/{$record->getKey()}";
        }

        return "{$prefix}/{$class::key()}/{$record->getKey()}";
    }
}

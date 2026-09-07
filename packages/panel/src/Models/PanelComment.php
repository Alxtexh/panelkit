<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Alxtexh\Panel\Support\CommentTables;

/**
 * A comment on any record whose resource opted in via `Resource::comments()`.
 * @property string $body
 * @property \Carbon\CarbonImmutable|null $created_at
 */
class PanelComment extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'mentions' => 'array',
        ];
    }

    public function getTable(): string
    {
        return CommentTables::comments();
    }

    /** @return MorphTo<Model, $this> */
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    /** @return BelongsTo<Model, $this> */
    public function author(): BelongsTo
    {
        /** @var class-string<Model> $model */
        $model = (string) config('auth.providers.users.model');

        return $this->belongsTo($model, 'user_id');
    }
}

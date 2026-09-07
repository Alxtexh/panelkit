<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Listeners;

use Alxtexh\Panel\Events\CommentCreated;
use Alxtexh\Panel\Notifications\BellText;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Notify @mentioned users through the bell inbox. Email is deferred to host hooks.
 */
final class SendCommentMentionNotifications
{
    public function handle(CommentCreated $event): void
    {
        if ($event->mentionedUserIds === []) {
            return;
        }

        $author = $event->comment->author;

        if ($author === null) {
            return;
        }

        /** @var class-string<Model> $model */
        $model = (string) config('auth.providers.users.model');

        $users = $model::query()
            ->whereIn('id', $event->mentionedUserIds)
            ->get();

        $title = (string) ($author->getAttribute('name') ?? 'Someone').' mentioned you';
        $body = Str::limit((string) $event->comment->body, 160);

        foreach ($users as $user) {
            if (! method_exists($user, 'notify')) {
                continue;
            }

            $user->notify(new BellText(
                title: $title,
                body: $body,
                href: $event->recordUrl,
                severity: 'info',
                category: 'mentions',
            ));
        }
    }
}

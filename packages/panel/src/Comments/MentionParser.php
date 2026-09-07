<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Comments;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Resolve `@email` and `@username` tokens in a comment body to user ids.
 *
 * Username matches the email local part (before `@`) or a slug of the user's
 * name. Email matches the full address. The author is never included.
 */
final class MentionParser
{
    /**
     * @return list<int|string>
     */
    public function parse(string $body, Model $author): array
    {
        if (! preg_match_all('/@([^\s@]+(?:@[^\s@]+)?)/u', $body, $matches)) {
            return [];
        }

        $tokens = array_values(array_unique($matches[1]));

        /** @var class-string<Model> $model */
        $model = (string) config('auth.providers.users.model');

        /** @var Collection<int, Model> $candidates */
        $candidates = $model::query()->get(['id', 'name', 'email']);

        $authorId = $author->getKey();
        $mentioned = [];

        foreach ($tokens as $token) {
            $token = rtrim((string) $token, '.,;:!?)]}\'"');

            if ($token === '') {
                continue;
            }

            $user = $this->matchToken($candidates, $token);

            if ($user === null || $user->getKey() === $authorId) {
                continue;
            }

            $mentioned[(string) $user->getKey()] = $user->getKey();
        }

        return array_values($mentioned);
    }

    /**
     * @param  Collection<int, Model>  $candidates
     */
    private function matchToken(Collection $candidates, string $token): ?Model
    {
        $needle = Str::lower($token);

        if (str_contains($needle, '@')) {
            return $candidates->first(
                static fn (Model $user): bool => Str::lower((string) $user->getAttribute('email')) === $needle,
            );
        }

        return $candidates->first(function (Model $user) use ($needle): bool {
            $email = Str::lower((string) $user->getAttribute('email'));
            $local = Str::before($email, '@');
            $nameSlug = Str::slug((string) $user->getAttribute('name'));

            return $local === $needle || $nameSlug === $needle;
        });
    }
}

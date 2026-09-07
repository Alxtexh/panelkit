<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Validation\ValidationException;
use Alxtexh\Panel\Auth\Impersonation;
use RuntimeException;

/**
 * Sign in as this record, for however long "the customer says the page is
 * blank, let me look" takes.
 *
 * EVERY RULE LIVES IN `Impersonation`, and this class exists only to wire a
 * `RecordAction` to it the way `ReplicateAction` wires one to `replicate()` -
 * so an installation writes `ImpersonateAction::make()->toAction()` in a
 * user resource's `->actions([...])` instead of re-deriving `visible()` and
 * `handle()` from the primitive by hand, and getting one of the fences wrong
 * in the process. `Impersonation::allows()`/`start()` already hold the whole
 * safety model - never upward, never across tenants, never nested, audited
 * at both ends - and asking them here is the only thing this class does.
 *
 * `visible()` RE-QUERIES THE TARGET PER ROW, and that is a known, accepted
 * cost rather than an oversight. `Impersonation::allows()` needs a real
 * model to compare ability grants against, and a `RecordAction::visible()`
 * closure sees one row's raw attributes at a time - it has no route to the
 * whole page's already-loaded models the way a resource's own `table()`
 * method does. A user list runs one extra query per VISIBLE row, which is
 * a page size, not a page size squared. A resource that wants that query
 * gone can still call `->visible()` again on the action `toAction()`
 * returns, resolving targets from whatever it already loaded - exactly the
 * override the reference app itself reached for once this cost showed up on
 * a page with hundreds of rows.
 *
 * STOPPING IS NOT HERE. It has no record to hang off - see
 * `ImpersonationController`, mounted once per panel regardless of whether
 * any resource ever attaches this action.
 */
final class ImpersonateAction
{
    private string $label = 'Impersonate';

    private ?string $confirmation = 'Everything you do next is recorded as this person. Continue?';

    private function __construct(private readonly string $key) {}

    public static function make(string $key = 'impersonate'): self
    {
        return new self($key);
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    /** Pass null to drop the confirmation dialog entirely. */
    public function confirm(?string $message): self
    {
        $this->confirmation = $message;

        return $this;
    }

    /** Build the record action this configures. */
    public function toAction(): RecordAction
    {
        $action = RecordAction::make($this->key, $this->label)
            ->icon('user-check')
            ->color('warning')
            // A view of the record is what impersonation grants - "view" is
            // the ability that actually describes it, not "update".
            ->authorize('view')
            /*
             * OFFERED ONLY WHERE IT WOULD SUCCEED. Presentation only: hiding
             * the entry is a courtesy, and `handle()` below refuses again
             * regardless - a menu and a server checking two different things
             * is how they end up disagreeing, and the disagreement always
             * favours the menu, which is the wrong direction.
             */
            ->visible(function (array $row): bool {
                $actor = auth()->user();

                if ($actor === null) {
                    return false;
                }

                $target = $this->targetModel()::query()->whereKey($row['id'] ?? null)->first();

                return $target instanceof Authenticatable
                    && app(Impersonation::class)->allows($actor, $target);
            })
            /*
             * A POST, NEVER A LINK. A record action is a POST with a session,
             * which is all `start()` needs - a `link()` would have to be a
             * GET, and a GET that changes who you are signed in as is exactly
             * the kind of thing a prefetcher or a crawler triggers by
             * accident.
             *
             * THE REFUSAL BECOMES A VALIDATION ERROR, not a 500 - "that
             * account can do things you cannot" is information for the
             * operator, not a crash. `visible()` above already keeps this
             * from firing on the common path; this is the backstop for a
             * request that skipped the menu.
             */
            ->handle(function (Model $record, array $data): void {
                if (! $record instanceof Authenticatable) {
                    throw new RuntimeException('Impersonation requires an authenticatable user record.');
                }

                try {
                    app(Impersonation::class)->start(auth()->user(), $record);
                } catch (RuntimeException $e) {
                    throw ValidationException::withMessages(['impersonate' => $e->getMessage()]);
                }
            });

        if ($this->confirmation !== null) {
            $action->confirm($this->confirmation);
        }

        return $action;
    }

    /** @return class-string<Model> */
    private function targetModel(): string
    {
        /** @var class-string<Model> */
        return config('auth.providers.users.model');
    }
}

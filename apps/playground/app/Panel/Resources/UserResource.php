<?php

declare(strict_types=1);

namespace App\Panel\Resources;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Auth\Impersonation;
use Alxtexh\Panel\Forms\Fields\MultiSelectField;
use Alxtexh\Panel\Forms\Fields\PasswordField;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Models\Role;
use Alxtexh\Panel\Models\Scopes\TenantScope;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\CheckboxColumn;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Table;

/**
 * The colleagues who can sign in, and which role each one holds.
 *
 * WITHOUT THIS SCREEN THE PERMISSION WORK IS INERT. Roles existed, the matrix
 * existed, and there was no way to give anybody a role - which made the whole
 * feature a configuration surface with nothing configured. Assigning a role is
 * the point at which permissions become real, so it is the field this resource
 * exists for.
 *
 * IT IS ONE PHP FILE, which is the kit's central claim and worth exercising on a
 * model that is genuinely awkward: a hashed password, a relation to a
 * tenant-scoped table, and a record you can lock yourself out with. If those
 * needed Vue, the claim would be false.
 */
final class UserResource extends Resource
{
    protected static string $model = User::class;

    protected static string $icon = 'users';

    protected static ?string $purpose = 'Colleagues who can sign in, and which role each one holds.';

    protected static ?string $group = 'Organisation';

    protected static ?int $sort = 10;

    /**
     * NOT IN THE SIDEBAR, because it was the same screen twice.
     *
     * The account menu has held User management since roles and permissions
     * arrived, and this resource put a second "Users" entry in the resource
     * column. Two entry points to one subject is worse than either alone: the
     * two screens are not identical - the settings one has the roles and
     * invitations tabs - so whichever a person happened to click became their
     * idea of what the panel can do, and the half they never opened looked
     * missing.
     *
     * THE RESOURCE STAYS. Its routes, its policy, its abilities and its API
     * endpoints are all still here and still used - by the command palette, by
     * record links from other screens, and by integrations. Hiding is a
     * navigation decision and nothing else.
     */
    public static function showsInNavigation(): bool
    {
        return false;
    }

    /**
     * COLLEAGUES ARE INVITED, NOT UPLOADED.
     *
     * This resource has a form, so the framework would offer Import - and a
     * spreadsheet of people is the wrong shape for what creating an account
     * actually is. Every row would need a role, which is a grant of
     * permissions; the invitation flow, the password rules and the "you cannot
     * create somebody more powerful than yourself" check all live on the paths
     * an import would go around. A mistyped column in a CSV is a quiet
     * privilege escalation, and it is the sort nobody reviews.
     *
     * User management already has the screen for bringing people in, with
     * invitations, and it is the one that keeps those guarantees.
     */
    public static function importable(): bool
    {
        return false;
    }

    /**
     * The driver's "join these rows into one string" function.
     *
     * THE THREE DATABASES SPELL IT DIFFERENTLY and none of them accepts the
     * others' syntax, so a single hardcoded expression works on whichever one
     * the author happened to run and is a SQL error on the rest - discovered by
     * whoever deploys to Postgres, not by whoever wrote it.
     */
    private static function groupConcat(string $column): string
    {
        return match (DB::getDriverName()) {
            'pgsql' => "string_agg({$column}, ', ')",
            'mysql', 'mariadb' => "group_concat({$column} separator ', ')",
            default => "group_concat({$column}, ', ')",
        };
    }

    /** Whether there is a `sessions` table to ask about live sessions. */
    private static function sessionsAreQueryable(): bool
    {
        return config('session.driver') === 'database';
    }

    /**
     * The moment before which a session is no longer live.
     *
     * `last_activity` IS A UNIX TIMESTAMP, so this is an integer computed here
     * rather than a date the three drivers each spell differently. It is also
     * why nothing needs binding: there is no user input anywhere near it.
     */
    private static function liveSessionCutoff(): int
    {
        return now()->subMinutes((int) config('session.lifetime', 120))->getTimestamp();
    }

    /**
     * What the "Last seen" cell says for one row.
     *
     * THE ORDER OF THE BRANCHES IS THE DESIGN. Being here now beats any
     * timestamp; today's date is noise once you have the time; and an account
     * nobody has signed into is a fact, not a gap.
     *
     * @param  array<string, mixed>  $row
     */
    private static function lastSeen(array $row): string
    {
        if ((int) ($row['signed_in'] ?? 0) === 1) {
            return 'Logged in';
        }

        $at = $row['last_login_at'] ?? null;

        if ($at === null || $at === '') {
            return 'Never';
        }

        $when = Carbon::parse((string) $at)
            ->setTimezone(config('app.timezone', 'UTC'));

        return $when->isToday()
            ? $when->format('H:i')
            : $when->format('j M Y');
    }

    public static function table(Table $table): Table
    {
        /**
         * The page's people, filled by `prepareRows` and read by `visible`.
         *
         * Declared here so both closures share one array by reference: the
         * preparer writes it once per page, the predicate reads it once per row.
         *
         * @var array<int, User>
         */
        $targets = [];

        /*
         * ONE OF THESE FOR THE PAGE, not one per row.
         *
         * `app()` inside the predicate built a fresh object for every person
         * listed, which threw away the ability answers it had just worked out -
         * so the actor's own "may I impersonate at all" was re-asked, as a
         * query, once per row. Resolved here it is asked once.
         */
        $impersonation = app(Impersonation::class);

        return $table
            /*
             * NO ROLE FILTER FOR NOW. Filtering a many-to-many needs an EXISTS
             * subquery rather than a column comparison, and the filter builder
             * takes a column. Left out rather than shipped filtering on
             * something that no longer exists - a filter that silently matches
             * nothing is worse than an absent one.
             */
            /*
             * SCOPED HERE RATHER THAN BY A GLOBAL SCOPE ON THE MODEL, and the
             * reason is authentication.
             *
             * Every other tenant-owned model carries `#[ScopedBy(TenantScope)]`,
             * which DENIES when no tenant is resolved. That is right for
             * subscribers and wrong for users: sign-in looks a person up by
             * email BEFORE any tenant exists, so the scope would deny the lookup
             * and nobody could log in. `users.email` is globally unique for the
             * same reason - identity resolves first, tenancy second.
             *
             * So `User` stays globally queryable for the auth path and every
             * PANEL query is constrained here. This is not theoretical: on the
             * first load, before this existed, the list showed all seven users
             * across five tenants.
             *
             * `constrain()` rather than `query()` because a predicate in the
             * join closure is dropped from counts - a bug this project shipped
             * once already, reporting every session ever recorded as the live
             * total.
             */
            ->constrain(function ($query): void {
                $key = TenantScope::currentTenantId();

                // Null is DENY, never "all tenants" - the same contract the
                // global scope keeps.
                $key === null
                    ? $query->whereRaw('1 = 0')
                    : $query->where('users.tenant_id', $key);
            })
            /*
             * QUALIFIED THROUGHOUT, because the join puts `id`, `name` and
             * `created_at` on both tables. `keyColumn` is the one easy to miss:
             * it is the keyset tiebreaker in every ORDER BY, so an unqualified
             * `id` makes the whole list a SQL error the moment a join exists.
             */
            ->keyColumn('users.id')
            /*
             * THE ROLE NAMES, NOT A COUNT.
             *
             * "1" in a Roles column answers the wrong question and reads like an
             * id. What somebody scanning this list wants is WHICH role, and with
             * several roles now possible per person the useful cell is the list.
             *
             * IT RIDES IN `alsoSelect`, WITH A BARE ALIAS, and both halves of
             * that were bugs before they were decisions. A `->query()` callback
             * adding to the select is discarded - the list sets its own
             * `select($this->select)` afterwards. And `addSelect(['x' => $sub])`
             * compiles the alias QUOTED, so this list, which hands back raw rows
             * rather than models, received a column literally named `"x"` and
             * rendered an empty cell with no error anywhere.
             *
             * A CORRELATED SUBQUERY RATHER THAN A JOIN, because a join to a
             * many-to-many multiplies the rows: one person with three roles
             * becomes three people in the table, and the pagination silently
             * disagrees with the count.
             */
            /*
             * "LOGGED IN" IS A FACT ABOUT SESSIONS, not about the user row.
             *
             * A live session row is the only honest definition of somebody
             * being here now: it is what the framework itself consults to keep
             * them signed in, so this cannot drift from reality the way a
             * heartbeat column written by the app would.
             *
             * ONLY WHEN SESSIONS ARE IN THE DATABASE. On the file or cookie
             * driver there is no table to ask, and inventing one would be a
             * query against something that does not exist - so the column
             * quietly falls back to reporting the last sign-in, which is still
             * the useful answer.
             */
            /*
             * THE CELL IS DECIDED HERE, over the page's rows, in PHP and
             * without a query - see the column for why the choice cannot be
             * made on the client.
             */
            ->transform(static function (array $row): array {
                $row['last_seen'] = self::lastSeen($row);

                return $row;
            })
            ->alsoSelect(array_values(array_filter([
                'users.id',
                'users.last_login_at',
                /*
                 * "LOGGED IN" IS A FACT ABOUT SESSIONS, not about the user row.
                 * A live session row is the only honest definition of somebody
                 * being here now: it is what the framework consults to keep
                 * them signed in, so it cannot drift from reality the way a
                 * heartbeat column written by the app would.
                 *
                 * ONLY WHEN SESSIONS ARE IN THE DATABASE. On the file or cookie
                 * driver there is no table to ask, so the cell falls back to
                 * reporting the last sign-in, which is still the useful answer.
                 */
                self::sessionsAreQueryable()
                    ? DB::raw(
                        '(select case when exists ('
                        .'select 1 from sessions'
                        .' where sessions.user_id = users.id'
                        .' and sessions.last_activity >= '.self::liveSessionCutoff()
                        .') then 1 else 0 end) as signed_in'
                    )
                    : null,
                DB::raw(
                    '(select '.self::groupConcat('roles.name')
                    .' from model_has_roles'
                    .' join roles on roles.id = model_has_roles.role_id'
                    .' where model_has_roles.model_id = users.id'
                    .' and model_has_roles.model_type = '
                    .DB::escape(User::class)
                    .') as role_names'
                ),
            ])))
            ->columns([
                TextColumn::make('name')->from('users.name')->sortAs('users.name')
                    ->sortable()->searchable()->locked(),

                TextColumn::make('email')->from('users.email')->sortAs('users.email')
                    ->sortable()->searchable()->copyable(),

                /*
                 * NO ROLE IS A STATE WORTH SEEING, and it is why this is a badge
                 * rather than text. Such a user can sign in and do nothing at
                 * all, and every page renders empty for them - which reads as a
                 * broken panel rather than as a missing assignment.
                 */
                TextColumn::make('role_names')->label('Roles'),

                /*
                 * WHETHER, NOT WHEN - roadmap 4.6. The date this address was
                 * confirmed is a fact nobody scans a list for; whether it was
                 * confirmed at all is the only question anybody asks of this
                 * column, and forty rows of ticks and blanks answer it at a
                 * glance where forty dates do not. Read-only by construction:
                 * verification is something the person does, not something an
                 * operator ticks on their behalf.
                 */
                CheckboxColumn::make('email_verified_at')->from('users.email_verified_at')
                    ->sortAs('users.email_verified_at')->label('Verified')->sortable()
                    ->labels('Email verified', 'Email not verified'),

                /*
                 * LAST SEEN, NOT JOINED.
                 *
                 * The date an account was created stops being interesting the
                 * week after it happens, and it was the only time column here.
                 * What somebody scans this list for is who is still using the
                 * panel - which accounts to revoke, who to chase, whether an
                 * invitation was ever taken up - and none of that is answerable
                 * from a join date.
                 *
                 * "NEVER" RATHER THAN A DASH, because the two mean different
                 * things and this column is read to make decisions about
                 * accounts. A blank cell says the panel does not know; this one
                 * knows, and the answer is that the person has not been here.
                 * On the day the column ships that is every row, which is
                 * honest and would look like a fault written as "-".
                 */
                /*
                 * ONE CELL, THREE ANSWERS, because the useful reading changes
                 * with how recent it is:
                 *
                 *   "Logged in"  they are signed in RIGHT NOW, which is the
                 *                answer to the question being asked and is not
                 *                a time at all
                 *   "14:32"      earlier today - the date is today, saying so
                 *                is noise, and the time is the whole content
                 *   "12 Jun"     any older, where the date is what matters and
                 *                the minute it happened does not
                 *   "Never"      not missing data: the person has not been here
                 *
                 * BUILT SERVER-SIDE, which is a deliberate exception to this
                 * panel's rule that dates are formatted on the client in the
                 * viewer's locale. The rule assumes a cell is one value being
                 * formatted; this one is a choice BETWEEN values, and the
                 * choice needs the session state that only the server has.
                 * Splitting it would mean shipping "logged in" as a second
                 * column and letting the two disagree.
                 */
                TextColumn::make('last_seen')->label('Last seen')
                    ->sortAs('users.last_login_at')->sortable(),
            ])
            /*
             * NO ROLE FILTER FOR NOW. Filtering a many-to-many needs an EXISTS
             * subquery rather than a column comparison, and the filter builder
             * takes a column. Left out rather than shipped filtering on
             * something that no longer exists - a filter that silently matches
             * nothing is worse than an absent one.
             */
            /*
             * SCOPED HERE RATHER THAN BY A GLOBAL SCOPE ON THE MODEL, and the
             * reason is authentication.
             *
             * Every other tenant-owned model carries `#[ScopedBy(TenantScope)]`,
             * which DENIES when no tenant is resolved. That is right for
             * subscribers and wrong for users: sign-in looks a person up by
             * email BEFORE any tenant exists, so the scope would deny the lookup
             * and nobody could log in. `users.email` is globally unique for the
             * same reason - identity resolves first, tenancy second.
             *
             * So `User` stays globally queryable for the auth path and every
             * PANEL query is constrained here. This is not theoretical: on the
             * first load, before this existed, the list showed all seven users
             * across five tenants.
             *
             * `constrain()` rather than `query()` because a predicate in the
             * join closure is dropped from counts - a bug this project shipped
             * once already, reporting every session ever recorded as the live
             * total.
             */
            ->constrain(function ($query): void {
                $key = TenantScope::currentTenantId();

                // Null is DENY, never "all tenants" - the same contract the
                // global scope keeps.
                $key === null
                    ? $query->whereRaw('1 = 0')
                    : $query->where('users.tenant_id', $key);
            })
            /*
             * IMPERSONATION IS OFFERED ONLY WHERE IT WOULD SUCCEED.
             *
             * `visible()` asks the same object the endpoint asks - see
             * `Impersonation::allows()` - rather than re-deriving the rules
             * here. A second copy of "may I become this person" is how a menu
             * and a server end up disagreeing, and the disagreement always
             * favours the menu, which is the wrong direction.
             *
             * It is presentation only: hiding the entry is a courtesy, and the
             * controller refuses regardless (§9 item 3).
             */
            /*
             * THE WHOLE PAGE'S PEOPLE, IN ONE QUERY.
             *
             * `Impersonation::allows()` needs the target as a record - it
             * compares abilities, and abilities live on roles, not on a row of
             * the list. Asking for that record inside `visible()` meant one
             * SELECT per row plus the permission read behind it, so the users
             * list cost roughly two extra queries for every person on it and
             * grew with the page size. Nothing named it: no column asked for a
             * relation, so no eager load was missing, and the queries appeared
             * in the log with no clue which feature spent them.
             *
             * AND THEIR "DOES THIS PERSON HOLD EVERYTHING" ANSWER COMES WITH
             * THEM. That check is memoised per User instance, which does nothing
             * for a page of one-question-each people, so it cost a second query
             * per row on top of the first. `primeGrantsEverything` answers it for
             * the whole page under the team context the check itself uses - see
             * the method, where the reason it is not a query written here is the
             * point.
             */
            ->prepareRows(function (array $rows) use (&$targets): void {
                $ids = array_filter(array_map(
                    static fn (array $row): int => (int) ($row['id'] ?? 0),
                    $rows,
                ));

                if ($ids === []) {
                    $targets = [];

                    return;
                }

                $people = User::query()->findMany($ids);

                User::primeGrantsEverything($people);

                $targets = $people->keyBy('id')->all();
            })
            ->recordActions([
                /*
                 * VIEW AND EDIT WERE MISSING, and that was a real gap rather
                 * than a decision: the actions column was wired on the users tab
                 * and this list declared only `impersonate`, so the one screen
                 * for managing people offered no way to open or change any of
                 * them. Delete is added by the page as a synthetic entry (see
                 * `ResourceIndex`), because it opens a confirmation rather than
                 * calling the action endpoint.
                 */
                RecordAction::make('view', 'View')
                    ->icon('eye')
                    ->color('primary')
                    ->authorize('view')
                    ->link(fn (array $row): string => '/users/'.$row['id']),

                RecordAction::make('edit', 'Edit')
                    ->icon('pencil')
                    ->color('primary')
                    ->authorize('update')
                    ->link(fn (array $row): string => '/users/'.$row['id'].'/edit'),

                RecordAction::make('impersonate', 'Impersonate')
                    ->icon('user-check')
                    ->color('warning')
                    ->authorize('view')
                    ->confirm('Everything you do next is recorded as this person. Continue?')
                    /*
                     * THE PAGE'S PEOPLE ARE ALREADY LOADED - see `prepareRows`
                     * above. This asked the database for the target one row at a
                     * time, which is the N+1 that hid the longest in this
                     * codebase: it belongs to no column, appears in no eager
                     * load, and is spent deciding which menu entries to draw.
                     */
                    ->visible(function (array $row) use (&$targets, $impersonation): bool {
                        $actor = auth()->user();
                        $target = $targets[(int) ($row['id'] ?? 0)] ?? null;

                        return $actor !== null
                            && $target !== null
                            && $impersonation->allows($actor, $target);
                    })
                    /*
                     * THE ACTION ENDPOINT DOES THE SWAP ITSELF rather than
                     * pointing at the controller, because a record action is a
                     * POST with a session and that is all `start()` needs. A
                     * `link()` would have to be a GET, and a GET that changes
                     * who you are signed in as is exactly the kind of thing a
                     * prefetcher or a crawler triggers by accident.
                     *
                     * A refusal becomes a validation error rather than a 500 -
                     * "that account can do things you cannot" is information for
                     * the operator, not a crash.
                     */
                    ->handle(function (Model $record, array $data): void {
                        if (! $record instanceof User) {
                            throw new \UnexpectedValueException('Impersonation requires a user record.');
                        }

                        try {
                            app(Impersonation::class)->start(auth()->user(), $record);
                        } catch (\RuntimeException $e) {
                            throw ValidationException::withMessages([
                                'impersonate' => $e->getMessage(),
                            ]);
                        }
                    }),

                /*
                 * DEMAND A NEW PASSWORD ON THE NEXT SIGN-IN.
                 *
                 * THIS IS WHY `must_change_password` EXISTS AS ITS OWN COLUMN.
                 * The age policy is a rule about everybody; this is a decision
                 * about one account - a reset handed over in person, a device
                 * left somewhere, a colleague who has left. It applies whatever
                 * the age policy says, and expressing it by backdating the
                 * change timestamp would work and would put a lie in a column
                 * other code reads.
                 *
                 * IT DOES NOT CHANGE THE PASSWORD, deliberately. Whoever holds
                 * this cannot use it to take an account over: the person still
                 * has to know their current password to set a new one, so the
                 * worst an operator can do with it is inconvenience somebody.
                 */
                RecordAction::make('require-password-change', 'Require a new password')
                    ->icon('key')
                    ->color('warning')
                    ->authorize('update')
                    ->confirm('They will be asked to choose a new password next time they sign in. Continue?')
                    ->visible(fn (array $row): bool => (int) ($row['id'] ?? 0) !== (int) auth()->id())
                    ->handle(function (Model $record, array $data): void {
                        if (! $record instanceof User) {
                            throw new \UnexpectedValueException('Password reset requires a user record.');
                        }

                        $record->forceFill(['must_change_password' => true])->save();
                    }),
            ])
            /*
             * MOST RECENTLY HERE FIRST, which is the order the "Last seen"
             * column exists to be read in. It was `created_at`, and that stopped
             * being a legal default the moment the join date left the columns:
             * the panel refuses a default sort that is not in the sortable
             * allowlist, so this was a 500 rather than a silent fallback, which
             * is the right way round.
             *
             * NEVER-SIGNED-IN SORT LAST under `desc` on all three drivers, which
             * is also where they belong - an account nobody has used is the tail
             * of "who is active", not the head.
             */
            ->defaultSort('users.last_login_at', 'desc');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextField::make('name')->required()->placeholder('Grace Wanjiru'),

            TextField::make('email')->label('Email address')->required()
                ->placeholder('grace@example.com'),

            /*
             * OPTIONS ARE SCOPED, and that is load-bearing rather than tidy.
             *
             * `Role` carries the tenant global scope, so this only offers roles
             * belonging to the current organisation - assigning another tenant's
             * role id would otherwise be privilege escalation by pointing at a
             * row you do not own. `User::hasPermission()` refuses such a role
             * anyway; this stops it being offered, which is the difference
             * between a guard and a trap.
             */
            /*
             * SEVERAL ROLES, which is the whole reason for moving to Spatie.
             * "Grace is Support and Billing" was not expressible before without
             * inventing a combined role for every combination.
             */
            /*
             * AT LEAST ONE ROLE IS REQUIRED, in the form as well as in the head
             * of whoever fills it in.
             *
             * A user with no role can sign in and every page renders empty -
             * which reads as a broken panel rather than as an unfinished
             * account, and the person it happens to reports it as a bug. The
             * state is legal in the database (the pivot simply has no rows) and
             * `hasPermission` correctly denies everything, so nothing errors;
             * it just produces somebody who cannot work and does not know why.
             *
             * Required at the form rather than the column, because a NOT NULL
             * cannot express "at least one row in a pivot" - and the server
             * validates it regardless of what the client sends.
             */
            MultiSelectField::make('roles')
                ->label('Roles')
                ->required()
                ->options(fn (): array => Role::query()->orderBy('name')->pluck('name', 'name')->all())
                ->help('Everything this person may do comes from their roles. Pick at least one.'),

            /*
             * BLANK MEANS UNCHANGED, and the field enforces that itself - see
             * PasswordField. A required password on an edit form turns every
             * unrelated change, like fixing a typo in a name, into a forced
             * password reset.
             */
            PasswordField::make('password')
                ->label('Password')
                ->help('Leave blank to keep the current password.'),
        ]);
    }
}

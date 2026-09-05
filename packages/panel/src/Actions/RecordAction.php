<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Closure;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Models\Concerns\HasStateTransitions;
use Alxtexh\Panel\Audit\AuditRecorder;

/**
 * A mutation applied to ONE record, from its row menu.
 *
 * The single-record twin of BulkAction, and it exists for the same reason:
 * THE CLIENT SENDS AN ACTION KEY, NEVER AN ATTRIBUTE SET. What the action does
 * is declared here, in server-side code; the request may only name which
 * declared action to run against which record it can already see. Accepting
 * `{status: 'suspended'}` from a row menu is a mass-assignment endpoint with a
 * nicer label on it.
 *
 * WHY NOT JUST REUSE BulkAction WITH ONE ID. Because the two differ in the
 * thing that matters most - what they are allowed to do. A bulk action is an
 * UPDATE over a selection and defaults to the `update` ability. A record action
 * covers a wider range: replicate CREATES a row, an export READS one, a
 * "resend invoice" neither reads nor writes the record it hangs off. Folding
 * them together would mean one default ability for genuinely different acts,
 * and the safe default for one is the wrong default for another.
 *
 * THREE SHAPES, and a given action is exactly one of them:
 *
 *   `mutate()`   set columns on this record. One UPDATE, no hydration cost.
 *   `handle()`   receives the model, for anything needing events or related
 *                writes - replication, state machines, notifications.
 *   `link()`     no mutation at all: View and Edit are record actions too, and
 *                keeping them in the same list is what lets a resource reorder
 *                or hide them without editing a Vue file.
 *
 * AND ANY OF THEM MAY ASK FOR INPUT FIRST - `form()`, added in v0.6.0 because a
 * port off Filament found that 67 of 229 actions needed to collect something
 * before doing anything: a reason for a suspension, an amount to credit, a
 * department to route to. Without it every one of those became a hand-written
 * screen, which is the largest functional gap this package had.
 *
 * THE FIELDS ARE DECLARED HERE, WHICH IS WHAT KEEPS THE ENDPOINT SAFE. The rule
 * at the top of this file does not bend: the client still sends an action key
 * and never an attribute set. What it may additionally send are VALUES FOR KEYS
 * THIS RESOURCE OFFERED - validated against the declaration's own rules and
 * reduced to its own keys before `handle()` sees them. A request naming a
 * column the form did not declare gets that key dropped, not written.
 */
final class RecordAction
{
    private ?string $icon = null;

    private bool $destructive = false;

    private ?string $confirmation = null;

    /**
     * The ability checked against the resource policy FOR THIS RECORD.
     *
     * `update` by default rather than nothing: an action that forgets to
     * declare one is checked, not waved through. Anything that creates must say
     * `create`, and anything that only reads should say `view` - a policy check
     * that is broader than the act it guards is a permission nobody granted
     * on purpose.
     */
    private string $ability = 'update';

    /** @var array<string, mixed> */
    private array $mutate = [];

    /**
     * The fields to collect before running, or null for an action that asks
     * nothing. See the class note on why declaring them here is the whole
     * security property.
     */
    private ?Form $form = null;

    /**
     * Ordered steps for a declarative action wizard.
     *
     * When set, the action's collected input comes from the steps' forms,
     * instead of from `form()`.
     *
     * @var list<ActionStep>
     */
    private array $steps = [];

    private ?Closure $handle = null;

    private ?Closure $link = null;

    /**
     * Where to navigate after a successful run, or null to stay and reload
     * the list in place (the default for every action until this exists).
     *
     * @var (Closure(Model, array<string, mixed>): string)|string|null
     */
    private Closure|string|null $redirectTo = null;

    /** Whether the row disappears from the current list after this runs. */
    private bool $removesRow = false;

    /** Filament's palette, so a ported resource reads the same in both. */
    public const COLORS = ['primary', 'gray', 'success', 'warning', 'danger', 'info'];

    private ?string $color = null;

    private bool $slideOver = false;

    private ?string $modalWidth = null;

    private ?string $submitLabel = null;

    private ?string $cancelLabel = null;

    /** @var list<ModalFooterAction> */
    private array $extraModalFooterActions = [];

    /** @var list<string> */
    private array $keyBindings = [];

    private ?Closure $visible = null;

    private ?string $transitionState = null;

    private string $transitionColumn = 'status';

    /** @var class-string<Model>|null */
    private ?string $transitionModel = null;

    private function __construct(public readonly string $key, private readonly string $label)
    {
        if (preg_match('/^[a-z][a-z0-9_-]*$/', $key) !== 1) {
            throw new InvalidArgumentException("[{$key}] is not a valid action key.");
        }
    }

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /** Renders in the destructive tone and, by convention, asks first. */
    public function destructive(bool $destructive = true): self
    {
        $this->destructive = $destructive;

        return $this;
    }

    /**
     * The tone this action carries in the menu.
     *
     * COLOUR IS THE ONLY GROUPING LEFT. The menu used to carry headings -
     * "STATUS", "MANAGE" - which cost two lines of chrome each and made a
     * six-item list look like a settings page. Colour separates a price change
     * from a visibility toggle at a glance and costs no vertical space.
     *
     * NAMES MATCH FILAMENT'S so a resource ported from one reads the same in
     * the other, and so nobody has to learn a second vocabulary for the same
     * six ideas.
     *
     * DESTRUCTIVE IS NOT A COLOUR. `destructive()` also moves the action last
     * and is refused in places a delete should not be; setting `danger` here
     * would paint an action red without any of that, which is the worst of both
     * - it looks dangerous and is treated as ordinary.
     */
    public function color(string $color): self
    {
        if (! in_array($color, self::COLORS, true)) {
            throw new InvalidArgumentException(
                "[{$this->key}] has unknown colour [{$color}]. One of: ".implode(', ', self::COLORS).'.'
            );
        }

        $this->color = $color;

        return $this;
    }

    public function confirm(string $message): self
    {
        $this->confirmation = $message;

        return $this;
    }

    /**
     * Present a form action in PkSlideover instead of the default dense PkModal.
     *
     * Page-first CRUD stays on dedicated routes; this is for secondary flows
     * that need more horizontal room than a centred modal.
     */
    public function slideOver(bool $slideOver = true): self
    {
        $this->slideOver = $slideOver;

        return $this;
    }

    /**
     * How wide the dense modal opens - `sm`, `confirm` (default), `form`,
     * `lg`, or `xl`. Ignored once `slideOver()` is on; a slide-over has its
     * own `size` and the two are not the same scale.
     *
     * THE DEFAULT STAYS `confirm` EVEN FOR A FORM ACTION. A resource author
     * who declared `->form([...])` and never called this keeps getting
     * exactly the width they always got - this is additive, not a change
     * to what an existing action renders at.
     */
    public function modalWidth(string $width): self
    {
        $this->modalWidth = $width;

        return $this;
    }

    /** Replace the primary button's text - defaults to the action's own label. */
    public function submitLabel(string $label): self
    {
        $this->submitLabel = $label;

        return $this;
    }

    /** Replace "Cancel" - a destructive action might prefer "Never mind", say. */
    public function cancelLabel(string $label): self
    {
        $this->cancelLabel = $label;

        return $this;
    }

    /**
     * Extra link buttons beside Cancel/Submit - "read the docs", "open this
     * customer in Stripe" - see `ModalFooterAction`'s own docblock for why
     * these are links and not a second thing this modal can submit.
     *
     * @param  list<ModalFooterAction>  $actions
     */
    public function extraModalFooterActions(array $actions): self
    {
        $this->extraModalFooterActions = $actions;

        return $this;
    }

    /**
     * Keyboard shortcuts that run this action while its row's menu is open.
     *
     * SCOPED TO THE OPEN MENU, NOT THE WHOLE SCREEN. A list shows many rows
     * at once, so a global binding has no single record to act on - "d" would
     * have to mean something the moment it is pressed, and there is no
     * correct row to pick among the fifty visible. The menu is already the
     * one place a single row IS unambiguously in focus: it opens on one row,
     * closes before another can, and already accepts arrow keys to move
     * between its own items (`RecordActions.vue`'s `onMenuKeydown`) - this is
     * the same idea, one keystroke instead of arrow-then-Enter.
     *
     * @param  list<string>  $bindings  e.g. `['mod+d']`, `['shift+e']`, `['e']`.
     */
    public function keyBindings(array $bindings): self
    {
        $this->keyBindings = array_values($bindings);

        return $this;
    }

    public function authorize(string $ability): self
    {
        $this->ability = $ability;

        return $this;
    }

    /** @param array<string, mixed> $attributes */
    public function mutate(array $attributes): self
    {
        $this->mutate = $attributes;

        return $this;
    }

    /**
     * Move a workflow column to a fixed state.
     *
     * Pair with `when()` or pass a model class that uses `HasStateTransitions`
     * so the menu and execution both refuse disallowed hops.
     *
     * @param  class-string<Model>|null  $model
     */
    public function transitionTo(string $state, string $column = 'status', ?string $model = null): self
    {
        $this->transitionState = $state;
        $this->transitionColumn = $column;
        $this->transitionModel = $model;
        $this->mutate([$column => $state]);

        if ($model !== null && in_array(HasStateTransitions::class, class_uses_recursive($model), true)) {
            $this->visible(static function (array $row) use ($model, $state, $column): bool {
                /** @var class-string<Model&HasStateTransitions> $model */
                return $model::canTransitionFromAttributes($row, $state, $column);
            });
        }

        return $this;
    }

    /**
     * Show and allow this action only when the row matches.
     *
     * Alias for `visible()` in LaraAdmin / Nova style action definitions.
     *
     * @param  Closure(array<string, mixed>): bool  $when
     */
    public function when(Closure $when): self
    {
        return $this->visible($when);
    }

    /**
     * Collect input before running.
     *
     * ```php
     * RecordAction::make('suspend', 'Suspend')
     *     ->form(fn (Form $form): Form => $form->schema([
     *         TextareaField::make('reason')->required()->rule('max:280'),
     *         DateField::make('until')->help('Leave empty for indefinite.'),
     *     ]))
     *     ->handle(fn (Client $client, array $data) => $client->suspend($data));
     * ```
     *
     * THE SCHEMA TRAVELS WITH THE ACTION, so the modal opens with **zero
     * network requests** - the same promise the record form makes, and for the
     * same reason: a dialog that fetches its own fields is a dialog that stalls
     * on a slow connection at the moment somebody has already committed to
     * acting.
     *
     * IT PAIRS WITH `handle()`, NOT `mutate()`. A mutation is a fixed set of
     * columns declared at definition time; if the values come from a person,
     * something has to decide what to do with them, and that is a closure.
     * Declaring both is refused at `run()` rather than silently preferring one.
     *
     * @param  Closure(Form): Form  $form
     */
    public function form(Closure $form): self
    {
        $this->form = $form(Form::make());

        return $this;
    }

    /** The declared form, or null when this action asks for nothing. */
    public function formDefinition(): ?Form
    {
        return $this->form;
    }

    /**
     * Declarative, wizard-style action steps.
     *
     * The action modal renders the stepper from each step's form schema.
     *
     * @param  list<ActionStep>  $steps
     */
    public function steps(array $steps): self
    {
        if ($this->form !== null) {
            throw new InvalidArgumentException(
                "[{$this->key}] declares both `form()` and `steps()`. Use one or the other.",
            );
        }

        foreach ($steps as $step) {
            if (! $step instanceof ActionStep) {
                throw new InvalidArgumentException('[steps()] accepts only ActionStep instances.');
            }
        }

        $this->steps = array_values($steps);

        return $this;
    }

    public function hasSteps(): bool
    {
        return $this->steps !== [];
    }

    /**
     * @return list<ActionStep>
     */
    public function stepsDefinition(): array
    {
        return $this->steps;
    }

    /**
     * @param  Closure(Model, array<string, mixed>): mixed  $handle
     */
    public function handle(Closure $handle): self
    {
        $this->handle = $handle;

        return $this;
    }

    /**
     * A navigation, not a mutation.
     *
     * Takes the row's attributes for the same reason `visible()` does.
     *
     * @param  Closure(array<string, mixed>): string  $link
     */
    public function link(Closure $link): self
    {
        $this->link = $link;

        return $this;
    }

    /**
     * Whether the acted-on row leaves the current view.
     *
     * The client needs to know, because the two outcomes look different: a
     * status change updates in place, a delete or an archive has to drop the
     * row or the operator clicks it again. Guessing from `destructive` would be
     * wrong in both directions - archiving is not destructive and does remove
     * the row; a hard reset is destructive and does not.
     */
    public function removesRow(bool $removes = true): self
    {
        $this->removesRow = $removes;

        return $this;
    }

    /**
     * Hide the action for records it does not apply to.
     *
     * IT RECEIVES THE ROW'S ATTRIBUTES, NOT A MODEL, and that is a performance
     * decision rather than a stylistic one. The list never hydrates models -
     * that is most of why it is fast on a million rows - so a closure typed
     * against `Model` could only be evaluated by hydrating 25 of them per page,
     * which is exactly the cost the table exists to avoid. An array works
     * identically in both places: the list passes the row it already has, and
     * the endpoint passes the record's attributes.
     *
     * PRESENTATION ONLY. It stops "Restore" appearing on a row that was never
     * deleted; it is NOT a permission check, and the ability above is still
     * enforced on execution. A client that calls a hidden action still has to
     * pass the policy AND this check.
     *
     * @param  Closure(array<string, mixed>): bool  $visible
     */
    public function visible(Closure $visible): self
    {
        $this->visible = $visible;

        return $this;
    }

    /**
     * Navigate here after `run()`/`executeWithData()` succeeds, instead of
     * reloading the list in place.
     *
     * THE CLOSURE'S SECOND ARGUMENT IS WHAT `handle()` RETURNED, not the form
     * input. `$record` is unchanged from before the run - a closure does not
     * rebind the caller's variable, so a `handle()` that creates a NEW row
     * (replicate, "convert to invoice") cannot hand back the new one through
     * `$record` at all. It hands it back the same way it already reports
     * anything to the client: by returning an array. `replicate` returns
     * `['id' => $copy->getKey()]`, and the redirect closure reads that -
     * `fn (Model $record, array $result): string => "/products/{$result['id']}/edit"`.
     * A plain string is the common case: "resend invoice" always returns to
     * the same list, "start onboarding" always goes to a fixed wizard route.
     *
     * @param  (Closure(Model, array<string, mixed>): string)|string  $url
     */
    public function redirect(Closure|string $url): self
    {
        $this->redirectTo = $url;

        return $this;
    }

    /** @param  array<string, mixed>  $result  Whatever `run()`/`executeWithData()` returned. */
    public function resolveRedirect(Model $record, array $result = []): ?string
    {
        if ($this->redirectTo === null) {
            return null;
        }

        return is_string($this->redirectTo)
            ? $this->redirectTo
            : ($this->redirectTo)($record, $result);
    }

    public function isLink(): bool
    {
        return $this->link !== null;
    }

    public function ability(): string
    {
        return $this->ability;
    }

    /** @param array<string, mixed> $attributes */
    public function appliesTo(array $attributes): bool
    {
        return $this->visible === null || ($this->visible)($attributes) === true;
    }

    /** @param array<string, mixed> $attributes */
    public function urlFor(array $attributes): ?string
    {
        return $this->link === null ? null : ($this->link)($attributes);
    }

    /**
     * Run it, and say whether anything changed.
     *
     * A link action is not runnable: there is nothing to execute, and letting
     * the endpoint "run" one would turn a navigation into a POST that quietly
     * did nothing.
     */
    /**
     * @param  array<string, mixed>  $data  Values collected by `form()`, already
     *                                      validated and reduced to declared keys
     *                                      by the caller. Empty for an action
     *                                      that asks nothing.
     */
    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>|null
     */
    public function run(Model $record, array $data = []): ?array
    {
        if ($this->link !== null) {
            throw new InvalidArgumentException("[{$this->key}] is a link and cannot be executed.");
        }

        /*
         * A FORM WITH NOWHERE TO SEND WHAT IT COLLECTED. `mutate()` is a fixed
         * set of columns fixed at definition time, so it has no use for values
         * a person typed - and an action that collected a reason and then wrote
         * a hardcoded status would be a dialog that lies about what it does.
         * Refused here rather than at the endpoint, so it fails for whoever
         * wrote it rather than for whoever used it.
         */
        if (($this->form !== null || $this->hasSteps()) && $this->handle === null) {
            throw new InvalidArgumentException(
                "[{$this->key}] declares input but no handle(), so the values it collects go nowhere."
            );
        }

        if ($this->hasSteps()) {
            foreach ($this->steps as $step) {
                $patch = $step->runValidate($record, $data);

                if ($patch !== null) {
                    $data = array_merge($data, $patch);
                }
            }
        }

        if ($this->handle !== null) {
            $result = ($this->handle)($record, $data);

            return is_array($result) ? $result : null;
        }

        if ($this->mutate === []) {
            throw new InvalidArgumentException("[{$this->key}] declares nothing to do.");
        }

        $this->assertTransitionAllowed($record);

        $from = $this->transitionState !== null
            ? $record->getAttribute($this->transitionColumn)
            : null;

        // forceFill, because the attributes come from the DEFINITION rather
        // than from a request - the mass-assignment guard is protecting against
        // input, and there is none here.
        $record->forceFill($this->mutate)->save();

        if ($this->transitionState !== null) {
            app(AuditRecorder::class)->record($record, 'state_transition', [
                'column' => $this->transitionColumn,
                'from' => $from,
                'to' => $this->transitionState,
            ]);
        }

        return null;
    }

    /**
     * Structure only. No record data, no CSS classes (antipatterns §6.1).
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'key' => $this->key,
            'label' => $this->label,
            /*
             * DEFAULT WHEN THE HOST OMITTED `->icon()`. The client also resolves
             * by key and label, but shipping the name here means every consumer
             * of the schema (exports, docs, a second client) sees the same glyph
             * without reimplementing the lookup.
             */
            'icon' => $this->icon ?? self::defaultIconFor($this->key, $this->label, $this->destructive),
            'destructive' => $this->destructive,
            // Destructive actions must pause in the client even when the
            // resource author forgot to add ->confirm().
            'confirmation' => $this->confirmation
                ?? ($this->destructive ? "{$this->label} this record?" : null),
            'link' => $this->isLink(),

            /*
             * THE FIELDS, SENT WITH THE LIST. This is what lets the modal open
             * without a request - see `form()`. Null for the common case, and
             * `array_filter` below drops the key entirely so an action that
             * asks nothing carries nothing.
             */
            'form' => $this->hasSteps()
                ? $this->stepsFormSchema()
                : $this->form?->toSchema(),
            'removesRow' => $this->removesRow,
            'color' => $this->color,
            'slideOver' => $this->slideOver ? true : null,
            'modalWidth' => $this->modalWidth,
            'submitLabel' => $this->submitLabel,
            'cancelLabel' => $this->cancelLabel,
            'keyBindings' => $this->keyBindings === [] ? null : $this->keyBindings,
            'extraFooterActions' => $this->extraModalFooterActions === []
                ? null
                : array_map(
                    static fn (ModalFooterAction $a): array => $a->toArray(),
                    $this->extraModalFooterActions,
                ),
        ], static fn (mixed $v): bool => $v !== null && $v !== false);
    }

    /**
     * Semantic icon name for a common key or label when none was declared.
     *
     * Returns null when nothing matches - the client then picks a hollow
     * circle rather than inventing a meaning the server did not intend.
     */
    public static function defaultIconFor(string $key, string $label = '', bool $destructive = false): ?string
    {
        $defaults = [
            'delete' => 'trash',
            'destroy' => 'trash',
            'force-delete' => 'trash',
            'force_delete' => 'trash',
            'impersonate' => 'log-in',
            'login-as' => 'log-in',
            'log-in-as' => 'log-in',
            'login_as' => 'log-in',
            'recharge' => 'coins',
            'recharge-credits' => 'coins',
            'recharge_credits' => 'coins',
            'credits' => 'coins',
            'view' => 'eye',
            'edit' => 'pencil',
            'restore' => 'undo',
            'replicate' => 'copy',
            'duplicate' => 'copy',
            'export' => 'download',
            'download' => 'download',
            'suspend' => 'ban',
            'activate' => 'play',
            'ban' => 'ban',
        ];

        if (isset($defaults[$key])) {
            return $defaults[$key];
        }

        $normalized = str_replace('_', '-', $key);

        if (isset($defaults[$normalized])) {
            return $defaults[$normalized];
        }

        $text = strtolower($label);

        if ($text !== '' && preg_match('/\b(delete|remove|destroy|trash)\b/', $text) === 1) {
            return 'trash';
        }

        if ($text !== '' && preg_match('/\b(log\s*in|impersonat|sign\s*in\s+as)\b/', $text) === 1) {
            return 'log-in';
        }

        if ($text !== '' && preg_match('/\b(recharge|credit|wallet|top\s*up|topup)\b/', $text) === 1) {
            return 'coins';
        }

        return $destructive ? 'trash' : null;
    }

    /**
     * Form schema for the action modal.
     *
     * The client only renders `form.nodes`, so the payload focuses on that.
     *
     * @return array{columns: int, nodes: list<array<string, mixed>>, fields: array<string, mixed>}
     */
    private function stepsFormSchema(): array
    {
        $steps = array_map(function (ActionStep $step): array {
            $nodes = $step->formDefinition()?->toSchema()['nodes'] ?? [];

            return [
                'component' => 'step',
                'key' => $step->stepKey(),
                'label' => $step->label,
                'description' => $step->getDescription(),
                'submitLabel' => $step->getSubmitLabel(),
                'children' => $nodes,
            ];
        }, $this->steps);

        return [
            'columns' => 1,
            'nodes' => [
                [
                    'component' => 'wizard',
                    'children' => $steps,
                ],
            ],
            'fields' => [],
        ];
    }

    /**
     * Execute with already-collected and already-step-validated data.
     *
     * This bypasses step callbacks run in `run()` so a wizard can validate
     * each step on its own request.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>|null
     */
    public function executeWithData(Model $record, array $data = []): ?array
    {
        if ($this->link !== null) {
            throw new InvalidArgumentException("[{$this->key}] is a link and cannot be executed.");
        }

        if ($this->handle !== null) {
            $result = ($this->handle)($record, $data);

            return is_array($result) ? $result : null;
        }

        if ($this->mutate === []) {
            throw new InvalidArgumentException("[{$this->key}] declares nothing to do.");
        }

        $this->assertTransitionAllowed($record);

        $from = $this->transitionState !== null
            ? $record->getAttribute($this->transitionColumn)
            : null;

        $record->forceFill($this->mutate)->save();

        if ($this->transitionState !== null) {
            app(AuditRecorder::class)->record($record, 'state_transition', [
                'column' => $this->transitionColumn,
                'from' => $from,
                'to' => $this->transitionState,
            ]);
        }

        return null;
    }

    private function assertTransitionAllowed(Model $record): void
    {
        if ($this->transitionState === null) {
            return;
        }

        if (! in_array(HasStateTransitions::class, class_uses_recursive($record), true)) {
            return;
        }

        /** @var Model&HasStateTransitions $record */
        $record->assertCanTransitionTo($this->transitionState, $this->transitionColumn);
    }
}

<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Closure;
use Illuminate\Database\Eloquent\Collection;
use InvalidArgumentException;
use Alxtexh\Panel\Forms\Form;

/**
 * A mutation applied to a selection.
 *
 * THE CLIENT SENDS AN ACTION KEY, NEVER AN ATTRIBUTE SET. `mutate()` is
 * declared here, in server-side code, and the request may only name which
 * declared action to run. The alternative - accepting `{status: 'active'}` from
 * the browser and applying it - is a mass-assignment endpoint wearing a bulk
 * action's clothes, and it would let any authenticated operator write any
 * column on any row they can see.
 *
 * TWO EXECUTION SHAPES, because they have genuinely different costs:
 *
 *   `mutate()`  one UPDATE per chunk. Suspending 50,000 clients is 50 queries,
 *               not 50,000. This is the path almost every bulk action wants.
 *
 *   `handle()`  receives the models, for anything that needs events, per-record
 *               logic, or related writes. Costs a hydration per chunk and is
 *               the honest price of doing per-record work.
 *
 * Authorization is an ABILITY NAME resolved against the resource policy, and it
 * defaults to `update` rather than to nothing - an action that forgets to
 * declare one is checked, not waved through.
 */
final class BulkAction
{
    private ?string $icon = null;

    private bool $destructive = false;

    private ?string $confirmation = null;

    /** Same palette as RecordAction, because it is the same menu vocabulary. */
    private ?string $color = null;

    private string $ability = 'update';

    /**
     * Whether the action must authorize each selected record individually.
     *
     * Collection authorization answers "may this actor run this action at
     * all?". This second check answers "may they run it on this row?" and is
     * important for mixed selections where policy decisions depend on record
     * state or ownership. It mirrors Filament's explicit
     * `authorizeIndividualRecords()` opt-in without imposing N policy calls on
     * the fast path for uniform, tenant-scoped mutations.
     */
    private bool $authorizeIndividualRecords = false;

    /** @var array<string, mixed> */
    private array $mutate = [];

    private ?Closure $handle = null;

    /**
     * Fields to collect ONCE, before the selection is touched.
     *
     * The bulk twin of `RecordAction::form()` and the shape most selection
     * actions in a real panel have: "assign these to a department", "move these
     * to a plan", "cancel these with a reason". The values are collected once
     * and applied to every row, which is the whole reason it is a bulk action
     * rather than a hundred clicks.
     */
    private ?Form $form = null;

    /**
     * Present a form action in PkSlideover instead of the default dense PkModal.
     *
     * Same opt-in as RecordAction::slideOver(). Page-first CRUD stays on
     * dedicated routes; this is for secondary bulk forms that need more
     * horizontal room than a centred modal.
     */
    private bool $slideOver = false;

    private int $chunkSize = 1000;

    /** Null defers to `panel.bulk.queue_threshold` - see `queueThreshold()`. */
    private ?int $queueThreshold = null;

    private function __construct(public readonly string $key, private readonly string $label) {}

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /** Renders in a warning tone and always confirms. */
    public function destructive(bool $destructive = true): self
    {
        $this->destructive = $destructive;

        return $this;
    }

    /**
     * The tone this action carries in the bulk menu.
     *
     * Deliberately the SAME vocabulary and the same six names as
     * `RecordAction::color()`. Suspend means the same thing whether it is done
     * to one subscriber or to nine hundred, and it should not be amber in one
     * menu and grey in the other.
     */
    public function color(string $color): self
    {
        if (! in_array($color, RecordAction::COLORS, true)) {
            throw new InvalidArgumentException(
                "[{$this->key}] has unknown colour [{$color}]. One of: "
                .implode(', ', RecordAction::COLORS).'.'
            );
        }

        $this->color = $color;

        return $this;
    }

    public function requiresConfirmation(string $message): self
    {
        $this->confirmation = $message;

        return $this;
    }

    /** The policy ability checked before anything is written. */
    public function authorize(string $ability): self
    {
        $this->ability = $ability;

        return $this;
    }

    /**
     * Use the collection-level policy ability for this bulk operation.
     *
     * `deleteAny` is intentionally distinct from `delete`: the first answers
     * whether this actor may run a bulk delete at all, while the latter is used
     * only when `authorizeIndividualRecords()` is enabled for each row.
     */
    public function authorizeAny(string $ability): self
    {
        $this->ability = str_ends_with($ability, 'Any') ? $ability : $ability.'Any';

        return $this;
    }

    public function authorizeIndividualRecords(bool $authorize = true): self
    {
        $this->authorizeIndividualRecords = $authorize;

        return $this;
    }

    public function authorizesIndividualRecords(): bool
    {
        return $this->authorizeIndividualRecords;
    }

    /**
     * The attributes to set, as ONE update per chunk.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function mutate(array $attributes): self
    {
        if ($attributes === []) {
            throw new InvalidArgumentException("Bulk action [{$this->key}] declares an empty mutation.");
        }

        $this->mutate = $attributes;

        return $this;
    }

    /**
     * Per-record work, for anything an UPDATE cannot express.
     *
     * @param  Closure(Collection): void  $handle
     */
    /**
     * Collect input before running - see the property note.
     *
     * PAIRS WITH `handle()`, NEVER `mutate()`, for the same reason as the
     * record version: a mutation is a fixed set of columns decided at
     * definition time and has nowhere to put what a person typed.
     *
     * THE VALUES ARE COLLECTED ONCE AND REUSED FOR EVERY CHUNK. `BulkRunner`
     * walks the selection in keyset chunks, so the handler is called repeatedly
     * with the same data - which is what makes "apply this to 40,000 rows"
     * one decision rather than a prompt per batch.
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
     * Present a form action in PkSlideover instead of the default dense PkModal.
     *
     * Page-first CRUD stays on dedicated routes; this is for secondary bulk
     * flows that need more horizontal room than a centred modal.
     */
    public function slideOver(bool $slideOver = true): self
    {
        $this->slideOver = $slideOver;

        return $this;
    }

    /** @param Closure(mixed, array<string, mixed>): mixed $handle */
    public function handle(Closure $handle): self
    {
        $this->handle = $handle;

        return $this;
    }

    /**
     * How many records are touched per round trip.
     *
     * Bounded on both sides: a chunk of 1 is one query per record, and a chunk
     * of 100,000 builds a `WHERE id IN (...)` with 100,000 bindings, which most
     * drivers reject outright and the rest handle badly.
     */
    public function chunkSize(int $size): self
    {
        if ($size < 1 || $size > 5000) {
            throw new InvalidArgumentException('Chunk size must be between 1 and 5000.');
        }

        $this->chunkSize = $size;

        return $this;
    }

    /**
     * HOW MANY EXPLICITLY-SELECTED ROWS THIS ACTION WILL STILL RUN INLINE.
     *
     * COST IS A PROPERTY OF THE ACTION, NOT OF THE ROW COUNT. Two hundred rows
     * through a handler that sends a message or calls an API is slower than a
     * thousand through a column update, so a single global number is the wrong
     * shape for the expensive cases and only the right shape for the ordinary
     * ones. This is how an action says which it is.
     *
     * NULL MEANS `panel.bulk.queue_threshold`, which is where the ordinary
     * answer lives. Set it LOW for anything that does per-row work with a
     * network call in it: past the threshold the selection is handed to a
     * worker with a progress token instead of holding a request open until the
     * web server times out and leaves a partial write behind.
     */
    public function queueThreshold(int $rows): self
    {
        if ($rows < 1) {
            throw new InvalidArgumentException('The queue threshold must be at least 1 row.');
        }

        $this->queueThreshold = $rows;

        return $this;
    }

    public function getQueueThreshold(): ?int
    {
        return $this->queueThreshold;
    }

    public function getAbility(): string
    {
        return $this->ability;
    }

    /** The record-level counterpart of an `*Any` collection ability. */
    public function getRecordAbility(): string
    {
        return str_ends_with($this->ability, 'Any')
            ? substr($this->ability, 0, -3)
            : $this->ability;
    }

    public function getChunkSize(): int
    {
        return $this->chunkSize;
    }

    /** @return array<string, mixed> */
    public function getMutation(): array
    {
        return $this->mutate;
    }

    public function getHandler(): ?Closure
    {
        return $this->handle;
    }

    /**
     * A FORM WITH NOWHERE TO SEND WHAT IT COLLECTED is refused, exactly as for
     * a record action - it would be a dialog that lies about what it does.
     */
    public function requiresHandler(): bool
    {
        return $this->form !== null;
    }

    public function isRunnable(): bool
    {
        return $this->mutate !== [] || $this->handle !== null;
    }

    /**
     * The client half. Semantic only - no classes, no colours (§6.1).
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $payload = [
            'key' => $this->key,
            'label' => $this->label,
            'icon' => $this->icon,
            'destructive' => $this->destructive,
            'color' => $this->color,
            'ability' => $this->ability,
            'authorizeIndividualRecords' => $this->authorizeIndividualRecords,
            // A destructive action always confirms, even if the definition
            // forgot to say so.
            'confirmation' => $this->confirmation
                ?? ($this->destructive ? "{$this->label} the selected records?" : null),

            /*
             * THE FIELDS, SENT WITH THE ACTION so the dialog opens with no
             * request. Null for the common case; the client checks for its
             * presence rather than its truthiness.
             */
            'form' => $this->form?->toSchema(),
        ];

        if ($this->slideOver) {
            $payload['slideOver'] = true;
        }

        return $payload;
    }
}

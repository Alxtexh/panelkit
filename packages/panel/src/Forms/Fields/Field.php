<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Alxtexh\Panel\Schema\Renderable;

/**
 * A form field.
 *
 * ONE SOURCE OF VALIDATION TRUTH. `rules()` produces the Laravel validation
 * array the server enforces, and it is the ONLY place rules are written. The
 * client carries no copy - a duplicated rule set drifts, and the copy that
 * drifts is always the client one, so the failure is "the form said it was fine
 * and the save rejected it".
 *
 * LIVE validation while typing uses the same JSON POST as `live()` form-state,
 * against the existing `precognitive` store/update routes. The Vue page sends
 * `{ field, values }` (values at the top level, field in
 * `Precognition-Validate-Only`). There is no Livewire and no extra PHP stack.
 *
 * Like columns, a field emits SEMANTIC values only. No CSS classes ever reach
 * the schema (antipatterns §6.1), and no tenant data either - an option list
 * backed by a query is a closure, resolved when the form's data is assembled,
 * never while building the cached schema (antipatterns §3.3, addendum Part A).
 */
abstract class Field implements Renderable
{
    use HasAffixes;

    protected ?string $label = null;

    protected bool $required = false;

    /**
     * `[controlling field, value]` when this field is conditional, else null.
     *
     * @var array{0: string, 1: mixed}|null
     */
    protected ?array $visibleWhen = null;

    protected ?string $help = null;

    protected ?string $placeholder = null;

    /**
     * Insertable tokens for a message field, `@token => meaning`, or null.
     *
     * @var array<string, string>|null
     */
    protected ?array $chips = null;

    protected bool|Closure $disabled = false;

    /**
     * Hide this field after a live() round-trip (or immediately when a bool).
     *
     * Closures receive the current form values. Cheap show/hide still uses
     * `visibleWhen`, which the client evaluates without a request.
     *
     * @var bool|Closure(array<string, mixed>): bool
     */
    protected bool|Closure $hidden = false;

    /**
     * Mutate other values after this live field changes.
     *
     * @var Closure(mixed, callable(string, mixed): void, array<string, mixed>): void|null
     */
    protected ?Closure $afterStateUpdated = null;

    /** When true, the client posts form-state after this field changes. */
    protected bool $live = false;

    /** @var list<object|string> */
    protected array $rules = [];

    /** Columns spanned in the form grid. Layout intent, not a CSS class. */
    protected int $span = 1;

    final public function __construct(public readonly string $key) {}

    public static function make(string $key): static
    {
        return new static($key);
    }

    abstract public function type(): string;

    public function label(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function required(bool $required = true): static
    {
        $this->required = $required;

        return $this;
    }

    public function help(string $help): static
    {
        $this->help = $help;

        return $this;
    }

    public function placeholder(string $placeholder): static
    {
        $this->placeholder = $placeholder;

        return $this;
    }

    public function disabled(bool|Closure $disabled = true): static
    {
        $this->disabled = $disabled;

        return $this;
    }

    /**
     * Hide this field. A Closure is evaluated on `{resource}/form-state`
     * against the posted values. `visibleWhen` stays the cheap client-side rule.
     *
     * @param  bool|Closure(array<string, mixed>): bool  $hidden
     */
    public function hidden(bool|Closure $hidden = true): static
    {
        $this->hidden = $hidden;

        return $this;
    }

    /**
     * Run after this live() field changes, before the schema patch is built.
     *
     * `$set('other', $value)` writes into the values returned to the client.
     *
     * @param  Closure(mixed, callable(string, mixed): void, array<string, mixed>): void  $callback
     */
    public function afterStateUpdated(Closure $callback): static
    {
        $this->afterStateUpdated = $callback;

        return $this;
    }

    /** @param array<string, mixed> $values */
    public function isHidden(array $values = []): bool
    {
        return $this->resolveFlag($this->hidden, $values);
    }

    /** @param array<string, mixed> $values */
    public function isDisabled(array $values = []): bool
    {
        return $this->resolveFlag($this->disabled, $values);
    }

    /**
     * @param  array<string, mixed>  $values
     * @return array<string, mixed>
     */
    public function applyAfterStateUpdated(array $values): array
    {
        if ($this->afterStateUpdated === null) {
            return $values;
        }

        $set = static function (string $key, mixed $value) use (&$values): void {
            $values[$key] = $value;
        };

        ($this->afterStateUpdated)($values[$this->key] ?? null, $set, $values);

        return $values;
    }

    /**
     * Ask the server for option and schema patches after this field changes.
     *
     * KIT CONTRACT (Inertia, not Livewire): the client POSTs `{ field, values }`
     * to `{resource}/form-state`. The server returns `{ options, schema, values }`
     * so afterStateUpdated-style logic can hide, disable, or replace fields.
     * `visibleWhen` still hides fields locally without a round-trip.
     */
    public function live(bool $live = true): static
    {
        $this->live = $live;

        return $this;
    }

    public function isLive(): bool
    {
        return $this->live;
    }

    /** @param  bool|Closure(array<string, mixed>): bool  $flag */
    /** @param array<string, mixed> $values */
    private function resolveFlag(bool|Closure $flag, array $values): bool
    {
        return $flag instanceof Closure ? (bool) $flag($values) : $flag;
    }

    /**
     * Additional rules, merged with the ones the type implies.
     *
     * Accepts rule OBJECTS as well as strings, because some checks a string
     * cannot express - ExistsInScope, for instance, has to ask the model rather
     * than the table so global scopes apply.
     *
     * Widened rather than given a second method: `rules()` is already the
     * getter, and a setter of the same name is a fatal redeclare.
     */
    public function rule(object|string ...$rules): static
    {
        $this->rules = [...$this->rules, ...array_values($rules)];

        return $this;
    }

    public function span(int $span): static
    {
        $this->span = $span;

        return $this;
    }

    public function resolvedLabel(): string
    {
        return $this->label ?? str($this->key)->headline()->value();
    }

    public function isRequired(): bool
    {
        return $this->required;
    }

    /**
     * The Laravel validation rules for this field.
     *
     * @return list<mixed>
     */
    public function rules(): array
    {
        return [$this->presenceRule(), ...$this->typeRules(), ...$this->rules];
    }

    /**
     * `required`, `nullable`, or `required_if` when this field is conditional.
     *
     * THE CONDITION IS RE-EVALUATED SERVER-SIDE, and that is the entire point of
     * expressing it as a validation rule rather than as a client hint.
     *
     * A conditional field is hidden by the browser when its condition is not
     * met - "show the tax number when the customer is a business". Treating that
     * as the whole story produces two symmetrical bugs, in opposite directions:
     *
     *   A plain `required` on a HIDDEN field means the form can never be
     *   submitted: the operator is told to fill in something that is not on
     *   screen, with no way to find it.
     *
     *   Dropping the rule entirely means a client that simply does not send the
     *   field skips a requirement the resource declared - and "hidden" was never
     *   a constraint on what a request may contain.
     *
     * `required_if` is neither. The rule travels with the same condition the UI
     * uses, so the server decides using the SUBMITTED value of the controlling
     * field. A request claiming to be a business must supply the tax number
     * whatever the browser displayed.
     */
    private function presenceRule(): string
    {
        if (! $this->required) {
            return 'nullable';
        }

        if ($this->visibleWhen === null) {
            return 'required';
        }

        [$field, $value] = $this->visibleWhen;

        // Booleans have to be written the way Laravel's rule parser reads them,
        // or `required_if:is_business,1` silently never matches `true`.
        $value = match (true) {
            $value === true => '1',
            $value === false => '0',
            default => (string) $value,
        };

        return "required_if:{$field},{$value}";
    }

    /**
     * Show this field only when another field holds a given value.
     *
     * PRESENTATION AND VALIDATION TOGETHER, from one declaration. The schema
     * carries the condition so the client can hide the control, and `rules()`
     * turns the same condition into `required_if` so the server reaches the same
     * answer from the submitted data. Declaring them separately is how they come
     * to disagree.
     */
    public function visibleWhen(string $field, mixed $value): static
    {
        $this->visibleWhen = [$field, $value];

        return $this;
    }

    /** @return array{0: string, 1: mixed}|null */
    public function visibilityCondition(): ?array
    {
        return $this->visibleWhen;
    }

    /**
     * Tokens the client can insert into this field, drawn from wherever the
     * caller's own schema says they come from.
     *
     * THE ORIGINAL VERSION OF THIS WAS THE DOCUMENT DESIGNER'S OWN, hand-built
     * against `DocumentKind::variables()` because nothing more general
     * existed. This is that same idea moved onto `Field` itself, so any
     * message field anywhere - an announcement's body, a future report's -
     * gets the identical chip strip and the identical "unknown token" guard
     * `panel:doctor` already knows how to run against a declared map, rather
     * than a second bespoke implementation per caller.
     *
     * NOT A DYNAMIC LIST. Unlike `options()`, which resolves late because a
     * select's choices are often tenant data, a token map is documentation
     * about what THIS FIELD substitutes - the same handful of names for every
     * tenant - so it is safe to cache in the schema exactly like any other
     * structural value.
     *
     * @param  array<string, string>  $chips  `@token => meaning`
     */
    public function chips(array $chips): static
    {
        $this->chips = $chips;

        return $this;
    }

    /** @return list<mixed> */
    protected function typeRules(): array
    {
        return [];
    }

    /**
     * Rules for keys OTHER than this field's own.
     *
     * A multi-value field needs `key.*` as well as `key`, and Form::rules()
     * keys everything by field - so without this hook a field could only ever
     * validate its own key. The consequence is not cosmetic: an `array` rule
     * alone accepts `['active', 'anything']`, because the array is an array.
     *
     * @return array<string, list<mixed>>
     */
    public function additionalRules(): array
    {
        return [];
    }

    /**
     * Structure only. Never resolves an option closure.
     *
     * @return array<string, mixed>
     */
    public function toSchema(): array
    {
        return array_filter([
            // Discriminator, so the client can walk a mixed tree of layout
            // nodes and fields without guessing what each node is.
            'component' => 'field',
            'key' => $this->key,
            'label' => $this->resolvedLabel(),
            'type' => $this->type(),
            'required' => $this->required,
            'help' => $this->help,
            'placeholder' => $this->placeholder,
            'disabled' => $this->isDisabled() ? true : null,
            'hidden' => $this->isHidden() ? true : null,
            'live' => $this->live ? true : null,
            'span' => $this->span > 1 ? $this->span : null,
            /*
             * The visibility condition, so the client can hide the control.
             *
             * A HINT, NOT A RULE. The server derives `required_if` from the same
             * declaration, so hiding this field on the client changes what is
             * shown and nothing about what is enforced.
             */
            'visibleWhen' => $this->visibleWhen === null ? null : [
                'field' => $this->visibleWhen[0],
                'value' => $this->visibleWhen[1],
            ],
            'chips' => $this->chips,
            ...$this->affixSchema(),
        ], static fn (mixed $v): bool => $v !== null && $v !== false);
    }

    /**
     * Current form values for this field, read from the record.
     *
     * ONE KEY FOR MOST FIELDS. MorphTo is the exception: it stores
     * `{key}_type` and `{key}_id` and presents `{ type, id }` under `$this->key`.
     *
     * @return array<string, mixed>
     */
    public function valuesFrom(?Model $record): array
    {
        $value = $record?->getAttribute($this->key);

        return [$this->key => $this->presentValue($value)];
    }

    /**
     * Extra columns to write instead of `$this->key`, or null to keep the default.
     *
     * MorphTo uses this to stamp `{key}_type` and `{key}_id` and to keep the
     * synthetic `{ type, id }` payload off the model.
     *
     * @return array<string, mixed>|null
     */
    public function expandStorage(mixed $value): ?array
    {
        return null;
    }

    /**
     * Turn a stored value into what the FORM should show.
     *
     * The mirror of `transformForStorage()`, and the identity for the same
     * reason: for most fields the column value is the editable value. An upload
     * is not - the column holds a path, and a path is not something a person
     * can look at and recognise.
     */
    public function presentValue(mixed $value): mixed
    {
        return $value;
    }

    /**
     * Turn a validated value into what the column should hold.
     *
     * The identity by default: for most fields the submitted value IS the
     * stored value. It exists for the ones where it is not - an upload submits
     * a handle and stores a path - and living here rather than in the
     * controller is what keeps that knowledge with the field that has it,
     * instead of adding a type check to every save path.
     */
    public function transformForStorage(mixed $value): mixed
    {
        return $value;
    }

    /**
     * Whether this value should be left out of the write entirely.
     *
     * DIFFERENT FROM TRANSFORMING TO NULL, and the distinction is the whole
     * reason this exists: null OVERWRITES the stored value, omission leaves it
     * alone. A password field submitted blank means "keep the current one", and
     * transforming it to null would instead erase it - locking the account out
     * of a form somebody opened to correct a typo in a name.
     *
     * Defaults to false, so every existing field writes exactly as before.
     */
    public function omitsFromStorage(mixed $value): bool
    {
        return false;
    }

    /**
     * What an ABSENT key means for this field, if anything.
     *
     * THE DEFAULT IS "NOTHING", which is what every field but a boolean wants.
     * `Form::sanitize()` skips a key the request does not carry, and that is
     * deliberate: a blank password means "keep the current one", an untouched
     * upload means "keep the current file". Writing null for either would
     * destroy data the operator never asked to change.
     *
     * A TICK BOX IS THE EXCEPTION, AND IT IS NOT A CORNER CASE. An unticked
     * checkbox submits NOTHING - the browser omits the key entirely, which is
     * how HTML has always worked. Under the default rule that reads as "leave
     * it alone", so unticking a box, saving, and being told it saved leaves the
     * value exactly as it was. On a field called "Available to sell" that is a
     * plan still on sale after somebody withdrew it.
     *
     * Alxtexhpanel's own client never triggers this - `ResourceForm` submits every
     * declared key, `false` included. It bites the consumer building their own
     * form out of the exported components, which this framework actively
     * encourages, and it bites them silently.
     *
     * Returning `self::ABSENT_MEANS_NOTHING` keeps the existing behaviour, so
     * a field that does not override this writes exactly as it did before.
     */
    public function absentMeans(): mixed
    {
        return self::ABSENT_MEANS_NOTHING;
    }

    /**
     * The sentinel for "an absent key is not my business".
     *
     * AN OBJECT RATHER THAN NULL, because null is a legitimate thing for a
     * field to want written - a nullable column cleared on purpose - and a
     * sentinel that collides with a real value is a bug waiting for the first
     * person who needs it.
     */
    public const ABSENT_MEANS_NOTHING = '__alxtexhpanel_absent_means_nothing__';

    /**
     * Tenant-varying options, resolved when the DATA payload is assembled.
     *
     * @return list<array{value: mixed, label: string}>|null
     */
    public function resolveOptions(): ?array
    {
        return null;
    }
}

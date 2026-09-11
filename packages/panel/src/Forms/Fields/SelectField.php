<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use InvalidArgumentException;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Forms\Rules\ExistsInScope;
use Alxtexh\Panel\Forms\Rules\MorphExistsInScope;
use Alxtexh\Panel\Models\Scopes\TenantScope;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\TenantContext;

/**
 * A single-choice field.
 *
 * Options may be a literal list (structure - safe to cache) or a Closure
 * (tenant data - resolved only when the form's data payload is assembled).
 * Either way the SUBMITTED value is validated against the resolved list by an
 * `in:` rule, so the allowlist is enforced server-side rather than trusted from
 * the client.
 */
final class SelectField extends Field
{
    /** @var array<string|int, string>|Closure(): array<string|int, string> */
    private array|Closure $options = [];

    /** @var array<string|int, string>|null */
    private ?array $resolved = null;

    private bool $searchable = false;

    /** @var (Closure(string, array<string, mixed>): array<string|int, string>)|null */
    private ?Closure $searchQuery = null;

    /** @var class-string<Model>|null */
    private ?string $relatedModel = null;

    private ?string $titleAttribute = null;

    /**
     * MorphTo types: model class => title attribute.
     *
     * @var array<class-string<Model>, string>
     */
    private array $morphTypes = [];

    /** @var class-string<Resource>|null */
    private ?string $pickerResource = null;

    /**
     * Mini-form used to create a related row without leaving this field.
     *
     * @var list<Field>
     */
    private array $createOptionFields = [];

    /** @var Closure(array<string, mixed>): mixed|null */
    private ?Closure $createOptionUsing = null;

    private ?string $createOptionDialogTitle = null;

    private ?string $createOptionButtonLabel = null;

    /** Morph type chrome: select (default) or toggle-buttons. */
    private bool $morphTypeSelectToggleButtons = false;

    /**
     * Above this, rendering every option inline stops being reasonable.
     *
     * Not arbitrary: 200 options is a long but usable dropdown, and it is far
     * enough below the point where the DOM cost shows up that nobody hits it by
     * accident. Pointed at a 100k-row relation the old code emitted 100,000
     * option elements - a correctness problem, not a slow one.
     */
    private const INLINE_LIMIT = 200;

    /** @param array<string|int, string>|Closure(): array<string|int, string> $options */
    public function options(array|Closure $options): static
    {
        $this->options = $options;

        return $this;
    }

    /** @return array<string|int, string> value => label */
    public function resolvedOptionMap(): array
    {
        return $this->resolved ??= ($this->options instanceof Closure ? ($this->options)() : $this->options);
    }

    /**
     * Fetch options on demand instead of rendering them all.
     *
     * Required for any relation that can grow - a client picker cannot ship
     * every client to the browser. The callback receives the search term and
     * returns value => label, already tenant-scoped by the model it queries.
     *
     * @param  (Closure(string, array<string, mixed>): array<string|int, string>)|null  $query
     */
    public function searchable(?Closure $query = null): static
    {
        $this->searchable = true;
        $this->searchQuery = $query;

        return $this;
    }

    public function isSearchable(): bool
    {
        return $this->searchable;
    }

    /**
     * Options from a related Eloquent model (BelongsTo picker).
     *
     * Searchable by default. Validation uses ExistsInScope so another tenant's
     * id is invalid the same way a missing id is. `$modifyQuery` receives the
     * query and the current form values (from `live()` / form-state).
     *
     * @param  class-string<Model>  $model
     * @param  Closure(Builder<Model>, array<string, mixed>): void|null  $modifyQuery
     */
    public function relationship(string $model, string $titleAttribute, ?Closure $modifyQuery = null): static
    {
        if (! is_subclass_of($model, Model::class)) {
            throw new InvalidArgumentException("[{$model}] is not an Eloquent model.");
        }

        $this->relatedModel = $model;
        $this->titleAttribute = $titleAttribute;
        $this->searchable = true;

        $this->searchQuery = function (string $term, array $form = []) use ($model, $titleAttribute, $modifyQuery): array {
            return $this->searchModel($model, $titleAttribute, $term, $modifyQuery, $form);
        };

        return $this->rule(ExistsInScope::of($model));
    }

    /**
     * MorphTo picker: a type and an id, with scoped Exists validation.
     *
     * Filament MorphToSelect without Livewire. The client submits
     * `{ type, id }` under this field's key. Storage writes `{key}_type`
     * and `{key}_id`. `$types` is model class => title attribute.
     *
     * @param  array<class-string<Model>, string>  $types
     */
    public function morphTo(array $types): static
    {
        if ($types === []) {
            throw new InvalidArgumentException('morphTo() needs at least one model => title attribute pair.');
        }

        foreach ($types as $model => $titleAttribute) {
            if (! is_subclass_of($model, Model::class)) {
                throw new InvalidArgumentException("[{$model}] is not an Eloquent model.");
            }

            $this->morphTypes[$model] = $titleAttribute;
        }

        $this->searchable = true;
        $this->live = true;

        $this->searchQuery = function (string $term, array $form = []): array {
            $type = data_get($form, $this->key.'.type');

            if (! is_string($type) || ! isset($this->morphTypes[$type]) || ! $this->isModelClass($type)) {
                return [];
            }

            return $this->searchModel($type, $this->morphTypes[$type], $term);
        };

        return $this;
    }

    /**
     * Dedicated picker page that reuses ListQuery. Not a modal.
     *
     * TableSelect without Livewire. The page lists `$resource` through the
     * same query the related index uses. Skip ModalTableSelect.
     *
     * @param  class-string<Resource>  $resource
     */
    public function tableSelect(string $resource, ?string $titleAttribute = null): static
    {
        if (! is_subclass_of($resource, Resource::class)) {
            throw new InvalidArgumentException("[{$resource}] is not a panel resource.");
        }

        $this->pickerResource = $resource;
        $this->searchable = true;

        if ($this->relatedModel === null && $this->morphTypes === []) {
            $this->relationship($resource::model(), $titleAttribute ?? 'title');
        }

        return $this;
    }

    /**
     * Create a related row from a small form, then pick it.
     *
     * JSON, not a Livewire modal. Resource CRUD stays on dedicated pages;
     * this is only for filling an option list. `$using` receives sanitised
     * values and must return the new key. Omit it to insert into the
     * `relationship()` model.
     *
     *     SelectField::make('article_id')
     *         ->relationship(Article::class, 'title')
     *         ->createOption([
     *             TextField::make('title')->required(),
     *         ]);
     *
     * @param  list<mixed>  $fields
     * @param  Closure(array<string, mixed>): mixed|null  $using
     */
    public function createOption(array $fields, ?Closure $using = null): static
    {
        $validated = [];

        foreach ($fields as $field) {
            if (! $field instanceof Field) {
                throw new InvalidArgumentException('createOption() fields must be Field instances.');
            }

            $validated[] = $field;
        }

        $this->createOptionFields = $validated;
        $this->createOptionUsing = $using;

        return $this;
    }

    public function createOptionLabel(string $label): static
    {
        $this->createOptionDialogTitle = $label;

        return $this;
    }

    public function createOptionActionLabel(string $label): static
    {
        $this->createOptionButtonLabel = $label;

        return $this;
    }

    /**
     * Draw the MorphTo type picker as toggle buttons instead of a select.
     *
     * Requires a short type list; pairs with ToggleButtonsField chrome on the
     * client. Filament's typeSelectToggleButtons() without Livewire.
     */
    public function typeSelectToggleButtons(bool $condition = true): static
    {
        $this->morphTypeSelectToggleButtons = $condition;

        return $this;
    }

    public function canCreateOption(): bool
    {
        return $this->createOptionFields !== [];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function createOptionSchema(): array
    {
        return array_map(static fn (Field $field): array => $field->toSchema(), $this->createOptionFields);
    }

    /**
     * @param  array<string, mixed>  $input
     * @return array{value: mixed, label: string}
     */
    public function createRelated(array $input): array
    {
        $form = Form::make()->schema($this->createOptionFields);
        Validator::make($input, $form->rules())->validate();
        $data = $form->sanitize($input);

        if ($this->createOptionUsing !== null) {
            $id = ($this->createOptionUsing)($data);
            $label = $this->labelForCreated($id);

            return ['value' => $id, 'label' => $label];
        }

        if ($this->relatedModel === null) {
            throw new InvalidArgumentException('createOption() needs relationship() or a using callback.');
        }

        $model = $this->relatedModel;
        $record = new $model;

        if (Gate::getPolicyFor($model) !== null) {
            abort_unless(Gate::allows('create', $model), 403);
        }

        $this->stampTenant($record);

        foreach ($data as $column => $value) {
            $record->setAttribute($column, $value);
        }

        $record->save();

        $label = $this->titleAttribute !== null
            ? (string) $record->getAttribute($this->titleAttribute)
            : (string) $record->getKey();

        return ['value' => $record->getKey(), 'label' => $label];
    }

    private function stampTenant(Model $record): void
    {
        $context = app(TenantContext::class);

        if (! $context->shouldScopeByColumn()) {
            return;
        }

        if (! Schema::hasColumn($record->getTable(), $context->column())) {
            return;
        }

        if (! $record->hasGlobalScope(TenantScope::class)) {
            return;
        }

        $key = $context->currentKey();

        abort_if($key === null, 403, 'No tenant resolved; refusing to write an unscoped record.');

        $record->setAttribute($context->column(), $key);
    }

    private function labelForCreated(mixed $id): string
    {
        if ($this->relatedModel !== null && $this->titleAttribute !== null) {
            $row = is_scalar($id) ? $this->relatedModel::query()->find($id) : null;

            if ($row !== null) {
                return (string) $row->getAttribute($this->titleAttribute);
            }
        }

        return is_scalar($id) ? (string) $id : '';
    }

    public function isMorphTo(): bool
    {
        return $this->morphTypes !== [];
    }

    /** @return class-string<Resource>|null */
    public function pickerResource(): ?string
    {
        return $this->pickerResource;
    }

    /** @phpstan-assert-if-true class-string<Model> $class */
    private function isModelClass(string $class): bool
    {
        return is_a($class, Model::class, true);
    }

    /**
     * @param  class-string<Model>  $model
     * @param  Closure(Builder<Model>, array<string, mixed>): void|null  $modifyQuery
     * @param  array<string, mixed>  $form
     * @return array<string|int, string>
     */
    private function searchModel(
        string $model,
        string $titleAttribute,
        string $term,
        ?Closure $modifyQuery = null,
        array $form = [],
    ): array {
        $query = $model::query();

        if ($modifyQuery !== null) {
            $modifyQuery($query, $form);
        }

        if ($term !== '') {
            $query->where($titleAttribute, 'like', '%'.addcslashes($term, '%_\\').'%');
        }

        $key = (new $model)->getKeyName();
        $out = [];

        foreach ($query->orderBy($titleAttribute)->limit(25)->get([$key, $titleAttribute]) as $row) {
            $out[$row->getKey()] = (string) $row->getAttribute($titleAttribute);
        }

        return $out;
    }

    /**
     * Options for a search term. Only meaningful on a searchable field.
     *
     * @param  array<string, mixed>  $form  Current form values, for live() dependents.
     * @return list<array{value: mixed, label: string}>
     */
    public function search(string $term, array $form = []): array
    {
        $map = $this->searchQuery !== null
            ? ($this->searchQuery)($term, $form)
            : array_filter(
                $this->resolvedOptionMap(),
                static fn (string $label): bool => $term === '' || stripos($label, $term) !== false,
            );

        $out = [];

        foreach ($map as $value => $label) {
            $out[] = ['value' => $value, 'label' => $label];
        }

        return $out;
    }

    public function type(): string
    {
        return 'select';
    }

    /**
     * `in:` from the resolved options. ALWAYS, even when the list is empty.
     *
     * This is the one place a Closure-backed option list is touched during
     * validation, and it has to be: without it the client could submit any value
     * and the option list would be decoration.
     *
     * Emitting nothing when the list resolves EMPTY was a real hole. `plan_id`
     * is populated from a tenant-scoped query, so an empty result is exactly
     * what a caller without a resolvable tenant sees - and the field then
     * accepted any integer, including another tenant's plan id. Rule::in([])
     * rejects every non-null value instead, which is the correct reading of
     * "there is nothing you may choose".
     */
    protected function typeRules(): array
    {
        /*
         * A SEARCHABLE field cannot use Rule::in - its options are a moving
         * window, and pinning validation to whatever the last search returned
         * would reject perfectly valid values.
         *
         * `exists` is the correct check instead, and it is STRONGER: it asks the
         * database whether the row is real, through a query the tenant scope
         * applies to. Without an exists rule declared, the field falls back to
         * refusing everything rather than accepting anything - a searchable
         * field with no validation would be the exact hole this whole change is
         * fixing.
         */
        if ($this->morphTypes !== []) {
            return ['array'];
        }

        if ($this->searchable) {
            return $this->rules === [] ? [Rule::in([])] : [];
        }

        return [Rule::in(array_keys($this->resolvedOptionMap()))];
    }

    public function additionalRules(): array
    {
        if ($this->morphTypes === []) {
            return [];
        }

        $presence = $this->isRequired() ? ['required'] : ['nullable'];

        return [
            $this->key.'.type' => [...$presence, 'string', Rule::in(array_keys($this->morphTypes))],
            $this->key.'.id' => [...$presence, new MorphExistsInScope($this->morphTypes, $this->key)],
        ];
    }

    public function valuesFrom(?Model $record): array
    {
        if ($this->morphTypes === []) {
            return parent::valuesFrom($record);
        }

        return [$this->key => [
            'type' => $record?->getAttribute($this->key.'_type'),
            'id' => $record?->getAttribute($this->key.'_id'),
        ]];
    }

    public function expandStorage(mixed $value): ?array
    {
        if ($this->morphTypes === []) {
            return null;
        }

        $type = is_array($value) ? ($value['type'] ?? null) : null;
        $id = is_array($value) ? ($value['id'] ?? null) : null;

        if (! is_string($type) || ! isset($this->morphTypes[$type]) || $id === null || $id === '') {
            return [
                $this->key.'_type' => null,
                $this->key.'_id' => null,
            ];
        }

        return [
            $this->key.'_type' => $type,
            $this->key.'_id' => $id,
        ];
    }

    public function toSchema(): array
    {
        $morphTo = [];

        foreach ($this->morphTypes as $model => $title) {
            $morphTo[] = [
                'value' => $model,
                'label' => class_basename($model),
                'titleAttribute' => $title,
            ];
        }

        return [
            ...parent::toSchema(),
            'searchable' => $this->searchable,
            ...($morphTo === [] ? [] : [
                'morphTo' => $morphTo,
                ...($this->morphTypeSelectToggleButtons ? ['morphTypeSelect' => 'toggle-buttons'] : []),
            ]),
            ...($this->pickerResource !== null ? ['tableSelect' => true] : []),
            ...($this->canCreateOption() ? [
                'createOption' => $this->createOptionSchema(),
                ...($this->createOptionDialogTitle !== null ? ['createOptionLabel' => $this->createOptionDialogTitle] : []),
                ...($this->createOptionButtonLabel !== null ? ['createOptionActionLabel' => $this->createOptionButtonLabel] : []),
            ] : []),
        ];
    }

    public function resolveOptions(): array
    {
        // A searchable field ships NO options; the client fetches them.
        if ($this->searchable) {
            return [];
        }

        $map = $this->resolvedOptionMap();

        if (count($map) > self::INLINE_LIMIT) {
            throw new \RuntimeException(sprintf(
                'Select field [%s] resolved %d options. Rendering them inline would ship %d option '
                .'elements to every browser. Call ->searchable() and supply a query.',
                $this->key,
                count($map),
                count($map),
            ));
        }

        $out = [];

        foreach ($this->resolvedOptionMap() as $value => $label) {
            $out[] = ['value' => $value, 'label' => $label];
        }

        return $out;
    }

    /**
     * The CURRENT VALUE's own label, for an Edit page.
     *
     * `resolveOptions()` deliberately ships nothing for a searchable
     * `relationship()` field - the client searches instead of downloading a
     * whole related table. But nobody resolved the ONE label that actually
     * matters on first paint: the record's own existing value. The client
     * had no label to show for it and fell back to the raw foreign key, so
     * an Invoice's "Customer" field showed `94` instead of "Kay White"
     * until you opened the search and picked the same customer again.
     *
     * Cheap by construction - one row, not a list - so it runs unconditionally
     * for every searchable relationship field on an Edit page rather than
     * needing its own opt-in.
     *
     * @return array{value: mixed, label: string}|null
     */
    public function resolveCurrentOption(mixed $value): ?array
    {
        if (! $this->searchable || $this->relatedModel === null || $this->titleAttribute === null) {
            return null;
        }

        if ($value === null || $value === '' || ! is_scalar($value)) {
            return null;
        }

        $row = $this->relatedModel::query()->find($value);

        if ($row === null) {
            return null;
        }

        return ['value' => $row->getKey(), 'label' => (string) $row->getAttribute($this->titleAttribute)];
    }
}

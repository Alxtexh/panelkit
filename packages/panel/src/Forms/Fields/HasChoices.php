<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

use Closure;

/**
 * Option handling shared by the fields that offer a fixed set of choices.
 *
 * A TRAIT RATHER THAN A BASE CLASS because `SelectField` is `final` and should
 * stay that way - subclassing a field to reuse its option plumbing is how a
 * radio group inherits a searchable dropdown's validation rules and nobody
 * notices until a search endpoint is called for a control that has no search.
 *
 * THE CLOSURE FORM IS THE IMPORTANT ONE. A literal list is structure and can be
 * cached with the schema; a list drawn from the database is TENANT DATA and must
 * be resolved when the form's payload is assembled, never while the schema is
 * built - a cached schema containing one organisation's plan names would serve
 * them to the next one.
 */
trait HasChoices
{
    /** @var array<string|int, string>|Closure(): array<string|int, string> */
    private array|Closure $options = [];

    /** @var array<string|int, string>|null */
    private ?array $resolvedOptions = null;

    /** @param array<string|int, string>|Closure(): array<string|int, string> $options */
    public function options(array|Closure $options): static
    {
        $this->options = $options;

        return $this;
    }

    /** @return array<string|int, string> value => label */
    public function resolvedOptionMap(): array
    {
        return $this->resolvedOptions ??= ($this->options instanceof Closure ? ($this->options)() : $this->options);
    }

    /**
     * The options for the DATA payload.
     *
     * THIS OVERRIDE IS NOT OPTIONAL, and forgetting it is silent. `Field`
     * returns null - "this field has no options" - and a control whose list is
     * null renders an empty group: a radio with nothing to choose and a checkbox
     * list with no boxes, on a form that otherwise looks complete. The schema
     * still contains the field, so nothing anywhere reports a problem.
     *
     * IT RESOLVES HERE, IN THE DATA, because an option list can be a closure
     * over tenant rows and tenant data never enters the cached schema.
     *
     * @return list<array{value: string|int, label: string}>
     */
    public function resolveOptions(): array
    {
        return $this->optionList();
    }

    /**
     * The options as the client renders them.
     *
     * A LIST OF PAIRS, not the map, because JSON objects do not preserve
     * numeric-key order in every consumer - and an option list whose order
     * changes between renders is one somebody clicks the wrong entry in.
     *
     * @return list<array{value: string|int, label: string}>
     */
    public function optionList(): array
    {
        $out = [];

        foreach ($this->resolvedOptionMap() as $value => $label) {
            $out[] = ['value' => $value, 'label' => $label];
        }

        return $out;
    }
}

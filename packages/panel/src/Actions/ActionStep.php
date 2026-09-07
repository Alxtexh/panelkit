<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Support\Deprecation;

/**
 * One step in a declarative record action wizard.
 *
 * A step may provide:
 * - a form schema (fields collected from the operator)
 * - a server-side validation callback (additional checks or value patches)
 *
 * The validation callback may return an array of values to merge into the
 * action's collected data, after it validated the input.
 */
final class ActionStep
{
    private ?Form $form = null;

    private ?string $description = null;

    private ?string $submitLabel = null;

    /**
     * @var Closure(Model, array<string, mixed>): (array<string, mixed>|void)|null
     */
    private ?Closure $validate = null;

    private function __construct(public readonly string $label, public readonly string $key)
    {
        if (preg_match('/^[a-z][a-z0-9_-]*$/', $key) !== 1) {
            throw new \InvalidArgumentException("[{$key}] is not a valid wizard step key.");
        }
    }

    public static function make(string $label, ?string $key = null): self
    {
        $resolvedKey = $key ?? static::keyFromLabel($label);

        return new self($label, $resolvedKey);
    }

    private static function keyFromLabel(string $label): string
    {
        $value = strtolower(trim($label));
        $value = preg_replace('/[^a-z0-9_-]+/', '-', $value) ?? '';
        $value = trim($value, '-');

        if ($value === '' || preg_match('/^[a-z]/', $value) !== 1) {
            $value = 'step-'.$value;
        }

        return $value;
    }

    public function describe(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function submitLabel(string $label): self
    {
        $this->submitLabel = $label;

        return $this;
    }

    public function stepKey(): string
    {
        return $this->key;
    }

    public function getSubmitLabel(): ?string
    {
        return $this->submitLabel;
    }

    /**
     * @param  Closure(Form): Form  $form
     */
    public function form(Closure $form): self
    {
        $this->form = $form(Form::make());

        return $this;
    }

    /**
     * @param  Closure(Model, array<string, mixed>): (array<string, mixed>|void)  $callback
     */
    public function onExecute(Closure $callback): self
    {
        $this->validate = $callback;

        return $this;
    }

    /**
     * Backwards-compatible alias for `onExecute()`.
     *
     * @deprecated Use `onExecute()` instead.
     */
    public function validate(Closure $callback): self
    {
        Deprecation::warn(__METHOD__, 'onExecute()');
        return $this->onExecute($callback);
    }

    public function formDefinition(): ?Form
    {
        return $this->form;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>|null
     */
    public function runValidate(Model $record, array $data): ?array
    {
        if ($this->validate === null) {
            return null;
        }

        $result = ($this->validate)($record, $data);

        return is_array($result) ? $result : null;
    }
}

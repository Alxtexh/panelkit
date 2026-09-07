<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

final class NumberField extends Field
{
    private ?int $min = null;

    private ?int $max = null;

    /** @var list<int> */
    private array $presets = [];

    public function min(int $min): static
    {
        $this->min = $min;

        return $this;
    }

    public function max(int $max): static
    {
        $this->max = $max;

        return $this;
    }

    /**
     * The handful of answers people actually give.
     *
     * WHY A NUMBER BOX IS USUALLY THE WRONG CONTROL. "How many days should
     * deleted records be kept?" has about four real answers - a week, a
     * fortnight, a month, a quarter - and a bare input pretends all 4,294,967,295
     * integers are equally sensible. It makes somebody invent a number, and then
     * needs validation to reject the ones they invented badly. A row of chips is
     * the decision as it actually exists.
     *
     * THE CHIPS DO NOT REPLACE THE INPUT, they sit beside it. Sometimes the
     * answer really is 47 because a contract says 47, and a control that made
     * that unrepresentable would be worse than the one it replaced. The chips
     * carry the sensible answers; the input carries the rest.
     *
     * @param  list<int>  $presets
     */
    public function presets(array $presets): static
    {
        $this->presets = array_values(array_unique(array_map(intval(...), $presets)));

        return $this;
    }

    public function type(): string
    {
        return 'number';
    }

    protected function typeRules(): array
    {
        return array_values(array_filter([
            'integer',
            $this->min !== null ? "min:{$this->min}" : null,
            $this->max !== null ? "max:{$this->max}" : null,
        ]));
    }

    public function toSchema(): array
    {
        $this->assertPresetsAreReachable();

        return array_filter(
            [
                ...parent::toSchema(),
                'min' => $this->min,
                'max' => $this->max,
                'presets' => $this->presets !== [] ? $this->presets : null,
            ],
            static fn (mixed $v): bool => $v !== null && $v !== false,
        );
    }

    /**
     * A chip the server would reject is a trap, so refuse to draw one.
     *
     * `->presets([7, 14, 30, 90])->max(30)` offers a button that fails validation
     * the moment it is pressed - and it fails as a form error under the field,
     * which reads as "you typed something wrong" about a value the panel itself
     * supplied. That is the worst kind of bug to be on the receiving end of.
     *
     * IT THROWS AT SCHEMA BUILD, not at submit. Both bounds and presets are
     * declared in code, so the conflict is deterministic and knowable before any
     * request - which makes it a developer error that should stop the boot, not a
     * runtime condition to handle. Silently dropping the out-of-range chips would
     * be the alternative, and that hides a mistake rather than fixing it.
     */
    private function assertPresetsAreReachable(): void
    {
        foreach ($this->presets as $preset) {
            $low = $this->min !== null && $preset < $this->min;
            $high = $this->max !== null && $preset > $this->max;

            if ($low || $high) {
                $range = ($this->min ?? '-∞').'..'.($this->max ?? '∞');

                throw new \InvalidArgumentException(
                    "Field [{$this->key}] offers the preset {$preset}, which is outside its own range ({$range}). ".
                    'A preset the field would reject is a button that fails validation when pressed.'
                );
            }
        }
    }
}

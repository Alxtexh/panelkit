# AlertRule

`Alxtexh\Panel\Alerts\AlertRule` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Alerts/AlertRule.php#L26)

A declared condition that MAY produce an alert.

## Methods

### `static make(string $key, Closure $resolver): self`

### `static countUpTo(Illuminate\Database\Query\Builder $query, int $cap = self::CAP): int`

Count matches, giving up at `$cap`.

### `static describeCount(int $count, int $cap = self::CAP): string`

"500+" once the cap is hit, so a label never claims more precision than was paid for.

### `resolve(): ?Alxtexh\Panel\Alerts\Alert`

### `static resolveAll(array $rules): array`

Resolve a set of rules, dropping the ones that do not currently apply.


# Numbers & money

## Plain integers

```php
NumberField::make('quantity')->min(1)->max(100),
NumberField::make('rating')->presets([1, 2, 3, 5, 8]),
```

`NumberField` is integer-only by design — it exists specifically so decimal
amounts have to go through `MoneyField` instead of an easily-misused generic
number input. `presets()` adds decision chips; PanelKit validates at
schema-build time (not just at submit) that every preset actually falls
within the declared `min()`/`max()` range, so a stale preset can't ship
silently.

## Money

```php
MoneyField::make('amount')->required(),           // minor units (cents) by default
MoneyField::make('amount')->major(),               // column stores decimals already
MoneyField::make('amount')->divideBy(1000),        // e.g. KWD, which has 3 decimal places
```

The form input always shows and accepts a major-unit decimal string
("125.00"), regardless of storage mode — only the conversion at the storage
boundary changes. See the dedicated [money guide](/money/) for the full
contract this field shares with `MoneyColumn` and `MoneyEntry`; get this one
setting wrong and every screen touching the same column disagrees about the
amount.

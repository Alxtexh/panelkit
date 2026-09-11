# Text fields

```php
TextField::make('name')->required()->max(255),        // default max is already 255
TextField::make('email')->as('email'),                 // semantic input-type hint
TextField::make('website')->as('url'),
PhoneField::make('phone'),                              // validates E.164-shaped input
```

`PhoneField` validates against an E.164-shaped pattern
(`/^\+[1-9]\d{6,14}$/`) — a leading `+`, country code, no spaces or
punctuation. If your application accepts locally-formatted numbers, normalize
them to E.164 before they reach this field's validation, rather than relaxing
the pattern.

For anything past a single line, see
[Textarea, markdown, rich text, code](/forms/text-content).

# Dates

```php
DateField::make('dated_at'),                 // date only
DateField::make('meeting_at')->withTime(),   // date + time
```

`withTime()` toggles the field between `date` and `datetime` — both are the
same `DateField` class; there's no separate `DateTimeField`. On the display
side, [`DateColumn`](/tables/#money-badges-dates) and `DateTimeEntry` mirror
the same `date()`/`dateTime()` toggle, and both format in the viewer's own
timezone client-side, the same reasoning [money formatting](/money/) uses —
never format a date on the server and print one timezone's rendering to
everyone.

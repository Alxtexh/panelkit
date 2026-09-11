# 4. Columns and filters

## Every column type

From `Alxtexh\Panel\Tables\Columns`:

| Column | Shows |
|---|---|
| `TextColumn` | Text, with `->prefix()`, `->suffix()`, `->copyable()` |
| `BadgeColumn` | A pill, coloured per value |
| `MoneyColumn` | Minor units as currency: `->currency('KES')` |
| `DateColumn` | Dates, relative or absolute |
| `IconColumn` | An icon per value |
| `ImageColumn` | A thumbnail |
| `ColourColumn` | A colour swatch |
| `CodeColumn` | Monospaced |
| `KeyValueColumn` | A map, summarised |
| `TagsColumn` | Chips from an array, JSON array string, or separator-split string |
| `CheckboxColumn` | A read-only tick |
| `ToggleColumn` | A switch that **writes** on click |
| `SelectColumn` | A dropdown that **writes** on change |
| `TextInputColumn` | Short text that **writes** on blur/Enter, validated by `->rules()` |
| `EditableColumn` | Base for the three above |

```php
use Alxtexh\Panel\Tables\Columns\{TextColumn, BadgeColumn, ColumnGroup, TagsColumn, MoneyColumn, DateColumn};

$table->columns([
    TextColumn::make('reference')->sortable()->searchable()->locked(),
    ColumnGroup::make('Contact', [
        TextColumn::make('email')->sortable(),
        TextColumn::make('phone'),
    ]),
    TagsColumn::make('tags')->limit(3),
    BadgeColumn::make('status')
        ->colours(['paid' => 'success', 'overdue' => 'danger']),
    MoneyColumn::make('total_cents')->label('Total')->currency('KES')->sortable(),
    DateColumn::make('created_at')->sortable()->muted(),
]);
```

`ColumnGroup::make('Contact', [...])` is layout only: the nested columns still
query and render as a flat list, with a two-row header when any group is
present. `TagsColumn` accepts arrays, JSON array strings, or
`->separator(',')` split strings; relation labels belong in the row payload
(transform / cast / `fromRaw()`), not in the schema.

`locked()` keeps a column visible when the person hides others.

### Computed values: `->from()` and `->fromRaw()`

`->from('other_table.column')` reads a value from a JOINED table instead of
the resource's own - the query still needs the join itself (`Table::query()`),
this only says which column the result should be read from and aliases it
back to the column's own key, so the row arrives under the key you declared
rather than one nothing reads.

`->fromRaw($sqlExpression)` goes one step further: a value the DATABASE
COMPUTES rather than one it stores - a comparison between two columns, not a
fact sitting in either. The panel's own Ticketing feature uses it for exactly
that, an "unread" badge computed in the SELECT instead of with a per-row
lookup (which would be an N+1 query the badge is not worth):

```php
BadgeColumn::make('unread')->label('')->fromRaw(
    '(case when tickets.desk_read_at is null'
    .' or (tickets.last_reply_at is not null'
    .' and tickets.last_reply_at >= tickets.desk_read_at)'
    ." then 'New' else '' end)"
)->colors(['New' => 'danger']),
```

The expression is aliased to the column's own key automatically (`... as
unread`), the same way `->from()` is - write `plans.name as plan_name` only
when you need an alias OTHER than the column's own key; PanelKit adds the
usual one for you.

**This is developer-authored SQL, not a query builder call - treat it with
the same care as any raw SQL string.** Everything passed to `fromRaw()` is
interpolated into the query with nothing bound, so it must be a literal
written in the resource class, never built from request input, a filter
value, or anything else a visitor controls. There is no safe way to pass
untrusted data through it.

`Entry::fromRaw()` (infolists, see the next chapter) works identically -
both `Column` and `Entry` share this exact mechanism, so a join declared once
on `table()` can back a computed value on the List page, the View page, or
both, without writing the alias-handling logic twice.

### Editable columns write, so they are guarded

`ToggleColumn`, `SelectColumn`, and `TextInputColumn` post a single cell. That
endpoint accepts **only** a column the resource declared as editable, and the
value is validated by the column itself — a select accepts only its own
options, a toggle only a real boolean. Without that check it would write any
attribute on any visible record, which is mass assignment wearing an
inline-edit costume.

`TextInputColumn` is the free-text one, so it is the only one that needs its
own fence — `->rules([...])` runs Laravel's own validator against the incoming
value before it is written:

```php
use Alxtexh\Panel\Tables\Columns\TextInputColumn;

TextInputColumn::make('reference')
    ->rules(['required', 'max:20', 'alpha_dash'])
    ->placeholder('e.g. REF-1024');
```

For anything longer than a short reference code or note, edit it on the record
form instead — an editable cell is a full write with a smaller control, not a
smaller commitment.

## Every filter type

From `Alxtexh\Panel\Tables\Filters`:

| Filter | For |
|---|---|
| `SelectFilter` | One of a list |
| `MultiSelectFilter` | Several of a list |
| `BooleanFilter` | Yes / no / either |
| `DateRangeFilter` | Between two dates |
| `TrashedFilter` | With, without, or only deleted |
| `QueryBuilderFilter` | Arbitrary nested AND/OR conditions |

```php
$table->filters([
    SelectFilter::make('status')->options(['paid' => 'Paid', 'overdue' => 'Overdue']),
    BooleanFilter::make('active')->label('Availability')->column('invoices.is_active'),
    DateRangeFilter::make('created_at')->label('Raised'),
]);
```

## Search

`searchable()` on a column includes it in the search box. Search runs
server-side against the declared columns only — never `SELECT *` with a
`LIKE` over everything — and the sortable column list is an allow-list, so a
crafted `sort` parameter cannot inject an identifier.

## Grouping, summaries and reorder

```php
$table
    ->groupBy('status')
    ->summarise(['total_cents' => 'sum'])
    ->reorderable('position');
```

`groupBy('status')` still works. A `Group` object is the same thing with a
label, collapsible headings, or clustering by calendar date:

```php
use Alxtexh\Panel\Tables\Grouping\Group;

$table
    ->groupBy(Group::make('status')->collapsible()->label('Workflow'))
    ->groups([
        Group::make('status')->collapsible()->label('Workflow'),
        Group::make('created_at')->date()->label('Created date'),
    ])
    ->collapsedGroupsByDefault();
```

`groups()` is the picker, and it only appears on the table toolbar that already
hosts search and filters. Without it, grouping stays on. `?group=` is
allowlisted against those keys; unknown values fall back to the default, and
`group=-` means none, only when a picker exists.

Keyset pagination still seeks on `(group, sort, id)`. A group may span a page
and is shown continuing rather than restarted.

`reorderable()` adds drag-and-drop that writes a position column; the write is
scoped to the tenant and to the nested parent, like every other write.

## Status tabs

```php
$table->tabs('status', ['draft', 'published', 'archived']);
```

Every declared tab's count comes from **one grouped aggregate query**, not one
`COUNT` per tab — a five-tab table costs one query before it renders a row,
not five. `all` is implicit, always first, and is the sum of the rest rather
than a second query.

A tab that needs more than `column = value` — a date range, a second column, a
join — gets a query modifier via the optional third argument, which receives
the `Tabs` instance to configure:

```php
$table->tabs('status', ['draft', 'published', 'overdue'], function (Tabs $tabs): void {
    $tabs->modifyQuery('overdue', function (Builder $query): void {
        $query->where('status', 'published')->where('due_at', '<', now());
    });
});
```

The cost of a modified tab is real but stays local to that one tab: it gets
its own dedicated `count()` query, while every other declared tab, modified or
not, still shares the single grouped aggregate.

## Filter chips

Applied filters appear as chips under the toolbar, with a clear control per
chip and Clear all when more than one is active. They are the same query
string the filter panel already writes, so dismissing a chip and Reset cannot
disagree.

```php
SelectFilter::make('status')
    ->options(['paid' => 'Paid', 'overdue' => 'Overdue'])
    ->indicateUsing(fn (mixed $value) => 'Only '.$value);

// Related model options (BelongsTo-style FK), tenant-scoped:
SelectFilter::make('article_id')
    ->relationship(Article::class, 'title');
```

# Global search

Every resource participates in the panel's command-palette-style search by
default, ranked by `recordTitle()` and a handful of per-resource overrides —
no separate search index or configuration is required to get basic search
working.

## Tuning what a resource contributes

```php
final class InvoiceResource extends Resource
{
    public static function searchResultLimit(): int
    {
        return 5; // default
    }

    public static function searchSubtitleColumn(): ?string
    {
        return 'customer_name'; // tells two same-titled results apart
    }

    public static function searchSort(): int
    {
        return 0; // default; lower sorts this resource's group earlier
    }

    public static function searchWeight(): float
    {
        return 1.0; // default; higher ranks this resource's rows more strongly
    }
}
```

- **`searchResultLimit()`** — how many of this resource's rows may appear in
  one search response. Default `5`.
- **`searchSubtitleColumn()`** — the column shown under a result's title when
  two results would otherwise look identical (two customers both named
  "Acme", say).
- **`searchSort()`** — where this resource's results sit among the palette's
  groups, independent of relevance within the group.
- **`searchWeight()`** — how strongly this resource's rows count toward
  overall ranking when results from multiple resources are merged.

## Narrowing or changing what's searched

```php
public static function modifySearchQuery(Builder $query, string $term): void
{
    $query->orWhere('external_reference', $term);
}
```

A no-op by default. Override it to add extra match conditions beyond the
columns already marked `->searchable()` in `table()`, or to constrain the
search query further for this resource specifically. It runs at the Eloquent
query stage, before tenant/authorization scopes are applied, so whatever you
add here still composes with tenancy rather than bypassing it.

## Authorization

There's no separate "searchable" permission to configure — search shares the
same [authorization](/authorization/) model as every other resource surface.
If a search result appears to leak data a user shouldn't see, that's a
`can()`/policy question first, not a search-specific setting.

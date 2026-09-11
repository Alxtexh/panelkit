# Capability comparison

| Capability | Simple (`->related()`) | Resource-backed (`->resource()`) |
|---|---|---|
| Read a list of related rows | ✅ | ✅ |
| Inline create | ✅ (if `form()` is set) | ✅ |
| Inline edit | ✅ (if `form()` is set, and not `->readOnly()`) | ✅ |
| Dedicated Create/Edit/View pages | ❌ | ✅ |
| Row Delete | ❌ | ✅ |
| Searchable relationship fields (`SelectField::relationship()`/`searchable()`) | ❌ — throws at schema-build time | ✅ |
| Independent policy for the related model | ❌ — authorized against the *parent's* ability | ✅ — its own policy, checked per record |
| Its own URL / bookmarkable pages | ❌ | ✅ (`/{parent}/{id}/{child}/...`) |
| Setup cost | One `RelationManager::make()->related()->table()->form()` call | A full nested `Resource` class, plus a `RelationManager::make()->resource()` wrapper |

The row that usually decides it: **searchable relationship fields**. If the
related form needs a `SelectField` that searches (rather than a small fixed
`options()` list), the simple shape refuses to build at all — it isn't a
degraded experience, it's a hard stop with a message naming the fix. That
failure exists specifically so this table's other differences don't have to
be rediscovered by trial and error.

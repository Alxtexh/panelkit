# Extending PanelKit

Most application work is building *with* PanelKit's existing Fields,
Columns, Entries, Actions and Pages, not writing new ones. Check the
existing catalogues first — [Forms](/forms/), [Tables](/tables/),
[Infolists](/infolists/), [Actions](/actions/) — before reaching for any of
the extension points below.

When you do need to extend the framework itself:

- [Custom fields](/forms/custom-fields) — a new `Field` subclass plus a registered Vue control
- [Custom columns & entries](/extending/custom-columns-and-entries) — the same pattern applied to `Column` and `Entry`
- [Custom pages](/extending/custom-pages) — a screen that isn't built from a model at all
- [Vue extension points](/extending/vue-extension-points) — the three client-side registries everything above ultimately plugs into, plus render hooks for adding markup to a screen you don't own

## The shared shape

Every extension point in PanelKit follows the same rule: **PHP declares a
semantic type name and configuration; the Vue client decides what that type
looks like.** A `Field`, `Column`, or `Entry` subclass never emits a CSS
class or a component reference — only a string like `'money'` or `'badge'`
and structured config. This is why extending the framework always means two
halves: a PHP class that declares the schema, and a Vue component registered
against the same type name.

# 3. Forms

Full reference: [Forms guide](/forms/). This page is the AI-facing recipe
for a Create/Edit form specifically.

## Recipe

1. **Group related fields** with `Section` — reach for it first, before
   `Tabs` or `Wizard`.
2. **Use `Tabs`** only when the form is long enough that scrolling loses
   someone. Fields behind an inactive tab still validate and save — hiding
   one client-side never skips its server-side rules.
3. **Use `Wizard`** only when a later step genuinely depends on an earlier
   one. A form somebody dips into to change one field should never be a
   wizard.
4. **Preserve PanelKit spacing** — don't write custom CSS for a standard
   form; see [Preserve the design system](/ai/panelkit-core#preserve-the-design-system).
5. **Validation should match the database constraints** — a `NOT NULL`
   column needs `->required()`; a `unique` constraint needs a matching
   validation rule, not just a database-level failure the operator sees as
   a raw error.
6. **Relationship fields must use the real relationship API** — see
   [Selects & relationships](/forms/selects-and-relationships).
   `SelectField::relationship($model, $titleAttribute)` takes a model class
   and an attribute name on *that* model — it is **not** a dotted path, and
   no dot-notation parsing happens anywhere in this call.
7. **Money field storage semantics must be explicit and correct before you
   write anything** — see [Money](/ai/money). This is the single highest-cost
   mistake to get wrong, because it's silent: nothing errors, every amount
   is just off by 100x.
8. **Avoid unnecessary custom controls** — check the
   [34-field catalogue](/forms/#every-field-type) before writing a new
   `Field` subclass.

## Do not

- Do not assume `TextEntry`/`SelectField`-style dot-notation relationship
  access works anywhere in PanelKit — it doesn't, in forms *or* infolists.
  See [Selects & relationships](/forms/selects-and-relationships) and
  [Infolists](/ai/infolists).
- Do not write your own mass-assignment logic (`$request->all()` into a
  model) — `Form::sanitize()` is the allow-list boundary and already does
  this correctly; bypassing it reintroduces exactly the vulnerability class
  it exists to prevent.
- Do not validate a multi-value field with only `['array']` — validate its
  *members* too (`{key}.*`), or a submission like `['valid-option',
  'anything-at-all']` passes.

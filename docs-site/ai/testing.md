# 12. Testing & verification

Do not declare a task complete after editing files. This is the loop.

## The loop

1. **Lint/static checks** where relevant (`vendor/bin/phpstan`, `vue-tsc --noEmit`).
2. **Backend tests** for anything you touched.
3. **Frontend tests**, if you touched Vue.
4. **HTTP verification** — actually hit the endpoint, don't infer from the code.
5. **Browser interaction**, for UI work — click through the actual screen.
6. **Check the browser console** for errors the response status wouldn't show.
7. **Check network requests** — confirm the payload shape matches what you expect.
8. **Mobile viewport**, if the UI changed.
9. **Authorization check** — sign in as someone who should be refused, and
   confirm they are. A positive test passing tells you less than a negative
   one passing.
10. **Confirm fresh-install/public API compatibility**, if you touched
    framework code rather than application code — see
    `scripts/check-public-api.php` and the [API reference](/api/) generator.

For application-level work, scale this down sensibly — a copy change
doesn't need a browser check — but never skip verification to zero.

## Minimum assertions for a new resource

```php
use Alxtexh\Panel\Testing\InteractsWithPanels;

$this->assertResourceRegistered('invoices');
$this->assertTenantIsolation($this->operator, 'invoices', $foreignRecord);
$this->assertResourceRefuses($this->stranger, 'invoices');
```

`assertTenantIsolation` checks **both** the list and the record URL — the
list is the obvious half to think of; the record URL is the half people
forget, and the one an attacker actually uses (guessing an id from another
tenant and requesting it directly).

## The rest of the testing trait, by what it checks

`InteractsWithPanels` ships 28 assertion/helper methods. Beyond the three
above, reach for:

- `assertFormState` — the `{options, schema, values}` contract a `live()`
  round-trip returns.
- `assertNestedAttach`/`assertNestedDetach` — BelongsToMany nested-resource
  attach/detach.
- `assertInfolistAction` — a View-page entry action.
- `assertNotImportable` vs. `assertPanelImports` + `assertImportFailuresDownload`
  — only meaningful once the optional import package is installed; see
  [SaaS blueprint](/ai/saas-blueprint).
- `assertPanelToast` / `assertEmptyGrantsHint` — UX for a signed-in account
  with no grants.
- `assertBillingSuspendedRedirect` / `assertBillingAllows` /
  `assertBillingWebhookAccepted` / `assertSuspendedPageRenders` — the
  packaged billing wall.
- `assertResourceListsFor` / `assertResourceShows` / `assertResourceHides` —
  finer-grained than `assertTenantIsolation` when you need to check one
  direction only.
- `assertSchemaHasColumn` / `assertSchemaHasField` — confirm a column/field
  actually made it into the cached schema, not just that you wrote it.

See the [generated API reference](/api/classes/interacts-with-panels) for
every method's exact signature.

## The failures that return 200

The whole reason this checklist exists: a resource with a missing policy
returns 200 with an empty list, not a 403 or a 500. A schema-cache bug
returns 200 with stale data. A broken tenant scope returns 200 with someone
else's rows. None of these fail a naive "does the page load" check — they
require the specific assertions above.

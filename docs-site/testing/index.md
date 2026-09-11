# Testing

PanelKit ships its own testing trait, `InteractsWithPanels`, specifically
because the failures that matter most here — a missing policy, a broken
tenant scope, a schema that silently omits a field — all return a `200`.
None of them fail a naive "does the page load" test.

```php
use Alxtexh\Panel\Testing\InteractsWithPanels;

final class InvoiceResourceTest extends TestCase
{
    use InteractsWithPanels;

    public function test_invoices_are_tenant_isolated(): void
    {
        $this->assertResourceRegistered('invoices');
        $this->assertTenantIsolation($this->operator, 'invoices', $foreignRecord);
        $this->assertResourceRefuses($this->stranger, 'invoices');
    }
}
```

`make:panel-resource` already generates a contract test using this trait for
every resource it scaffolds — extend it rather than starting from a blank
test file.

## The failures worth asserting explicitly

| Assertion | Catches |
|---|---|
| `assertResourceRegistered($key)` | The resource never made it into the registry at all |
| `assertTenantIsolation($user, $key, $foreignRecord)` | **Both** the list and the record URL leaking another tenant's row — the record URL is the half people forget, and the one an attacker uses |
| `assertResourceRefuses($user, $key)` | A user without the ability reaching the screen anyway |
| `assertSchemaHasColumn` / `assertSchemaHasField` | A column/field you wrote never actually reached the cached schema |
| `assertPanelValidationFails` / `assertPanelCreates` | The right validation rule is wired to the right field |
| `assertFormState` | The `{options, schema, values}` contract a `live()` round-trip returns |
| `assertNestedAttach` / `assertNestedDetach` | A BelongsToMany nested resource's attach/detach endpoints |
| `assertInfolistAction` | A View-page entry action |
| `assertPanelToast` / `assertEmptyGrantsHint` | UX for a signed-in account with no grants |
| `assertBillingSuspendedRedirect` / `assertBillingAllows` / `assertBillingWebhookAccepted` / `assertSuspendedPageRenders` | The packaged billing wall |

See the [generated API reference](/api/classes/interacts-with-panels) for
every method's exact signature — there are 28 in total.

## The negative test matters more than the positive one

A positive test (an authorized user sees the right data) passes just as
happily with tenant isolation completely broken. Always pair it with a
negative test: sign in as someone from another organisation, or with no
grants, and assert the request is refused. `assertTenantIsolation` does
both halves in one call for the common case.

## Verifying by hand

```bash
php artisan panel:doctor
php artisan test
```

`panel:doctor` catches a class of configuration mistakes no PHPUnit
assertion can — a missing policy, an unsupported icon name, a Filament-style
property name — because they're facts about the *registered* application,
not about any one request/response cycle. Run it alongside your test suite,
not instead of it. See [Testing & verification](/ai/testing) for the fuller
verification loop an AI agent (or a careful human) should run before calling
a change done.

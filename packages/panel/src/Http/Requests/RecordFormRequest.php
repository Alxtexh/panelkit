<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Requests;

use Alxtexh\Panel\Http\NestedContext;
use Alxtexh\Panel\Http\NestedRelation;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Authorisation and validation for a record write, in the one place a
 * precognitive request actually executes.
 *
 * THE ROUTES WERE IN THE `precognitive` GROUP AND THE FEATURE DID NOT WORK -
 * which is worse than it not being wired, because the endpoint ANSWERED.
 *
 * `PrecognitionControllerDispatcher::dispatch()` never calls the controller
 * method. It checks the method exists, RESOLVES ITS PARAMETERS, and aborts 204.
 * That is the whole design: Laravel expects a `FormRequest` in the signature,
 * because resolving one runs `authorize()` and `rules()`. `RecordController`
 * type-hinted the base `Request` and validated inside the body, so under
 * precognition the body never ran and NOTHING was checked.
 *
 * TWO THINGS WERE WRONG, AND THE SECOND IS THE SERIOUS ONE.
 *
 *   - Any payload returned `204 Precognition-Success: true`. The identical
 *     payload without the header returned 422. So the endpoint whose entire
 *     purpose is reporting validation errors early reported that invalid input
 *     was fine - and a client wired to it would have shown every field valid.
 *
 *   - `abort_unless($class::can('create'), 403)` is also in the body, so it did
 *     not run either. A signed-in user with no roles was redirected away from
 *     an ordinary POST and received 204 from a precognitive one. No row was
 *     written, but an authorisation check that does not run is not made safe by
 *     what the request happens not to do afterwards - and with
 *     `Precognition-Validate-Only` it answers field by field about a form the
 *     caller may not open.
 *
 * BOTH FIXES ARE THE SAME MOVE: put the checks in a `FormRequest`. It runs on
 * an ordinary request exactly as before, and it now also runs on the only step
 * a precognitive request performs.
 *
 * THE RULES STILL COME FROM THE FORM, so there is still one source of
 * validation truth and the client still holds no copy.
 */
final class RecordFormRequest extends FormRequest
{
    /**
     * THE SAME QUESTION THE CONTROLLER ASKED, moved rather than added.
     *
     * A create is authorised against the class; an update against the RECORD,
     * because "may you edit this one" is not answerable without it. Fetching
     * the record here is also what makes another tenant's id a 404 rather than
     * a 403 - see `record()`.
     */
    public function authorize(): bool
    {
        $class = $this->resourceClass();

        /*
         * THE NESTED PARENT IS AUTHORISED HERE TOO, and leaving it out was a
         * hole this class was written to close rather than to keep.
         *
         * `NestedContext::parent()` does three things a create depends on: it
         * 404s a parent key that does not match the child's declared parent,
         * 404s an id the caller's tenant cannot see, and refuses with 403 when
         * the caller may not `view` that parent. All three lived only in
         * `RecordController::store`'s body - so on the precognitive path, where
         * no body runs, a caller holding `create` could validate against a
         * parent they are not entitled to open.
         *
         * `update` already reaches this through `record()`, which resolves the
         * parent to scope its own lookup. Only `create` was missing it, because
         * a create has no record to find.
         *
         * THE CONTROLLER STILL RESOLVES IT AGAIN, and that is not redundancy
         * worth removing. `NestedContext::parent()` memoises on the request's
         * attribute bag, but `FormRequest::createFrom()` COPIES that bag - so
         * the memo set here lives on this object while the controller reads
         * `request()`, the original. The checks run twice and cost one extra
         * query; the alternative is a controller that trusts a decision taken
         * on a different object.
         */
        NestedContext::parent($this, $class);

        return $this->isMethod('POST')
            ? $class::can('create')
            : $class::can('update', $this->record());
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return $this->resourceClass()::formDefinition()->rules();
    }

    protected function prepareForValidation(): void
    {
        $this->resourceClass()::beforeValidate($this);
    }

    protected function passedValidation(): void
    {
        $this->resourceClass()::afterValidate($this->validated());
    }

    /**
     * THE RESOURCE THIS REQUEST IS ABOUT, resolved from the route rather than
     * from the body - a resource key taken from input would let a caller
     * validate against one resource's rules while writing to another.
     *
     * @return class-string<Resource>
     */
    public function resourceClass(): string
    {
        $key = (string) $this->route('resource');

        $class = app(PanelManager::class)->resource($key);

        /*
         * `isEnabled()` HERE AS WELL AS IN THE CONTROLLER, and it has to be
         * both. A precognitive request never enters the controller, so a check
         * placed only in `RecordController::resolve()` would still let
         * `POST /sessions` with `Precognition: true` answer for a resource the
         * tenant's feature flags have turned off.
         */
        if ($class === null || ! $class::isEnabled()) {
            throw new NotFoundHttpException("No panel resource registered for [{$key}].");
        }

        abort_unless($class::isAccessible(), 403);

        return $class;
    }

    /**
     * The record being updated, scoped exactly as the controller scopes it.
     *
     * THE TENANT GLOBAL SCOPE MAKES A FOREIGN ID A 404, which is the correct
     * answer: a 403 would confirm the record exists. The nested parent claim in
     * the URL is carried into the query for the same reason it is there - a
     * mismatched pairing must be indistinguishable from a missing record.
     */
    public function record(): Model
    {
        $class = $this->resourceClass();
        $model = $class::model();

        $query = $model::query();

        $parent = NestedContext::parent($this, $class);

        if ($parent !== null) {
            NestedRelation::constrain($query, $class, $parent);
        }

        $record = $query->whereKey($this->route('id'))->first();

        abort_if($record === null, 404);

        return $record;
    }
}

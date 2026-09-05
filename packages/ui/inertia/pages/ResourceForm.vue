<script setup lang="ts">
/*
 * EVERY PAGE PROP ARRIVES AS AN ATTRIBUTE, and this page's root is a
 * fragment. Inertia binds the whole payload onto the page component -
 * declared props bind as props, and the shared ones (panelNav, auth,
 * locale, and every deferred prop as it lands) arrive as plain
 * attributes with nowhere to go. Vue then warns once per prop, per
 * visit, which reads exactly like the page reloading in a loop.
 */
defineOptions({ inheritAttrs: false })

/**
 * Create and edit, as a REAL PAGE for every resource.
 *
 * WHY A PAGE AND NOT A MODAL. This is Filament's convention and the reasons are
 * practical: a page is linkable and shareable, survives a refresh, gets its own
 * browser-history entry so Back means "back", and has room for a form a dialog
 * cannot hold without scrolling. The modal path still exists for quick inline
 * actions, which is what a modal is genuinely good at.
 *
 * Nothing here names a resource. Fields come from the schema, option lists from
 * the payload, and the same file serves create and edit - the only difference is
 * whether `record` is null.
 */
import { Head, Link, router, useForm } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { PkButton as Button, PkModal } from '@alxtexh-enterprise/panel'
import {
    CreateOptionError,
    FORM_MEASURE,
    PAGE_SHELL_COMPACT,
    PkPageHeader,
    RecordForm,
    UnsavedBar,
    buttonClasses,
    fieldErrorsFromPayload,
} from '@alxtexh-enterprise/panel'
import type { FormField, UploadedFileValue } from '@alxtexh-enterprise/panel'
import DefineFieldDialog from '../components/DefineFieldDialog.vue'
import RenderHook from '../components/RenderHook.vue'

const props = defineProps<{
    schema: {
        key: string
        label: string
        labelPlural: string
        routes: { index: string; store?: string; update?: string }
        /**
         * Places to go from this screen - normally the thing it configures.
         *
         * A SETTINGS SCREEN THAT CANNOT SHOW YOU WHAT IT CHANGES is guesswork
         * with a Save button. `external` opens in a new tab and renders as a
         * plain anchor rather than an Inertia `Link`, because a `Link` to a
         * page Inertia does not serve shows the reader raw JSON.
         */
        links?: { label: string; href: string; external?: boolean }[]
        /*
         * `fields` IS LOOSE HERE ON PURPOSE. `FormField` is recursive
         * (`children?: FormField[]`), so it cannot be written inline - and
         * importing it into `defineProps` makes the SFC compiler load
         * TypeScript from the consuming project. It arrives as server JSON and
         * is typed where it is USED: `RecordForm` declares `FormField[]`, and
         * the template casts to it below.
         */
        form: {
            columns: number
            nodes?: any[]
            fields?: Record<string, any>[]
            autosave?: boolean
            autosaveMilliseconds?: number | null
        }
    }
    record: { id: number | string; label: string } | null
    values: Record<string, any>
    formOptions: Record<string, { value: any; label: string }[]>
    breadcrumbs: { title: string; href: string }[]
    /**
     * Null unless this resource has custom-field storage AND this user may
     * define fields - see ResourceController::customFieldSupport(). The
     * affordance renders only when acting on it can succeed.
     */
    customFieldSupport?: {
        resource: string
        label: string
        types: string[]
        endpoint: string
    } | null
    renderHooks?: { position: string; component: string; props: Record<string, unknown> }[]
}>()

const isEdit = computed(() => props.record !== null)

/**
 * `window` IS RESOLVED HERE, NOT IN THE TEMPLATE. A bare `window` inside a
 * Vue template compiles to `_ctx.window` - it is not in the compiler's
 * global allowlist - so the SSR-safety check silently always took the
 * "undefined" branch and `window.location.pathname` was dead code.
 */
const returnUrl = computed(() =>
    typeof window === 'undefined' ? props.schema.routes.index : window.location.pathname,
)

const definingField = ref(false)

const form = useForm<Record<string, any>>({ ...withDownloadUrls(props.values) })

const liveOptions = ref({ ...props.formOptions })

const formSchema = ref(props.schema.form)
const draftStatus = ref<'idle' | 'saved' | 'restored'>('idle')
let draftTimer: ReturnType<typeof setTimeout> | undefined
let draftController: AbortController | undefined

function draftStorageKey(): string {
    return `panel:draft:${window.location.pathname}`
}

function draftKey(): string {
    return `${window.location.pathname}:draft`.slice(0, 80)
}

function draftUrl(): string {
    return props.record?.id
        ? `${props.schema.routes.index}/${props.record.id}/draft`
        : `${props.schema.routes.index}/draft`
}

function draftEnabled(): boolean {
    return formSchema.value.autosave === true && typeof window !== 'undefined'
}

function clearDraft(): void {
    if (!draftEnabled()) {
        return
    }

    try {
        window.localStorage.removeItem(draftStorageKey())
    } catch {
        // Storage may be disabled by browser policy; the form remains usable.
    }
}

function saveDraft(): void {
    if (!draftEnabled()) {
        return
    }

    try {
        window.localStorage.setItem(
            draftStorageKey(),
            JSON.stringify({
                version: form.data()._updated_at ?? null,
                values: payload(),
                savedAt: new Date().toISOString(),
            }),
        )
        draftStatus.value = 'saved'
        void syncServerDraft()
    } catch {
        // Quota/security errors must never interrupt editing.
    }
}

async function syncServerDraft(): Promise<void> {
    if (!draftEnabled()) {
        return
    }

    draftController?.abort()
    draftController = new AbortController()

    try {
        await fetch(draftUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrf(),
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                draftKey: draftKey(),
                version: form.data()._updated_at ?? null,
                values: payload(),
            }),
            signal: draftController.signal,
        })
    } catch (error) {
        if (!isAbort(error)) {
            // Local storage remains the offline fallback.
        }
    }
}

async function restoreServerDraft(): Promise<boolean> {
    if (!draftEnabled()) {
        return false
    }

    try {
        const res = await fetch(`${draftUrl()}?draftKey=${encodeURIComponent(draftKey())}`, {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        })

        if (!res.ok) {
            return false
        }

        const body = await res.json()
        const draft = body?.draft

        if (!draft || body.stale || !draft.values || typeof draft.values !== 'object') {
            return false
        }

        for (const [key, value] of Object.entries(draft.values)) {
            ;(form as any)[key] = value
        }
        draftStatus.value = 'restored'

        return true
    } catch {
        return false
    }
}

async function forgetServerDraft(): Promise<void> {
    if (!draftEnabled()) {
        return
    }

    try {
        await fetch(draftUrl(), {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrf(),
            },
            credentials: 'same-origin',
            body: JSON.stringify({ draftKey: draftKey() }),
        })
    } catch {
        // A successful record save is not made unsuccessful by draft cleanup.
    }
}

function scheduleDraft(): void {
    if (!draftEnabled()) {
        return
    }

    clearTimeout(draftTimer)
    draftTimer = setTimeout(saveDraft, formSchema.value.autosaveMilliseconds ?? 1000)
}

function restoreDraft(): void {
    if (!draftEnabled()) {
        return
    }

    try {
        const raw = window.localStorage.getItem(draftStorageKey())
        const draft = raw ? JSON.parse(raw) : null
        const currentVersion = form.data()._updated_at ?? null

        if (
            !draft ||
            typeof draft !== 'object' ||
            draft.version !== currentVersion ||
            !draft.values ||
            typeof draft.values !== 'object'
        ) {
            return
        }

        for (const [key, value] of Object.entries(draft.values)) {
            ;(form as any)[key] = value
        }
        draftStatus.value = 'restored'
    } catch {
        // Corrupt or unavailable drafts are discarded by omission.
    }
}

watch(
    () => props.formOptions,
    (next) => {
        liveOptions.value = { ...next }
    },
)

watch(
    () => props.schema.form,
    (next) => {
        formSchema.value = next
    },
)

/**
 * Attaches a download URL to each stored file.
 *
 * Composed here rather than sent by the server because the URL needs the
 * resource and the record id, and this is the side that knows both - the form
 * layer is handed a column value and has no idea what is looking at it.
 *
 * A file that is only a pending handle gets NO url, which is what makes the
 * control say "not saved yet" instead of offering a download that would 404.
 *
 * @param values The server's values, untouched on a create page.
 */
function withDownloadUrls(values: Record<string, any>): Record<string, any> {
    if (!props.record) {
        return values
    }

    const out = { ...values }

    for (const key of fileFieldKeys()) {
        const file = out[key]

        if (file && typeof file === 'object' && file.value) {
            out[key] = {
                ...file,
                url: `${props.schema.routes.index}/${props.record.id}/file/${key}`,
            }
        }
    }

    return out
}

const formValues = computed<Record<string, any>>(() => ({ ...form.data() }))

/**
 * File fields hold an OBJECT in form state and submit a STRING.
 *
 * The control needs the name and size to render something a person recognises;
 * the column stores a handle or a path. Flattening happens once, here, on the
 * way out - the alternative is teaching the server to accept both shapes, which
 * means the validation rule can no longer just say `string`.
 */
function payload(): Record<string, any> {
    const out: Record<string, any> = { ...form.data() }

    for (const key of fileFieldKeys()) {
        const value = out[key]

        out[key] = value && typeof value === 'object' ? value.value : (value ?? null)
    }

    return out
}

/**
 * The keys of every file field, from EITHER form shape.
 *
 * A flat form carries `fields`; a form with sections or tabs carries a `nodes`
 * tree and no flat list at all. Reading only `fields` threw on every sectioned
 * form - and because this runs inside Inertia's `transform`, the throw did not
 * surface as an error, it just meant the visit never happened and the Save
 * button appeared to do nothing.
 */
function fileFieldKeys(): string[] {
    const keys: string[] = []

    const walk = (node: any) => {
        if (!node) {
            return
        }

        if (node.type === 'file' && node.key) {
            keys.push(node.key)
        }

        node.children?.forEach(walk)
    }

    ;(props.schema.form.fields ?? []).forEach(walk)
    ;(props.schema.form.nodes ?? []).forEach(walk)

    return keys
}

/**
 * True while a save is in flight, from the click until the visit finishes.
 *
 * The navigation guard needs to tell a SAVE apart from LEAVING, and
 * `form.processing` cannot do it: Inertia fires its global `before` event and
 * only then starts the visit, so `processing` is still false at the moment the
 * guard runs. The guard therefore saw a dirty form navigating and asked "leave
 * without saving?" on every save - and a user who answered Cancel had their
 * save silently dropped, which is the exact outcome the prompt exists to
 * prevent.
 */
let saving = false

/**
 * True while an explicit Cancel is navigating away.
 *
 * CANCEL IS ALREADY THE ANSWER to "leave without saving?", so prompting on top
 * of it asks the same question twice - and the second dialogue is the confusing
 * one, because it appears to be about a different decision. Worse, a browser
 * that auto-dismisses the confirm turns the button into a no-op: it visibly does
 * nothing, which reads as broken rather than as guarded.
 *
 * Same mechanism as `saving`, and for the same reason: Inertia fires its global
 * `before` hook before the visit starts, so the guard cannot tell a deliberate
 * departure from an accidental one without being told.
 */
let cancelling = false

/**
 * `andNew` is create-only (checked by the caller via `isEdit`, not here, so
 * this stays the one place that decides what "done" means).
 *
 * NO SECOND REQUEST. The create route IS the current page, so "and add
 * another" needs nothing from the server beyond the store response already
 * in flight - `form.reset()` restores the same defaults the page loaded
 * with, which also clears `form.isDirty` and so the leave-guard with it.
 */
function submit(andNew = false) {
    saving = true

    const onSuccess = () => {
        clearDraft()
        void forgetServerDraft()
        toast.success(`${props.schema.label} ${isEdit.value ? 'updated' : 'created'}`)

        if (andNew && !isEdit.value) {
            form.reset()

            return
        }

        router.visit(props.schema.routes.index)
    }

    // `transform` rather than a second form object, so the visit still carries
    // this form's errors and processing state back to the same controls.
    const submitting = form.transform(() => payload())

    // Cleared however the visit ends: a validation failure leaves the user on
    // a dirty form that must prompt again if they then try to leave.
    const onFinish = () => {
        saving = false
    }

    if (isEdit.value) {
        submitting.put(`${props.schema.routes.index}/${props.record!.id}`, { onSuccess, onFinish })
    } else {
        submitting.post(props.schema.routes.index, { onSuccess, onFinish })
    }
}

/**
 * Uploads a file and returns the handle the form will carry.
 *
 * Lives here rather than in the control for the same reason `searchOptions`
 * does: @alxtexh-enterprise/panel ships no HTTP client. XHR rather than fetch, because
 * fetch still cannot report UPLOAD progress - and on a 4 MB scan over a phone
 * connection, an indeterminate spinner is the difference between waiting and
 * pressing the button again.
 */
function upload(
    field: string,
    file: File,
    onProgress: (percent: number) => void,
): Promise<UploadedFileValue> {
    return new Promise((resolve, reject) => {
        const body = new FormData()

        body.append('file', file)
        body.append('field', field)

        const request = new XMLHttpRequest()

        request.open('POST', `${props.schema.routes.index}/uploads`)
        request.setRequestHeader('Accept', 'application/json')
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        request.setRequestHeader('X-XSRF-TOKEN', csrf())
        request.withCredentials = true

        request.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                onProgress(Math.round((event.loaded / event.total) * 100))
            }
        }

        request.onload = () => {
            let parsed: any = null

            try {
                parsed = JSON.parse(request.responseText)
            } catch {
                // Left null; the status decides below.
            }

            if (request.status === 201 && parsed) {
                resolve({ value: parsed.handle, name: parsed.name, size: parsed.size })

                return
            }

            // The server's own reason, when it gave one: "the file's contents
            // do not match its .pdf extension" is actionable, "upload failed"
            // is not.
            reject(new Error(parsed?.message ?? 'The upload failed.'))
        }

        request.onerror = () => reject(new Error('The upload failed.'))

        request.send(body)
    })
}

async function discardUpload(handle: string): Promise<void> {
    await fetch(`${props.schema.routes.index}/uploads`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ handle }),
    })
}

function csrf(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

    return match ? decodeURIComponent(match[1]) : ''
}

/**
 * Fetches options for a searchable select.
 *
 * Lives here because @alxtexh-enterprise/panel may not import an HTTP client - the same rule
 * that keeps the live-update composable transport-agnostic.
 */
async function searchOptions(
    field: string,
    term: string,
): Promise<{ value: any; label: string }[]> {
    const query = new URLSearchParams({
        field,
        q: term,
        form: JSON.stringify(form.data()),
    })
    const res = await fetch(`${props.schema.routes.index}/field-options?${query}`, {
        headers: { Accept: 'application/json' },
    })

    if (!res.ok) {
        throw new Error(String(res.status))
    }

    return (await res.json()).options
}

async function createOption(
    field: string,
    values: Record<string, unknown>,
): Promise<{ value: any; label: string }> {
    const res = await fetch(`${props.schema.routes.index}/field-options`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ field, values }),
    })

    const payload = await res.json().catch(() => ({}))

    if (!res.ok) {
        const fieldErrors = fieldErrorsFromPayload(payload?.errors)
        const first =
            Object.values(fieldErrors)[0] ??
            (payload?.message && typeof payload.message === 'string' ? payload.message : null)

        throw new CreateOptionError(
            typeof first === 'string' ? first : 'Could not create that option.',
            fieldErrors,
        )
    }

    return payload.option
}

function cancel() {
    cancelling = true

    router.visit(props.schema.routes.index, {
        // Cleared however the visit ends, so a failed navigation leaves the
        // guard armed rather than permanently disabled.
        onFinish: () => {
            cancelling = false
        },
    })
}

/**
 * Discard edits without leaving the page.
 *
 * `form.reset()` restores the values the form was CONSTRUCTED with, which are
 * the record's saved values on an edit page and the empty defaults on a create
 * page - so one call is correct for both. Errors are cleared too: an error
 * about a field that has just been reverted is describing a value that no
 * longer exists.
 */
/*
 * THE CAST LIVES IN SCRIPT, not in the template.
 *
 * `:fields="schema.form.fields as FormField[] | undefined"` is valid and the
 * linter reads the `|` as a Vue 2 filter pipe - a rule that cannot be argued
 * with from inside an expression. Hoisting it is clearer anyway: template
 * expressions are not where type surgery belongs.
 */
const formFields = computed(() => formSchema.value.fields as FormField[] | undefined)

function fieldIsLive(key: string): boolean {
    if ((formFields.value ?? []).some((field) => field.key === key && field.live)) {
        return true
    }

    return nodeHasLiveField(formSchema.value.nodes, key)
}

function nodeHasLiveField(nodes: any[] | undefined, key: string): boolean {
    if (!nodes) {
        return false
    }

    for (const node of nodes) {
        if (node?.component === 'field' && node.key === key && node.live) {
            return true
        }

        if (nodeHasLiveField(node?.children, key) || nodeHasLiveField(node?.fields, key)) {
            return true
        }
    }

    return false
}

async function onFieldChange(key: string, value: any): Promise<void> {
    ;(form as any)[key] = value

    if (!fieldIsLive(key)) {
        scheduleLiveValidation(key)

        return
    }

    liveController?.abort()
    liveController = new AbortController()

    let res: Response

    try {
        res = await fetch(`${props.schema.routes.index}/form-state`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
            body: JSON.stringify({ field: key, values: form.data() }),
            signal: liveController.signal,
        })
    } catch (error) {
        if (!isAbort(error)) {
            throw error
        }

        return
    }

    if (!res.ok) {
        return
    }

    applyFormPatch(await res.json())
    scheduleLiveValidation(key)
}

/**
 * Named prefix/suffix Action. Same JSON family as live() form-state.
 * Copy and URL affixes never reach here: FormFieldControl handles those locally.
 */
async function onAffixAction(field: string, action: string): Promise<void> {
    const res = await fetch(`${props.schema.routes.index}/form-action`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ field, action, values: form.data() }),
    })

    if (!res.ok) {
        return
    }

    applyFormPatch(await res.json())
}

function applyFormPatch(payload: any): void {
    if (payload.options && typeof payload.options === 'object') {
        liveOptions.value = { ...liveOptions.value, ...payload.options }
    }

    if (payload.schema && typeof payload.schema === 'object') {
        formSchema.value = payload.schema
    }

    if (payload.values && typeof payload.values === 'object') {
        for (const [k, v] of Object.entries(payload.values as Record<string, unknown>)) {
            ;(form as any)[k] = v
        }
    }
}

/**
 * Live typing validation over the existing precognitive store/update route.
 *
 * JSON POST of the current values, field named in Precognition-Validate-Only.
 * Same transport as live() form-state. No Livewire.
 */
let validateTimer: ReturnType<typeof setTimeout> | undefined
let liveController: AbortController | undefined
let validationController: AbortController | undefined

function isAbort(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'AbortError'
}

function validateUrl(): string | null {
    if (props.record?.id && props.schema.routes.update) {
        return props.schema.routes.update.replace('{id}', String(props.record.id))
    }

    return props.schema.routes.store ?? props.schema.routes.index ?? null
}

function scheduleLiveValidation(key: string): void {
    clearTimeout(validateTimer)
    validateTimer = setTimeout(() => {
        void validateField(key)
    }, 350)
}

async function validateField(key: string): Promise<void> {
    const url = validateUrl()

    if (!url) {
        return
    }

    validationController?.abort()
    validationController = new AbortController()

    let res: Response

    try {
        res = await fetch(url, {
        method: props.record?.id ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Precognition: 'true',
            'Precognition-Validate-Only': key,
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
            body: JSON.stringify({ field: key, ...form.data() }),
            signal: validationController.signal,
        })
    } catch (error) {
        if (!isAbort(error)) {
            throw error
        }

        return
    }

    if (res.status === 204 || res.headers.get('Precognition-Success') === 'true') {
        form.clearErrors(key)

        return
    }

    if (res.status !== 422) {
        return
    }

    const body = await res.json().catch(() => ({}))
    const messages = (body as { errors?: Record<string, string[]> }).errors?.[key]

    if (messages) {
        form.setError(key, Array.isArray(messages) ? String(messages[0]) : String(messages))
    } else {
        form.clearErrors(key)
    }
}

function discard() {
    form.reset()
    form.clearErrors()
}

/**
 * Unsaved-changes guard (addendum C).
 *
 * Trivial in an SPA and genuinely useful on a full-page form, where a stray
 * Back or a closed tab loses everything typed. Only guards a form that is
 * actually dirty, so it never nags on a page someone merely looked at.
 */
function onBeforeUnload(e: BeforeUnloadEvent) {
    if (form.isDirty && !form.processing) {
        e.preventDefault()
        e.returnValue = ''
    }
}

watch(
    formValues,
    () => scheduleDraft(),
    { deep: true },
)

let removeNavigationGuard: (() => void) | undefined
const pendingNavigation = ref<any | null>(null)

onMounted(() => {
    window.addEventListener('beforeunload', onBeforeUnload)
    void restoreServerDraft().then((restored) => {
        if (!restored) {
            restoreDraft()
        }
    })

    const params = new URLSearchParams(window.location.search)

    for (const field of formFields.value ?? []) {
        if (field.tableSelect && params.has(field.key)) {
            const picked = params.get(field.key)
            ;(form as any)[field.key] = picked
        }
    }

    removeNavigationGuard = router.on('before', (event) => {
        // A submit and an explicit Cancel both navigate; only an UNRELATED
        // navigation should prompt.
        if (saving || cancelling || !form.isDirty || form.processing) {
            return
        }

        event.preventDefault()
        pendingNavigation.value = event.detail.visit
    })
})

function leaveWithoutSaving(): void {
    const visit = pendingNavigation.value

    pendingNavigation.value = null
    cancelling = true

    if (visit) {
        router.visit(visit.url, {
            ...visit,
            onFinish: () => {
                cancelling = false
            },
        })
    } else {
        cancelling = false
    }
}

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', onBeforeUnload)
    removeNavigationGuard?.()
    clearTimeout(validateTimer)
    clearTimeout(draftTimer)
    draftController?.abort()
    saveDraft()
    liveController?.abort()
    validationController?.abort()
})
</script>

<template>
    <Head :title="`${isEdit ? 'Edit' : 'New'} ${schema.label}`" />

    <!--
        `pb-24` CLEARS THE FLOATING SAVE BAR. The bar is fixed to the bottom
        of the main content column (`#pk-main`), so without reserved space it sits ON the last section
        of a scrolled-to-bottom form - covering the exact fields somebody is
        trying to fill (the user hit this on the announcement toggles). The
        padding means fully scrolled content ends above the bar, always.
    -->
    <div :class="[PAGE_SHELL_COMPACT, 'flex flex-col gap-4 pb-24']">
        <PkPageHeader
            :title="isEdit ? `Edit ${schema.label}` : `New ${schema.label}`"
            :purpose="record?.label ?? null"
        >
            <template v-if="schema.links?.length" #actions>
                <template v-for="link in schema.links" :key="link.href">
                    <a
                        v-if="link.external"
                        :href="link.href"
                        target="_blank"
                        rel="noopener"
                        :class="buttonClasses({ variant: 'outline', size: 'sm' })"
                    >
                        {{ link.label }}
                        <svg
                            viewBox="0 0 24 24"
                            class="ml-1 size-3.5"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <path d="M15 3h6v6M10 14 21 3" />
                        </svg>
                    </a>
                    <Link
                        v-else
                        :href="link.href"
                        :class="buttonClasses({ variant: 'outline', size: 'sm' })"
                    >
                        {{ link.label }}
                    </Link>
                </template>
            </template>
        </PkPageHeader>

        <PkModal
            :open="pendingNavigation !== null"
            title="Leave without saving?"
            description="Your changes are still on this form and will be discarded if you leave."
            @close="pendingNavigation = null"
        >
            <p class="text-sm">Continue to the next page without saving this form?</p>
            <template #footer>
                <Button variant="ghost" size="sm" @click="pendingNavigation = null">Stay</Button>
                <Button variant="destructive" size="sm" @click="leaveWithoutSaving">Leave page</Button>
            </template>
        </PkModal>

        <!--
            Full-bleed PAGE_SHELL_COMPACT for the page; FORM_MEASURE (max-w-7xl,
            Filament-default content width) keeps fields left-aligned without an
            mx-auto skinny centre column. No card here when the schema declares
            layout: Section and Tabs draw their own frame, and wrapping them puts
            a border around a border. The flat fallback has no frame of its own,
            so it still gets one.
        -->
        <div :class="FORM_MEASURE">
            <!--
                ANYTHING A PLUGIN ADDS ABOVE THIS FORM goes here - a trial
                banner, a compliance notice - the same "add a sentence to an
                existing screen without forking it" this mechanism exists for
                on the list and record pages.
            -->
            <RenderHook
                position="form.before"
                :hooks="renderHooks"
                :resource="schema.key"
                :record-id="record?.id"
            />

            <div
                :class="
                    formSchema.nodes?.length
                        ? ''
                        : 'bg-card rounded-xl border p-4 shadow-sm ring-1 ring-black/5 sm:p-6 dark:ring-white/10'
                "
            >
                <RecordForm
                    :model-value="formValues"
                    :nodes="formSchema.nodes"
                    :fields="formFields"
                    :columns="formSchema.columns"
                    :errors="form.errors as any"
                    :options="liveOptions"
                    :processing="form.processing"
                    :search-options="searchOptions"
                    :upload="upload"
                    :discard="discardUpload"
                    :picker-base="schema.routes.index"
                    :return-url="returnUrl"
                    :create-option="createOption"
                    @change="onFieldChange"
                    @affix-action="onAffixAction"
                />
            </div>

            <!--
                THE DOOR TO A NEW FIELD IS ON THE FORM, because that is where the
                need arises - see DefineFieldDialog's own note, and Part D of the
                plan. A ghost button, deliberately quiet: defining a field is an
                occasional act, not part of filling this form in.
            -->
            <div v-if="customFieldSupport" class="mt-4 flex justify-start">
                <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground"
                    :disabled="form.processing"
                    @click="definingField = true"
                >
                    + Add a field to every {{ customFieldSupport.label.toLowerCase() }}
                </Button>
            </div>

            <!-- Below the form, above the floating save bar. -->
            <RenderHook
                position="form.after"
                :hooks="renderHooks"
                :resource="schema.key"
                :record-id="record?.id"
            />
        </div>

        <!--
            THE BAR IS THE ONLY SAVE UI. There used to be a second Cancel/Save
            pair at the bottom of the form, and with the bar floating above it
            the same two buttons rendered twice on every dirty form - two
            controls claiming the same act, one of them half-hidden behind the
            other. The floating bar is the reliable one (visible wherever the
            scroll is), so the inline pair is gone.

            ON EDIT it appears when there is something to lose, so a page
            merely looked at stays quiet. ON CREATE it is always there -
            a create form's entire purpose is the submit, and a screen whose
            only save control appears after the first keystroke reads as
            broken for exactly one keystroke too long.
        -->
        <UnsavedBar
            :show="isEdit ? form.isDirty : true"
            :processing="form.processing"
            :message="isEdit ? 'Unsaved changes' : `New ${schema.label.toLowerCase()}`"
            :save-label="isEdit ? 'Save changes' : `Create ${schema.label}`"
            :discard-label="form.isDirty ? 'Discard' : undefined"
            :extra-label="isEdit ? undefined : 'Create & add another'"
            @save="submit()"
            @cancel="cancel"
            @discard="discard"
            @extra="submit(true)"
        />

        <DefineFieldDialog
            v-if="customFieldSupport"
            :open="definingField"
            :resource="customFieldSupport.resource"
            :label="customFieldSupport.label"
            :types="customFieldSupport.types"
            :endpoint="customFieldSupport.endpoint"
            @close="definingField = false"
        />
    </div>
</template>

import { router } from '@inertiajs/vue3'
import { onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'

/**
 * Stop an Inertia visit while there are unsaved changes, and ask first.
 *
 * WHY IT IS HERE AND `useUnsavedChanges` IS IN `@alxtexh-enterprise/panel`. The dirty
 * comparison and the `beforeunload` handler need nothing but a browser;
 * cancelling a visit needs the router. Putting this half in the presentation
 * package would give it an Inertia dependency for one listener, and every
 * consumer of `@alxtexh-enterprise/panel` that is not an Inertia application would carry it.
 *
 * `beforeunload` DOES NOT COVER THIS, which is the whole reason both exist. An
 * Inertia visit never unloads the document, so the browser has nothing to warn
 * about - clicking a sidebar link with a half-finished form silently threw the
 * work away, and the packaged bar could not prevent it either, because a bar
 * cannot intercept navigation.
 *
 * IT ASKS RATHER THAN REFUSES. A guard that blocked outright would trap
 * somebody on a page they have decided to abandon, and the way out of that is
 * to reload - which loses the work anyway, with an extra step.
 *
 * ```ts
 * const { dirty, commit } = useUnsavedChanges(state)
 * useUnsavedGuard(dirty)
 * ```
 */
export function useUnsavedGuard(
    dirty: Ref<boolean>,
    message = 'You have unsaved changes. Leave this page and lose them?',
    confirmLeave: ((message: string) => boolean) | null = null,
): void {
    const stop = router.on('before', (event) => {
        if (!dirty.value) {
            return
        }

        /*
         * ONLY A REAL NAVIGATION IS GUARDED. Inertia fires `before` for every
         * visit, including the partial reloads a table makes when somebody
         * sorts or pages - and the reference app's own screens make those
         * constantly. Confirming a sort would be absurd, and worse, would train
         * people to dismiss the prompt that matters.
         */
        if (event.detail.visit.only.length > 0 || event.detail.visit.method !== 'get') {
            return
        }

        /*
         * Native dialogs are unavailable in embedded browsers and cannot be
         * styled or tested. A caller that owns a modal may provide the small
         * synchronous decision callback; otherwise fail closed and keep the
         * user on the form instead of silently discarding their work.
         */
        event.preventDefault()

        if (confirmLeave?.(message) === true) {
            router.visit(event.detail.visit.url)
        }
    })

    onBeforeUnmount(stop)
}

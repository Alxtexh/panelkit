import { router } from '@inertiajs/vue3'
import { onBeforeUnmount, ref } from 'vue'

/**
 * Runs a bulk action or an export, and follows it if it was queued.
 *
 * THE HTTP LIVES HERE, NOT IN @alxtexh-enterprise/panel. Package rule 2 (§4) is that
 * components take props and emit events; only the app fetches. So BulkActions
 * emits `run` and this turns it into a request.
 *
 * POLLING IS BOUNDED AND ONLY EVER IN FLIGHT. §8 forbids UNNECESSARY polling,
 * not all of it: an operator who just queued a job over 90,000 rows is watching
 * for its result, so asking every second is answering a question they are
 * actively holding. It starts on dispatch, stops the moment the job resolves,
 * and gives up after a ceiling rather than spinning forever against a dead
 * worker. Nothing polls when nothing is running.
 */

export interface JobProgress {
    status: 'pending' | 'running' | 'done' | 'failed' | 'canceled'
    done: number
    total: number | null
    error: string | null
    downloadable: boolean
    /**
     * Where to fetch the file, as the SERVER built it.
     *
     * This used to be assembled here as `/${resourceKey}/jobs/${token}/download`,
     * which is right for the portal mounted at the root and wrong for every
     * other one - a reseller's export linked to a path their portal does not
     * serve. The prefix is a server-side fact; only the server should say it.
     */
    download: string | null
    selected?: number
    authorized?: number
    skipped?: number
}

export interface BulkTarget {
    ids?: (string | number)[]
    all?: boolean
}

const POLL_MS = 1000
/** ~5 minutes. A worker that has not answered by then is not going to. */
const MAX_POLLS = 300

/**
 * Laravel accepts the XSRF cookie echoed back as a header - the same thing
 * axios does automatically. Read here because these calls are plain fetch, not
 * Inertia visits, so nothing sets it for us.
 */
function csrf(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

    return match ? decodeURIComponent(match[1]) : ''
}

async function post(url: string, body: Record<string, unknown>) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(payload.message ?? `Request failed (${response.status}).`)
    }

    return payload
}

/** The index URL is already resolved by the server for the active panel. */
export function useBulkJob(resourceKey: string, indexUrl = `/${resourceKey}`) {
    const busy = ref(false)
    const progress = ref<JobProgress | null>(null)
    const error = ref<string | null>(null)
    const downloadUrl = ref<string | null>(null)

    let timer: ReturnType<typeof setTimeout> | null = null

    function stop() {
        if (timer) {
            clearTimeout(timer)
        }

        timer = null
    }

    /**
     * The current filter parameters, carried so the server re-derives the exact
     * set the operator is looking at. The IDs are not sent for select-all - the
     * whole point is that the set may be larger than the browser knows.
     */
    function currentQuery(): string {
        return window.location.search
    }

    function follow(token: string, attempt = 0): void {
        stop()

        if (attempt >= MAX_POLLS) {
            error.value = 'This job is taking longer than expected. It may still be running.'
            busy.value = false

            return
        }

        timer = setTimeout(async () => {
            try {
                const response = await fetch(`${indexUrl}/jobs/${token}`, {
                    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                    credentials: 'same-origin',
                })

                if (!response.ok) {
                    throw new Error('Lost track of that job.')
                }

                const state: JobProgress = await response.json()
                progress.value = state

                if (state.status === 'done') {
                    busy.value = false

                    if (state.downloadable) {
                        downloadUrl.value =
                            state.download ?? `${indexUrl}/jobs/${token}/download`
                    } else {
                        // A mutation changed rows; the table must catch up.
                        // Partial reload, so the schema does not travel again.
                        router.reload({ only: ['records', 'total', 'tabCounts'] })
                    }

                    return
                }

                if (state.status === 'failed') {
                    busy.value = false
                    error.value = state.error ?? 'That job failed.'

                    return
                }

                if (state.status === 'canceled') {
                    busy.value = false
                    error.value = state.error ?? 'That job was canceled.'

                    return
                }

                follow(token, attempt + 1)
            } catch (e) {
                busy.value = false
                error.value = e instanceof Error ? e.message : 'Lost track of that job.'
            }
        }, POLL_MS)
    }

    /**
     * @param data Values a bulk action's form collected, or undefined for one
     *             that asks nothing. Sent nested so a field named `action`
     *             cannot collide with the action key.
     */
    async function run(action: string, target: BulkTarget, data?: Record<string, unknown>) {
        busy.value = true
        error.value = null
        progress.value = null
        downloadUrl.value = null

        try {
            const result = await post(`${indexUrl}/bulk${currentQuery()}`, {
                action,
                all: target.all ?? false,
                ids: target.all ? [] : (target.ids ?? []),
                ...(data ? { data } : {}),
            })

            if (result.status === 'done') {
                busy.value = false
                progress.value = {
                    status: 'done',
                    done: result.affected,
                    total: result.affected,
                    error: null,
                    downloadable: false,
                    download: null,
                    selected: result.selected,
                    authorized: result.authorized,
                    skipped: result.skipped,
                }
                router.reload({ only: ['records', 'total', 'tabCounts'] })

                return
            }

            follow(result.token)
        } catch (e) {
            busy.value = false
            error.value = e instanceof Error ? e.message : 'That action failed.'
        }
    }

    async function exportView(target: BulkTarget) {
        busy.value = true
        error.value = null
        progress.value = null
        downloadUrl.value = null

        try {
            const result = await post(`${indexUrl}/export${currentQuery()}`, {
                all: target.all ?? false,
                ids: target.all ? [] : (target.ids ?? []),
            })

            follow(result.token)
        } catch (e) {
            busy.value = false
            error.value = e instanceof Error ? e.message : 'That export failed.'
        }
    }

    function dismiss() {
        stop()
        progress.value = null
        error.value = null
        downloadUrl.value = null
        busy.value = false
    }

    // A page visit can unmount the table while its job is still being polled.
    // Stop the timer so the old page cannot keep issuing requests.
    onBeforeUnmount(stop)

    return { busy, progress, error, downloadUrl, run, exportView, dismiss }
}

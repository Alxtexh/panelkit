import { router, usePage } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * Client idle timer for a panel that shared `panelIdleLock`.
 *
 * ACTIVITY EVENTS reset the clock: mousedown, keydown, touchstart, scroll,
 * click. Scroll listens on `document` in the capture phase because the inset
 * scrolls inside AppContent, not on `window`, and scroll events do not bubble.
 *
 * A background tab uses visibilitychange so returning after the idle window
 * locks immediately rather than waiting for the next interval tick.
 *
 * THE TIMER DOES NOT RUN on the lock screen or other auth pages. Locking the
 * lock screen is a loop, and a signed-out form has no session to protect.
 */

export type PanelIdleLockShared = {
    idleMinutes: number
    warningSeconds: number
    lockUrl: string
}

export function usePanelIdleLock() {
    const page = usePage()

    const config = computed((): PanelIdleLockShared | null => {
        const value = (page.props as { panelIdleLock?: PanelIdleLockShared | null }).panelIdleLock

        return value?.lockUrl ? value : null
    })

    const warningSecondsLeft = ref(0)
    const warningOpen = computed(() => warningSecondsLeft.value > 0)

    let lastActivity = Date.now()
    let interval: ReturnType<typeof setInterval> | null = null
    let locking = false
    let redirectingToLock = false
    let removeHttpExceptionListener: (() => void) | null = null

    /**
     * A background partial reload receives 423 JSON while the panel is locked.
     * That is correct for the transport, but Inertia cannot render JSON as a
     * page and otherwise opens its "invalid response" dialog. Intercept the
     * exception event and perform one normal navigation to the lock screen.
     */
    function onHttpException(event: Event): void {
        const response = (event as CustomEvent<{ response?: { status?: number } }>).detail?.response

        if (response?.status !== 423 || !config.value?.lockUrl || isAuthPage() || redirectingToLock) {
            return
        }

        event.preventDefault()
        redirectingToLock = true
        window.location.assign(config.value.lockUrl)
    }

    function isAuthPage(): boolean {
        const component = String(page.component ?? '')
        const url = String(page.url ?? '')

        if (/auth\//i.test(component) || /LockScreen/i.test(component)) {
            return true
        }

        return /\/(login|register|forgot-password|reset-password|two-factor|screens\/locked)(\/|$|\?)/i.test(
            url,
        )
    }

    function idleMs(): number {
        const minutes = Number(config.value?.idleMinutes ?? 0)

        return minutes > 0 ? minutes * 60_000 : 0
    }

    function enabled(): boolean {
        return config.value !== null && idleMs() > 0 && !isAuthPage()
    }

    function resetActivity(): void {
        lastActivity = Date.now()
        warningSecondsLeft.value = 0
        locking = false
    }

    function lockNow(): void {
        const url = config.value?.lockUrl

        if (!url || locking) {
            return
        }

        locking = true
        warningSecondsLeft.value = 0
        router.post(url)
    }

    function elapsedMs(): number {
        return Date.now() - lastActivity
    }

    function tick(): void {
        if (!enabled()) {
            warningSecondsLeft.value = 0

            return
        }

        const idle = idleMs()
        const warnMs = Math.max(0, config.value!.warningSeconds) * 1000
        const remaining = idle - elapsedMs()

        if (remaining <= 0) {
            lockNow()

            return
        }

        if (warnMs > 0 && remaining <= warnMs) {
            warningSecondsLeft.value = Math.max(1, Math.ceil(remaining / 1000))

            return
        }

        warningSecondsLeft.value = 0
    }

    function onVisibility(): void {
        if (document.visibilityState !== 'visible' || !enabled()) {
            return
        }

        tick()
    }

    const windowActivityEvents = ['mousedown', 'keydown', 'touchstart', 'click'] as const

    function onActivity(): void {
        if (!enabled()) {
            return
        }

        resetActivity()
    }

    function start(): void {
        stop()

        if (!enabled()) {
            return
        }

        resetActivity()

        for (const event of windowActivityEvents) {
            window.addEventListener(event, onActivity, { passive: true })
        }

        document.addEventListener('scroll', onActivity, { passive: true, capture: true })
        document.addEventListener('visibilitychange', onVisibility)
        removeHttpExceptionListener = router.on('httpException', onHttpException)
        interval = setInterval(tick, 1000)
    }

    function stop(): void {
        for (const event of windowActivityEvents) {
            window.removeEventListener(event, onActivity)
        }

        document.removeEventListener('scroll', onActivity, { capture: true })
        document.removeEventListener('visibilitychange', onVisibility)
        removeHttpExceptionListener?.()
        removeHttpExceptionListener = null

        if (interval !== null) {
            clearInterval(interval)
            interval = null
        }

        warningSecondsLeft.value = 0
    }

    onMounted(start)

    watch(
        () => [config.value?.lockUrl, page.component, page.url],
        () => start(),
    )

    onBeforeUnmount(stop)

    return {
        config,
        warningOpen,
        warningSecondsLeft,
        lockNow,
        dismissWarning: resetActivity,
    }
}

/**
 * Keep document scrolling disabled until the LAST PanelKit overlay closes.
 *
 * A modal and a slideover can overlap during a secondary confirmation flow.
 * Storing `body.style.overflow` inside each component is not enough: when the
 * older overlay closes it would restore the value that existed before it
 * opened, even though the newer overlay still owns the screen. A shared owner
 * set makes the lock behave like the overlay stack it represents.
 */
const owners = new Set<symbol>()
let previousOverflow = ''

export function acquireScrollLock(owner: symbol): void {
    if (typeof document === 'undefined' || owners.has(owner)) {
        return
    }

    if (owners.size === 0) {
        previousOverflow = document.body.style.overflow
    }

    owners.add(owner)
    document.body.style.overflow = 'hidden'
}

/** Returns true when this release closed the final active overlay. */
export function releaseScrollLock(owner: symbol): boolean {
    if (typeof document === 'undefined' || !owners.delete(owner)) {
        return false
    }

    if (owners.size === 0) {
        document.body.style.overflow = previousOverflow
        previousOverflow = ''

        return true
    }

    return false
}

export function hasActiveScrollLock(): boolean {
    return owners.size > 0
}

/**
 * Pack dashboard widgets into independent column tracks.
 *
 * A two-column CSS grid shares rows: collapsing the left card leaves a hole
 * because the right neighbour still defines the row height. Assigning widgets
 * to flex columns (round-robin, declaration order) means a collapse only
 * shortens that column, and widgets below it slide up immediately.
 *
 * `span >= 2` widgets flush the current column batch and sit on their own
 * full-width band, matching `lg:col-span-2` without stretching siblings.
 */
export type WidgetColumnBand<T> = { type: 'wide'; item: T } | { type: 'columns'; columns: T[][] }

type ResponsiveSpan = number | Record<string, number>

/**
 * One number for the wide/not-wide decision this packer makes.
 *
 * `span()` on the PHP side accepts a bare int OR a per-breakpoint map
 * (`{default: 1, sm: 2, lg: 3}`) - see `Widgets\HasLayout`. This packer only
 * ever chooses between ONE column and TWO (`wideLayout` in `PanelWidgets.vue`
 * gates that above it), so a responsive declaration is collapsed to the value
 * that governs at the wider of those two tracks: `lg`, falling back to
 * `default`, falling back to the largest declared breakpoint - a widget
 * declared wide at ANY breakpoint should still get its own full-width band
 * rather than silently losing that once two columns are in play.
 */
function effectiveSpan(span: ResponsiveSpan | undefined): number {
    if (span === undefined) {
        return 1
    }

    if (typeof span === 'number') {
        return span
    }

    if (span.lg !== undefined) {
        return span.lg
    }

    if (span.default !== undefined) {
        return span.default
    }

    const values = Object.values(span)

    return values.length > 0 ? Math.max(...values) : 1
}

export function packWidgetColumns<T extends { span?: ResponsiveSpan }>(
    items: readonly T[],
    columnCount: number,
): WidgetColumnBand<T>[] {
    const count = Math.max(1, Math.floor(columnCount))

    if (items.length === 0) {
        return []
    }

    if (count === 1) {
        return [{ type: 'columns', columns: [[...items]] }]
    }

    const bands: WidgetColumnBand<T>[] = []
    let pending: T[] = []

    const flush = () => {
        if (pending.length === 0) {
            return
        }

        // Do not render an empty flex track for a final solo widget. An empty
        // second track makes one card occupy half the dashboard and leaves a
        // conspicuous blank half beside it. Once there are two items, the
        // normal independent tracks are retained so collapsing one still
        // cannot stretch or leave a shared-grid hole in the other.
        const columns: T[][] = Array.from(
            { length: Math.min(count, pending.length) },
            () => [],
        )

        pending.forEach((item, index) => {
            columns[index % count].push(item)
        })

        bands.push({ type: 'columns', columns })
        pending = []
    }

    for (const item of items) {
        if (effectiveSpan(item.span) >= 2) {
            flush()
            bands.push({ type: 'wide', item })
        } else {
            pending.push(item)
        }
    }

    flush()

    return bands
}

/**
 * An amount of money, in the VIEWER'S locale.
 *
 * SHARED, BECAUSE IT WAS NOT. This lived only in `ResourceIndex`, so the list
 * formatted `129900` as a currency and the record page for the same row printed
 * `129900`. Not an unstyled value - a WRONG NUMBER, two orders of magnitude
 * out, on the screen somebody opens to check an amount.
 *
 * LIVES IN `src/lib`, NOT `inertia/lib`, because `RelationPanel.vue` (a
 * `src/components` library component, built independently of the Inertia
 * page layer) needed it too - its own related-list tables were formatting
 * money as a bare number for the identical reason ResourceIndex.vue's record
 * page once was. `inertia/lib/money.ts` re-exports this so every existing
 * import keeps working.
 *
 * FORMATTED HERE RATHER THAN ON THE SERVER, the same rule dates follow.
 * `Intl.NumberFormat` knows that this reader groups with a space and decimals
 * with a comma; PHP knows what the server's locale is, which is nobody's.
 *
 * MINOR UNITS BY DEFAULT. Money stored as an integer count of the smallest unit
 * cannot drift the way a float does - `0.1 + 0.2` is not `0.3` in binary
 * floating point, and a total out by a cent is a support ticket nobody can
 * reproduce. A column that genuinely stores decimals declares `->major()`.
 *
 * AN UNKNOWN CURRENCY DEGRADES TO A PLAIN NUMBER rather than throwing.
 * `Intl.NumberFormat` raises a RangeError on a code it does not recognise, and
 * a typo in one row's currency column should cost that cell its symbol, not
 * take the table down.
 */
export type MoneyColumnShape = {
    currency?: string
    currencyColumn?: string
    major?: boolean
}

export function formatMoney(
    column: MoneyColumnShape,
    value: unknown,
    row?: Record<string, unknown>,
): string {
    const raw = Number(value)

    // NOT A NUMBER MEANS SHOW WHAT IS THERE. A column mis-declared as money
    // over a text field should reveal that, not print NaN.
    if (Number.isNaN(raw)) {
        return String(value)
    }

    const amount = column.major ? raw : raw / 100

    const code = column.currencyColumn
        ? String(row?.[column.currencyColumn] ?? '')
        : (column.currency ?? '')

    if (!code) {
        return new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: code,
        }).format(amount)
    } catch {
        // AN UNKNOWN CODE STILL SHOWS THE AMOUNT. `Intl` throws on a currency
        // it does not know, and a thrown formatter would blank the cell —
        // losing the number entirely to protect its symbol.
        return `${new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)} ${code}`
    }
}

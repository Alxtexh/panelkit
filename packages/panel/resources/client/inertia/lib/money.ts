/**
 * Re-exported from `src/lib/money.ts`, which is where this now lives.
 *
 * KEPT SO NOTHING HAD TO CHANGE IN `inertia/pages/*.vue`: this file's own
 * import path (`../lib/money`) is unchanged, only its implementation moved -
 * to `src/lib`, where a `src/components` library component (`RelationPanel.vue`)
 * could reach it without importing across the library/app boundary.
 */
export { formatMoney } from '../../src/lib/money'
export type { MoneyColumnShape } from '../../src/lib/money'

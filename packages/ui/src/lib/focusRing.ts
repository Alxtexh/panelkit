/**
 * Shared focus-visible ring for inputs, toolbar controls, and chrome that
 * should feel like one kit rather than mixed ring widths.
 *
 * Prefer these over ad-hoc `ring-2` / `ring-[3px]` strings so a focus pass
 * stays one edit.
 */
export const FOCUS_RING =
    'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

/** Same token for containers that wrap an unstyled input (affix rows, editors). */
export const FOCUS_RING_WITHIN =
    'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]'

/** Compact controls (toolbar icons, sidebar items) that already own a border. */
export const FOCUS_RING_SOFT = 'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]'

/**
 * Same tone as `PkTextInput`/`Input.vue`'s built-in `aria-invalid:` styling,
 * pulled out for the trigger-button controls (`PkSelectMenu`, `PkDatePicker`)
 * that set `aria-invalid` but draw their own box rather than rendering a
 * native `<input>` - so they never picked up the border Tailwind's
 * `aria-invalid:` variant already gives every native text input. Phase 6's
 * audit caught this: every field correctly gets a red helper line and
 * `aria-invalid="true"` on validation failure, but only the fields built on
 * a native `<input>` also got a red border - the two custom overlay
 * triggers stayed neutral gray.
 */
export const INVALID_BORDER =
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'

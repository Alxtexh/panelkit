/**
 * The frame around a chart: title, period selector, trend, and the chart slot.
 *
 * IT DOES NOT FETCH. Selecting a period emits `update:period` and nothing else
 * - the page decides that this means an Inertia partial reload of one prop.
 * That is package rule 2 (§4), and it is what lets the same card work outside
 * Inertia later.
 *
 * THE CARD IS THE ONLY FRAME. The chart inside draws no border and no heading
 * of its own; nesting a bordered chart inside a bordered card is the wrapper
 * stack the layout renderer already avoids.
 *
 * The body height is FIXED across loading, error and loaded states unless
 * `fitBody` is set. A skeleton shorter than the chart makes the whole
 * dashboard jump when six cards resolve at slightly different times. A
 * detailer (label/value rows) sizes to its content instead.
 *
 * COLLAPSE IS LOCAL AND EPHEMERAL. Hide is the page's job: this card emits
 * `hide` and stays mounted until the parent stops rendering it. The body
 * uses `v-if`, not `v-show`: a hidden plot with min-height still reserved
 * a white hole, and a grid neighbour could stretch the card around it.
 * Unmounting the body leaves a thin header; the plot remounts on expand,
 * the same as a widget that was hidden and restored.
 */
type __VLS_Props = {
    label: string;
    description?: string | null;
    /** Omit to hide the selector entirely. */
    periods?: {
        value: string;
        label: string;
    }[] | null;
    period?: string;
    loading?: boolean;
    error?: boolean;
    /** Offer an in-place retry action when the series failed. */
    retryable?: boolean;
    bodyHeight?: number;
    /** Size the body to its content once loaded. */
    fitBody?: boolean;
    /** Offer the collapse control at all. */
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    /** Offer a hide control. The parent decides what hiding means. */
    hideable?: boolean;
    /** Semantic icon name from `iconPath`. The `icon` slot wins if given. */
    icon?: string | null;
};
declare var __VLS_1: {}, __VLS_3: {}, __VLS_5: {}, __VLS_10: {};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_1) => any;
} & {
    trend?: (props: typeof __VLS_3) => any;
} & {
    actions?: (props: typeof __VLS_5) => any;
} & {
    default?: (props: typeof __VLS_10) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    retry: () => any;
    "update:period": (value: string) => any;
    hide: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRetry?: (() => any) | undefined;
    "onUpdate:period"?: ((value: string) => any) | undefined;
    onHide?: (() => any) | undefined;
}>, {
    description: string | null;
    icon: string | null;
    loading: boolean;
    error: boolean;
    collapsible: boolean;
    periods: {
        value: string;
        label: string;
    }[] | null;
    retryable: boolean;
    bodyHeight: number;
    fitBody: boolean;
    defaultCollapsed: boolean;
    hideable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

type __VLS_Props = {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
    /**
     * A tinted background with saturated text instead of a solid fill.
     *
     * FOR DENSE LISTS, NOT FOR A LONE BADGE. A single solid pill reads
     * fine next to a heading; a table where every row carries one reads
     * loud. `soft` is the calmer alternative for that case - `outline`
     * is unaffected, since it already has no fill to soften.
     */
    soft?: boolean;
    class?: string;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
    soft: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

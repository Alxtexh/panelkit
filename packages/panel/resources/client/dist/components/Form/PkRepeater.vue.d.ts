import type { FormField } from './types';
type Row = Record<string, unknown>;
type __VLS_Props = {
    modelValue: Row[] | null;
    /** One row's shape, declared server-side. */
    children: FormField[];
    itemLabel?: string;
    minItems?: number | null;
    maxItems?: number | null;
    collapsible?: boolean;
    /** Whether "Add" appears at all - distinct from `atMax` below, which
     * is a count ceiling. This is a declared "never grows" field. */
    addable?: boolean;
    /** Whether a row's own remove control appears - distinct from
     * `atMin`, which is a count floor. This is a declared "never
     * shrinks" field. */
    deletable?: boolean;
    /** Whether a row can be duplicated. Independent of `addable`: a host
     * can offer "start from a copy" while still refusing a blank row. */
    cloneable?: boolean;
    /** Render as a `<table>` - one column per child, one row per item -
     * instead of the stacked one-field-per-line layout. No collapse
     * affordance renders in this mode, whatever `collapsible` says. */
    table?: boolean;
    /** Relationship mode preserves the server-issued child id on submit. */
    relationship?: string | null;
    disabled?: boolean;
    /** Validation errors for the whole form, keyed by dotted path. */
    errors?: Record<string, string>;
    /** The field's own key, so child error paths can be built. */
    fieldKey: string;
    /** Option lists for child selects, keyed by child field key. */
    childOptions?: Record<string, {
        value: any;
        label: string;
    }[]>;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: Row[] | null) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: Row[] | null) => any) | undefined;
}>, {
    table: boolean;
    disabled: boolean;
    errors: Record<string, string>;
    childOptions: Record<string, {
        value: any;
        label: string;
    }[]>;
    itemLabel: string;
    minItems: number | null;
    maxItems: number | null;
    collapsible: boolean;
    addable: boolean;
    deletable: boolean;
    cloneable: boolean;
    relationship: string | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

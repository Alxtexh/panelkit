interface Option {
    value: string | number;
    label: string;
}
type __VLS_Props = {
    modelValue: string | number | null;
    options: Option[];
    id?: string;
    disabled?: boolean;
    invalid?: boolean;
    placeholder?: string;
    clearable?: boolean;
    /** The field's own label text, read only for the popup listbox's
     *  `aria-label` - the VISIBLE label already lives outside this
     *  component (the surrounding form layout renders it), so a
     *  screen reader landing in the listbox otherwise hears an
     *  unnamed "listbox" with no indication of what it is choosing. */
    label?: string;
    /** The id of this field's error message (`role="alert"` text), so a
     *  screen reader announces it as part of the control's description -
     *  not just at the moment the error first appears. */
    describedBy?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: string | number | null) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | number | null) => any) | undefined;
}>, {
    label: string;
    id: string;
    invalid: boolean;
    disabled: boolean;
    placeholder: string;
    describedBy: string;
    clearable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

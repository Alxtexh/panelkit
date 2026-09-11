type __VLS_Props = {
    modelValue: string | null;
    id?: string;
    withTime?: boolean;
    min?: string | null;
    max?: string | null;
    disabled?: boolean;
    invalid?: boolean;
    placeholder?: string;
    /** The id of this field's error message (`role="alert"` text), so a
     *  screen reader announces it as part of the control's description -
     *  not just at the moment the error first appears. */
    describedBy?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: string | null) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | null) => any) | undefined;
}>, {
    id: string;
    invalid: boolean;
    disabled: boolean;
    placeholder: string;
    max: string | null;
    min: string | null;
    withTime: boolean;
    describedBy: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

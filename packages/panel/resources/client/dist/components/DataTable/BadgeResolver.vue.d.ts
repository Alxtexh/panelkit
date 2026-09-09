type __VLS_Props = {
    value: unknown;
    options?: Record<string, string>;
    colors?: Record<string, string>;
    defaultColor?: string;
    label?: string;
    busy?: boolean;
    disabled?: boolean;
    soft?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
}>, {
    label: string;
    disabled: boolean;
    busy: boolean;
    options: Record<string, string>;
    soft: boolean;
    colors: Record<string, string>;
    defaultColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

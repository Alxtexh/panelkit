type __VLS_Props = {
    show: boolean;
    processing?: boolean;
    message?: string;
    saveLabel?: string;
    cancelLabel?: string;
    discardLabel?: string;
    /**
     * A second, non-primary submit - "Create & add another" on a create
     * form. Undefined hides it, same as `discardLabel`: this bar stays
     * generic (it also guards ordinary settings forms via
     * `useUnsavedChanges`), so the concept is a plain optional secondary
     * action rather than anything creation-specific.
     */
    extraLabel?: string;
    /**
     * The primary button reads as a warning, not a recommendation - for a
     * bar whose main action is "leave and lose this" rather than "save
     * this", where a brand-coloured button would read as the endorsed
     * choice.
     */
    destructive?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    discard: () => any;
    extra: () => any;
    save: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onDiscard?: (() => any) | undefined;
    onExtra?: (() => any) | undefined;
    onSave?: (() => any) | undefined;
}>, {
    message: string;
    destructive: boolean;
    processing: boolean;
    saveLabel: string;
    cancelLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

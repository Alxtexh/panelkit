type __VLS_Props = {
    title?: string;
    items?: {
        name: string;
        href?: string;
    }[];
    speed?: 'slow' | 'normal' | 'fast';
    reverse?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    title: string;
    reverse: boolean;
    speed: "slow" | "normal" | "fast";
    items: {
        name: string;
        href?: string;
    }[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

export interface InfoNode {
    component: 'entry' | 'section' | 'grid' | 'tabs' | 'tab';
    children?: InfoNode[];
    key?: string;
    label?: string;
    badge?: string | number | null;
    description?: string;
    columns?: number | ResponsiveColumns;
    collapsible?: boolean;
    collapsed?: boolean;
    icon?: string | null;
    /** Optional status chip next to a section title. */
    status?: string | null;
    type?: string;
    mono?: boolean;
    muted?: boolean;
    transform?: 'upper' | 'lower';
    prefix?: string;
    suffix?: string;
    colors?: Record<string, string>;
    defaultColor?: string;
    [key: string]: any;
}
type ResponsiveColumns = Partial<Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>;
type __VLS_Props = {
    node: InfoNode;
    record: Record<string, any>;
    /** 0 is the outermost layout node - the only one that draws a frame. */
    depth?: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    action: (action: {
        key: string;
        label?: string;
        confirmation?: string;
    }) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAction?: ((action: {
        key: string;
        label?: string;
        confirmation?: string;
    }) => any) | undefined;
}>, {
    depth: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

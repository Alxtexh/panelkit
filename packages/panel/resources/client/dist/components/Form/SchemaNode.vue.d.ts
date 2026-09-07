import type { UploadedFileValue } from './PkFileUpload.vue';
export interface SchemaNode {
    component: 'field' | 'section' | 'card' | 'columns' | 'column' | 'grid' | 'flex' | 'fieldset' | 'callout' | 'tabs' | 'tab' | 'wizard' | 'step';
    children?: SchemaNode[];
    label?: string;
    badge?: string | number | null;
    title?: string;
    description?: string;
    columns?: number | ResponsiveColumns;
    span?: number;
    collapsible?: boolean;
    collapsed?: boolean;
    icon?: string | null;
    /** `flex` */
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    gap?: 'sm' | 'md' | 'lg';
    wrap?: boolean;
    /** `callout` */
    tone?: 'info' | 'success' | 'warning' | 'danger';
    body?: string;
    /** `tabs`/`wizard`: the query-string key to remember position under, or
     * null when the node did not opt in. */
    persistInQueryString?: string | null;
    [key: string]: any;
}
export type ResponsiveColumns = Partial<Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>;
type __VLS_Props = {
    node: SchemaNode;
    values: Record<string, any>;
    errors?: Record<string, string>;
    options?: Record<string, {
        value: any;
        label: string;
    }[]>;
    processing?: boolean;
    /** Supplied by the page; @alxtexh-enterprise/panel ships no HTTP client. */
    searchOptions?: (field: string, term: string) => Promise<{
        value: any;
        label: string;
    }[]>;
    /** Performs an upload for a file field. See PkFileUpload. */
    upload?: (field: string, file: File, onProgress: (percent: number) => void) => Promise<UploadedFileValue>;
    discard?: (handle: string) => Promise<void>;
    /** 0 is the outermost layout node - the only one that draws a frame. */
    depth?: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (key: string, value: unknown) => any;
    "affix-action": (field: string, action: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((key: string, value: unknown) => any) | undefined;
    "onAffix-action"?: ((field: string, action: string) => any) | undefined;
}>, {
    options: Record<string, {
        value: any;
        label: string;
    }[]>;
    depth: number;
    processing: boolean;
    errors: Record<string, string>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

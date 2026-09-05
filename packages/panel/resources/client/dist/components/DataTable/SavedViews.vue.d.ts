/** A small local saved-view control for resource tables. */
export interface SavedTableView {
    name: string;
    search: string;
    filters: Record<string, unknown>;
    sort: string;
    direction: 'asc' | 'desc';
    perPage: number;
    tab: string | null;
    group: string | null;
    lens: string | null;
    hidden: string[];
    layout: 'table' | 'cards';
}
type __VLS_Props = {
    views: SavedTableView[];
    active?: string | null;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    remove: (name: string) => any;
    apply: (view: SavedTableView) => any;
    save: (name: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRemove?: ((name: string) => any) | undefined;
    onApply?: ((view: SavedTableView) => any) | undefined;
    onSave?: ((name: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

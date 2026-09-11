import type { CatalogItem } from './CatalogCard.vue';
import type { CatalogFacet, CatalogFilters } from './catalogFilter';
type __VLS_Props = {
    items: CatalogItem[];
    /** Show the search field. Off for a dashboard `catalog` chart. */
    searchable?: boolean;
    searchPlaceholder?: string;
    facets?: CatalogFacet[];
    /** Tiles vs compact rows. Off for a dashboard strip. */
    layoutToggle?: boolean;
    /** Autofocus the search box, a till treating it as a scanner. */
    autofocus?: boolean;
    /** Page size for the grid. Off when unset. */
    pageSize?: number | null;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue?: 'grid' | 'list';
};
declare var __VLS_8: {};
type __VLS_Slots = {} & {
    toolbar?: (props: typeof __VLS_8) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cart: (key: string) => any;
    filter: (filters: CatalogFilters) => any;
    select: (key: string) => any;
    "update:modelValue": (value: "list" | "grid") => any;
    scan: (query: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onCart?: ((key: string) => any) | undefined;
    onFilter?: ((filters: CatalogFilters) => any) | undefined;
    onSelect?: ((key: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: "list" | "grid") => any) | undefined;
    onScan?: ((query: string) => any) | undefined;
}>, {
    searchPlaceholder: string;
    searchable: boolean;
    autofocus: boolean;
    facets: CatalogFacet[];
    layoutToggle: boolean;
    pageSize: number | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

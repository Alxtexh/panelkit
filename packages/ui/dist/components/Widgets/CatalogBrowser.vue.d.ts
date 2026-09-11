import type { CatalogItem } from './CatalogCard.vue';
import type { CatalogFacet } from './catalogFilter';
export interface CatalogBrowserTab {
    key: string;
    label: string;
    items: CatalogItem[];
    facets?: CatalogFacet[];
    searchPlaceholder?: string;
    filterTitle?: string;
}
type __VLS_Props = {
    title?: string;
    description?: string | null;
    tabs: CatalogBrowserTab[];
    pageSize?: number;
    embedded?: boolean;
};
type __VLS_PublicProps = __VLS_Props & {
    'layout'?: 'grid' | 'list';
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cart: (key: string) => any;
    select: (key: string) => any;
    "update:layout": (value: "list" | "grid") => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onCart?: ((key: string) => any) | undefined;
    onSelect?: ((key: string) => any) | undefined;
    "onUpdate:layout"?: ((value: "list" | "grid") => any) | undefined;
}>, {
    title: string;
    description: string | null;
    embedded: boolean;
    pageSize: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

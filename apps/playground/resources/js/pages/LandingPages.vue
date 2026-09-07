<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    Check,
    ChevronDown,
    ExternalLink,
    LayoutTemplate,
    Megaphone,
    Package,
    PenLine,
    Send,
    Sparkles,
} from '@lucide/vue';
import { computed, onMounted, ref, watch } from 'vue';
import {
    CATALOGUE_CONTAINER,
    PAGE_SHELL,
    PkBadge,
    PkButton,
} from '@alxtexh-enterprise/panel';

defineOptions({ inheritAttrs: false });

interface LandingTemplate {
    slug: string;
    title: string;
    eyebrow: string;
    description: string;
    href: string;
    icon: string;
    accent: string;
}

interface LandingContent {
    siteName: string;
    eyebrow: string;
    headline: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    logoUrl: string;
    heroImageUrl: string;
    socialImageUrl: string;
    seoTitle: string;
    seoDescription: string;
    overrides: LandingOverride[];
}

interface LandingOverride {
    label: string;
    selector: string;
    type: 'text' | 'image' | 'link';
    value: string;
    alt: string;
}

interface PreviewElement {
    slot: string;
    selector: string;
    type: 'text' | 'image' | 'link';
    label: string;
    value: string;
    alt: string;
}

const props = defineProps<{
    pageHeading?: string;
    pageDescription?: string | null;
    templates: LandingTemplate[];
    selectedSlug: string;
    enabledSlugs: string[];
    orderSlugs: string[];
    activeTemplate?: LandingTemplate | null;
    content: LandingContent;
    publishedContent: LandingContent;
    contentBySlug: Record<string, LandingContent>;
    publishedContentBySlug: Record<string, LandingContent>;
    contentIsCustomBySlug: Record<string, boolean>;
    canManage: boolean;
    saveHref?: string | null;
    publishHref?: string | null;
    uploadMediaHref?: string | null;
    previewHref?: string | null;
}>();

const iconFor: Record<string, any> = {
    megaphone: Megaphone,
    package: Package,
    sparkles: Sparkles,
    'layout-template': LayoutTemplate,
};

const form = useForm<{
    selected: string;
    enabled: string[];
    order: string[];
    content: LandingContent;
}>({
    selected: props.selectedSlug,
    enabled: [...props.enabledSlugs],
    order: [...props.orderSlugs],
    content: { ...props.content },
});

const activeTemplate = computed(
    () =>
        props.templates.find(
            (template) => template.slug === form.selected,
        ) ?? props.activeTemplate ?? null,
);

const uploading = ref<string | null>(null);
const previewFrame = ref<HTMLIFrameElement | null>(null);
const previewElements = ref<PreviewElement[]>([]);
const previewLoading = ref(true);
const seededPreviewSlugs = new Set<string>();
const seededContentBySlug = ref<Record<string, LandingContent>>({});
const isPublished = computed(() => {
    const published = props.publishedContentBySlug[form.selected] ?? props.publishedContent;
    const matchesPublished = JSON.stringify(form.content) === JSON.stringify(published);
    const seeded = seededContentBySlug.value[form.selected];
    const matchesImportedSource = seeded
        ? JSON.stringify(form.content) === JSON.stringify(seeded)
        : false;

    return matchesPublished || matchesImportedSource;
});
const previewUrl = computed(() => {
    return form.selected
        ? `/?preview=${encodeURIComponent(form.selected)}&panelkit_editor=1`
        : props.previewHref ?? '';
});

function selectTemplate(slug: string): void {
    form.selected = slug;
    form.content = JSON.parse(JSON.stringify(
        props.contentBySlug[slug] ?? props.content,
    )) as LandingContent;

    if (!form.enabled.includes(slug)) {
        form.enabled.push(slug);
    }
}

function saveDraft(): void {
    if (!props.saveHref || !props.canManage) {
        return;
    }

    form.post(props.saveHref, { preserveScroll: true });
}

function publish(): void {
    if (!props.publishHref || !props.canManage) {
        return;
    }

    form.post(props.publishHref, { preserveScroll: true });
}

function addOverride(): void {
    form.content.overrides.push({
        label: '',
        selector: '',
        type: 'text',
        value: '',
        alt: '',
    });
}

function removeOverride(index: number): void {
    form.content.overrides.splice(index, 1);
}

function csrf(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

async function uploadImage(event: Event, target: string, index?: number): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !props.uploadMediaHref || !props.canManage) return;

    uploading.value = index === undefined ? target : `override-${index}`;

    try {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch(props.uploadMediaHref, {
            method: 'POST',
            body,
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrf(),
            },
        });

        if (!response.ok) throw new Error('The image upload failed.');

        const payload = await response.json() as { url?: string };
        if (!payload.url) throw new Error('The image upload returned no URL.');

        if (index === undefined) {
            (form.content as unknown as Record<string, unknown>)[target] = payload.url;
        } else if (form.content.overrides[index]) {
            form.content.overrides[index].value = payload.url;
        }
    } catch (error) {
        form.setError('content', error instanceof Error ? error.message : 'The image upload failed.');
    } finally {
        uploading.value = null;
        input.value = '';
    }
}

function replacePreviewText(element: Element | null, value: string): void {
    if (!element || !value) return;
    const walker = element.ownerDocument?.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node = walker?.nextNode() as Text | null;

    while (node) {
        textNodes.push(node);
        node = walker?.nextNode() as Text | null;
    }

    if (textNodes.length) {
        textNodes[0].nodeValue = value;
        textNodes.slice(1).forEach((textNode) => {
            textNode.nodeValue = '';
        });
    } else {
        element.textContent = value;
    }
}

function previewHeroContainer(document: Document, heading: Element | null): Element | null {
    if (!heading) return null;

    const semantic = heading.closest('section, [class*="hero" i], [id*="hero" i]');
    if (semantic) return semantic;

    let ancestor = heading.parentElement;
    for (let depth = 0; ancestor && depth < 6; depth += 1, ancestor = ancestor.parentElement) {
        if (ancestor.querySelector('a[href], img, picture')) return ancestor;
    }

    return heading.parentElement;
}

function previewOverride(element: PreviewElement): LandingOverride | undefined {
    return form.content.overrides.find((override) => override.selector === element.selector);
}

function previewValue(element: PreviewElement): string {
    return previewOverride(element)?.value || element.value;
}

function updatePreviewOverride(element: PreviewElement, value: string): void {
    const index = previewOverrideIndex(element);
    const override = form.content.overrides[index];

    if (override) override.value = value;
}

function seedCommonFieldsFromPreview(document: Document): void {
    const slug = form.selected;

    if (seededPreviewSlugs.has(slug)) return;

    // Do not replace values that an administrator has already edited while
    // the imported app is hydrating. A pristine form is the only safe time to
    // copy the source document into the named fields.
    const sourceForm = props.contentBySlug[slug] ?? props.content;
    if (JSON.stringify(form.content) !== JSON.stringify(sourceForm)) return;

    const heading = document.querySelector('h1');
    const hero = previewHeroContainer(document, heading);
    const brand = document.querySelector('header a, nav a, a');
    const text = (element: Element | null): string => (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

    // The outer document exists before the imported React app hydrates. Never
    // consume that transient state as the source snapshot.
    if (!heading && !brand) return;

    const allLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
    const heroLinks = hero ? Array.from(hero.querySelectorAll<HTMLAnchorElement>('a[href]')) : [];
    const fallbackLinks = allLinks.filter((link) => {
        const label = text(link);
        return label !== '' && !/^(PanelKit|ShadcnStore)$/i.test(label);
    });
    const ctaLinks = heroLinks.length ? heroLinks : fallbackLinks;
    const primaryLink = ctaLinks.find((link) => /get started|start free|try (it|now)|sign up|register/i.test(text(link)))
        ?? ctaLinks[0];
    const secondaryLink = ctaLinks.find((link) => /watch|demo|learn more|view/i.test(text(link)))
        ?? ctaLinks[1];
    const allImages = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    const heroImages = allImages.filter((image) => {
        const alt = image.getAttribute('alt') ?? '';
        return /hero|preview|dashboard/i.test(alt);
    });
    const socialImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"], meta[name="twitter:image"]');
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    const siteName = text(brand);
    const headline = text(heading);
    const eyebrow = text(hero?.querySelector('span, small') ?? null);
    const description = text(hero?.querySelector('p') ?? null);

    if (siteName) form.content.siteName = siteName;
    if (headline) form.content.headline = headline;
    if (eyebrow) form.content.eyebrow = eyebrow;
    if (description) form.content.description = description;
    if (primaryLink) form.content.primaryLabel = text(primaryLink) || form.content.primaryLabel;
    if (secondaryLink) form.content.secondaryLabel = text(secondaryLink) || form.content.secondaryLabel;
    if (heroImages[0]?.src) form.content.heroImageUrl = heroImages[0].getAttribute('src') ?? heroImages[0].src;
    if (socialImage?.content) form.content.socialImageUrl = socialImage.content;
    if (document.title) form.content.seoTitle = document.title;
    if (descriptionMeta?.content) form.content.seoDescription = descriptionMeta.content;

    seededPreviewSlugs.add(slug);
    seededContentBySlug.value[slug] = JSON.parse(JSON.stringify(form.content)) as LandingContent;
}

function previewDocument(): Document | null {
    const outer = previewFrame.value?.contentDocument;
    const nested = outer?.querySelector<HTMLIFrameElement>('#panelkit-public-landing');

    return nested?.contentDocument ?? outer ?? null;
}

function applyPreviewDraft(): void {
    const document = previewDocument();
    if (!document) return;

    const heading = document.querySelector('h1');
    const hero = previewHeroContainer(document, heading);
    const commonContentReady = props.contentIsCustomBySlug[form.selected]
        || seededPreviewSlugs.has(form.selected);

    if (commonContentReady) {
        replacePreviewText(document.querySelector('header a, nav a, a'), form.content.siteName);
        replacePreviewText(heading, form.content.headline);
        replacePreviewText(hero?.querySelector('span, small') ?? null, form.content.eyebrow);
        replacePreviewText(hero?.querySelector('p') ?? null, form.content.description);
    }

    if (form.content.logoUrl) {
        document.querySelectorAll('header img, nav img, img[alt*="logo" i], [data-panelkit-logo]').forEach((image) => {
            image.setAttribute('src', form.content.logoUrl);
            image.removeAttribute('srcset');
            image.setAttribute('alt', form.content.siteName);
        });
    }

    if (form.content.heroImageUrl) {
        hero?.querySelectorAll('img, picture source').forEach((image) => {
            image.setAttribute(image.tagName === 'SOURCE' ? 'srcset' : 'src', form.content.heroImageUrl);
            image.removeAttribute('srcset');
        });
    }

    form.content.overrides.forEach((override) => {
        if (!override.selector || !override.value) return;

        try {
            document.querySelectorAll(override.selector).forEach((element) => {
                if (override.type === 'image') {
                    element.setAttribute('src', override.value);
                    element.removeAttribute('srcset');
                    if (override.alt) element.setAttribute('alt', override.alt);
                } else if (override.type === 'link') {
                    element.setAttribute('href', override.value);
                } else {
                    replacePreviewText(element, override.value);
                }
            });
        } catch {
            // The server ignores invalid selectors too; the preview should stay usable.
        }
    });
}

function scanPreview(): void {
    const document = previewDocument();
    if (!document) return;

    const elements: PreviewElement[] = [];

    document.querySelectorAll<HTMLElement>('[data-panelkit-slot]').forEach((element) => {
        const slot = element.dataset.panelkitSlot;
        if (!slot) return;

        const rect = element.getBoundingClientRect();
        const value = element.tagName === 'IMG'
            ? element.getAttribute('src') ?? ''
            : (element.textContent ?? '').replace(/\s+/g, ' ').trim();

        if ((rect.width === 0 && rect.height === 0) || !value) return;

        const type: PreviewElement['type'] = element.tagName === 'IMG'
            ? 'image'
            : element.tagName === 'A'
                ? 'link'
                : 'text';

        elements.push({
            slot,
            selector: `[data-panelkit-slot="${slot}"]`,
            type,
            label: type === 'image' ? 'Image' : type === 'link' ? 'Link' : element.tagName.toLowerCase(),
            value,
            alt: element.getAttribute('alt') ?? '',
        });
    });

    previewElements.value = elements;
    previewLoading.value = false;
    seedCommonFieldsFromPreview(document);
    applyPreviewDraft();
}

function schedulePreviewScan(): void {
    previewLoading.value = true;
    window.setTimeout(scanPreview, 150);
    window.setTimeout(scanPreview, 600);
    window.setTimeout(scanPreview, 1400);
}

function addPreviewOverride(element: PreviewElement): void {
    const existing = form.content.overrides.find(
        (override) => override.selector === element.selector,
    );

    if (existing) {
        existing.value = element.value;
        existing.alt = element.alt;
        return;
    }

    form.content.overrides.push({
        label: `${element.label} ${element.slot.split('-').at(-1) ?? ''}`.trim(),
        selector: element.selector,
        type: element.type,
        value: element.value,
        alt: element.alt,
    });
}

function previewOverrideIndex(element: PreviewElement): number {
    const existing = form.content.overrides.findIndex(
        (override) => override.selector === element.selector,
    );

    if (existing >= 0) return existing;

    addPreviewOverride(element);

    return form.content.overrides.length - 1;
}

watch(() => form.selected, () => {
    previewElements.value = [];
    schedulePreviewScan();
});
watch(() => form.content, applyPreviewDraft, { deep: true });
onMounted(schedulePreviewScan);
</script>

<template>
    <Head :title="props.pageHeading ?? 'Landing page'" />

    <div
        :class="[
            PAGE_SHELL,
            CATALOGUE_CONTAINER,
            'flex flex-col gap-6 pb-10',
        ]"
    >
        <header
            class="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-6"
        >
            <div class="max-w-3xl space-y-2">
                <div
                    class="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-primary uppercase"
                >
                    <LayoutTemplate class="size-4" />
                    <span>Website CMS</span>
                </div>
                <div>
                    <h1 class="text-2xl font-semibold tracking-tight">
                        {{ props.pageHeading ?? 'Landing page' }}
                    </h1>
                    <p class="mt-1 text-sm leading-6 text-muted-foreground">
                        {{ props.pageDescription }}
                    </p>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <PkBadge
                    :variant="isPublished ? 'secondary' : 'outline'"
                    class="w-fit shrink-0"
                >
                    {{ isPublished ? 'Published' : 'Draft changes' }}
                </PkBadge>
                <PkButton
                    as="a"
                    href="/"
                    variant="ghost"
                    size="sm"
                    class="gap-1.5"
                >
                    View public site
                    <ExternalLink class="size-3.5" />
                </PkButton>
            </div>
        </header>

        <div
            v-if="form.errors.selected"
            class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
            {{ form.errors.selected }}
        </div>

        <section
            class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start"
        >
            <div class="space-y-6">
                <article
                    v-if="activeTemplate"
                    class="overflow-hidden rounded-xl border bg-card shadow-sm"
                >
                    <div
                        :class="[
                            'relative flex min-h-40 items-end overflow-hidden bg-gradient-to-br p-6',
                            activeTemplate.accent,
                        ]"
                    >
                        <div
                            class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_38%)]"
                        />
                        <div
                            class="absolute -right-8 -bottom-12 size-44 rounded-full border border-white/20 bg-white/10 blur-[1px]"
                        />
                        <div class="relative flex items-end justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex size-11 items-center justify-center rounded-lg border border-white/20 bg-background/70 text-foreground shadow-sm backdrop-blur"
                                >
                                    <component
                                        :is="iconFor[activeTemplate.icon] ?? LayoutTemplate"
                                        class="size-5"
                                    />
                                </div>
                                <div>
                                    <p
                                        class="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
                                    >
                                        Active design
                                    </p>
                                    <h2 class="text-xl font-semibold tracking-tight">
                                        {{ activeTemplate.title }}
                                    </h2>
                                </div>
                            </div>
                            <PkBadge variant="secondary" class="hidden sm:inline-flex">
                                Public preset
                            </PkBadge>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 p-5 sm:p-6">
                        <p class="text-sm leading-6 text-muted-foreground">
                            {{ activeTemplate.description }}
                        </p>
                        <div class="flex flex-wrap items-center gap-2">
                            <PkButton
                                as="a"
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                variant="outline"
                                size="sm"
                                class="gap-1.5"
                            >
                                Preview full page
                                <ArrowUpRight class="size-3.5" />
                            </PkButton>
                            <span class="text-xs text-muted-foreground">
                                Opens outside the dashboard shell
                            </span>
                        </div>
                    </div>
                </article>

                <section class="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div class="flex flex-wrap items-start justify-between gap-3 border-b p-5 sm:p-6">
                        <div>
                            <div class="flex items-center gap-2 text-sm font-semibold">
                                <ExternalLink class="size-4 text-primary" />
                                Live page content
                            </div>
                            <p class="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                                This is the actual imported landing page. The editor inventory below is read from its rendered DOM, so the CMS and the published design stay aligned.
                            </p>
                        </div>
                        <PkBadge variant="outline" class="shrink-0">
                            {{ previewElements.length }} editable elements
                        </PkBadge>
                    </div>
                    <div class="bg-muted/20 p-3 sm:p-4">
                        <div class="relative">
                            <iframe
                            v-if="previewUrl"
                            ref="previewFrame"
                            :key="previewUrl"
                            :src="previewUrl"
                            title="Actual imported landing page preview"
                            class="h-[520px] w-full rounded-lg border bg-background"
                            @load="schedulePreviewScan"
                            />
                            <div v-if="previewLoading" class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg border bg-background/80 text-sm text-muted-foreground backdrop-blur-sm">
                                Loading the actual landing page…
                            </div>
                        </div>
                    </div>
                    <div class="border-t p-5 sm:p-6">
                        <div class="mb-3">
                            <p class="text-sm font-semibold">Content found in this design</p>
                            <p class="mt-1 text-xs leading-5 text-muted-foreground">
                                Select Edit to add a real override for the exact element shown above. Changes are applied to the live preview immediately and to the public page after publishing.
                            </p>
                        </div>
                        <div v-if="previewElements.length" class="grid max-h-80 gap-2 overflow-y-auto pr-1">
                            <div v-for="element in previewElements" :key="element.slot" class="flex items-center gap-3 rounded-lg border bg-background px-3 py-2">
                                <img v-if="element.type === 'image'" :src="previewValue(element)" :alt="element.alt" class="size-10 shrink-0 rounded-md border object-cover" />
                                <PkBadge variant="outline" class="w-20 justify-center text-[10px] uppercase">
                                    {{ element.type }}
                                </PkBadge>
                                <div class="min-w-0 flex-1">
                                    <textarea
                                        v-if="element.type !== 'image'"
                                        :value="previewValue(element)"
                                        rows="1"
                                        class="min-h-8 w-full resize-y rounded-md border bg-background px-2 py-1 text-sm leading-5 outline-none focus:border-primary"
                                        @focus="addPreviewOverride(element)"
                                        @input="updatePreviewOverride(element, ($event.target as HTMLTextAreaElement).value)"
                                    />
                                    <input
                                        v-else
                                        :value="previewValue(element)"
                                        type="url"
                                        class="w-full rounded-md border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
                                        @focus="addPreviewOverride(element)"
                                        @input="updatePreviewOverride(element, ($event.target as HTMLInputElement).value)"
                                    />
                                    <p class="truncate font-mono text-[10px] text-muted-foreground">{{ element.selector }}</p>
                                </div>
                                <PkButton
                                    v-if="props.canManage"
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    @click="addPreviewOverride(element)"
                                >
                                    Map
                                </PkButton>
                                <input
                                    v-if="element.type === 'image' && props.canManage"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    class="max-w-28 text-[10px] text-muted-foreground file:mr-1 file:rounded file:border-0 file:bg-muted file:px-1.5 file:py-1 file:text-[10px]"
                                    :disabled="!!uploading"
                                    @change="uploadImage($event, 'override', previewOverrideIndex(element))"
                                />
                            </div>
                        </div>
                        <p v-else class="rounded-lg border border-dashed px-3 py-4 text-xs text-muted-foreground">
                            The imported app has not exposed editable DOM nodes yet. Wait for the preview to finish loading or choose another design.
                        </p>
                    </div>
                </section>

                <details class="group rounded-xl border bg-card shadow-sm">
                    <summary
                        class="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden sm:p-6"
                    >
                        <span class="flex items-center gap-2 text-sm font-semibold">
                            <LayoutTemplate class="size-4 text-primary" />
                            Change landing design
                        </span>
                        <ChevronDown
                            class="size-4 text-muted-foreground transition-transform group-open:rotate-180"
                        />
                    </summary>
                    <div class="grid gap-3 border-t p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                        <button
                            v-for="template in props.templates"
                            :key="template.slug"
                            type="button"
                            class="flex items-start gap-3 rounded-lg border p-3 text-left transition hover:border-primary/50 hover:bg-muted/40"
                            :class="form.selected === template.slug ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : ''"
                            @click="selectTemplate(template.slug)"
                        >
                            <span
                                :class="[
                                    'flex size-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br',
                                    template.accent,
                                ]"
                            >
                                <component
                                    :is="iconFor[template.icon] ?? LayoutTemplate"
                                    class="size-4"
                                />
                            </span>
                            <span class="min-w-0">
                                <span class="flex items-center gap-1.5 text-sm font-medium">
                                    {{ template.title }}
                                    <Check
                                        v-if="form.selected === template.slug"
                                        class="size-3.5 text-primary"
                                    />
                                </span>
                                <span class="mt-0.5 block text-xs leading-5 text-muted-foreground">
                                    {{ template.eyebrow }}
                                </span>
                            </span>
                        </button>
                    </div>
                </details>

                <section class="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
                    <div class="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <div class="flex items-center gap-2 text-sm font-semibold">
                                <PenLine class="size-4 text-primary" />
                                Landing content
                            </div>
                            <p class="mt-1 text-sm text-muted-foreground">
                                These values are owned by the host application and are safe to change without editing the imported design source.
                            </p>
                        </div>
                        <PkBadge variant="outline" class="hidden sm:inline-flex">
                            Draft editor
                        </PkBadge>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        <label class="space-y-1.5 sm:col-span-2">
                            <span class="text-sm font-medium">Site name</span>
                            <input v-model="form.content.siteName" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="80" />
                        </label>
                        <label class="space-y-1.5 sm:col-span-2">
                            <span class="text-sm font-medium">Eyebrow</span>
                            <input v-model="form.content.eyebrow" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="120" />
                        </label>
                        <label class="space-y-1.5 sm:col-span-2">
                            <span class="text-sm font-medium">Headline</span>
                            <input v-model="form.content.headline" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="160" />
                        </label>
                        <label class="space-y-1.5 sm:col-span-2">
                            <span class="text-sm font-medium">Description</span>
                            <textarea v-model="form.content.description" rows="3" class="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="320" />
                        </label>
                        <div class="space-y-3 sm:col-span-2">
                            <div>
                                <p class="text-sm font-medium">Brand and media</p>
                                <p class="mt-1 text-xs leading-5 text-muted-foreground">
                                    These image slots are applied to the actual imported document. Use a hosted URL or upload a JPG, PNG, WebP, or GIF.
                                </p>
                            </div>
                            <div class="grid gap-4 sm:grid-cols-3">
                                <label class="space-y-1.5">
                                    <span class="text-xs font-medium">Logo image URL</span>
                                    <input v-model="form.content.logoUrl" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="2048" />
                                    <div v-if="form.content.logoUrl" class="flex min-h-20 items-center justify-center overflow-hidden rounded-md border bg-muted/30 p-2">
                                        <img :src="form.content.logoUrl" :alt="`${form.content.siteName} logo`" class="max-h-16 max-w-full object-contain" />
                                    </div>
                                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs" :disabled="!!uploading" @change="uploadImage($event, 'logoUrl')" />
                                </label>
                                <label class="space-y-1.5">
                                    <span class="text-xs font-medium">Hero image URL</span>
                                    <input v-model="form.content.heroImageUrl" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="2048" />
                                    <div v-if="form.content.heroImageUrl" class="overflow-hidden rounded-md border bg-muted/30">
                                        <img :src="form.content.heroImageUrl" :alt="`${form.content.siteName} hero image`" class="aspect-video w-full object-cover" />
                                    </div>
                                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs" :disabled="!!uploading" @change="uploadImage($event, 'heroImageUrl')" />
                                </label>
                                <label class="space-y-1.5">
                                    <span class="text-xs font-medium">Social preview image URL</span>
                                    <input v-model="form.content.socialImageUrl" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="2048" />
                                    <div v-if="form.content.socialImageUrl" class="overflow-hidden rounded-md border bg-muted/30">
                                        <img :src="form.content.socialImageUrl" :alt="`${form.content.siteName} social preview`" class="aspect-video w-full object-cover" />
                                    </div>
                                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs" :disabled="!!uploading" @change="uploadImage($event, 'socialImageUrl')" />
                                </label>
                            </div>
                        </div>
                        <label class="space-y-1.5">
                            <span class="text-sm font-medium">Primary button</span>
                            <input v-model="form.content.primaryLabel" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="60" />
                        </label>
                        <label class="space-y-1.5">
                            <span class="text-sm font-medium">Primary link</span>
                            <input v-model="form.content.primaryHref" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="2048" />
                        </label>
                        <label class="space-y-1.5">
                            <span class="text-sm font-medium">Secondary button</span>
                            <input v-model="form.content.secondaryLabel" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="60" />
                        </label>
                        <label class="space-y-1.5">
                            <span class="text-sm font-medium">Secondary link</span>
                            <input v-model="form.content.secondaryHref" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="2048" />
                        </label>
                        <div class="space-y-3 border-t pt-5 sm:col-span-2">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p class="text-sm font-medium">Visual overrides</p>
                                    <p class="mt-1 text-xs leading-5 text-muted-foreground">
                                        Edit any rendered text, image, or link in the selected design by targeting its CSS selector. Overrides are applied after the imported app hydrates.
                                    </p>
                                </div>
                                <PkButton type="button" variant="outline" size="sm" @click="addOverride">
                                    Add override
                                </PkButton>
                            </div>
                            <div v-if="form.content.overrides.length === 0" class="rounded-lg border border-dashed px-3 py-4 text-xs text-muted-foreground">
                                No custom overrides yet. Use the named fields above for common content, or add an override for any page element.
                            </div>
                            <div v-for="(override, index) in form.content.overrides" :key="index" class="grid gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-[1fr_1.4fr_110px_1.5fr_auto] sm:items-end">
                                <label class="space-y-1.5">
                                    <span class="text-xs font-medium">Label</span>
                                    <input v-model="override.label" placeholder="Hero title" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="80" />
                                </label>
                                <label class="space-y-1.5">
                                    <span class="text-xs font-medium">CSS selector</span>
                                    <input v-model="override.selector" placeholder="section.hero h1" class="w-full rounded-md border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="240" />
                                </label>
                                <label class="space-y-1.5">
                                    <span class="text-xs font-medium">Type</span>
                                    <select v-model="override.type" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                        <option value="text">Text</option>
                                        <option value="image">Image</option>
                                        <option value="link">Link</option>
                                    </select>
                                </label>
                                <label class="space-y-1.5">
                                    <span class="text-xs font-medium">Value</span>
                                    <input v-model="override.value" :placeholder="override.type === 'image' ? '/storage/landing-media/hero.webp' : 'New content'" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="2048" />
                                    <input v-if="override.type === 'image'" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs" :disabled="!!uploading" @change="uploadImage($event, 'override', index)" />
                                </label>
                                <PkButton type="button" variant="ghost" size="sm" class="text-destructive hover:text-destructive" @click="removeOverride(index)">
                                    Remove
                                </PkButton>
                                <label v-if="override.type === 'image'" class="space-y-1.5 sm:col-span-2">
                                    <span class="text-xs font-medium">Image alt text</span>
                                    <input v-model="override.alt" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="160" />
                                </label>
                            </div>
                        </div>
                        <label class="space-y-1.5 sm:col-span-2">
                            <span class="text-sm font-medium">SEO title</span>
                            <input v-model="form.content.seoTitle" class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="160" />
                        </label>
                        <label class="space-y-1.5 sm:col-span-2">
                            <span class="text-sm font-medium">SEO description</span>
                            <textarea v-model="form.content.seoDescription" rows="2" class="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="320" />
                        </label>
                    </div>
                </section>
            </div>

            <aside class="space-y-4 xl:sticky xl:top-6">
                <div class="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
                    <div class="flex items-center gap-2 text-sm font-semibold">
                        <Send class="size-4 text-primary" />
                        Publish controls
                    </div>
                    <p class="mt-2 text-sm leading-6 text-muted-foreground">
                        Save changes as a draft first. Publishing makes this one design and its approved content the public site at <code class="rounded bg-muted px-1 py-0.5 text-xs">/</code>.
                    </p>
                    <div v-if="props.canManage" class="mt-5 flex flex-col gap-2">
                        <PkButton
                            :disabled="form.processing"
                            variant="outline"
                            class="w-full"
                            @click="saveDraft"
                        >
                            {{ form.processing ? 'Saving…' : 'Save draft' }}
                        </PkButton>
                        <PkButton
                            :disabled="form.processing"
                            class="w-full gap-2"
                            @click="publish"
                        >
                            <Send class="size-4" />
                            Publish landing page
                        </PkButton>
                    </div>
                    <p v-else class="mt-4 text-sm text-muted-foreground">
                        You can preview the public page, but publishing requires the landing-page management permission.
                    </p>
                </div>

                <div class="rounded-xl border border-dashed bg-muted/20 p-5 text-sm leading-6 text-muted-foreground sm:p-6">
                    <p class="font-medium text-foreground">One public page, many presets</p>
                    <p class="mt-1">
                        Visitors only receive the published design. The other imported pages stay available as reusable starting points inside this editor and never appear as separate public navigation items.
                    </p>
                </div>
            </aside>
        </section>
    </div>
</template>

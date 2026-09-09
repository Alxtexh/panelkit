<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    LayoutTemplate,
    Megaphone,
    Package,
    Sparkles,
} from '@lucide/vue';
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

const props = defineProps<{
    pageHeading?: string;
    pageDescription?: string | null;
    templates: LandingTemplate[];
    defaultSlug: string;
}>();

const iconFor: Record<string, any> = {
    megaphone: Megaphone,
    package: Package,
    sparkles: Sparkles,
    'layout-template': LayoutTemplate,
};

function previewHref(slug: string): string {
    return `/?preview=${encodeURIComponent(slug)}`;
}
</script>

<template>
    <Head :title="props.pageHeading ?? 'Landing pages'" />

    <div :class="[PAGE_SHELL, CATALOGUE_CONTAINER, 'flex flex-col gap-6 pb-10']">
        <header class="flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
            <div class="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-primary uppercase">
                <LayoutTemplate class="size-4" />
                <span>Imported designs</span>
            </div>
            <h1 class="text-2xl font-semibold tracking-tight">
                {{ props.pageHeading ?? 'Landing pages' }}
            </h1>
            <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
                {{ props.pageDescription }}
            </p>
        </header>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article
                v-for="template in props.templates"
                :key="template.slug"
                class="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
            >
                <div
                    :class="[
                        'relative flex min-h-24 items-center overflow-hidden bg-gradient-to-br px-5 py-4',
                        template.accent,
                    ]"
                >
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_38%)]" />
                    <div class="relative flex size-11 items-center justify-center rounded-lg border border-white/20 bg-background/70 text-foreground shadow-sm backdrop-blur">
                        <component :is="iconFor[template.icon] ?? LayoutTemplate" class="size-5" />
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-base font-semibold">{{ template.title }}</h2>
                            <PkBadge v-if="template.slug === props.defaultSlug" variant="secondary">
                                Live
                            </PkBadge>
                        </div>
                        <p class="mt-0.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {{ template.eyebrow }}
                        </p>
                    </div>
                    <p class="flex-1 text-sm leading-6 text-muted-foreground">
                        {{ template.description }}
                    </p>
                    <PkButton
                        as="a"
                        :href="previewHref(template.slug)"
                        target="_blank"
                        rel="noreferrer"
                        variant="outline"
                        size="sm"
                        class="gap-1.5 self-start"
                    >
                        Preview
                        <ArrowUpRight class="size-3.5" />
                    </PkButton>
                </div>
            </article>
        </div>

        <div class="rounded-xl border border-dashed bg-muted/20 p-5 text-sm leading-6 text-muted-foreground sm:p-6">
            <p class="font-medium text-foreground">Choosing the live design</p>
            <p class="mt-1">
                The public site at <code class="rounded bg-muted px-1 py-0.5 text-xs">/</code> always serves one preset directly, unmodified. Which one is live is set in code
                (<code class="rounded bg-muted px-1 py-0.5 text-xs">Pages::LANDING_DEFAULT</code>), not from this screen.
            </p>
        </div>
    </div>
</template>

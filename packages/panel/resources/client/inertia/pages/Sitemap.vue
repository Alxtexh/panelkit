<script setup lang="ts">
/*
 * EVERY PAGE PROP ARRIVES AS AN ATTRIBUTE, and this page's root is a
 * fragment. Inertia binds the whole payload onto the page component -
 * declared props bind as props, and the shared ones (panelNav, auth,
 * locale, and every deferred prop as it lands) arrive as plain
 * attributes with nowhere to go. Vue then warns once per prop, per
 * visit, which reads exactly like the page reloading in a loop.
 */
defineOptions({ inheritAttrs: false })

/**
 * What this installation currently tells search engines is public, and a
 * button to write it to disk.
 *
 * WHY THERE IS NO CRAWLER AND NO "ADD URL" FORM HERE. Every general sitemap
 * tool assumes a multi-page public site with content types to describe -
 * this screen assumes an admin panel with ONE public surface it can already
 * prove: the landing page, if one is routed. Anything past that is added in
 * code, with `Sitemap::add()` or `Sitemap::source()`, because a URL a
 * plugin or the application registers is a URL somebody decided belongs in
 * public search results - not a decision this screen should make by
 * offering a text box.
 *
 * DECLARED AND WRITTEN CAN DISAGREE, and the screen says so rather than
 * picking one. `urls` is what `Sitemap::urls()` returns right now; `exists`
 * and `generatedAt` describe the file on disk from the last time somebody
 * pressed Regenerate. Adding a URL does not rewrite the file - the button
 * does.
 *
 * THE REACH LINE ANSWERS "who actually finds this" rather than leaving it
 * implied by the file existing. `robotsTxtReferencesIt` is what makes the
 * sitemap discoverable to Google, Bing, Yandex, DuckDuckGo and the AI
 * crawlers whose own published guidance says the same thing - none of them
 * needs a submission if they can already find the `Sitemap:` line.
 * `indexNowConfigured` is the one instant-notify mechanism still alive
 * (Bing, Yandex, Naver, Seznam) - Google's own ping endpoint has 404'd since
 * June 2023, which is why nothing here offers to call it.
 */
import { Head, router, usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { PAGE_SHELL, PkButton as Button } from '@alxtexh-enterprise/panel'

type Url = {
    loc: string
    lastmod: string | null
    changefreq: string | null
    priority: number | null
}

const props = withDefaults(
    defineProps<{
        urls?: Url[]
        exists?: boolean
        generatedAt?: string | null
        filename?: string
        maxPerFile?: number
        willSplit?: boolean
        robotsTxtReferencesIt?: boolean
        indexNowConfigured?: boolean
        pageHeading?: string
        pageDescription?: string | null
    }>(),
    {
        urls: () => [],
        exists: false,
        generatedAt: null,
        filename: 'sitemap.xml',
        maxPerFile: 50_000,
        willSplit: false,
        robotsTxtReferencesIt: false,
        indexNowConfigured: false,
        pageHeading: 'Sitemap',
        pageDescription: null,
    },
)

const page = usePage()

/** The panel's own prefix - see `settings/Organisation.vue` for why this is not a generated route. */
const base = computed(() => (page.props.panel as { path?: string } | undefined)?.path ?? '')
const at = (path: string) => `${base.value === '/' ? '' : base.value}${path}`

const generating = ref(false)

const generate = () => {
    generating.value = true

    router.post(
        at('/sitemap/generate'),
        {},
        { preserveScroll: true, onFinish: () => (generating.value = false) },
    )
}

const formattedGeneratedAt = computed(() =>
    props.generatedAt
        ? new Date(props.generatedAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
          })
        : null,
)

const stale = computed(() => props.exists && props.urls.length === 0)
</script>

<template>
    <Head :title="pageHeading" />

    <div :class="[PAGE_SHELL, 'flex flex-col gap-4']">
        <header>
            <h1 class="text-xl font-semibold tracking-tight">{{ pageHeading }}</h1>
            <p v-if="pageDescription" class="text-muted-foreground mt-1 text-sm">
                {{ pageDescription }}
            </p>
        </header>

        <!-- Design rule: status first, the list of what it covers second, the action last. -->
        <div
            class="bg-muted/40 flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
        >
            <p class="text-muted-foreground">
                <template v-if="exists">
                    <span class="text-foreground font-medium">{{ urls.length }}</span> URL{{
                        urls.length === 1 ? '' : 's'
                    }}
                    declared · last written
                    <span class="text-foreground font-medium">{{ formattedGeneratedAt }}</span>
                    to <code class="font-mono text-xs">{{ filename }}</code>
                </template>
                <template v-else>
                    <span class="text-foreground font-medium">{{ urls.length }}</span> URL{{
                        urls.length === 1 ? '' : 's'
                    }}
                    declared · never written
                </template>
            </p>

            <Button size="sm" :disabled="generating" @click="generate">
                {{ generating ? 'Writing…' : exists ? 'Regenerate' : 'Generate' }}
            </Button>
        </div>

        <!--
            WHO ACTUALLY FINDS THIS, stated rather than assumed. A file that
            exists and is never referenced from anywhere a crawler looks is
            indistinguishable from no file at all - it just fails silently
            instead of loudly.
        -->
        <ul class="text-muted-foreground flex flex-col gap-1 text-sm">
            <li class="flex items-center gap-1.5">
                <span
                    :class="robotsTxtReferencesIt ? 'text-emerald-600' : 'text-muted-foreground'"
                    >{{ robotsTxtReferencesIt ? '✓' : '—' }}</span
                >
                Referenced from <code class="font-mono text-xs">robots.txt</code> - how Google,
                Bing, Yandex, DuckDuckGo and AI crawlers find it without a manual submission.
                <template v-if="!robotsTxtReferencesIt">Regenerate to add the line.</template>
            </li>
            <li class="flex items-center gap-1.5">
                <span :class="indexNowConfigured ? 'text-emerald-600' : 'text-muted-foreground'">{{
                    indexNowConfigured ? '✓' : '—'
                }}</span>
                <template v-if="indexNowConfigured">
                    IndexNow notifies Bing, Yandex, Naver and Seznam the moment this is regenerated.
                </template>
                <template v-else>
                    IndexNow not configured - set
                    <code class="font-mono text-xs">PANEL_INDEXNOW_KEY</code> for instant
                    notification to Bing, Yandex, Naver and Seznam. Google does not support it;
                    submit there through Search Console.
                </template>
            </li>
        </ul>

        <p
            v-if="willSplit"
            class="border-amber-500/40 bg-amber-500/5 rounded-lg border p-3 text-sm"
        >
            More than {{ maxPerFile.toLocaleString() }} URLs are declared - the sitemaps.org
            protocol caps a single file there, so this writes an index (<code
                class="font-mono text-xs"
                >{{ filename }}</code
            >) alongside the numbered parts that actually hold them.
        </p>

        <!--
            DECLARED IS NOT THE SAME AS ON DISK, said in the interface rather
            than only in the status line above - a file that exists but no
            longer matches what is declared reads as "up to date" until this
            says otherwise.
        -->
        <p
            v-if="stale"
            class="border-destructive/40 bg-destructive/5 rounded-lg border p-3 text-sm"
        >
            Nothing is declared any more, but a previous sitemap is still on disk at
            <code class="font-mono text-xs">{{ filename }}</code
            >. Regenerating writes an empty <code class="font-mono text-xs">&lt;urlset&gt;</code>.
        </p>

        <div v-if="urls.length" class="overflow-x-auto rounded-lg border">
            <table class="w-full text-sm">
                <thead class="bg-muted/40 text-muted-foreground text-xs uppercase">
                    <tr>
                        <th class="px-3 py-2 text-left font-medium">URL</th>
                        <th class="px-3 py-2 text-left font-medium">Last modified</th>
                        <th class="px-3 py-2 text-left font-medium">Change frequency</th>
                        <th class="px-3 py-2 text-left font-medium">Priority</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="url in urls" :key="url.loc">
                        <td class="max-w-xs truncate px-3 py-2 font-mono text-xs" :title="url.loc">
                            {{ url.loc }}
                        </td>
                        <td class="text-muted-foreground px-3 py-2 text-xs">
                            {{ url.lastmod ? new Date(url.lastmod).toLocaleDateString() : '—' }}
                        </td>
                        <td class="text-muted-foreground px-3 py-2 text-xs">
                            {{ url.changefreq ?? '—' }}
                        </td>
                        <td class="text-muted-foreground px-3 py-2 text-xs">
                            {{ url.priority ?? '—' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else class="text-muted-foreground text-sm font-normal">
            Nothing is declared. Add public URLs with
            <code class="font-mono text-xs">Sitemap::add()</code> or
            <code class="font-mono text-xs">Sitemap::source()</code> from your own service provider.
        </p>
    </div>
</template>

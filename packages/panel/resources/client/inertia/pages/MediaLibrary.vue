<script setup lang="ts">
/**
 * Tenant media library. Props and action hrefs from MediaLibraryPage.
 * Upload / move / delete post to page actions; no client-side fetch.
 */
import { Head, router, useForm, usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import {
    FORM_MEASURE,
    PAGE_SHELL_STACK,
    PkButton as Button,
    PkEmptyState,
    PkModal,
    PkPageHeader,
    TableShell,
} from '@alxtexh-enterprise/panel'

defineOptions({ inheritAttrs: false })

interface MediaItem {
    id: number
    name: string
    path?: string
    mime?: string | null
    size?: number | null
    folder?: string
    url?: string | null
    download_url?: string | null
    is_image?: boolean
}

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        pageDescription?: string | null
        folder?: string
        folders?: string[]
        items?: MediaItem[]
        uploadHref?: string
        moveHref?: string
        deleteHref?: string
    }>(),
    {
        folder: '',
        folders: () => [],
        items: () => [],
        uploadHref: '/files/media-library/upload',
        moveHref: '/files/media-library/move',
        deleteHref: '/files/media-library/delete',
    },
)

const page = usePage()
const showUpload = ref(false)
const movingId = ref<number | null>(null)
const moveFolder = ref('')
const pendingDeleteId = ref<number | null>(null)

const uploadForm = useForm<{ file: File | null; folder: string }>({
    file: null,
    folder: props.folder ?? '',
})

const indexHref = computed(() => {
    const url = String(page.url ?? '/files/media-library')
    const q = url.indexOf('?')

    return q === -1 ? url : url.slice(0, q)
})

const folderLabel = computed(() => (props.folder ? props.folder : 'Root'))

function formatSize(bytes?: number | null): string {
    if (bytes == null || bytes < 0) {
        return '-'
    }

    if (bytes < 1024) {
        return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function openFolder(name: string) {
    router.get(indexHref.value, name === '' ? {} : { folder: name }, {
        preserveState: true,
        preserveScroll: true,
    })
}

function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    uploadForm.file = input.files?.[0] ?? null
}

function submitUpload() {
    uploadForm.folder = props.folder ?? ''
    uploadForm.post(props.uploadHref ?? '/files/media-library/upload', {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
            uploadForm.reset()
            showUpload.value = false
        },
    })
}

function startMove(item: MediaItem) {
    movingId.value = item.id
    moveFolder.value = item.folder ?? props.folder ?? ''
}

function confirmMove() {
    if (movingId.value === null) {
        return
    }

    router.post(
        props.moveHref ?? '/files/media-library/move',
        { id: movingId.value, folder: moveFolder.value },
        {
            preserveScroll: true,
            onSuccess: () => {
                movingId.value = null
                moveFolder.value = ''
            },
        },
    )
}

function requestRemove(id: number) {
    pendingDeleteId.value = id
}

function remove() {
    if (pendingDeleteId.value === null) {
        return
    }

    router.post(
        props.deleteHref ?? '/files/media-library/delete',
        { id: pendingDeleteId.value },
        { preserveScroll: true, onFinish: () => (pendingDeleteId.value = null) },
    )
}
</script>

<template>
    <Head :title="pageHeading ?? 'Media library'" />

    <div :class="PAGE_SHELL_STACK">
        <PkPageHeader
            :title="pageHeading ?? 'Media library'"
            :purpose="
                pageDescription ??
                'Tenant-scoped files. Preview and download use temporary signed URLs when the disk is private.'
            "
        >
            <template #actions>
                <Button type="button" variant="outline" @click="showUpload = !showUpload">
                    {{ showUpload ? 'Cancel' : 'Upload' }}
                </Button>
            </template>
        </PkPageHeader>

        <nav class="flex flex-wrap items-center gap-2 text-sm" aria-label="Folders">
            <Button
                type="button"
                size="sm"
                :variant="folder === '' ? 'secondary' : 'ghost'"
                @click="openFolder('')"
            >
                Root
            </Button>
            <Button
                v-for="name in folders"
                :key="name"
                type="button"
                size="sm"
                :variant="folder === name ? 'secondary' : 'ghost'"
                @click="openFolder(name)"
            >
                {{ name || 'Root' }}
            </Button>
        </nav>

        <form
            v-if="showUpload"
            :class="[FORM_MEASURE, 'space-y-3 rounded-xl border bg-card p-4']"
            @submit.prevent="submitUpload"
        >
            <p class="text-sm text-muted-foreground font-normal">
                Uploading into <span class="font-medium text-foreground">{{ folderLabel }}</span
                >. Files stay on the panel uploads disk (private by default).
            </p>
            <div>
                <label class="text-sm font-medium" for="media-file">File</label>
                <input
                    id="media-file"
                    type="file"
                    class="mt-1 block w-full text-sm"
                    @change="onFileChange"
                />
                <p v-if="uploadForm.errors.file" class="mt-1 text-xs text-destructive">
                    {{ uploadForm.errors.file }}
                </p>
            </div>
            <Button type="submit" :disabled="uploadForm.processing || !uploadForm.file">
                Upload file
            </Button>
        </form>

        <PkEmptyState
            v-if="items.length === 0"
            title="No files in this folder"
            description="Upload a file, or switch folders above. Preview links are temporary signed URLs (or disk temporary URLs). Override MediaLibraryPage::resolveItemUrl() for a host CDN."
            icon="package"
        >
            <template #actions>
                <Button type="button" @click="showUpload = true">Upload</Button>
            </template>
        </PkEmptyState>

        <TableShell v-else>
            <template #title>
                <p class="text-sm font-medium">
                    {{ items.length }} {{ items.length === 1 ? 'file' : 'files' }} in
                    {{ folderLabel }}
                </p>
            </template>

            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead
                        class="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground"
                    >
                        <tr>
                            <th class="px-3 py-2">Name</th>
                            <th class="px-3 py-2">Type</th>
                            <th class="px-3 py-2">Size</th>
                            <th class="px-3 py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in items" :key="row.id" class="border-b last:border-0">
                            <td class="px-3 py-2">
                                <div class="flex items-center gap-3">
                                    <a
                                        v-if="row.url && row.is_image"
                                        :href="row.url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="bg-muted block size-10 shrink-0 overflow-hidden rounded border"
                                    >
                                        <img
                                            :src="row.url"
                                            :alt="row.name"
                                            class="size-full object-cover"
                                        />
                                    </a>
                                    <div
                                        v-else
                                        class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded border text-[10px] font-medium uppercase"
                                    >
                                        {{ row.is_image ? 'img' : 'file' }}
                                    </div>
                                    <div class="min-w-0">
                                        <p class="truncate font-medium">{{ row.name }}</p>
                                        <p
                                            v-if="row.url || row.download_url"
                                            class="text-muted-foreground truncate text-xs"
                                        >
                                            <a
                                                v-if="row.url"
                                                :href="row.url"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="underline-offset-2 hover:underline"
                                            >
                                                Open
                                            </a>
                                            <span v-if="row.url && row.download_url"> · </span>
                                            <a
                                                v-if="row.download_url"
                                                :href="row.download_url"
                                                class="underline-offset-2 hover:underline"
                                            >
                                                Download
                                            </a>
                                        </p>
                                        <p v-else class="text-muted-foreground text-xs font-normal">
                                            Preview URL unavailable for this file.
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="text-muted-foreground px-3 py-2 font-mono text-xs">
                                {{ row.mime ?? '-' }}
                            </td>
                            <td class="text-muted-foreground px-3 py-2">
                                {{ formatSize(row.size) }}
                            </td>
                            <td class="px-3 py-2 text-right">
                                <div class="flex flex-wrap justify-end gap-1">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        @click="startMove(row)"
                                    >
                                        Move
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        @click="requestRemove(row.id)"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </TableShell>

        <div
            v-if="movingId !== null"
            :class="[FORM_MEASURE, 'space-y-3 rounded-xl border bg-card p-4']"
        >
            <p class="text-sm font-medium">Move file #{{ movingId }}</p>
            <div>
                <label class="text-sm font-medium" for="move-folder">Folder</label>
                <input
                    id="move-folder"
                    v-model="moveFolder"
                    type="text"
                    class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Leave empty for root"
                />
            </div>
            <div class="flex gap-2">
                <Button type="button" @click="confirmMove">Save folder</Button>
                <Button type="button" variant="ghost" @click="movingId = null">Cancel</Button>
            </div>
        </div>

        <PkModal
            :open="pendingDeleteId !== null"
            title="Delete file?"
            description="The file will be moved to Trash and can be restored according to your retention policy."
            @close="pendingDeleteId = null"
        >
            <p class="text-sm">Move file <strong>#{{ pendingDeleteId }}</strong> to Trash?</p>
            <template #footer>
                <Button variant="outline" @click="pendingDeleteId = null">Cancel</Button>
                <Button variant="destructive" @click="remove">Move to Trash</Button>
            </template>
        </PkModal>
    </div>
</template>

<script setup lang="ts">
/**
 * SearchAddress – shows current address; type to search OpenStreetMap Nominatim and pick from dropdown.
 * On select, emits coordinates and display name for the map.
 */

interface NominatimResult {
    place_id: number
    lat: string
    lon: string
    display_name: string
    type?: string
}

const props = defineProps<{
    /** Current address to display (e.g. from map or Use My Location) */
    address?: string
    placeholder?: string
}>()

const emit = defineEmits<{
    (e: 'select', data: { lat: number; lng: number; address: string }): void
}>()

const query = ref('')
const suggestions = ref<NominatimResult[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

const displayValue = computed(() => query.value || props.address || '')

watch(() => props.address, (v) => {
    if (v) query.value = ''
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function search() {
    const q = query.value.trim()
    if (!q || q.length < 3) {
        suggestions.value = []
        return
    }
    isLoading.value = true
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`,
            { headers: { 'User-Agent': 'BreadWinners Delivery App' } }
        )
        const data = await res.json()
        suggestions.value = data
        isOpen.value = true
    } catch (err) {
        console.error(err)
        suggestions.value = []
    } finally {
        isLoading.value = false
    }
}

function onInput() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(search, 300)
}

function select(s: NominatimResult) {
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    query.value = ''
    suggestions.value = []
    isOpen.value = false
    emit('select', { lat, lng, address: s.display_name })
}

function onFocus() {
    if (suggestions.value.length) isOpen.value = true
}

function onBlur() {
    setTimeout(() => { isOpen.value = false }, 150)
}
</script>

<template>
    <div class="relative w-full">
        <UInput ref="inputEl" :model-value="displayValue"
            :placeholder="placeholder ?? 'Search address or select on map'" size="lg" class="w-full"
            @update:model-value="(v: string) => { query = v ?? ''; onInput() }" @focus="onFocus" @blur="onBlur" />
        <div v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
            <Icon name="heroicons:arrow-path" class="size-5 animate-spin text-neutral-400" />
        </div>
        <div v-if="isOpen && suggestions.length > 0"
            class="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
            <button v-for="s in suggestions" :key="s.place_id" type="button"
                class="w-full px-4 py-3 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                @mousedown.prevent="select(s)">
                {{ s.display_name }}
            </button>
        </div>
    </div>
</template>

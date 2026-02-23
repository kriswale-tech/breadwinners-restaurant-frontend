<script setup lang="ts">
/**
 * DeliveryMap – map only. Click or drag marker to select location.
 * Emits lat/lng and reverse-geocoded address. Accepts coordinates prop to set marker from parent.
 */

export interface LocationData {
    lat: number
    lng: number
    address: string
}

const props = defineProps<{
    /** When set (e.g. from search or Use My Location), marker and view move here */
    coordinates?: { lat: number; lng: number } | null
    error?: string
}>()

const emit = defineEmits<{
    (e: 'location-selected', data: LocationData): void
}>()

let map: any = null
let marker: any = null
const isLoading = ref(false)

const defaultLat = 5.6037
const defaultLng = -0.1870

async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'BreadWinners Delivery App' } }
    )
    if (!res.ok) throw new Error('Reverse geocoding failed')
    const data = await res.json()
    return data.display_name || `${lat}, ${lng}`
}

async function setMarkerAt(lat: number, lng: number) {
    const L = (await import('leaflet')).default
    if (marker && map) map.removeLayer(marker)
    marker = L.marker([lat, lng], { draggable: true }).addTo(map)
    marker.on('dragend', async (e: any) => {
        const pos = e.target.getLatLng()
        await selectLocation(pos.lat, pos.lng)
    })
    return marker
}

async function selectLocation(lat: number, lng: number) {
    isLoading.value = true
    try {
        await setMarkerAt(lat, lng)
        const address = await reverseGeocode(lat, lng)
        emit('location-selected', { lat, lng, address })
        marker.bindPopup(`<strong>Selected</strong><br>${address}`).openPopup()
    } catch (err) {
        console.error(err)
        const address = `${lat}, ${lng}`
        emit('location-selected', { lat, lng, address })
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    await nextTick()
    if (import.meta.client) await import('leaflet/dist/leaflet.css')
    const L = (await import('leaflet')).default

    map = L.map('delivery-map').setView([defaultLat, defaultLng], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map)

    map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng
        await selectLocation(lat, lng)
    })

    if (props.coordinates) {
        map.setView([props.coordinates.lat, props.coordinates.lng], 15)
        setMarkerAt(props.coordinates.lat, props.coordinates.lng)
    }
})

watch(
    () => props.coordinates,
    (coords) => {
        if (!map || !coords) return
        map.setView([coords.lat, coords.lng], Math.max(map.getZoom(), 15))
        setMarkerAt(coords.lat, coords.lng)
    }
)

onUnmounted(() => {
    if (map) map.remove()
})
</script>

<template>
    <ClientOnly>
        <div class="space-y-2">
            <div class="relative">
                <div id="delivery-map" class="w-full rounded-lg border border-neutral-200 dark:border-neutral-700"
                    :class="error ? 'border-error-500' : ''" style="height: 400px; z-index: 0;" />
                <div v-if="isLoading"
                    class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 rounded-lg z-10">
                    <div class="flex flex-col items-center gap-2">
                        <Icon name="heroicons:arrow-path" class="size-6 animate-spin text-primary-600" />
                        <span class="text-sm text-neutral-600 dark:text-neutral-400">Loading address...</span>
                    </div>
                </div>
            </div>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
                Click on the map or drag the marker to select your delivery location
            </p>
            <p v-if="error" class="text-sm text-error-600 dark:text-error-400 mt-1">{{ error }}</p>
        </div>
        <template #fallback>
            <div class="w-full rounded-lg border border-neutral-200 dark:border-neutral-700" style="height: 400px;">
                <div class="flex items-center justify-center h-full">
                    <Icon name="heroicons:arrow-path" class="size-6 animate-spin text-primary-600" />
                </div>
            </div>
        </template>
    </ClientOnly>
</template>

<style scoped>
#delivery-map {
    min-height: 400px;
}
</style>

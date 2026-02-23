<script setup lang="ts">
/**
 * UseMyLocation – button that requests geolocation and emits coordinates for the map.
 */

const emit = defineEmits<{
    (e: 'location', data: { lat: number; lng: number }): void
}>()

const isLoading = ref(false)
const error = ref<string | null>(null)

function useLocation() {
    if (!import.meta.client || !navigator.geolocation) {
        error.value = 'Geolocation is not supported'
        return
    }
    error.value = null
    isLoading.value = true
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            emit('location', { lat, lng })
            isLoading.value = false
        },
        (err) => {
            error.value = err.message || 'Could not get location'
            isLoading.value = false
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
}
</script>

<template>
    <UButton type="button" icon="heroicons:map-pin" size="lg" color="neutral" variant="outline" :loading="isLoading"
        aria-label="Use my current location" @click="useLocation">
        Use my location
    </UButton>
</template>

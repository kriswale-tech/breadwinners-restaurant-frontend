<script setup lang="ts">
/**
 * DeliveryAddressComponent
 * Encapsulates all delivery address selection: search, use my location, and map.
 * Emits location-selected with address and coordinates for the parent form.
 */

export interface DeliveryLocationData {
    address: string
    coordinates: { lat: number; lng: number }
}

const props = defineProps<{
    address?: string
    coordinates?: { lat: number; lng: number } | null
    error?: string
}>()

const emit = defineEmits<{
    (e: 'location-selected', data: DeliveryLocationData): void
}>()

function handleLocationSelected(data: { lat: number; lng: number; address: string }) {
    emit('location-selected', {
        address: data.address,
        coordinates: { lat: data.lat, lng: data.lng }
    })
}

function handleSearchSelect(data: { lat: number; lng: number; address: string }) {
    emit('location-selected', {
        address: data.address,
        coordinates: { lat: data.lat, lng: data.lng }
    })
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'BreadWinners Delivery App' } }
    )
    if (!res.ok) return `${lat}, ${lng}`
    const data = await res.json()
    return data.display_name || `${lat}, ${lng}`
}

async function handleUseMyLocation(data: { lat: number; lng: number }) {
    const address = await reverseGeocode(data.lat, data.lng)
    emit('location-selected', {
        address,
        coordinates: { lat: data.lat, lng: data.lng }
    })
}
</script>

<template>
    <div class="space-y-3">
        <!-- Row: Search + Use my location -->
        <div class="flex flex-wrap items-center gap-2">
            <div class="min-w-0 flex-1">
                <CheckoutDeliveryAddressSearchAddress :address="address" @select="handleSearchSelect" />
            </div>
            <CheckoutDeliveryAddressUseMyLocation @location="handleUseMyLocation" />
        </div>
        <!-- Map -->
        <CheckoutDeliveryAddressDeliveryMap :coordinates="coordinates" :error="error"
            @location-selected="handleLocationSelected" />
    </div>
</template>

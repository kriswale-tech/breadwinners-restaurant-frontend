<script setup lang="ts">
const shopStore = useShopStore()
const authStore = useAuthStore()

const shops = ref<{ label: string; value: number }[]>([])

const selectedShop = ref<number | undefined>(undefined)

watch(selectedShop, (value) => {
    if (value != null) {
        shopStore.setSelectedShop(value)
    }
}, { immediate: true })

watch(
    () => shopStore.shops,
    (shopsList) => {
        shops.value = shopsList.map(shop => ({ label: shop.name, value: shop.id }))
        const currentId = shopStore.selectedShop?.id ?? shops.value[0]?.value
        if (currentId !== selectedShop.value) {
            selectedShop.value = currentId
        }
    },
    { immediate: true },
)

// Reload when user changes shop (not on initial set from undefined)
watch(selectedShop, (newVal, oldVal) => {
    if (typeof oldVal === 'number' && typeof newVal === 'number' && newVal !== oldVal && typeof window !== 'undefined') {
        window.location.reload()
    }
})

onMounted(async () => {
    await shopStore.getShops()
    shops.value = shopStore.shops.map(shop => ({ label: shop.name, value: shop.id }))
    const saved = shopStore.getSelectedShop()
    if (saved?.id != null) {
        selectedShop.value = saved.id
    } else if (shops.value[0]) {
        selectedShop.value = shops.value[0].value
    }
})
</script>

<template>
    <div class="flex items-center gap-2" v-if="authStore.userRole === 'staff'">
        <span class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Shop: {{ authStore.user?.profile?.shop?.name }}
        </span>
    </div>
    <div v-else>
        <span class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Shop
        </span>
        <USelect v-model="selectedShop" :items="shops" value-key="value" class="w-56" size="lg" />
    </div>
</template>

<style lang="css" scoped></style>
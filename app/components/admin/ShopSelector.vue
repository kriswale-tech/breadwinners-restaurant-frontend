<script setup lang="ts">
const shopStore = useShopStore()

const shops = [
    { label: 'BreadWinners', value: 'breadwinners' },
    { label: 'Restaurant', value: 'restaurant' },
]

const selectedShop = ref<string | undefined>(undefined)

watch(selectedShop, (value) => {
    shopStore.selectedShop = shops.find(shop => shop.value === value)
}, {
    immediate: true
})

onMounted(() => {
    selectedShop.value = shops[0]?.value
})
</script>

<template>
    <div class="flex items-center gap-2" v-if="true">
        <span class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Shop
        </span>
        <USelect v-model="selectedShop" :items="shops" value-key="value" class="w-56" size="lg" />
    </div>
    <div v-else>
        <span class="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
            {{ shopStore.selectedShop?.label }}
        </span>
    </div>
</template>

<style lang="css" scoped></style>
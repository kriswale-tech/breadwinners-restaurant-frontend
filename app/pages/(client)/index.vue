<script setup lang="ts">
const shopStore = useShopStore()
definePageMeta({
    theme: ''
})

</script>

<template>
    <div>
        <SharedHeader title="Fresh Bakes & Local Flavors"
            description="Handcrafted breads and seasonal dishes — baked daily, served with care." />

        <div class="container mx-auto px-4 py-16 space-y-16">
            <template v-for="shop in shopStore.shops" :key="shop.id">
                <template v-if="shop.is_active">
                    <SharedShopSampleProductsSection :shop="shop" />
                </template>
            </template>
        </div>
    </div>
</template>

<style lang="css" scoped></style>
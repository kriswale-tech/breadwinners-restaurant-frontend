<script setup lang="ts">
const clientProductStore = useClientProductStore()
const showSkeleton = computed(() => clientProductStore.loading && clientProductStore.shopProducts.length === 0)

</script>

<template>
    <div>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
            All bread products.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <template v-if="showSkeleton">
                <SharedCardSkeleton :count="4" />
            </template>
            <template v-else>
                <SharedProductCard v-for="product in clientProductStore.shopProducts" :key="product.id"
                    :product="product" :shop-id="Number($route.params.id)" />
            </template>
        </div>
    </div>
</template>

<style lang="css" scoped></style>

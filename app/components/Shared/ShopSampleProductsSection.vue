<script setup lang="ts">
import type { Shop } from '~/types';
const clientProductStore = useClientProductStore()

const props = defineProps<{
    shop: Shop
}>()

const products = computed(() => {
    return clientProductStore.products.find(product => product.shopId === props.shop.id)?.products ?? []
})

const showSkeleton = computed(() => clientProductStore.loading && products.value.length === 0)

onMounted(async () => {
    await callOnce('fetch-products-by-shop', () => clientProductStore.fetchProductsByShop(props.shop.id))
})
</script>

<template>
    <section>
        <div class=" mb-4">
            <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-200">{{ shop.name }}</h2>
            <p class="text-gray-700 dark:text-gray-300">
                {{ shop.description }}
            </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <template v-if="showSkeleton">
                <SharedCardSkeleton :count="4" />
            </template>
            <SharedProductCard v-else v-for="product in products" :key="product.id" :product="product" />
        </div>
        <div class="flex justify-end mt-4">
            <UButton :to="`/${shop.slug}/${shop.id}`" variant="outline" trailing-icon="lucide:arrow-right"
                color="primary">
                View All
            </UButton>
        </div>
    </section>
</template>

<style lang="css" scoped></style>
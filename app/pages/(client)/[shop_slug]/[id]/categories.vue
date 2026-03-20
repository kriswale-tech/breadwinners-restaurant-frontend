<script setup lang="ts">
const clientProductStore = useClientProductStore()

const filteredProducts = (id: number) => {
    return clientProductStore.shopProducts.filter(product => product.category_id === id)
}
</script>

<template>
    <div class="space-y-16">
        <template v-for="category in clientProductStore.shopCategories" :key="category.id">
            <template v-if="filteredProducts(category.id).length > 0">
                <p class="text-gray-700 dark:text-gray-300 mb-3 text-2xl font-bold">
                    {{ category.name }}

                    <span class="text-sm text-gray-500 dark:text-gray-400 block">
                        {{ category.description }}
                    </span>
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <SharedProductCard v-for="product in filteredProducts(category.id)" :key="product.id"
                        :product="product" />
                </div>
            </template>
        </template>
    </div>
</template>

<style lang="css" scoped></style>
<script setup lang="ts">
import { products } from '~/data/products'
definePageMeta({
    theme: ''
})

</script>

<template>
    <div>
        <SharedHeader title="Fresh Bakes & Local Flavors"
            description="Handcrafted breads and seasonal dishes — baked daily, served with care." />

        <div class="container mx-auto px-4 py-16 space-y-16">
            <!-- Bread winners section -->
            <section>
                <div class=" mb-4">
                    <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-200">Bread Winners</h2>
                    <p class="text-gray-700 dark:text-gray-300">
                        People's favorite breads.
                    </p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <SharedProductCard v-for="product in products" :key="product.id" :product="product" />
                </div>
                <div class="flex justify-end mt-4">
                    <UButton to="/breadwinners" variant="outline" trailing-icon="lucide:arrow-right" color="primary">
                        View All
                    </UButton>
                </div>
            </section>

            <!-- Restaurant section -->
            <section>
                <div class="mb-4 ">
                    <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-200">Restaurant</h2>
                    <p class="text-gray-700 dark:text-gray-300">
                        Our restaurant is a place where you can enjoy our breads and other dishes.
                    </p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <SharedProductCard v-for="product in products" :key="product.id" :product="product" />
                </div>
                <div class="flex justify-end mt-4">
                    <UButton to="/restaurant" variant="outline" trailing-icon="lucide:arrow-right" color="primary">
                        View All
                    </UButton>
                </div>
            </section>
        </div>
    </div>
</template>

<style lang="css" scoped></style>
<script setup lang="ts">
import { products } from '~/data/products'
</script>

<template>
    <div>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
            Our bread packages.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SharedProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
    </div>
</template>

<style lang="css" scoped></style>
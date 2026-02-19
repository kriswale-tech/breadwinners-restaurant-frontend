<script setup lang="ts">
import type { Product } from '~/data/products'

const props = defineProps<{
    product: Product
}>()

const emit = defineEmits<{
    (e: 'add-to-cart', payload: Product): void
}>()

const cartStore = useCartStore()

function onAdd() {
    console.log('Adding to cart', props.product)
    cartStore.addToCart(props.product)
    console.log('Cart store', cartStore.items)
}
</script>

<template>
    <article class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col"
        role="group">
        <div class="w-full h-48 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            <img v-if="product.image" :src="product.image" :alt="product.name" class="object-cover w-full h-full"
                loading="lazy">
            <div v-else class="text-gray-400">No image</div>
        </div>

        <div class="mt-4 flex-1">
            <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-200 leading-tight">
                {{ product.name }}
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                GH₵{{ typeof product.price === 'number' ? product.price.toFixed(2) : product.price }}
            </p>
        </div>

        <div class="mt-4 flex items-center justify-between gap-2">
            <button
                class="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-300"
                aria-label="Add to cart" @click="onAdd">
                <Icon name="heroicons:shopping-cart" class="size-4" />
                <span>Add</span>
            </button>

            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                In stock
            </span>
        </div>
    </article>
</template>

<style scoped></style>

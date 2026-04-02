<script setup lang="ts">
import type { Product } from '~/types/products'

const props = defineProps<{
    product: Product

}>()

const cartStore = useCartStore()

const formattedPrice = computed(() => `GH₵${Number(props.product.price).toFixed(2)}`)

function onAdd() {
    cartStore.addToCart({ kind: 'product', data: props.product })
}
</script>

<template>
    <article
        class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
        role="group">
        <!-- Image -->
        <div class="w-full h-44 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
            <img v-if="product.image" :src="product.image" :alt="product.name" class="object-cover w-full h-full"
                loading="lazy" />
            <div v-else class="text-gray-400 text-sm">
                No image
            </div>
        </div>

        <div class="p-4 flex flex-col gap-3 flex-1">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                    <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-200 leading-tight truncate">
                        {{ product.name }}
                    </h3>
                    <p v-if="product.description" class="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {{ product.description }}
                    </p>
                </div>

                <div class="shrink-0 text-right">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Price
                    </p>
                    <p class="text-lg font-semibold text-neutral-900 dark:text-white">
                        {{ formattedPrice }}
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div class="mt-auto pt-1 flex justify-end">
                <UButton color="primary" variant="subtle" size="sm" icon="heroicons:shopping-cart" label="Add to cart"
                    class="ml-auto" aria-label="Add to cart" @click="onAdd" />
            </div>
        </div>
    </article>
</template>

<style scoped></style>

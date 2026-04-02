<script setup lang="ts">
import type { ProductPackage } from '~/types/products'

const cartStore = useCartStore()
const props = defineProps<{
    package: ProductPackage
}>()

const formattedPrice = computed(() => `GH₵${Number(props.package.price).toFixed(2)}`)

const itemLines = computed(() =>
    (props.package.items ?? []).map((item) => ({
        key: item.id ?? `${item.product}-${item.quantity}`,
        label: `${item.quantity} × ${item.product_name ?? `Product #${item.product}`}`,
    })),
)

function onAdd() {

    cartStore.addToCart({ kind: 'package', data: props.package })

}
</script>

<template>
    <article
        class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden flex flex-col min-w-[320px] max-w-[420px]"
        role="group">
        <!-- Image -->
        <div class="w-full h-44 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
            <img v-if="package.image" :src="package.image" :alt="package.name" class="object-cover w-full h-full"
                loading="lazy" />
            <div v-else class="text-gray-400 text-sm">
                No image
            </div>
        </div>

        <div class="p-4 flex flex-col gap-3 flex-1">
            <!-- Header -->
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-200 leading-tight truncate">
                        {{ package.name }}
                    </h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {{ package.description }}
                    </p>
                </div>

                <div class="shrink-0 text-right">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Package price
                    </p>
                    <p class="text-lg font-semibold text-neutral-900 dark:text-white">
                        {{ formattedPrice }}
                    </p>
                </div>
            </div>

            <!-- Items -->
            <div
                class="mt-1 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/40 p-3">
                <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
                    Includes
                </p>

                <p v-if="itemLines.length" class="text-sm text-neutral-800 dark:text-neutral-200">
                    {{itemLines.map((l) => l.label).join(', ')}}
                </p>
                <p v-else class="text-sm text-neutral-500 dark:text-neutral-400">
                    No items listed.
                </p>
            </div>

            <!-- Footer -->
            <div class="mt-auto pt-1 flex items-center justify-between gap-2">
                <UButton color="primary" variant="subtle" size="sm" icon="heroicons:shopping-cart" label="Add to cart"
                    class="ml-auto" @click="onAdd" />
            </div>
        </div>
    </article>
</template>

<style lang="css" scoped></style>
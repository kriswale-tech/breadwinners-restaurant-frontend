<script setup lang="ts">
import type { OrderItemType, OrderItemType2 } from '~/stores/order-store'
import type { CartItemType } from '~/stores/cart-store'

/**
 * OrderSummary Component
 * Displays order items and total with Make Payment button
 */
const cartStore = useCartStore()

const props = defineProps<{
    items?: (OrderItemType | OrderItemType2)[]
    totalPrice?: number
    buttonLabel?: string
    allowClear?: boolean
    loading?: boolean
}>()

const items = computed(() => props.items ?? cartStore.items)
const totalPrice = computed(() => props.totalPrice?.toFixed(2) ?? cartStore.totalPrice.toFixed(2))


// Emit event when payment button is clicked
const emit = defineEmits<{
    (e: 'make-payment'): void
    (e: 'clear-products'): void
    (e: 'remove-product', payload: string): void
}>()

// Computed formatted total
const formattedTotal = computed(() => cartStore.totalPrice.toFixed(2))

// Handle payment button click
const handlePayment = () => {
    emit('make-payment')
}

const handleClearProducts = () => {
    emit('clear-products')
}

const handleRemoveProduct = (productId: string) => {
    emit('remove-product', productId)
}
</script>

<template>
    <div class="space-y-4">
        <!-- Order Summary Header -->
        <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
            Order Summary
        </h3>

        <!-- Order Items List -->
        <ClientOnly>
            <div class="space-y-3">
                <div v-for="item in items" :key="item.id" class="flex justify-between items-start text-sm">
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-neutral-900 dark:text-white truncate">
                            {{ item.name }}
                        </p>
                        <p v-if="item.description"
                            class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                            {{ item.description }}
                        </p>
                    </div>
                    <div class="ml-4 text-right shrink-0 flex items-center gap-2">
                        <div class="">
                            <p class="font-medium text-neutral-900 dark:text-white">
                                x{{ item.quantity }}
                            </p>
                            <p class="text-xs text-neutral-600 dark:text-neutral-400">
                                GH₵{{
                                    ((typeof item.price === 'string' ? parseFloat(item.price) : item.price) *
                                        item.quantity).toFixed(2)
                                }}
                            </p>
                        </div>
                        <div class="" v-if="allowClear">
                            <UButton size="sm" color="error" variant="soft" icon="heroicons:trash"
                                @click="handleRemoveProduct((item as OrderItemType | OrderItemType2).value)" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
                <!-- Total -->
                <div class="flex justify-between items-center">
                    <span class="text-base font-semibold text-neutral-900 dark:text-white">
                        Total
                    </span>
                    <span class="text-xl font-bold text-primary-600 dark:text-primary-400">
                        GH₵{{ totalPrice }}
                    </span>
                </div>
            </div>
            <template #fallback>
                <div class="space-y-3">
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                        Loading order...
                    </div>
                </div>
                <div class="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
                    <div class="flex justify-between items-center">
                        <span class="text-base font-semibold text-neutral-900 dark:text-white">
                            Total
                        </span>
                        <span class="text-xl font-bold text-primary-600 dark:text-primary-400">
                            GH₵0.00
                        </span>
                    </div>
                </div>
            </template>
        </ClientOnly>

        <!-- Make Payment Button -->
        <div class="">
            <UButton block size="lg" color="primary" :label="buttonLabel ?? 'Make Payment'" icon="heroicons:credit-card"
                class="mt-6" @click="handlePayment" :loading="loading" :disabled="loading" />
            <UButton block size="lg" color="error" variant="soft" label="Clear" icon="heroicons:trash" v-if="allowClear"
                @click="handleClearProducts" class="mt-2" :loading="loading" :disabled="loading" />
        </div>
    </div>
</template>

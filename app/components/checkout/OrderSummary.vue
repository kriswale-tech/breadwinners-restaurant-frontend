<script setup lang="ts">
/**
 * OrderSummary Component
 * Displays order items and total with Make Payment button
 */

const cartStore = useCartStore()

// Emit event when payment button is clicked
const emit = defineEmits<{
    (e: 'make-payment'): void
}>()

// Computed formatted total
const formattedTotal = computed(() => cartStore.totalPrice.toFixed(2))

// Handle payment button click
const handlePayment = () => {
    emit('make-payment')
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
                <div
                    v-for="item in cartStore.items"
                    :key="item.id"
                    class="flex justify-between items-start text-sm"
                >
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-neutral-900 dark:text-white truncate">
                            {{ item.name }}
                        </p>
                        <p v-if="item.description" class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                            {{ item.description }}
                        </p>
                    </div>
                    <div class="ml-4 text-right shrink-0">
                        <p class="font-medium text-neutral-900 dark:text-white">
                            x{{ item.quantity }}
                        </p>
                        <p class="text-xs text-neutral-600 dark:text-neutral-400">
                            GH₵{{
                                ((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)
                            }}
                        </p>
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
                        GH₵{{ formattedTotal }}
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
        <UButton
            block
            size="lg"
            color="primary"
            label="Make Payment"
            icon="heroicons:credit-card"
            class="mt-6"
            @click="handlePayment"
        />
    </div>
</template>

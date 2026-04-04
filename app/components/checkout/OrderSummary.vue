<script setup lang="ts">
import type { OrderItemType, OrderItemType2 } from '~/stores/order-store'
import type { CartLine } from '~/stores/cart-store'
/**
 * OrderSummary Component
 * Displays order items and total with Make Payment button
 */
const cartStore = useCartStore()
const toast = useToast()

const props = defineProps<{
    items?: (OrderItemType | OrderItemType2)[]
    totalPrice?: number
    buttonLabel?: string
    allowClear?: boolean
    loading?: boolean
    isPickupDelivery?: boolean
    showShopSelector?: boolean
}>()

const items = computed(() => props.items ?? cartStore.items)
const totalPrice = computed(() => props.totalPrice?.toFixed(2) ?? cartStore.totalPrice.toFixed(2))


// Emit event when payment button is clicked
const emit = defineEmits<{
    (e: 'make-payment', shopId?: number): void
    (e: 'make-payment-on-pickup', shopId?: number): void
    (e: 'clear-products'): void
    (e: 'remove-product', payload: string): void
}>()

// Computed formatted total
const formattedTotal = computed(() => cartStore.totalPrice.toFixed(2))

// Handle payment button click
function checkoutShopId() {
    return selectedShopId.value
}

const handlePayment = () => {
    if (props.showShopSelector) {
        if (!checkoutShopId()) {
            toast.add({
                title: 'Error',
                description: 'Please select a shop to make payment',
                color: 'error',
                icon: 'heroicons:exclamation-triangle',
            })
            return
        }
        emit('make-payment', checkoutShopId())
    }
    else emit('make-payment')
}

const handlePaymentOnPickup = () => {
    if (props.showShopSelector) {
        if (!checkoutShopId()) {
            toast.add({
                title: 'Error',
                description: 'Please select a shop to make payment',
                color: 'error',
                icon: 'heroicons:exclamation-triangle',
            })
            return
        }
        emit('make-payment-on-pickup', checkoutShopId())
    }
    else emit('make-payment-on-pickup')
}

const handleClearProducts = () => {
    emit('clear-products')
}

const handleRemoveProduct = (productId: string) => {
    emit('remove-product', productId)
}

/** Stable key for list + remove: order lines use `value`, cart lines use `item_id`. */
function lineKey(item: OrderItemType | OrderItemType2 | CartLine): string {
    if ('value' in item && typeof item.value === 'string') return item.value
    if ('item_id' in item) return item.item_id
    return String(item.id)
}

const shopStore = useShopStore()
const { selectedShopId } = storeToRefs(shopStore)

const shopSelectItems = computed(() =>
    shopStore.shops
        .filter((s) => s.is_active)
        .map((s) => ({ label: s.name, value: s.id })),
)

/** Default checkout shop id when list loads and current id is missing or invalid */
watch(shopSelectItems, (items) => {
    if (!props.showShopSelector || items.length === 0) return
    const current = selectedShopId.value
    const stillValid = current != null && items.some((i) => i.value === current)
    if (stillValid) return
    const first = items[0]
    selectedShopId.value = first?.value
}, { immediate: true })

onMounted(async () => {
    if (props.showShopSelector && !shopStore.shops.length) {
        await shopStore.getShops()
    }
})

const paymentDisabledByShop = computed(
    () => Boolean(props.showShopSelector) && selectedShopId.value == null,
)

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
                <div v-for="item in items" :key="lineKey(item)" class="flex justify-between items-start text-sm">
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-neutral-900 dark:text-white truncate">
                            {{ item.name }} <span class="text-xs text-neutral-500 dark:text-neutral-400">({{
                                item.item_type }})</span>
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
                                @click="handleRemoveProduct(lineKey(item))" />
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

        <div v-if="showShopSelector" class="space-y-2">
            <UFormField hint="Select a shop near you" label="Shop" name="shop" required>
                <USelect v-model="selectedShopId" :items="shopSelectItems" value-key="value" placeholder="Select shop"
                    class="w-full" />
            </UFormField>
        </div>

        <!-- Make Payment Button -->
        <div class="">
            <!-- if is pickup delivery, show pickup button -->
            <div class="flex gap-2" v-if="isPickupDelivery">
                <UButton block size="lg" color="primary" label="Pay now" icon="heroicons:credit-card" class="mt-6"
                    @click="handlePayment" :loading="loading" :disabled="loading || paymentDisabledByShop" />
                <UButton block size="lg" color="primary" label="Pay on Pickup" icon="heroicons:building-office"
                    class="mt-6" @click="handlePaymentOnPickup" :loading="loading"
                    :disabled="loading || paymentDisabledByShop" variant="outline" />
            </div>

            <div class="" v-else>
                <UButton block size="lg" color="primary" :label="buttonLabel ?? 'Make Payment'"
                    icon="heroicons:credit-card" class="mt-6" @click="handlePayment" :loading="loading"
                    :disabled="loading || paymentDisabledByShop" />
            </div>

            <!-- if allow clear, show clear button -->
            <UButton block size="lg" color="error" variant="soft" label="Clear" icon="heroicons:trash" v-if="allowClear"
                @click="handleClearProducts" class="mt-2" :loading="loading" :disabled="loading" />
        </div>
    </div>
</template>

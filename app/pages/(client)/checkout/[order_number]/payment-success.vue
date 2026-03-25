<script setup lang="ts">
import type { OrderDetail, OrderItem } from '~/types/orders'
import {
    clearPaymentOrderDetail,
    getPaymentOrderDetail,
} from '~/utils/payment-order-storage'

const cartStore = useCartStore()
const route = useRoute()

const order = ref<OrderDetail | null>(null)
const pageError = ref(false)

function formatPrice(value: string | number) {
    const n = typeof value === 'string' ? parseFloat(value) : value
    if (Number.isNaN(n)) return 'GH₵0.00'
    return `GH₵${n.toFixed(2)}`
}

function formatDate(iso: string) {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(iso))
    } catch {
        return iso
    }
}

function itemLabel(item: OrderItem) {
    return item.product_name || item.package_name || 'Item'
}

function statusLabel(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

function handleDownloadReceipt() {
    if (!import.meta.client) return
    window.print()
}

const orderNumberParam = computed(() => {
    const raw = route.params.order_number
    return typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] ?? '' : ''
})

onMounted(() => {
    // clear cart after successful payment
    cartStore.clearCart()

    const orderNumber = orderNumberParam.value
    if (!orderNumber) {
        pageError.value = true
        return
    }
    const detail = getPaymentOrderDetail(orderNumber)
    if (detail && detail.order_number === orderNumber) {
        order.value = detail
    } else {
        pageError.value = true
    }
})

onBeforeRouteLeave(() => {
    const orderNumber = orderNumberParam.value
    if (orderNumber) clearPaymentOrderDetail(orderNumber)
})
</script>

<template>
    <div class="container min-h-screen py-32">
        <!-- Loading -->
        <div v-if="!pageError && !order" class="flex flex-col items-center justify-center gap-4 py-20">
            <Icon name="heroicons:arrow-path" class="size-10 animate-spin text-primary-600" />
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
                Loading your receipt…
            </p>
        </div>

        <!-- Error -->
        <div v-else-if="pageError"
            class="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/50 mx-auto max-w-4xl">
            <Icon name="heroicons:exclamation-circle" class="mx-auto size-12 text-amber-600" />
            <h1 class="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                We couldn't load this order
            </h1>
            <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Check the link or try again from checkout. You can still track orders from the menu.
            </p>
            <div class="mt-6 flex flex-wrap justify-center gap-3">
                <UButton to="/" color="primary" label="Continue shopping" />
                <UButton to="/track-order" color="neutral" variant="outline" label="Track order" />
            </div>
        </div>

        <!-- Receipt -->
        <template v-else-if="order">
            <div class="mb-8 text-center mx-auto max-w-4xl">
                <div
                    class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                    <Icon name="heroicons:check-circle" class="size-9 text-green-600 dark:text-green-400" />
                </div>
                <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">
                    Payment received
                </h1>
                <p class="mt-2 text-neutral-600 dark:text-neutral-400">
                    Thank you — your order is successfully placed. Here's your receipt.
                </p>
                <div class="mt-5 no-print">
                    <UButton icon="heroicons:arrow-down-tray" label="Download receipt" color="neutral" variant="outline"
                        @click="handleDownloadReceipt" />
                </div>
            </div>

            <div
                class="receipt-print-area overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900 mx-auto max-w-4xl">
                <!-- Receipt header -->
                <div
                    class="border-b border-dashed border-neutral-200 bg-neutral-50 px-6 py-5 dark:border-neutral-700 dark:bg-neutral-800/50">
                    <div class="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p
                                class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                Order number
                            </p>
                            <p class="mt-1 font-mono text-lg font-semibold text-neutral-900 dark:text-white">
                                {{ order.order_number }}
                            </p>
                        </div>
                        <div class="text-right">
                            <p
                                class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                Date
                            </p>
                            <p class="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                {{ formatDate(order.created_at) }}
                            </p>
                        </div>
                    </div>
                    <div class="mt-4 flex flex-wrap gap-2">
                        <UBadge color="neutral" variant="subtle">
                            {{ statusLabel(order.status) }}
                        </UBadge>
                        <UBadge color="neutral" variant="outline">
                            {{ order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup' }}
                        </UBadge>
                    </div>
                </div>

                <!-- Shop -->
                <div class="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
                    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        From
                    </p>
                    <p class="mt-1 font-medium text-neutral-900 dark:text-white">
                        {{ order.shop?.name ?? 'BreadWinners' }}
                    </p>
                </div>

                <!-- Customer -->
                <div class="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
                    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Customer
                    </p>
                    <p class="mt-1 font-medium text-neutral-900 dark:text-white">
                        {{ order.customer_name }}
                    </p>
                    <p class="text-sm text-neutral-600 dark:text-neutral-400">
                        {{ order.customer_phone }}
                    </p>
                    <p v-if="order.email" class="text-sm text-neutral-600 dark:text-neutral-400">
                        {{ order.email }}
                    </p>
                </div>

                <!-- Delivery -->
                <div v-if="order.delivery_method === 'delivery' && (order.delivery_address || order.delivery_notes)"
                    class="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
                    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Delivery
                    </p>
                    <p v-if="order.delivery_address" class="mt-1 text-sm text-neutral-800 dark:text-neutral-200">
                        {{ order.delivery_address }}
                    </p>
                    <p v-if="order.delivery_notes" class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span class="font-medium">Notes:</span> {{ order.delivery_notes }}
                    </p>
                </div>

                <!-- Line items -->
                <div class="px-6 py-4">
                    <p class="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Items
                    </p>
                    <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
                        <li v-for="(item, index) in order.items" :key="item.id ?? index"
                            class="flex justify-between gap-4 py-3 first:pt-0">
                            <div class="min-w-0">
                                <p class="font-medium text-neutral-900 dark:text-white">
                                    {{ itemLabel(item) }}
                                </p>
                                <p class="text-sm text-neutral-500 dark:text-neutral-400">
                                    {{ formatPrice(item.unit_price) }} × {{ item.quantity }}
                                </p>
                            </div>
                            <p class="shrink-0 font-medium tabular-nums text-neutral-900 dark:text-white">
                                {{ formatPrice(item.total_price) }}
                            </p>
                        </li>
                    </ul>
                </div>

                <!-- Total -->
                <div
                    class="border-t-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                    <div class="flex items-center justify-between">
                        <span class="text-base font-semibold text-neutral-900 dark:text-white">Total</span>
                        <span class="text-xl font-bold text-primary-600 dark:text-primary-400">
                            {{ formatPrice(order.total_amount) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Track order CTA -->
            <div
                class="no-print mt-8 rounded-xl border border-primary-200 bg-primary-50/80 p-6 text-center dark:border-primary-900/50 dark:bg-primary-950/30 mx-auto max-w-4xl">
                <Icon name="heroicons:map-pin" class="mx-auto size-8 text-primary-600 dark:text-primary-400" />
                <h2 class="mt-3 text-lg font-semibold text-neutral-900 dark:text-white">
                    Follow your order from kitchen to doorstep
                </h2>
                <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    See live status updates and know exactly when your bread is on the way.
                </p>
                <UButton :to="{ path: '/track-order', query: { order: order.order_number } }" size="lg" color="primary"
                    class="mt-5" trailing-icon="heroicons:arrow-right" label="Track my order" />
            </div>

            <div class="no-print mt-6 text-center">
                <UButton to="/" variant="ghost" color="neutral" label="Continue shopping" />
            </div>
        </template>
    </div>
</template>

<style scoped>
@media print {

    :global(header),
    :global(footer) {
        display: none !important;
    }

    .no-print {
        display: none !important;
    }

    .receipt-print-area {
        box-shadow: none !important;
        border-color: #d4d4d4 !important;
    }

    :global(body) {
        background: #fff !important;
    }

    .container {
        padding: 0 !important;
    }
}
</style>

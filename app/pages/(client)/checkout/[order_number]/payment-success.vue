<script setup lang="ts">
import type { OrderDetail } from '~/types/orders'
import {
    clearPaymentOrderDetail,
    getPaymentOrderDetail,
} from '~/utils/payment-order-storage'

const cartStore = useCartStore()
const route = useRoute()

const order = ref<OrderDetail | null>(null)
const pageError = ref(false)

function handleDownloadReceipt() {
    if (!import.meta.client) return
    window.print()
}

const orderNumberParam = computed(() => {
    const raw = route.params.order_number
    return typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] ?? '' : ''
})

onMounted(() => {
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
        <div v-if="!pageError && !order" class="flex flex-col items-center justify-center gap-4 py-20">
            <Icon name="heroicons:arrow-path" class="size-10 animate-spin text-primary-600" />
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
                Loading your receipt…
            </p>
        </div>

        <div
            v-else-if="pageError"
            class="mx-auto max-w-4xl rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/50"
        >
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

        <template v-else-if="order">
            <div class="mx-auto mb-8 max-w-4xl text-center">
                <div
                    class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40"
                >
                    <Icon name="heroicons:check-circle" class="size-9 text-green-600 dark:text-green-400" />
                </div>
                <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">
                    Payment received
                </h1>
                <p class="mt-2 text-neutral-600 dark:text-neutral-400">
                    Thank you — your order is successfully placed. Here's your receipt.
                </p>
                <div class="mt-5 no-print">
                    <UButton
                        icon="heroicons:arrow-down-tray"
                        label="Download receipt"
                        color="neutral"
                        variant="outline"
                        @click="handleDownloadReceipt"
                    />
                </div>
            </div>

            <div class="mx-auto max-w-4xl">
                <CheckoutOrderReceipt :order="order" />
            </div>

            <div
                class="no-print mx-auto mt-8 max-w-4xl rounded-xl border border-primary-200 bg-primary-50/80 p-6 text-center dark:border-primary-900/50 dark:bg-primary-950/30"
            >
                <Icon name="heroicons:map-pin" class="mx-auto size-8 text-primary-600 dark:text-primary-400" />
                <h2 class="mt-3 text-lg font-semibold text-neutral-900 dark:text-white">
                    Follow your order from kitchen to doorstep
                </h2>
                <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    See live status updates and know exactly when your bread is on the way.
                </p>
                <UButton
                    :to="{ path: '/track-order', query: { order: order.order_number } }"
                    size="lg"
                    color="primary"
                    class="mt-5"
                    trailing-icon="heroicons:arrow-right"
                    label="Track my order"
                />
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

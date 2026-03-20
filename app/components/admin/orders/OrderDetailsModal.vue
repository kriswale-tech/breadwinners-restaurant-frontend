<script setup lang="ts">
import type { OrderDetail, OrderItem, OrderStatus } from '~/types/orders'
import type { TableColumn } from '@nuxt/ui'

const toast = useToast()
const orderStore = useOrderStore()

const props = defineProps<{
    open: boolean
    orderId: number | null
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    'update-status': [payload: { orderId: number; status: OrderStatus }]
}>()

const order = ref<OrderDetail | null>(null)
const loading = ref(false)
const loadFailed = ref(false)

const statusBadgeColor: Record<OrderStatus, 'warning' | 'info' | 'error' | 'success' | 'neutral'> = {
    pending: 'warning',
    confirmed: 'neutral',
    cancelled: 'error',
    done: 'info',
    delivered: 'success',
}

function statusLabel(status: OrderStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

const orderTotal = computed(() => Number(order.value?.total_amount ?? 0))

const statusOptions: { label: string; value: OrderStatus; color: 'warning' | 'info' | 'error' | 'success' | 'neutral' }[] =
    [
        { label: statusLabel('pending'), value: 'pending', color: statusBadgeColor.pending },
        { label: statusLabel('confirmed'), value: 'confirmed', color: statusBadgeColor.confirmed },
        { label: statusLabel('cancelled'), value: 'cancelled', color: statusBadgeColor.cancelled },
        { label: statusLabel('done'), value: 'done', color: statusBadgeColor.done },
        { label: statusLabel('delivered'), value: 'delivered', color: statusBadgeColor.delivered },
    ]

function setStatus(status: OrderStatus) {
    if (order.value) emit('update-status', { orderId: order.value.id, status })
}

function close() {
    emit('update:open', false)
}

watch(
    () => [props.open, props.orderId],
    async () => {
        if (!props.open || props.orderId == null) {
            order.value = null
            loadFailed.value = false
            return
        }

        loading.value = true
        loadFailed.value = false
        try {
            const result = await orderStore.getOrderDetail(props.orderId)
            order.value = result ?? null
            if (!result) loadFailed.value = true
        } catch {
            loadFailed.value = true
        } finally {
            loading.value = false
        }
    },
    { immediate: true },
)

function formatDateTime(value: string): string {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', hour12: false })
}

function formatMoney(value: string | number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(Number(value))
}

const itemColumns: TableColumn<OrderItem>[] = [
    {
        accessorKey: 'product_name',
        header: 'Product/Package',
        cell: ({ row }) => row.original.product_name ?? row.original.package_name ?? '-',
    },
    {
        accessorKey: 'item_type',
        header: 'Type',
        cell: ({ row }) => row.original.item_type ?? '-',
        meta: { class: { td: 'capitalize' } },
    },
    {
        accessorKey: 'unit_price',
        header: 'Unit price',
        meta: { class: { th: 'text-right', td: 'text-right' } },
        cell: ({ row }) => formatMoney(row.original.unit_price),
    },
    {
        accessorKey: 'quantity',
        header: 'Qty',
        meta: { class: { th: 'text-right', td: 'text-right' } },
    },
    {
        accessorKey: 'total_price',
        header: 'Total',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) => formatMoney(row.original.total_price),
    },
]

function copyToClipboard(lat: string | number, lng: string | number) {
    navigator.clipboard.writeText(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)
    toast.add({
        title: 'Copied to clipboard',
        color: 'success',
    })
}
</script>

<template>
    <UModal :open="open" :title="order ? `Order #${order.order_number} - ${order.shop.name}` : 'Order details'"
        scrollable :ui="{ content: 'w-[calc(100vw-2rem)] max-w-3xl' }" @update:open="emit('update:open', $event)">
        <!-- No trigger: modal is opened programmatically from table row click -->
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>
        <template #body>
            <div v-if="loading"
                class="flex items-center justify-center py-10 text-sm text-neutral-500 dark:text-neutral-400">
                Loading...
            </div>
            <div v-else-if="loadFailed" class="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Failed to load order details.
            </div>
            <div v-else-if="order" class="space-y-6">
                <!-- Top row: customer + delivery -->
                <div class="grid gap-6 md:grid-cols-2">
                    <!-- Customer -->
                    <section>
                        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Customer
                        </h3>
                        <ul class="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                            <li>{{ order.customer_name }}</li>
                            <li>{{ order.customer_phone }}</li>
                            <li v-if="order.email">{{ order.email }}</li>
                            <li v-if="order.delivery_notes">Delivery notes: {{ order.delivery_notes }}</li>
                        </ul>
                    </section>

                    <!-- Order info -->
                    <section>
                        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Order info
                        </h3>
                        <ul class="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                            <li>Order ID: #{{ order.order_number }}</li>
                            <li>
                                Time:
                                {{
                                    formatDateTime(order.created_at)
                                }}
                            </li>
                            <li>
                                Last updated:
                                {{
                                    formatDateTime(order.updated_at)
                                }}
                            </li>
                        </ul>
                    </section>

                </div>

                <div class="grid gap-6 md:grid-cols-2">

                    <!-- Delivery -->
                    <section>
                        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Delivery
                        </h3>
                        <ul class="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                            <li class="capitalize">
                                Type: {{ order.delivery_method }}
                            </li>
                            <li v-if="order.delivery_method === 'delivery' && order.delivery_address">
                                Address: {{ order.delivery_address }}
                            </li>
                            <li v-if="order.delivery_method === 'delivery' && order.address_latitude != null && order.address_longitude != null"
                                class="flex items-center gap-2">
                                Address link:
                                <a :href="`https://www.google.com/maps/search/?api=1&query=${order.address_latitude},${order.address_longitude}`"
                                    target="_blank" class="text-blue-500 hover:text-blue-600">
                                    View on Google Maps
                                </a>
                                <!-- copy to clipboard button -->
                                <UButton size="sm" color="neutral" variant="ghost" icon="lucide:copy"
                                    @click="copyToClipboard(order.address_latitude, order.address_longitude)" />
                            </li>
                        </ul>
                    </section>

                    <!-- order status -->
                    <section>
                        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Order status
                        </h3>
                        <p class="text-sm text-neutral-600 dark:text-neutral-400">
                            <UBadge :color="statusBadgeColor[order.status]" :label="statusLabel(order.status)" />
                        </p>
                    </section>
                </div>

                <!-- Total -->
                <section>
                    <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Total
                    </h3>
                    <p class="mt-2 text-right text-sm font-semibold text-neutral-900 dark:text-white">
                        Total: {{ formatMoney(orderTotal) }}
                    </p>
                </section>

                <!-- Items -->
                <section>
                    <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Items
                    </h3>
                    <UTable :data="order.items" :columns="itemColumns" class="w-full" />
                </section>

                <!-- Status actions -->
                <section>
                    <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Change status
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        <UButton v-for="opt in statusOptions" :key="opt.value" :color="opt.color" variant="soft"
                            size="sm" :label="opt.label" :disabled="order.status === opt.value"
                            @click="setStatus(opt.value)" />
                    </div>
                </section>
            </div>
            <p v-else class="text-sm text-neutral-500">
                Order not found.
            </p>
        </template>
        <template #footer>
            <UButton color="neutral" variant="outline" label="Close" @click="close" />
        </template>
    </UModal>
</template>

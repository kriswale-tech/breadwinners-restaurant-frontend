<script setup lang="ts">
import type { Order, OrderStatus } from '~/data/order'
import { statusBadgeColor } from '~/data/order'
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
    open: boolean
    orderId: string | null
    orders: Order[]
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    'update-status': [payload: { orderId: string; status: OrderStatus }]
}>()

const order = computed(() =>
    props.orderId ? props.orders.find((o) => o.orderId === props.orderId) ?? null : null
)

const itemsWithTotal = computed(() => {
    const o = order.value
    if (!o?.items?.length) return []
    return o.items.map((i) => ({
        name: i.name,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        total: i.unitPrice * i.quantity,
    }))
})

const orderTotal = computed(() => order.value?.amount ?? 0)

const statusOptions: { label: OrderStatus; color: 'warning' | 'info' | 'error' | 'success' | 'neutral' }[] = [
    { label: 'Pending', color: 'warning' },
    { label: 'Confirmed', color: 'neutral' },
    { label: 'Cancelled', color: 'error' },
    { label: 'Done', color: 'info' },
    { label: 'Delivered', color: 'success' },
]

function setStatus(status: OrderStatus) {
    if (order.value) {
        emit('update-status', { orderId: order.value.orderId, status })
    }
}

function close() {
    emit('update:open', false)
}

const itemColumns: TableColumn<{ name: string; unitPrice: number; quantity: number; total: number }>[] = [
    { accessorKey: 'name', header: 'Product' },
    {
        accessorKey: 'unitPrice',
        header: 'Unit price',
        meta: { class: { td: 'text-right' } },
        cell: ({ row }) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(row.getValue('unitPrice')),
    },
    {
        accessorKey: 'quantity',
        header: 'Qty',
        meta: { class: { td: 'text-right' } }
    },
    {
        accessorKey: 'total',
        header: 'Total',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(row.getValue('total')),
    },
]
</script>

<template>
    <UModal :open="open" :title="order ? `Order #${order.orderId} - ${order.shop}` : 'Order details'" scrollable
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-3xl' }" @update:open="emit('update:open', $event)">
        <!-- No trigger: modal is opened programmatically from table row click -->
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>
        <template #body>
            <div v-if="order" class="space-y-6">
                <!-- Top row: customer + delivery -->
                <div class="grid gap-6 md:grid-cols-2">
                    <!-- Customer -->
                    <section>
                        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Customer
                        </h3>
                        <ul class="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                            <li>{{ order.customerName }}</li>
                            <li>{{ order.phoneNumber }}</li>
                            <li v-if="order.email">
                                {{ order.email }}
                            </li>
                        </ul>
                    </section>

                    <!-- Delivery -->
                    <section>
                        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Delivery
                        </h3>
                        <ul class="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                            <li class="capitalize">
                                Type: {{ order.deliveryType ?? 'Pickup' }}
                            </li>
                            <li v-if="order.deliveryType === 'delivery' && order.address">
                                Address: {{ order.address }}
                            </li>
                            <li v-if="order.deliveryType === 'delivery' && order.coordinates">
                                Coordinates:
                                {{ order.coordinates.lat }}, {{ order.coordinates.lng }}
                            </li>
                        </ul>
                    </section>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                    <!-- Order info -->
                    <section>
                        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Order info
                        </h3>
                        <ul class="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                            <li>Order ID: #{{ order.orderId }}</li>
                            <li>
                                Time:
                                {{
                                    new Date(order.date).toLocaleString('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                        hour12: false
                                    })
                                }}
                            </li>
                            <li v-if="order.deliveryNotes">
                                Delivery notes: {{ order.deliveryNotes }}
                            </li>
                        </ul>
                    </section>

                    <!-- order status -->
                    <section>
                        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                            Order status
                        </h3>
                        <p class="text-sm text-neutral-600 dark:text-neutral-400">
                            <UBadge :color="statusBadgeColor[order.status]" :label="order.status" />
                        </p>
                    </section>
                </div>

                <!-- Items -->
                <section>
                    <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Items
                    </h3>
                    <UTable v-if="itemsWithTotal.length" :data="itemsWithTotal" :columns="itemColumns" class="w-full" />
                    <p v-else class="text-sm text-neutral-500">
                        No items listed.
                    </p>
                    <p class="mt-2 text-right text-sm font-semibold text-neutral-900 dark:text-white">
                        Total: {{ new Intl.NumberFormat('en-US', {
                            style: 'currency', currency: 'GHS'
                        }).format(orderTotal) }}
                    </p>
                </section>

                <!-- Status actions -->
                <section>
                    <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Change status
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        <UButton v-for="opt in statusOptions" :key="opt.label" :color="opt.color" variant="soft"
                            size="sm" :label="opt.label" :disabled="order.status === opt.label"
                            @click="setStatus(opt.label)" />
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

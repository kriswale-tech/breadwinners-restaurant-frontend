<script setup lang="ts">
import type { OrderDetail, OrderItem } from '~/types/orders'

const props = defineProps<{
    order: OrderDetail
}>()

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
</script>

<template>
    <div
        class="receipt-print-area overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
    >
        <div
            class="border-b border-dashed border-neutral-200 bg-neutral-50 px-6 py-5 dark:border-neutral-700 dark:bg-neutral-800/50"
        >
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Order number
                    </p>
                    <p class="mt-1 font-mono text-lg font-semibold text-neutral-900 dark:text-white">
                        {{ props.order.order_number }}
                    </p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Date
                    </p>
                    <p class="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                        {{ formatDate(props.order.created_at) }}
                    </p>
                </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
                <UBadge color="neutral" variant="subtle">
                    {{ statusLabel(props.order.status) }}
                </UBadge>
                <UBadge color="neutral" variant="outline">
                    {{ props.order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup' }}
                </UBadge>
            </div>
        </div>

        <div class="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
            <p class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                From
            </p>
            <p class="mt-1 font-medium text-neutral-900 dark:text-white">
                {{ props.order.shop?.name ?? 'BreadWinners' }}
            </p>
        </div>

        <div class="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
            <p class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Customer
            </p>
            <p class="mt-1 font-medium text-neutral-900 dark:text-white">
                {{ props.order.customer_name }}
            </p>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ props.order.customer_phone }}
            </p>
            <p v-if="props.order.email" class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ props.order.email }}
            </p>
        </div>

        <div
            v-if="props.order.delivery_method === 'delivery' && (props.order.delivery_address || props.order.delivery_notes)"
            class="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700"
        >
            <p class="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Delivery
            </p>
            <p v-if="props.order.delivery_address" class="mt-1 text-sm text-neutral-800 dark:text-neutral-200">
                {{ props.order.delivery_address }}
            </p>
            <p v-if="props.order.delivery_notes" class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span class="font-medium">Notes:</span> {{ props.order.delivery_notes }}
            </p>
        </div>

        <div class="px-6 py-4">
            <p class="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Items
            </p>
            <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
                <li
                    v-for="(item, index) in props.order.items"
                    :key="item.id ?? index"
                    class="flex justify-between gap-4 py-3 first:pt-0"
                >
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

        <div
            class="border-t-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-700 dark:bg-neutral-800/50"
        >
            <div class="flex items-center justify-between">
                <span class="text-base font-semibold text-neutral-900 dark:text-white">Total</span>
                <span class="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {{ formatPrice(props.order.total_amount) }}
                </span>
            </div>
        </div>
    </div>
</template>

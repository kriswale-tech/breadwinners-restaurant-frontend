<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Order, OrderStatus, PaymentStatus, DeliveryMethod } from '~/types/orders'

const orderStore = useOrderStore()

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const props = defineProps<{
    data?: Order[]
    loading?: boolean
}>()

const emit = defineEmits<{
    'update-status': [payload: { orderId: number; status: OrderStatus }]
    'select-order': [orderId: number]
}>()

const statusBadgeColor: Record<OrderStatus, 'warning' | 'info' | 'error' | 'success' | 'neutral'> = {
    pending: 'warning',
    confirmed: 'neutral',
    cancelled: 'error',
    done: 'info',
    delivered: 'success',
}

const paymentStatusBadgeColor: Record<PaymentStatus, 'warning' | 'info' | 'error' | 'success' | 'neutral'> = {
    paid: 'success',
    unpaid: 'error',
}

function paymentStatusLabel(paymentStatus: PaymentStatus): string {
    return paymentStatus ? paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1) : '-'
}

function statusLabel(status: OrderStatus): string {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : '-'
}

const statusDropdownOptions: {
    label: string
    value: OrderStatus
    color: 'warning' | 'info' | 'error' | 'success' | 'neutral'
}[] = [
        { label: statusLabel('pending'), value: 'pending', color: statusBadgeColor.pending },
        { label: statusLabel('confirmed'), value: 'confirmed', color: statusBadgeColor.confirmed },
        { label: statusLabel('cancelled'), value: 'cancelled', color: statusBadgeColor.cancelled },
        { label: statusLabel('done'), value: 'done', color: statusBadgeColor.done },
        { label: statusLabel('delivered'), value: 'delivered', color: statusBadgeColor.delivered },
    ]

// Fetch orders in this component
onMounted(() => {
    orderStore.getOrders()
})

const tableData = computed(() => {
    // If parent passes filtered data, prefer it; otherwise, fall back to store.
    if (props.data) return props.data
    return orderStore.orders
})

const tableLoading = computed(() => props.loading ?? orderStore.loading)

// pagination info
const page = ref(1)
const itemsPerPage = 10

const paginatedData = computed(() => {
    const start = (page.value - 1) * itemsPerPage
    return tableData.value.slice(start, start + itemsPerPage)
})

const total = computed(() => tableData.value.length)

const columns: TableColumn<Order>[] = [
    {
        id: 'view',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'w-12' } },
        cell: ({ row }) =>
            h(UButton, {
                icon: 'i-lucide-eye',
                color: 'neutral',
                variant: 'ghost',
                size: 'sm',
                'aria-label': 'View details',
                onClick: () => emit('select-order', row.original.id),
            }),
    },
    {
        accessorKey: 'order_number',
        header: 'Order #',
        cell: ({ row }) => `#${row.getValue('order_number')}`,
    },
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) =>
            new Date(row.getValue('created_at')).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as OrderStatus
            const color = statusBadgeColor[status]
            return h(UBadge, { variant: 'subtle', color }, () => statusLabel(status))
        },
    },
    {
        accessorKey: 'customer_phone',
        header: 'Phone Number',
    },
    {
        accessorKey: 'customer_name',
        header: 'Customer Name',
    },
    {
        accessorKey: 'total_amount',
        header: 'Amount',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(
                Number(row.getValue('total_amount')),
            ),
    },
    {
        accessorKey: 'delivery_method',
        header: 'Delivery Method',
        cell: ({ row }) => {
            const deliveryMethod = row.getValue('delivery_method') as DeliveryMethod
            return deliveryMethod ? deliveryMethod.charAt(0).toUpperCase() + deliveryMethod.slice(1) : '-'
        },
    },
    {
        accessorKey: 'payment_status',
        header: 'Payment Status',
        cell: ({ row }) => {
            const paymentStatus = row.getValue('payment_status') as PaymentStatus
            return h(UBadge, { variant: 'subtle', color: paymentStatusBadgeColor[paymentStatus] }, () => paymentStatusLabel(paymentStatus))
        },
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'w-12 text-right' } },
        cell: ({ row }) => {
            const orderId = row.original.id
            const items = statusDropdownOptions.map((opt) => ({
                label: opt.label,
                color: opt.color,
                onSelect() {
                    emit('update-status', { orderId, status: opt.value })
                },
            }))
            return h(
                UDropdownMenu,
                {
                    items: [items],
                    content: { align: 'end' },
                    'aria-label': 'Order actions',
                },
                () =>
                    h(UButton, {
                        icon: 'i-lucide-ellipsis',
                        color: 'neutral',
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': 'Actions',
                    }),
            )
        },
    },
]
</script>

<template>
    <div class="space-y-4">
        <UTable :data="paginatedData" :columns="columns" :loading="tableLoading" loading-animation="swing"
            class="w-full" />
        <div class="flex justify-end">
            <UPagination v-model:page="page" :total="total" :items-per-page="itemsPerPage" :sibling-count="1"
                show-edges />
        </div>
    </div>
</template>

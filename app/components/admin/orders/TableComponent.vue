<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { type Order, type OrderStatus, statusBadgeColor } from '~/data/order'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const props = withDefaults(
    defineProps<{
        data?: Order[],
        loading?: boolean
    }>(),
    { data: () => [] }
)

const emit = defineEmits<{
    'update-status': [payload: { orderId: string; status: OrderStatus }]
    'select-order': [orderId: string]
}>()

// pagination info
const page = ref(1)
const itemsPerPage = 10

const paginatedData = computed(() => {
    const start = (page.value - 1) * itemsPerPage
    return props.data.slice(start, start + itemsPerPage)
})

const total = computed(() => props.data.length)

const statusDropdownOptions: { label: OrderStatus; color: 'warning' | 'info' | 'error' | 'success' | 'neutral' }[] = [
    { label: 'Pending', color: 'warning' },
    { label: 'Confirmed', color: 'neutral' },
    { label: 'Cancelled', color: 'error' },
    { label: 'Done', color: 'info' },
    { label: 'Delivered', color: 'success' },
]

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
                onClick: () => emit('select-order', row.original.orderId),
            }),
    },
    {
        accessorKey: 'orderId',
        header: 'Order ID',
        cell: ({ row }) => `#${row.getValue('orderId')}`,
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) =>
            new Date(row.getValue('date')).toLocaleDateString('en-US', {
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
            return h(UBadge, { variant: 'subtle', color, class: 'capitalize' }, () => status)
        },
    },
    {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
    },
    {
        accessorKey: 'customerName',
        header: 'Customer Name',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(
                Number(row.getValue('amount'))
            ),
    },
    {
        accessorKey: 'shop',
        header: 'Shop',
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'w-12 text-right' } },
        cell: ({ row }) => {
            const orderId = row.original.orderId
            const items = statusDropdownOptions.map((opt) => ({
                label: opt.label,
                // icon: 'i-lucide-circle',
                color: opt.color,
                onSelect() {
                    emit('update-status', { orderId, status: opt.label })
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
                    })
            )
        },
    },
]
</script>

<template>
    <div class="space-y-4">
        <UTable :data="paginatedData" :columns="columns" :loading="loading" loading-animation="swing" class="w-full" />
        <div class="flex justify-end">
            <UPagination v-model:page="page" :total="total" :items-per-page="itemsPerPage" :sibling-count="1"
                show-edges />
        </div>
    </div>
</template>

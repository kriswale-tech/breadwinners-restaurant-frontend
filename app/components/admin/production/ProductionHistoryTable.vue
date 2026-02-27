<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { ProductionRecord } from '~/data/production'

const UButton = resolveComponent('UButton')

const props = withDefaults(
    defineProps<{
        records?: ProductionRecord[]
    }>(),
    { records: () => [] },
)

const emit = defineEmits<{
    view: [record: ProductionRecord]
}>()

function formatDate(value: string): string {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

const columns: TableColumn<ProductionRecord>[] = [
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.date),
    },
    {
        accessorKey: 'productName',
        header: 'Product Name',
        meta: { class: { td: 'font-medium text-neutral-900 dark:text-white' } },
    },
    {
        accessorKey: 'quantityProduced',
        header: 'Quantity Produced',
        meta: { class: { td: 'text-sm text-neutral-900 dark:text-neutral-100' } },
    },
    {
        accessorKey: 'producedBy',
        header: 'Produced by',
        meta: { class: { td: 'text-sm text-neutral-700 dark:text-neutral-200' } },
    },
    {
        id: 'view',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'w-10 text-right' } },
        cell: ({ row }) =>
            h(UButton, {
                icon: 'i-lucide-eye',
                color: 'neutral',
                variant: 'ghost',
                size: 'sm',
                'aria-label': 'View production details',
                onClick: () => emit('view', row.original),
            }),
    },
]
</script>

<template>
    <div class="space-y-4">
        <UTable :data="records" :columns="columns" class="w-full" />
    </div>
</template>

<style scoped></style>


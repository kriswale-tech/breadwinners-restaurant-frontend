<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { ProductPackage, ProductStatus } from '~/data/products'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const props = withDefaults(
    defineProps<{
        packages?: ProductPackage[]
    }>(),
    { packages: () => [] },
)

const emit = defineEmits<{
    edit: [pkg: ProductPackage]
    delete: [pkg: ProductPackage]
}>()

const statusColor: Record<ProductStatus, 'success' | 'neutral'> = {
    active: 'success',
    disabled: 'neutral',
}

function formatPackageInfo(items: ProductPackage['items']): string {
    if (!items?.length) return '—'
    return items.map((i) => `${i.product.name} x ${i.quantity}`).join(', ')
}

const columns: TableColumn<ProductPackage>[] = [
    {
        accessorKey: 'name',
        header: 'Package',
        cell: ({ row }) => {
            const image = row.original.image
            const name = row.original.name
            return h(
                'div',
                { class: 'flex items-center gap-3' },
                [
                    image
                        ? h('img', {
                            src: image,
                            alt: name,
                            class: 'h-10 w-10 rounded-md object-cover',
                        })
                        : h(
                            'div',
                            {
                                class:
                                    'flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500',
                            },
                            [h(resolveComponent('Icon'), { name: 'i-lucide-package', class: 'size-5' })],
                        ),
                    h('div', { class: 'min-w-0' }, [
                        h('p', { class: 'text-sm font-medium text-neutral-900 dark:text-white truncate' }, name),
                    ]),
                ],
            )
        },
    },
    {
        id: 'packageInfo',
        header: 'Package info',
        meta: { class: { td: 'max-w-xs truncate text-sm text-neutral-600 dark:text-neutral-400' } },
        cell: ({ row }) => formatPackageInfo(row.original.items),
    },
    {
        accessorKey: 'description',
        header: 'Description',
        meta: { class: { td: 'max-w-xs truncate text-sm text-neutral-600 dark:text-neutral-400' } },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        meta: { class: { th: 'text-right', td: 'text-right font-medium' } },
        cell: ({ row }) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(
                Number(row.getValue('price')),
            ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = (row.getValue('status') as ProductStatus) || 'active'
            const color = statusColor[status]
            return h(UBadge, { color, variant: 'subtle', class: 'capitalize' }, () => status)
        },
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'text-right' } },
        cell: ({ row }) => {
            const pkg = row.original
            return h('div', { class: 'flex items-center justify-end gap-1' }, [
                h(UButton, {
                    icon: 'i-lucide-pencil',
                    color: 'neutral',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Edit package',
                    onClick: () => emit('edit', pkg),
                }),
                h(UButton, {
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Delete package',
                    onClick: () => emit('delete', pkg),
                }),
            ])
        },
    },
]
</script>

<template>
    <div class="space-y-4">
        <UTable :data="packages" :columns="columns" class="w-full" />
    </div>
</template>

<style scoped></style>

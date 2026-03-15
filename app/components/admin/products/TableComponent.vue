<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Product } from '~/types/products'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const productStore = useProductStore()

const products = computed(() => productStore.products)

const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
}>()

const columns: TableColumn<Product>[] = [
    {
        accessorKey: 'name',
        header: 'Product',
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
                            [h(resolveComponent('Icon'), { name: 'i-lucide-image', class: 'size-5' })],
                        ),
                    h('div', { class: 'min-w-0' }, [
                        h('p', { class: 'text-sm font-medium text-neutral-900 dark:text-white truncate' }, name),
                    ]),
                ],
            )
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        meta: { class: { td: 'max-w-xs truncate text-sm text-neutral-600 dark:text-neutral-400' } },
    },
    {
        accessorKey: 'category_name',
        header: 'Category',
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
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.original.is_active
            const color = isActive ? 'success' : 'neutral'
            const label = isActive ? 'Active' : 'Disabled'
            return h(UBadge, { color, variant: 'subtle', class: 'capitalize' }, () => label)
        },
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'text-right' } },
        cell: ({ row }) => {
            const product = row.original
            return h('div', { class: 'flex items-center justify-end gap-1' }, [
                h(UButton, {
                    icon: 'i-lucide-pencil',
                    color: 'neutral',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Edit product',
                    onClick: () => emit('edit', product),
                }),
                h(UButton, {
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Delete product',
                    onClick: () => emit('delete', product),
                }),
            ])
        },
    },
]
</script>

<template>
    <div class="space-y-4">
        <UTable :data="products" :columns="columns" class="w-full" />
    </div>
</template>

<style scoped></style>
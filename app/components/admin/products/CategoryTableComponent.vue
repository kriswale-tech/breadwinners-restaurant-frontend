<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Category } from '~/data/products'

const UButton = resolveComponent('UButton')

const props = withDefaults(
    defineProps<{
        categories?: Category[]
    }>(),
    { categories: () => [] },
)

const emit = defineEmits<{
    edit: [category: Category]
    delete: [category: Category]
}>()

const columns: TableColumn<Category>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        meta: { class: { td: 'font-medium text-neutral-900 dark:text-white' } },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        meta: { class: { td: 'max-w-xs truncate text-sm text-neutral-600 dark:text-neutral-400' } },
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'text-right' } },
        cell: ({ row }) => {
            const category = row.original
            return h('div', { class: 'flex items-center justify-end gap-1' }, [
                h(UButton, {
                    icon: 'i-lucide-pencil',
                    color: 'neutral',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Edit category',
                    onClick: () => emit('edit', category),
                }),
                h(UButton, {
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Delete category',
                    onClick: () => emit('delete', category),
                }),
            ])
        },
    },
]
</script>

<template>
    <div class="space-y-4">
        <UTable :data="categories" :columns="columns" class="w-full" />
    </div>
</template>

<style scoped></style>

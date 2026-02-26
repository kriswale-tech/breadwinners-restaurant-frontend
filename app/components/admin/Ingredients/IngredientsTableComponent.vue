<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Ingredient } from '~/data/ingredients'

const UButton = resolveComponent('UButton')

const props = withDefaults(
    defineProps<{
        ingredients?: Ingredient[]
    }>(),
    { ingredients: () => [] },
)

const emit = defineEmits<{
    edit: [ingredient: Ingredient]
    delete: [ingredient: Ingredient]
}>()

function formatQuantity(item: Ingredient): string {
    return `${item.quantity}${item.unit}`
}

const columns: TableColumn<Ingredient>[] = [
    {
        accessorKey: 'name',
        header: 'Ingredient',
        meta: { class: { td: 'font-medium text-neutral-900 dark:text-white' } },
    },
    {
        id: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => formatQuantity(row.original),
        meta: { class: { td: 'text-sm text-neutral-600 dark:text-neutral-400' } },
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'text-right' } },
        cell: ({ row }) => {
            const ingredient = row.original
            return h('div', { class: 'flex items-center justify-end gap-1' }, [
                h(UButton, {
                    icon: 'i-lucide-pencil',
                    color: 'neutral',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Edit ingredient',
                    onClick: () => emit('edit', ingredient),
                }),
                h(UButton, {
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Delete ingredient',
                    onClick: () => emit('delete', ingredient),
                }),
            ])
        },
    },
]
</script>

<template>
    <div class="space-y-4">
        <UTable :data="ingredients" :columns="columns" class="w-full" />
    </div>
</template>

<style scoped></style>

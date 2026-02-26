<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { type User, type UserRole, users } from '~/data/users'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const emit = defineEmits<{
    edit: [user: User]
    delete: [user: User]
}>()

const roleColor: Record<UserRole, 'primary' | 'neutral'> = {
    admin: 'primary',
    staff: 'neutral',
}

function formatLastLogin(value?: string): string {
    if (!value) return 'Never'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

const columns: TableColumn<User>[] = [
    {
        id: 'user',
        header: 'User',
        cell: ({ row }) => {
            const avatar = row.original.avatar
            const firstName = row.original.firstName
            const lastName = row.original.lastName
            const role = row.original.role
            const fullName = `${firstName} ${lastName}`

            return h(
                'div',
                { class: 'flex items-center gap-3' },
                [
                    avatar
                        ? h('img', {
                            src: avatar,
                            alt: fullName,
                            class: 'h-10 w-10 rounded-full object-cover',
                        })
                        : h(
                            'div',
                            {
                                class:
                                    'flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500',
                            },
                            [h(resolveComponent('Icon'), { name: 'i-lucide-user', class: 'size-5' })],
                        ),
                    h('div', { class: 'min-w-0' }, [
                        h(
                            'p',
                            { class: 'text-sm font-semibold text-neutral-900 dark:text-white truncate' },
                            fullName,
                        ),
                        h(
                            'p',
                            { class: 'text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 capitalize' },
                            role,
                        ),
                    ]),
                ],
            )
        },
    },
    {
        accessorKey: 'address',
        header: 'Address',
        meta: { class: { td: 'max-w-xs truncate text-sm text-neutral-600 dark:text-neutral-400' } },
    },
    {
        id: 'lastLogin',
        header: 'Last login',
        cell: ({ row }) => formatLastLogin(row.original.lastLogin),
    },
    {
        accessorKey: 'bio',
        header: 'Bio',
        meta: { class: { td: 'max-w-xs truncate text-sm text-neutral-600 dark:text-neutral-400' } },
    },
    {
        accessorKey: 'phoneNumber',
        header: 'Phone number',
        meta: { class: { td: 'text-sm text-neutral-900 dark:text-neutral-100' } },
    },
    {
        id: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.original.role
            const color = roleColor[role]
            return h(UBadge, { color, variant: 'soft', class: 'capitalize' }, () => role)
        },
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { class: { td: 'text-right' } },
        cell: ({ row }) => {
            const user = row.original
            return h('div', { class: 'flex items-center justify-end gap-1' }, [
                h(UButton, {
                    icon: 'i-lucide-pencil',
                    color: 'neutral',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Edit user',
                    onClick: () => emit('edit', user),
                }),
                h(UButton, {
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    variant: 'ghost',
                    size: 'sm',
                    'aria-label': 'Delete user',
                    onClick: () => emit('delete', user),
                }),
            ])
        },
    },
]
</script>

<template>
    <div class="space-y-4">
        <UTable :data="users" :columns="columns" class="w-full" />
    </div>
</template>

<style scoped></style>


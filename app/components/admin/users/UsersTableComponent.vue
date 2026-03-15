<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { UsersList } from '~/types'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const usersStore = useUsersStore()
const dayjs = useDayjs()

const users = computed(() => usersStore.users)
const loading = computed(() => usersStore.loading)

const emit = defineEmits<{
    edit: [user: UsersList]
    delete: [user: UsersList]
}>()

function formatDate(value: string | null): string {
    if (!value) return '—'
    const d = dayjs(value)
    return d.isValid() ? d.format('MMM D, YYYY h:mm A') : '—'
}

const columns: TableColumn<UsersList>[] = [
    {
        id: 'user',
        header: 'User',
        cell: ({ row }) => {
            const avatar = row.original.avatar
            const firstName = row.original.first_name
            const lastName = row.original.last_name
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
                            role ?? 'Super Admin',
                        ),
                    ]),
                ],
            )
        },
    },
    {
        accessorKey: 'phone_number',
        header: 'Phone number',
        meta: { class: { td: 'text-sm text-neutral-900 dark:text-neutral-100' } },
    },
    {
        id: 'shop',
        header: 'Shop',
        cell: ({ row }) => {
            const shop = row.original.shop_name
            if (!shop) return '—'
            return h(UBadge, { variant: 'soft', class: 'capitalize' }, () => shop)
        },
    },
    {
        id: 'address',
        header: 'Address',
        cell: ({ row }) => row.original.address ?? '—',
        meta: { class: { td: 'max-w-xs truncate text-sm text-neutral-600 dark:text-neutral-400' } },
    },
    {
        id: 'dateJoined',
        header: 'Date joined',
        cell: ({ row }) => formatDate(row.original.date_joined),
        meta: { class: { td: 'text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap' } },
    },
    {
        id: 'lastLogin',
        header: 'Last login',
        cell: ({ row }) => formatDate(row.original.last_login),
        meta: { class: { td: 'text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap' } },
    },
    {
        id: 'isActive',
        header: 'Is Active',
        cell: ({ row }) => {
            const isSet = row.original.is_password_set
            return h(UBadge, {
                color: isSet ? 'success' : 'warning',
                variant: 'soft',
            }, () => isSet ? 'Active' : 'Pending')
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

onMounted(async () => {
    await callOnce('users', () => usersStore.getUsers())
})
</script>

<template>
    <div class="space-y-4">
        <UTable :data="users" :columns="columns" :loading="loading" class="w-full" />
    </div>
</template>

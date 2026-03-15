<script setup lang="ts">
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const userRole = computed(() => {
  if (user.value?.profile?.role) {
    return user.value?.profile?.role === 'admin' ? 'Administrator' : 'Staff'
  }
  return 'Super Admin'
})
const navItems = [
  [
    {
      type: 'label' as const,
      label: 'Menu',
    },
    {
      label: 'Home',
      icon: 'i-lucide-home',
      to: '/admin',
    },
    {
      label: 'Orders',
      icon: 'i-lucide-clipboard-list',
      to: '/admin/orders',
    },
    {
      label: 'Products',
      icon: 'i-lucide-package',
      to: '/admin/products',
    },
    {
      label: 'Ingredients Inventory',
      icon: 'i-lucide-warehouse',
      to: '/admin/ingredients',
    },
    {
      label: 'Production',
      icon: 'i-lucide-factory',
      to: '/admin/production',
    },
    {
      label: 'Users',
      icon: 'i-lucide-users',
      to: '/admin/users',
    },
    {
      label: 'Reports',
      icon: 'i-lucide-bar-chart-3',
      to: '/admin/reports',
    },
  ],
]

function goToProfile() {
  navigateTo('/admin/profile')
}

function handleLogout() {
  authStore.logout()
  navigateTo('/admin/auth/login')
}

const userMenuItems = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      onSelect: goToProfile,
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: handleLogout,
      color: 'error',
    },
  ],
]
</script>

<template>
  <aside class="flex h-full w-full flex-col border-r border-neutral-200 dark:border-neutral-800">
    <UNavigationMenu orientation="vertical" :items="navItems"
      :ui="{ root: 'gap-2', item: 'py-1', link: 'py-3 text-base' }"
      class="w-full flex-1 px-4 py-4 data-[orientation=vertical]:w-full" />

    <div class="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <UDropdownMenu :items="userMenuItems">
        <button type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <UAvatar size="lg" alt="Admin" icon="i-lucide-user" />
          <div class="flex flex-col">
            <span class="text-sm font-medium text-neutral-900 dark:text-neutral-50">{{ user?.first_name }} {{
              user?.last_name }}</span>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">{{ userRole }}</span>
          </div>
        </button>
      </UDropdownMenu>
    </div>
  </aside>
</template>

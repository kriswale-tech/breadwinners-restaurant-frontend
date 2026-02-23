<script setup lang="ts">
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
</script>

<template>
  <aside class="flex h-full w-full flex-col border-r border-neutral-200 dark:border-neutral-800">
    <UNavigationMenu orientation="vertical" :items="navItems"
      :ui="{ root: 'gap-2', item: 'py-1', link: 'py-3 text-base' }"
      class="w-full flex-1 px-4 py-4 data-[orientation=vertical]:w-full" />
  </aside>
</template>

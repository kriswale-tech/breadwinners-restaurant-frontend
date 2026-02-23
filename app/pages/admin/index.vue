<script setup lang="ts">
// Placeholder stats – replace with real data later
const todayOrders = 0
const pendingOrders = 0
const lowStockCount = 0

const quickLinks = [
  { label: 'Add Products', to: '/admin/products', icon: 'i-lucide-plus-circle', color: 'primary' as const },
  { label: 'View Orders', to: '/admin/orders', icon: 'i-lucide-clipboard-list', color: 'info' as const },
  { label: 'Enter Kitchen', to: '/admin/orders', icon: 'i-lucide-utensils-crossed', color: 'success' as const },
  { label: 'Add Ingredient', to: '/admin/ingredients', icon: 'i-lucide-warehouse', color: 'warning' as const },
]
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-semibold text-neutral-900 dark:text-white">
      Dashboard
    </h1>

    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-3">
      <UCard class="border border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Icon name="i-lucide-shopping-bag" class="size-5" />
          </div>
          <div>
            <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Today's orders
            </p>
            <p class="text-2xl font-semibold text-neutral-900 dark:text-white">
              {{ todayOrders }}
            </p>
          </div>
        </div>
      </UCard>
      <UCard class="border border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <Icon name="i-lucide-clock" class="size-5" />
          </div>
          <div>
            <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Pending orders
            </p>
            <p class="text-2xl font-semibold text-neutral-900 dark:text-white">
              {{ pendingOrders }}
            </p>
          </div>
        </div>
      </UCard>
      <UCard class="border border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <Icon name="i-lucide-alert-triangle" class="size-5" />
          </div>
          <div>
            <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Low stock ingredients
            </p>
            <p class="text-2xl font-semibold text-neutral-900 dark:text-white">
              {{ lowStockCount }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick links -->
    <div>
      <h2 class="mb-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Quick actions
      </h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UButton
          v-for="link in quickLinks"
          :key="link.label"
          :to="link.to"
          :color="link.color"
          variant="solid"
          size="xl"
          :icon="link.icon"
          class="min-h-14 justify-start text-base font-medium"
        >
          {{ link.label }}
        </UButton>
      </div>
    </div>
  </div>
</template>

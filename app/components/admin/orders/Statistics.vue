<script setup lang="ts">
import type { OrderStatus } from '~/data/order'
import { statusBadgeColor } from '~/data/order'

const props = withDefaults(
  defineProps<{
    orders?: { status: OrderStatus }[]
  }>(),
  { orders: () => [] }
)

const statusOrder: OrderStatus[] = ['Pending', 'Confirmed', 'Cancelled', 'Done', 'Delivered']

const statusCounts = computed(() => {
  const counts = { Pending: 0, Confirmed: 0, Cancelled: 0, Done: 0, Delivered: 0 }
  for (const order of props.orders) {
    counts[order.status]++
  }
  return statusOrder.map((status) => ({
    status,
    count: counts[status],
    color: statusBadgeColor[status],
  }))
})

const colorBgClass: Record<string, string> = {
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  neutral: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700/50 dark:text-neutral-300',
  error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <UCard
      v-for="item in statusCounts"
      :key="item.status"
      class="border border-neutral-200 dark:border-neutral-700"
    >
      <div class="flex items-center gap-3">
        <div
          :class="[
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            colorBgClass[item.color],
          ]"
        >
          <Icon
            v-if="item.status === 'Pending'"
            name="i-lucide-clock"
            class="size-5"
          />
          <Icon
            v-else-if="item.status === 'Confirmed'"
            name="i-lucide-circle-check"
            class="size-5"
          />
          <Icon
            v-else-if="item.status === 'Cancelled'"
            name="i-lucide-x-circle"
            class="size-5"
          />
          <Icon
            v-else-if="item.status === 'Done'"
            name="i-lucide-check-circle"
            class="size-5"
          />
          <Icon
            v-else
            name="i-lucide-truck"
            class="size-5"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {{ item.status }}
          </p>
          <p class="text-2xl font-semibold text-neutral-900 dark:text-white">
            {{ item.count }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

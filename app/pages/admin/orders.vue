<script setup lang="ts">
import { orders, type OrderStatus } from '~/data/order'
import type { Order } from '~/data/order'

const toast = useToast()

const ALL_VALUE = 'all'

const searchQuery = ref('')
const statusFilter = ref<string>(ALL_VALUE)
const shopFilter = ref<string>(ALL_VALUE)

const statusOptions = [
  { label: 'All', value: ALL_VALUE },
  { label: 'Pending', value: 'Pending' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Done', value: 'Done' },
  { label: 'Delivered', value: 'Delivered' },
]

const shopOptions = computed(() => {
  const names = [...new Set(orders.value.map((o) => o.shop))].sort()
  return [{ label: 'All', value: ALL_VALUE }, ...names.map((name) => ({ label: name, value: name }))]
})

const filteredOrders = computed(() => {
  let list: Order[] = orders.value

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.phoneNumber.replace(/\s/g, '').toLowerCase().includes(q.replace(/\s/g, ''))
    )
  }

  if (statusFilter.value && statusFilter.value !== ALL_VALUE) {
    list = list.filter((o) => o.status === statusFilter.value)
  }

  if (shopFilter.value && shopFilter.value !== ALL_VALUE) {
    list = list.filter((o) => o.shop === shopFilter.value)
  }

  return list
})

const modalOpen = ref(false)
const selectedOrderId = ref<string | null>(null)

function openOrderDetails(orderId: string) {
  selectedOrderId.value = orderId
  modalOpen.value = true
}

function handleUpdateStatus(payload: { orderId: string; status: OrderStatus }) {
  const order = orders.value.find((o) => o.orderId === payload.orderId)
  if (order) {
    order.status = payload.status
    toast.add({
      title: 'Status updated',
      description: `Order #${payload.orderId} is now ${payload.status}.`,
      color: 'success',
      icon: 'i-lucide-check',
    })
  }
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold text-neutral-900 dark:text-white">
      Orders
    </h1>
    <p class="text-neutral-600 dark:text-neutral-400">
      Manage and view orders.
    </p>
    <AdminOrdersStatistics :orders="filteredOrders" />
    <div class="flex flex-wrap items-end gap-3 mt-10! mb-5!">
      <UInput v-model="searchQuery" placeholder="Search by Order ID or phone..." class="min-w-0 flex-1 sm:max-w-xs"
        icon="i-lucide-search" />
      <div class="flex items-center gap-2">
        <span>Status:</span>
        <USelect v-model="statusFilter" :items="statusOptions" placeholder="Status" value-key="value"
          class="w-full sm:w-40" />
      </div>
      <div class="flex items-center gap-2">
        <span>Shop:</span>
        <USelect v-model="shopFilter" :items="shopOptions" placeholder="Shop" value-key="value"
          class="w-full sm:w-48" />
      </div>
    </div>
    <AdminOrdersTableComponent
      :data="filteredOrders"
      @update-status="handleUpdateStatus"
      @select-order="openOrderDetails"
    />
    <AdminOrdersOrderDetailsModal
      v-model:open="modalOpen"
      :order-id="selectedOrderId"
      :orders="orders"
      @update-status="handleUpdateStatus"
    />
  </div>
</template>

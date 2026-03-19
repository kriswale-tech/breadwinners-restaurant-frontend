<script setup lang="ts">
import type { Order, OrderStatus } from '~/types/orders'
import type { ErrorResponse } from '~/types/error'

const toast = useToast()
const orderStore = useOrderStore()

const ALL_VALUE = 'all'

const searchQuery = ref('')
const statusFilter = ref<OrderStatus | typeof ALL_VALUE>(ALL_VALUE)

type StatusPayload = { orderId: number; status: OrderStatus }


// confirm order status update modal
const showPromptModal = ref(false)
const selectedOrderStatus = ref<OrderStatus | null>(null)
const statusPayload = ref<StatusPayload | null>(null)

function statusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const statusOptions = [
  { label: 'All', value: ALL_VALUE },
  { label: statusLabel('pending'), value: 'pending' as const },
  { label: statusLabel('confirmed'), value: 'confirmed' as const },
  { label: statusLabel('cancelled'), value: 'cancelled' as const },
  { label: statusLabel('done'), value: 'done' as const },
  { label: statusLabel('delivered'), value: 'delivered' as const },
]

const filteredOrders = computed(() => {
  let list: Order[] = orderStore.orders

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter((o) => {
      const phone = o.customer_phone.replace(/\s/g, '').toLowerCase()
      return (
        o.order_number.toLowerCase().includes(q) ||
        String(o.id).toLowerCase().includes(q) ||
        phone.includes(q.replace(/\s/g, ''))
      )
    })
  }

  if (statusFilter.value && statusFilter.value !== ALL_VALUE) {
    list = list.filter((o) => o.status === statusFilter.value)
  }

  return list
})

const modalOpen = ref(false)
const selectedOrderId = ref<number | null>(null)

function openOrderDetails(orderId: number) {
  selectedOrderId.value = orderId
  modalOpen.value = true
}

function closeConfirmOrderStatusUpdateModal() {
  showPromptModal.value = false
  selectedOrderStatus.value = null

}

function handleUpdateStatus(payload: StatusPayload) {
  selectedOrderStatus.value = payload.status
  showPromptModal.value = true
  statusPayload.value = payload
}

async function confirmOrderStatusUpdate() {
  const payload = statusPayload.value
  if (!payload) return

  try {
    await orderStore.updateOrder(payload.orderId, { status: payload.status })
    await orderStore.getOrderDetail(payload.orderId)
    closeConfirmOrderStatusUpdateModal()
  } catch (error) {
    console.error(error)
    const errorResponse = error as ErrorResponse
    toast.add({
      title: errorResponse.message || 'Error',
      description: errorResponse.detail || 'Failed to update order status',
      color: 'error',
      icon: 'i-lucide-x',
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

    <!-- statistics -->
    <AdminOrdersStatistics :orders="filteredOrders" />

    <!-- filters -->
    <div class="flex flex-wrap items-end gap-3 mt-10! mb-5!">
      <UInput v-model="searchQuery" placeholder="Search by Order ID or phone..." class="min-w-0 flex-1 sm:max-w-xs"
        icon="i-lucide-search" />
      <div class="flex items-center gap-2">
        <span>Status:</span>
        <USelect v-model="statusFilter" :items="statusOptions" placeholder="Status" value-key="value"
          class="w-full sm:w-40" />
      </div>

      <!-- create new order button -->
      <div class="flex items-center gap-2 ml-auto">
        <NuxtLink to="/admin/orders/create">
          <UButton color="primary" variant="subtle" icon="i-lucide-plus">Create New Order</UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- table -->
    <AdminOrdersTableComponent :data="filteredOrders" @update-status="handleUpdateStatus"
      @select-order="openOrderDetails" />

    <!-- order details modal -->
    <AdminOrdersOrderDetailsModal v-model:open="modalOpen" :order-id="selectedOrderId"
      @update-status="handleUpdateStatus" />

    <!-- confirm order status update modal -->
    <SharedPromptCard v-if="showPromptModal" @close="closeConfirmOrderStatusUpdateModal" :open="showPromptModal"
      :title="`Confirm ${selectedOrderStatus} Status`"
      :description="`Are you sure you want to update the order status to ${selectedOrderStatus}?`"
      :buttonText="`Confirm`" :type="`warning`" @confirm="confirmOrderStatusUpdate" />
  </div>
</template>

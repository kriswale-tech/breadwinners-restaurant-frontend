<script setup lang="ts">
import type { OrderDetail } from '~/types/orders'
import type { ErrorResponse } from '~/types/error'

definePageMeta({
  theme: 'amber',
})

const route = useRoute()
const cartStore = useCartStore()

const phone = ref('')
const orderNumber = ref('')
const order = ref<OrderDetail | null>(null)
const trackError = ref('')
const trackSuccessMessage = ref('')
const tracking = ref(false)

onMounted(() => {
  const qOrder = route.query.order
  if (typeof qOrder === 'string' && qOrder.trim()) orderNumber.value = qOrder.trim()
  const qPhone = route.query.phone
  if (typeof qPhone === 'string' && qPhone.trim()) phone.value = qPhone.trim()
})

async function onTrack() {
  trackError.value = ''
  trackSuccessMessage.value = ''
  order.value = null

  const p = phone.value.trim()
  const o = orderNumber.value.trim()
  if (!p || !o) {
    trackError.value = 'Enter the phone number and order number from your confirmation.'
    return
  }

  tracking.value = true
  try {
    const data = await cartStore.trackOrder(p, o)
    if (data?.status?.toLowerCase() === 'success' && data.order) {
      order.value = data.order
      trackSuccessMessage.value = data.message?.trim() || ''
    } else {
      trackError.value =
        data?.message?.trim() || 'We couldn’t find an order matching those details.'
    }
  } catch (e) {
    const err = e as ErrorResponse
    trackError.value =
      err?.detail?.trim()
      || err?.message?.trim()
      || 'Something went wrong. Please try again.'
  } finally {
    tracking.value = false
  }
}

function clearResult() {
  order.value = null
  trackError.value = ''
  trackSuccessMessage.value = ''
  phone.value = ''
  orderNumber.value = ''

}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function handleDownloadReceipt() {
  if (!import.meta.client) return
  window.print()
}
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-b from-neutral-50 via-white to-neutral-100/80 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 pt-20">
    <div class="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <!-- Header -->
      <div class="mb-10 text-center">
        <div
          class="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary-100 shadow-inner dark:bg-primary-950/50">
          <Icon name="heroicons:map-pin" class="size-9 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          Track your order
        </h1>
        <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Enter the phone number and order number from your SMS or receipt. We’ll show your order status and
          items below.
        </p>
      </div>

      <div class="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <!-- Form column -->
        <div class="lg:col-span-2">
          <div
            class="rounded-2xl border border-neutral-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/80">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Lookup
            </h2>
            <form class="track-lookup-form mt-5 space-y-5" @submit.prevent="onTrack">
              <UFormField label="Phone number" name="phone" required
                description="10 digits, format 0XXXXXXXXX (leading zero, then 9 digits).">
                <UInput v-model="phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="0551234567"
                  maxlength="10" pattern="^0[0-9]{9}$" size="lg" class="w-full" icon="heroicons:device-phone-mobile" />
              </UFormField>
              <UFormField label="Order number" name="order_number" required
                description="Exactly as printed on your receipt or sent by SMS.">
                <UInput v-model="orderNumber" autocomplete="off" placeholder="e.g. ORDXXXXXXXXX" size="lg"
                  class="w-full" icon="heroicons:hashtag" />
              </UFormField>

              <UAlert v-if="trackError" color="error" variant="soft" title="Failed" :description="trackError" />

              <UButton type="submit" block size="lg" label="Track order" icon="heroicons:magnifying-glass"
                :loading="tracking" :disabled="tracking" />
            </form>

          </div>
        </div>

        <!-- Results column -->
        <div class="lg:col-span-3">
          <div v-if="!order"
            class="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white/50 px-6 py-16 text-center dark:border-neutral-600 dark:bg-neutral-900/40">
            <Icon name="heroicons:clipboard-document-list" class="size-12 text-neutral-400 dark:text-neutral-500" />
            <p class="mt-4 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              No order loaded yet
            </p>
            <p class="mt-1 max-w-xs text-xs text-neutral-500 dark:text-neutral-400">
              Fill in the form and tap <span class="font-medium text-neutral-700 dark:text-neutral-300">Track
                order</span>
              to see your order status and receipt.
            </p>
          </div>

          <div v-else class="space-y-6">
            <div
              class="no-print rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="flex items-start gap-3">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-200/80 dark:bg-emerald-900/50">
                    <Icon name="heroicons:check-circle" class="size-6 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-emerald-900 dark:text-emerald-100">
                      Order found
                    </p>

                    <p class="mt-0.5 font-mono text-sm text-emerald-800/90 dark:text-emerald-200/80">
                      {{ order.order_number }}
                    </p>
                    <div class="mt-4 space-y-1 border-t border-emerald-200/60 pt-4 dark:border-emerald-800/50">
                      <p
                        class="text-xs font-medium uppercase tracking-wide text-emerald-800/70 dark:text-emerald-300/70">
                        Order status
                      </p>
                      <div class="flex flex-wrap items-center gap-2">
                        <UBadge color="primary" variant="subtle" size="md">
                          {{ statusLabel(order.status) }}
                        </UBadge>
                      </div>
                      <p class="text-xs text-emerald-800/85 dark:text-emerald-200/75">
                        <span class="font-medium">Last updated</span>
                        {{ formatDateTime(order.updated_at) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">

                  <UButton label="New search" color="neutral" variant="outline" size="sm" class="sm:w-full"
                    @click="clearResult" />
                </div>
              </div>
            </div>

            <CheckoutOrderReceipt :order="order" />
          </div>
        </div>
      </div>

      <div class="mt-12 text-center no-print">
        <UButton to="/" variant="ghost" color="neutral" label="Back to home" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.track-lookup-form :deep(.ui-form-field) {
  width: 100%;
}
</style>

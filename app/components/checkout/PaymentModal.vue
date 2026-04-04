<script setup lang="ts">
import type { ErrorResponse } from '~/types/error'
import type { VerifyPaymentResponse } from '~/stores/cart-store'
import { storePaymentOrderDetail } from '~/utils/payment-order-storage'

/**
 * Payment modal: processing or failed.
 * When `paymentReference` is set and the modal opens, calls verifyPayment and navigates on success.
 */

export type PaymentModalStatus = 'processing' | 'failed'

const props = withDefaults(
    defineProps<{
        open: boolean
        /** Paystack (or gateway) reference from route query — triggers verify when modal opens */
        paymentReference?: string | null
        /** Manual state when not using paymentReference */
        status?: PaymentModalStatus
    }>(),
    {
        paymentReference: null,
        status: 'processing',
    }
)

const emit = defineEmits<{
    'update:open': [value: boolean]
    'verified': [data: VerifyPaymentResponse]
}>()

const cartStore = useCartStore()
const shopStore = useShopStore()
const { selectedShopId } = storeToRefs(shopStore)
const verificationFailed = ref(false)
const errorMessage = ref('')
const lastAttemptedReference = ref<string | null>(null)
const alternativeErrorMessage = ref('Something went wrong. You can try again or contact support if the problem continues.')

function close() {
    emit('update:open', false)
}

watch(
    () => props.open,
    (isOpen) => {
        if (!isOpen) {
            verificationFailed.value = false
            errorMessage.value = ''
            lastAttemptedReference.value = null
        }
    }
)

async function runVerification(reference: string) {
    verificationFailed.value = false
    errorMessage.value = ''

    try {
        console.log('Verifying payment for reference:', reference)
        const data = await cartStore.verifyPayment(reference, selectedShopId.value!)
        console.log('Payment verification response:', data)
        if (
            data?.status?.toLowerCase() === 'success'
            && data.order?.order_number
        ) {
            storePaymentOrderDetail(data.order)
            emit('verified', data)
            emit('update:open', false)
            await navigateTo(
                `/checkout/${encodeURIComponent(data.order.order_number)}/payment-success`,
            )
            return
        }

        verificationFailed.value = true
        errorMessage.value =
            data?.message?.trim() || 'Payment could not be verified. Please try again or contact support.'
    } catch (error) {
        verificationFailed.value = true
        const err = error as ErrorResponse
        errorMessage.value =
            err?.detail?.trim() ||
            err?.message?.trim() ||
            (error instanceof Error ? error.message : 'Something went wrong while verifying payment.')
    }
}

watch(
    () => [props.open, props.paymentReference] as const,
    ([isOpen, ref]) => {
        if (!isOpen || !ref) return
        // if (lastAttemptedReference.value === ref) return

        lastAttemptedReference.value = ref
        runVerification(ref)
    },
    { flush: 'post' }
)

const displayFailed = computed(() => {
    if (props.paymentReference) return verificationFailed.value
    return props.status === 'failed'
})

const displayProcessing = computed(() => {
    if (props.paymentReference) return !verificationFailed.value
    return props.status === 'processing'
})

const modalTitle = computed(() =>
    displayFailed.value ? 'Payment failed' : 'Processing payment',
)

onMounted(() => {
    console.log('Payment modal mounted')
    if (props.paymentReference) {
        runVerification(props.paymentReference)
    }
})
</script>

<template>
    <UModal :open="open" :title="modalTitle" :ui="{ content: 'w-[calc(100vw-2rem)] max-w-md' }"
        @update:open="emit('update:open', $event)">
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>

        <template #body>
            <!-- Processing -->
            <div v-if="displayProcessing" class="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <Icon name="heroicons:arrow-path" class="size-12 animate-spin text-primary-600" aria-hidden="true" />
                <p class="text-base text-neutral-700 dark:text-neutral-300">
                    Processing payment, please wait.
                </p>
            </div>

            <!-- Failed -->
            <div v-else-if="displayFailed" class="flex flex-col items-center gap-6 py-6 text-center">
                <div class="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                    <Icon name="heroicons:x-circle" class="size-9 text-red-600 dark:text-red-400" />
                </div>
                <div class="space-y-1">
                    <p class="text-lg font-semibold text-neutral-900 dark:text-white">
                        Payment unsuccessful
                    </p>
                    <p class="text-sm text-neutral-600 dark:text-neutral-400">
                        {{
                            errorMessage || alternativeErrorMessage
                        }}
                    </p>
                </div>
                <div class="flex gap-2 justify-center items-center">
                    <UButton color="neutral" variant="outline" label="Close" @click="close" />
                    <!-- retry button -->
                    <UButton color="primary" variant="outline" label="Retry"
                        @click="runVerification(props.paymentReference!)" />
                </div>
            </div>
        </template>

        <template #footer>
            <div v-if="displayProcessing" class="flex w-full justify-end">
                <UButton color="neutral" variant="ghost" label="Cancel" @click="close" />
            </div>
        </template>
    </UModal>
</template>

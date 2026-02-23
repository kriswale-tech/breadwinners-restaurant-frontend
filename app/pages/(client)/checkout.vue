<script setup lang="ts">
/**
 * Checkout Page
 * Displays customer information form and order summary side by side
 */

import type { CustomerFormData } from '~/components/checkout/CustomerInfo.vue'

const cartStore = useCartStore()
const toast = useToast()

// Reference to CustomerInfo component to access form data and validation
const customerInfoRef = ref<{
    form: Ref<CustomerFormData>
    getFormData: () => CustomerFormData
    validateForm: () => boolean
    showValidationErrors: () => void
    state: CustomerFormData
} | null>(null)

// Handle payment button click from OrderSummary
const handleMakePayment = () => {
    // Validate customer information
    if (!customerInfoRef.value) {
        toast.add({
            title: 'Error',
            description: 'Form not initialized. Please refresh the page.',
            color: 'error',
            icon: 'heroicons:exclamation-triangle'
        })
        return
    }

    // Always log coordinates and address when delivery is selected (from reactive state)
    const state = customerInfoRef.value.state
    if (state.deliveryType === 'delivery') {
        console.log('Delivery Coordinates:', state.coordinates)
        console.log('Delivery Address:', state.address)
    }

    // Show validation errors before validating
    customerInfoRef.value.showValidationErrors()

    const isValid = customerInfoRef.value.validateForm()

    if (isValid) {
        // Log form data to console on success (use getFormData() for reliable current data)
        const formData = customerInfoRef.value.getFormData()
        console.log('Payment validation passed!')
        console.log('Customer Information:', formData)
        console.log('Order Items:', cartStore.items)
        console.log('Total Price:', cartStore.totalPrice)

        // Log coordinates and address again on success
        if (formData.deliveryType === 'delivery') {
            console.log('Delivery Coordinates:', formData.coordinates)
            console.log('Delivery Address:', formData.address)
        }

        toast.add({
            title: 'Validation Successful',
            description: 'Form data is valid. Ready to process payment.',
            color: 'success',
            icon: 'heroicons:check-circle'
        })
    } else {
        // Show error toast
        toast.add({
            title: 'Validation Failed',
            description: 'Please check the form and fix any errors before proceeding.',
            color: 'error',
            icon: 'heroicons:exclamation-triangle'
        })
    }
}

</script>

<template>
    <div class="container mx-auto px-4 py-32 min-h-screen">
        <!-- Empty cart state -->
        <div
            v-if="cartStore.items.length === 0"
            class="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/50 px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-800/30"
        >
            <div class="mb-4 flex size-20 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                <Icon name="heroicons:shopping-cart" class="size-10 text-neutral-500 dark:text-neutral-400" />
            </div>
            <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">
                Your cart is empty
            </h2>
            <p class="mt-2 max-w-sm text-neutral-600 dark:text-neutral-400">
                Add something delicious from our menu, then come back here to complete your order.
            </p>
            <UButton
                to="/"
                size="lg"
                color="primary"
                class="mt-8"
                icon="heroicons:arrow-left"
            >
                Back to home
            </UButton>
        </div>

        <!-- Checkout content when cart has items -->
        <template v-else>
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    Checkout
                </h1>
                <p class="text-neutral-600 dark:text-neutral-400">
                    Complete your order by providing your information below
                </p>
            </div>

            <!-- Main Content: Flex Layout -->
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Left: Customer Information Form -->
                <div class="w-full">
                    <div
                        class="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                        <CheckoutCustomerInfo ref="customerInfoRef" />
                    </div>
                </div>
                <!-- Right: Order Summary -->
                <div class="w-96 shrink-0">
                    <div class="sticky top-20">
                        <div
                            class="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <CheckoutOrderSummary @make-payment="handleMakePayment" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

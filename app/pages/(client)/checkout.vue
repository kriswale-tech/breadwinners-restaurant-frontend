<script setup lang="ts">
import type { ErrorResponse } from '~/types/error'

import type { CustomerFormData } from '~/components/checkout/CustomerInfo.vue'
import { formatCoord } from '~/utils/utils'

const cartStore = useCartStore()
const toast = useToast()

// Reference to CustomerInfo component to access form data and validation
const customerInfoRef = ref<{
    form: Ref<CustomerFormData>
    getFormData: () => CustomerFormData
    validateForm: () => boolean
    showValidationErrors: () => void
    resetForm: () => void
    state: CustomerFormData
} | null>(null)

// Reset customer information form
const resetCustomerInfo = () => {
    if (customerInfoRef.value) {
        customerInfoRef.value.resetForm()
    }
    cartStore.clearCart()
}

// build order payload function
const buildOrderPayload = (formData: CustomerFormData) => {
    // separate products and packages
    const products = cartStore.items.filter(item => item.item_type === 'product').map(item => ({
        product: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: typeof item.price === 'string' ? parseFloat(item.price) : item.price * item.quantity,
    }))
    const packages = cartStore.items.filter(item => item.item_type === 'package').map(item => ({
        package: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: typeof item.price === 'string' ? parseFloat(item.price) : item.price * item.quantity,
    }))
    console.log('Products in Cart:', JSON.stringify(cartStore.items, null, 2))
    const items = [...products, ...packages]
    console.log('Items to be sent:', JSON.stringify(items, null, 2))

    return {
        customer_name: formData.name,
        customer_phone: formData.phone,
        total_amount: cartStore.totalPrice,
        delivery_method: formData.deliveryType,
        delivery_address: formData.address,
        address_latitude: formatCoord(formData.coordinates?.lat, 10),
        address_longitude: formatCoord(formData.coordinates?.lng, 11),
        delivery_notes: formData.notes,
        email: formData.email,
        items: items,
    }
}

// Handle payment button click from OrderSummary
const handleMakePayment = async () => {
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

        const payload = buildOrderPayload(formData)
        console.log('Payload:', JSON.stringify(payload, null, 2))

        try {
            await cartStore.createOrder(payload)
            toast.add({
                title: 'Order created successfully',
                description: 'You\'ll receive a confirmation email shortly, you can track the status of your order from here.',
                color: 'success',
                icon: 'heroicons:check-circle',
                actions: [
                    {
                        label: 'Track order',
                        color: 'primary',
                        variant: 'soft',
                        onClick: () => {
                            navigateTo('/track-order')
                        }
                    }
                ]
            })
            resetCustomerInfo()
        } catch (error) {
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to create order',
                color: 'error',
                icon: 'heroicons:x-circle'
            })
        }
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
        <div v-if="cartStore.items.length === 0"
            class="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/50 px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-800/30">
            <div class="mb-4 flex size-20 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                <Icon name="heroicons:shopping-cart" class="size-10 text-neutral-500 dark:text-neutral-400" />
            </div>
            <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">
                Your cart is empty
            </h2>
            <p class="mt-2 max-w-sm text-neutral-600 dark:text-neutral-400">
                Add something delicious from our menu, then come back here to complete your order.
            </p>
            <UButton to="/" size="lg" color="primary" class="mt-8" icon="heroicons:arrow-left">
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

<script setup lang="ts">
import type { ErrorResponse } from '~/types/error'
const orderStore = useOrderStore()

import type { CustomerFormData } from '~/components/checkout/CustomerInfo.vue'
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
}

const buildOrderPayload = (formData: CustomerFormData) => {
    // separate products and packages
    const products = orderStore.itemsInCart.filter(item => item.item_type === 'product').map(item => ({
        product: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: typeof item.price === 'string' ? parseFloat(item.price) : item.price * item.quantity,
    }))
    const packages = orderStore.itemsInCart.filter(item => item.item_type === 'package').map(item => ({
        package: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: typeof item.price === 'string' ? parseFloat(item.price) : item.price * item.quantity,
    }))
    console.log('Products in Cart:', JSON.stringify(orderStore.itemsInCart, null, 2))
    const items = [...products, ...packages]
    console.log('Items to be sent:', JSON.stringify(items, null, 2))

    return {
        customer_name: formData.name,
        customer_phone: formData.phone,
        total_amount: orderStore.totalPrice,
        delivery_method: formData.deliveryType,
        delivery_address: formData.address,
        address_latitude: formData.coordinates?.lat,
        address_longitude: formData.coordinates?.lng,
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
        console.log('Order Items:', orderStore.itemsInCart)
        console.log('Total Price:', orderStore.totalPrice)

        // Log coordinates and address again on success
        if (formData.deliveryType === 'delivery') {
            console.log('Delivery Coordinates:', formData.coordinates)
            console.log('Delivery Address:', formData.address)
        }

        const payload = buildOrderPayload(formData)
        console.log('Payload:', JSON.stringify(payload, null, 2))

        try {
            await orderStore.createOrder(payload)
            toast.add({
                title: 'Success',
                description: 'Order created successfully',
                color: 'success',
                icon: 'heroicons:check-circle'
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
    <div>
        <h1>Create New Order</h1>

        <!-- Main Content: Flex Layout -->
        <div class="flex flex-col xl:flex-row gap-6 mt-10">
            <!-- Left: Customer Information Form -->
            <div class="w-full">
                <div
                    class="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                    <CheckoutCustomerInfo ref="customerInfoRef" />
                </div>
            </div>
            <!-- Right: Order Summary -->
            <div class="w-full xl:w-[40%] shrink-0">
                <div class="sticky top-20 space-y-6">
                    <div class="border border-neutral-200 dark:border-neutral-700 rounded-xl p-3">
                        <AdminOrdersSelectProducts />
                    </div>
                    <div class="border border-neutral-200 dark:border-neutral-700 rounded-xl p-3">
                        <CheckoutOrderSummary :items="orderStore.itemsInCart" :totalPrice="orderStore.totalPrice"
                            button-label="Create Order" @clear-products="orderStore.clearCart" allow-clear
                            :loading="orderStore.loading" @remove-product="orderStore.removeProduct"
                            @make-payment="handleMakePayment" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped></style>
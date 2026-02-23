<script setup lang="ts">
/**
 * CustomerInfo Component
 * Handles customer information and delivery options form
 * Uses Nuxt UI form validation strategies
 */

// Form data interface
export interface CustomerFormData {
    name: string
    phone: string
    email?: string
    deliveryType: 'delivery' | 'pickup'
    address: string
    coordinates?: { lat: number; lng: number }
    notes: string
}

// Expose form data and validation state for parent component
const form = ref<CustomerFormData>({
    name: '',
    phone: '',
    email: '',
    deliveryType: 'delivery',
    address: '',
    coordinates: undefined,
    notes: ''
})

// Nuxt UI form state
const state = reactive({
    name: '',
    phone: '',
    email: '',
    deliveryType: 'delivery' as 'delivery' | 'pickup',
    address: '',
    coordinates: undefined as { lat: number; lng: number } | undefined,
    notes: ''
})

// Validation rules using Nuxt UI validation
const validate = {
    name: (value: string) => {
        if (!value?.trim()) {
            return 'Name is required'
        }
        return true
    },
    phone: (value: string) => {
        if (!value?.trim()) {
            return 'Phone number is required'
        }
        if (!/^[0-9+\-\s()]+$/.test(value)) {
            return 'Please enter a valid phone number'
        }
        return true
    },
    email: (value: string) => {
        // Email is optional, but if provided, must be valid
        if (value && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address'
        }
        return true
    },
    address: (value: string) => {
        // Address is required only if delivery is selected
        if (state.deliveryType === 'delivery' && !value?.trim()) {
            return 'Delivery address is required'
        }
        return true
    }
}

// Sync state with form ref for external access
watch(state, (newState) => {
    form.value = { ...newState }
}, { deep: true })

// Single handler for delivery address selection (from map, search, or use my location)
const handleDeliveryLocationSelected = (data: { address: string; coordinates: { lat: number; lng: number } }) => {
    state.address = data.address
    state.coordinates = data.coordinates
}

// Watch delivery type changes to clear address validation
watch(() => state.deliveryType, () => {
    if (state.deliveryType === 'pickup') {
        state.address = ''
        state.coordinates = undefined
    }
})

// Flag to control when to show validation errors
const showErrors = ref(false)

// Function to trigger showing validation errors
const showValidationErrors = () => {
    showErrors.value = true
}

// Expose validation function for parent component
const validateForm = (): boolean => {
    // Trigger showing errors when validation is attempted
    showErrors.value = true

    const nameValid = validate.name(state.name)
    const phoneValid = validate.phone(state.phone)
    const emailValid = validate.email(state.email)
    const addressValid = validate.address(state.address)

    return nameValid === true && phoneValid === true && emailValid === true && addressValid === true
}

// Helper function to get error message only if showErrors is true
const getError = (field: 'name' | 'phone' | 'email' | 'address') => {
    if (!showErrors.value) return undefined

    const result = validate[field](state[field])
    return result !== true ? result : undefined
}

// Get current form data (reliable for parent to read)
const getFormData = (): CustomerFormData => ({
    ...state,
    coordinates: state.coordinates ? { ...state.coordinates } : undefined
})

// Expose form data and validation function
defineExpose({
    form,
    getFormData,
    validateForm,
    showValidationErrors,
    state
})
</script>

<template>
    <div class="space-y-6">
        <!-- Customer Information Section -->
        <div class="space-y-4">
            <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                Customer Information
            </h3>

            <!-- Name Field -->
            <UFormField label="Full Name" name="name" :error="getError('name')" required>
                <UInput v-model="state.name" placeholder="Enter your full name" size="lg" class="w-full" />
            </UFormField>

            <!-- Phone Number Field -->
            <UFormField label="Phone Number" name="phone" :error="getError('phone')" required>
                <UInput v-model="state.phone" type="tel" placeholder="Enter your phone number" size="lg"
                    class="w-full" />
            </UFormField>

            <!-- Email Field (Optional) -->
            <UFormField label="Email Address (Optional)" name="email" :error="getError('email')">
                <UInput v-model="state.email" type="email" placeholder="Enter your email address (optional)" size="lg"
                    class="w-full" />
            </UFormField>
        </div>

        <!-- Delivery Options Section -->
        <div class="space-y-4">
            <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                Delivery Options
            </h3>

            <!-- Delivery Type -->
            <UFormField label="Delivery Type" name="deliveryType">
                <div class="flex gap-2">
                    <button type="button"
                        class="flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                        :class="state.deliveryType === 'delivery'
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-neutral-600'"
                        @click="state.deliveryType = 'delivery'">
                        <Icon name="heroicons:truck" class="size-4" />
                        Delivery
                    </button>
                    <button type="button"
                        class="flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                        :class="state.deliveryType === 'pickup'
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-neutral-600'"
                        @click="state.deliveryType = 'pickup'">
                        <Icon name="heroicons:building-storefront" class="size-4" />
                        Pickup
                    </button>
                </div>
            </UFormField>

            <!-- Delivery Address (only show if delivery is selected) -->
            <div v-if="state.deliveryType === 'delivery'" class="space-y-4">
                <UFormField label="Delivery Address" name="address" :error="getError('address')" required>
                    <CheckoutDeliveryAddressComponent :address="state.address" :coordinates="state.coordinates"
                        :error="getError('address')" @location-selected="handleDeliveryLocationSelected" />
                </UFormField>
            </div>

            <!-- Pickup Information (only show if pickup is selected) -->
            <UAlert v-if="state.deliveryType === 'pickup'" icon="heroicons:information-circle" color="info"
                variant="soft" title="Pickup Information"
                description="Your order will be ready for pickup at our bakery. We'll contact you when it's ready." />
        </div>

        <!-- Notes Section -->
        <div class="space-y-4">
            <UFormField label="Notes (Optional)" name="notes">
                <UTextarea v-model="state.notes" placeholder="Any special instructions for your order..." :rows="2"
                    size="lg" class="w-full" />
            </UFormField>
        </div>
    </div>
</template>

<style scoped>
/* Ensure form fields take full width */
:deep(.ui-form-field) {
    width: 100%;
}
</style>

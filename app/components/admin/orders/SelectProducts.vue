<script setup lang="ts">
const productStore = useProductStore()
const orderStore = useOrderStore()
const productId = ref<string | undefined>(undefined)
const quantityOrdered = ref<number | null>(null)
const productError = ref<string | boolean>(false)
const quantityError = ref<string | boolean>(false)

const productOptions = computed(() => {
    const packages = productStore.packages.map((p) => ({
        ...p,
        label: p.name + ' (Package)',
        value: 'package' + p.id,
        item_type: 'package' as const,
    }))
    const products = productStore.products.map((p) => ({
        ...p,
        label: p.name + ' (Product)',
        value: 'product' + p.id,
        item_type: 'product' as const,
    }))
    return [...packages, ...products]
})

function addProduct() {
    if (!productId.value) {
        productError.value = "Please select a product"
        return
    }

    if (!quantityOrdered.value) {
        quantityError.value = "Please enter a quantity"
        return
    }

    const item = productOptions.value.find((p) => p.value === productId.value)
    if (!item) {
        productError.value = "Product not found"
        return
    }

    orderStore.addToCart({ ...item, quantity: quantityOrdered.value })
    console.log(JSON.stringify({ ...item, quantity: quantityOrdered.value }, null, 2))


    productId.value = undefined
    quantityOrdered.value = null
    productError.value = false
    quantityError.value = false
}
</script>

<template>
    <form @submit.prevent="addProduct" class="flex w-full items-start gap-3">
        <UFormField label="Product" name="product" required class="flex-2 min-w-0" :error="productError">
            <USelectMenu v-model="productId" :items="productOptions" value-key="value" placeholder="Select product"
                class="w-full" />
        </UFormField>

        <div class="flex-1 min-w-[140px]">
            <UFormField label="Quantity ordered" name="quantity_ordered" required :error="quantityError">
                <UInput v-model.number="quantityOrdered" type="number" min="1" step="1" placeholder="e.g. 20" size="lg"
                    required class="w-full" />
            </UFormField>
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Must be a positive whole number.
            </p>
        </div>

        <div class="flex items-end self-center relative bottom-1.5">
            <UButton color="primary" variant="subtle" icon="i-lucide-plus" class="w-24 shrink-0" type="submit">
                Add
            </UButton>
        </div>
    </form>
</template>

<style lang="css" scoped></style>
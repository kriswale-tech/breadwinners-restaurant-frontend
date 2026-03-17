<script setup lang="ts">
import type { ErrorResponse } from '~/types/error'
import type { Inventory } from '~/types/inventory'
import type { ProductionRecordPayload } from '~/types/inventory'

const { products } = storeToRefs(useProductStore())
const { ingredients } = storeToRefs(useInventoryStore())
const inventoryStore = useInventoryStore()
const toast = useToast()

interface IngredientRow {
    ingredientId: number
    quantityUsed: number
}

const productId = ref<number | undefined>(undefined)
const quantityProduced = ref<number | null>(null)

// Persisted ingredient list
const ingredientRows = ref<IngredientRow[]>([])

// Current ingredient form
const newIngredientId = ref<number | undefined>(undefined)
const newQuantityUsed = ref<number | null>(null)

const showPreviewModal = ref(false)
const submitting = ref(false)

const productOptions = computed(() =>
    products.value.map((p) => ({
        label: p.name,
        value: p.id,
    })),
)

const ingredientOptions = computed(() =>
    ingredients.value.map((i) => ({
        label: i.name,
        value: i.id,
    })),
)

function ingredientOptionsForNew() {
    const selectedIds = ingredientRows.value.map((r) => r.ingredientId)
    return ingredientOptions.value.filter((opt) => !selectedIds.includes(opt.value))
}

function findIngredientById(id: number | null | undefined): Inventory | undefined {
    if (id == null) return undefined
    return ingredients.value.find((i) => i.id === id)
}

const selectedProduct = computed(() => products.value.find((p) => p.id === productId.value) || null)

const isBasicInfoValid = computed(() => {
    return (
        productId.value != null &&
        quantityProduced.value != null &&
        quantityProduced.value > 0 &&
        Number.isInteger(quantityProduced.value)
    )
})

const hasIngredients = computed(() => ingredientRows.value.length > 0)

const areIngredientsValid = computed(() =>
    ingredientRows.value.every(
        (row) => row.ingredientId != null && row.quantityUsed != null && row.quantityUsed > 0,
    ),
)

const isFormValid = computed(() => isBasicInfoValid.value && hasIngredients.value && areIngredientsValid.value)

const canAddCurrentIngredient = computed(() => {
    return (
        newIngredientId.value != null &&
        newQuantityUsed.value != null &&
        newQuantityUsed.value > 0 &&
        !ingredientRows.value.some((row) => row.ingredientId === newIngredientId.value)
    )
})

function addIngredient() {
    if (!canAddCurrentIngredient.value || newIngredientId.value == null || newQuantityUsed.value == null) {
        return
    }

    const ingredient = findIngredientById(newIngredientId.value)
    if (ingredient && newQuantityUsed.value > ingredient.quantity) {
        toast.add({
            title: 'Not enough stock',
            description: `Available: ${ingredient.quantity}${ingredient.unit}. Please restock to use more.`,
            color: 'warning',
        })
        return
    }

    ingredientRows.value.push({
        ingredientId: newIngredientId.value!,
        quantityUsed: newQuantityUsed.value!,
    })
    // Clear form for next entry
    newIngredientId.value = undefined
    newQuantityUsed.value = null
}

function removeIngredient(index: number) {
    ingredientRows.value.splice(index, 1)
}

function resetForm() {
    productId.value = undefined
    quantityProduced.value = null
    ingredientRows.value = []
    newIngredientId.value = undefined
    newQuantityUsed.value = null
}

function buildPayload(): ProductionRecordPayload {
    return {
        product: productId.value!,
        quantity_produced: quantityProduced.value!,
        ingredients: ingredientRows.value.map((row) => ({
            ingredient: row.ingredientId,
            quantity_used: row.quantityUsed,
        })),
    }
}

function handleSubmitClick() {
    if (!isFormValid.value) {
        toast.add({
            title: 'Please fix validation errors',
            color: 'warning',
        })
        return
    }
    showPreviewModal.value = true
}

async function recordProduction() {
    if (!isFormValid.value) return
    submitting.value = true
    try {
        await inventoryStore.recordProduction(buildPayload())
        showPreviewModal.value = false
        resetForm()
    } catch (error) {
        console.error(error)
        const errorResponse = error as ErrorResponse
        toast.add({
            title: errorResponse.message || 'Error',
            description: errorResponse.detail || 'Failed to record production',
            color: 'error',
            icon: 'i-lucide-alert-circle',
        })
        // Store shows toast on error
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="space-y-6">
        <!-- Section 1: Basic production info -->
        <div class="space-y-4">
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
                Basic production info
            </h2>

            <div class="grid gap-5 md:grid-cols-2 max-w-2xl">
                <UFormField label="Product" name="product" required>
                    <USelectMenu v-model="productId" :items="productOptions" value-key="value"
                        placeholder="Select product" class="w-full" />
                </UFormField>

                <div>
                    <UFormField label="Quantity produced" name="quantity_produced" required>
                        <UInput v-model.number="quantityProduced" type="number" min="1" step="1" placeholder="e.g. 20"
                            size="lg" required class="w-full" />
                    </UFormField>
                    <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Must be a positive whole number.
                    </p>
                </div>
            </div>
        </div>

        <!-- Section 2: Ingredients used -->
        <div class="space-y-4">
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
                Ingredients used
            </h2>

            <!-- Current ingredient form -->
            <div
                class="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-900/30">
                <div class="flex flex-wrap items-end gap-3">
                    <div class="flex-1 min-w-[180px]">
                        <UFormField label="Ingredient" name="new-ingredient" required>
                            <USelectMenu v-model="newIngredientId" :items="ingredientOptionsForNew()" value-key="value"
                                placeholder="Select ingredient" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="w-full sm:w-40">
                        <UFormField label="Quantity used" name="new-quantity" required>
                            <UInput v-model.number="newQuantityUsed" type="number" min="0" step="any"
                                placeholder="e.g. 2.5" size="lg" class="w-full" />
                        </UFormField>
                    </div>

                    <div class="flex items-end">
                        <UButton color="primary" variant="subtle" icon="i-lucide-plus"
                            :disabled="!canAddCurrentIngredient" @click="addIngredient">
                            Add Ingredient
                        </UButton>
                    </div>
                </div>

                <div class="text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                        Unit:
                        <span class="font-medium">
                            {{ findIngredientById(newIngredientId)?.unit ?? '—' }}
                        </span>
                    </span>
                    <span>
                        Available:
                        <span class="font-medium">
                            {{
                                findIngredientById(newIngredientId)
                                    ?
                                    `${findIngredientById(newIngredientId)!.quantity}${findIngredientById(newIngredientId)!.unit}`
                                    : '—'
                            }}
                        </span>
                    </span>
                </div>
            </div>

            <!-- Added ingredients list -->
            <div class="space-y-2">
                <div v-for="(row, index) in ingredientRows" :key="row.ingredientId"
                    class="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900/60">
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {{ findIngredientById(row.ingredientId)?.name ?? 'Ingredient' }}
                        </p>
                        <p class="text-xs text-neutral-500 dark:text-neutral-400">
                            Using {{ row.quantityUsed }}
                            {{ findIngredientById(row.ingredientId)?.unit ?? '' }}
                        </p>
                    </div>

                    <div class="text-xs text-neutral-500 dark:text-neutral-400">
                        Available:
                        <span class="font-medium">
                            {{
                                findIngredientById(row.ingredientId)
                                    ?
                                    `${findIngredientById(row.ingredientId)!.quantity}${findIngredientById(row.ingredientId)!.unit}`
                                    : '—'
                            }}
                        </span>
                    </div>

                    <UButton color="neutral" variant="ghost" icon="i-lucide-trash-2" size="sm"
                        aria-label="Remove ingredient" @click="removeIngredient(index)" />
                </div>

                <p v-if="!hasIngredients" class="text-sm text-red-500 dark:text-red-400">
                    At least one ingredient is required.
                </p>
            </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end">
            <UButton color="success" label="Submit" :disabled="!isFormValid" @click="handleSubmitClick" />
        </div>

        <!-- Preview modal -->
        <UModal :open="showPreviewModal" title="Confirm production" :ui="{ content: 'w-[calc(100vw-2rem)] max-w-lg' }"
            @update:open="showPreviewModal = $event">
            <template #default>
                <span class="hidden" aria-hidden="true" />
            </template>
            <template #body>
                <div class="space-y-4 text-sm text-neutral-700 dark:text-neutral-200">
                    <div>
                        <p class="font-medium mb-1">
                            You are producing:
                        </p>
                        <p>
                            {{ quantityProduced }} × {{ selectedProduct?.name ?? 'Selected product' }}
                        </p>
                    </div>

                    <div>
                        <p class="font-medium mb-1">
                            Using:
                        </p>
                        <ul class="list-disc list-inside space-y-1">
                            <li v-for="row in ingredientRows" :key="row.ingredientId">
                                {{
                                    findIngredientById(row.ingredientId)?.name ??
                                    'Ingredient'
                                }}:
                                {{ row.quantityUsed }}
                                {{ findIngredientById(row.ingredientId)?.unit ?? '' }}
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <UButton color="neutral" variant="outline" label="Cancel" @click="showPreviewModal = false" />
                    <UButton color="success" :loading="submitting" label="Record Production"
                        @click="recordProduction" />
                </div>
            </template>
        </UModal>
    </div>
</template>

<style lang="css" scoped></style>

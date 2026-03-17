<script setup lang="ts">
import type { Inventory, InventoryCreateUpdatePayload } from '~/types/inventory'
import type { ErrorResponse } from '~/types/error'

const inventoryStore = useInventoryStore()
const toast = useToast()

const props = withDefaults(
    defineProps<{
        open: boolean
        ingredient?: Inventory | null
    }>(),
    { ingredient: null },
)

const emit = defineEmits<{
    close: [value: boolean]
}>()

const isEdit = computed(() => !!props.ingredient)

const name = ref('')
const quantity = ref<number>(0)
const unit = ref('')

function resetForm() {
    name.value = ''
    quantity.value = 0
    unit.value = ''
}

watch(
    () => [props.open, props.ingredient],
    () => {
        if (props.open) {
            if (props.ingredient) {
                name.value = props.ingredient.name
                quantity.value = props.ingredient.quantity
                unit.value = props.ingredient.unit
            } else {
                resetForm()
            }
        }
    },
    { immediate: true },
)

async function handleSubmit() {
    const payload: InventoryCreateUpdatePayload = {
        name: name.value,
        unit: unit.value,
        quantity: Number(quantity.value),
    }
    try {
        if (props.ingredient?.id != null) {
            await inventoryStore.updateIngredient(props.ingredient.id, payload)
        } else {
            await inventoryStore.createIngredient(payload)
        }
        close()
    }
    catch (error) {
        console.error(error)
        const errorResponse = error as ErrorResponse
        toast.add({
            title: errorResponse.message || 'Error',
            description: errorResponse.detail || 'Failed to create ingredient',
            color: 'error',
            icon: 'i-lucide-alert-circle',
        })
    }
}

function close() {
    emit('close', false)
}
</script>

<template>
    <UModal :open="open" :title="isEdit ? 'Edit ingredient' : 'Add ingredient'"
        :description="isEdit ? 'Update the ingredient details below.' : 'Fill in the details to add a new ingredient.'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-lg' }" @update:open="emit('close', $event)">
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>
        <template #body>
            <form id="add-edit-ingredient-form" class="space-y-5" @submit.prevent="handleSubmit">
                <UFormField label="Ingredient name" name="name" required>
                    <UInput v-model="name" placeholder="e.g. Flour" size="lg" required class="w-full" />
                </UFormField>

                <div class="grid gap-5 sm:grid-cols-2">
                    <UFormField label="Quantity" name="quantity" required>
                        <UInput v-model.number="quantity" type="number" step="any" min="0" placeholder="e.g. 20"
                            size="lg" required class="w-full" />
                    </UFormField>

                    <UFormField label="Unit" name="unit" required>
                        <UInput v-model="unit" placeholder="e.g. kg, g, L" size="lg" required class="w-full" />
                    </UFormField>
                </div>
            </form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Cancel" @click="close" />
                <UButton type="submit" form="add-edit-ingredient-form" color="success" label="Save" class="ml-auto"
                    :disabled="!name.trim() || Number.isNaN(quantity) || quantity < 0 || !unit.trim()"
                    :loading="inventoryStore.loading" />
            </div>
        </template>
    </UModal>
</template>

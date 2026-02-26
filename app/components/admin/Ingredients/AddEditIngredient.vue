<script setup lang="ts">
import type { Ingredient } from '~/data/ingredients'

const props = withDefaults(
    defineProps<{
        open: boolean
        ingredient?: Ingredient | null
    }>(),
    { ingredient: null }
)

const emit = defineEmits<{
    'close': [value: boolean]
    save: [payload: Partial<Ingredient> & { name: string; quantity: number; unit: string }]
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
    { immediate: true }
)

function handleSubmit() {
    emit('save', {
        ...(props.ingredient?.id != null && { id: props.ingredient.id }),
        name: name.value,
        quantity: quantity.value,
        unit: unit.value,
    })
    emit('close', false)
}

function close() {
    emit('close', false)
}
</script>

<template>
    <UModal
        :open="open"
        :title="isEdit ? 'Edit ingredient' : 'Add ingredient'"
        :description="isEdit ? 'Update the ingredient details below.' : 'Fill in the details to add a new ingredient.'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-lg' }"
        @update:open="emit('close', $event)"
    >
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
                        <UInput
                            v-model.number="quantity"
                            type="number"
                            step="any"
                            min="0"
                            placeholder="e.g. 20"
                            size="lg"
                            required
                            class="w-full"
                        />
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
                <UButton
                    type="submit"
                    form="add-edit-ingredient-form"
                    color="success"
                    label="Save"
                    class="ml-auto"
                    :disabled="!name || quantity < 0 || !unit"
                />
            </div>
        </template>
    </UModal>
</template>

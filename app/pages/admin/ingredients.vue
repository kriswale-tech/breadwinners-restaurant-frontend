<script setup lang="ts">
import { ingredients, type Ingredient } from '~/data/ingredients'

const selectedIngredient = ref<Ingredient | null>(null)

const showAddEditIngredientModal = ref(false)
const showDeleteIngredientModal = ref(false)

function addIngredient() {
  selectedIngredient.value = null
  showAddEditIngredientModal.value = true
}

function closeAddEditIngredientModal() {
  showAddEditIngredientModal.value = false
  selectedIngredient.value = null
}

function openAddEditIngredientModal(ingredient?: Ingredient) {
  selectedIngredient.value = ingredient ?? null
  showAddEditIngredientModal.value = true
}

function onEditIngredient(ingredient: Ingredient) {
  openAddEditIngredientModal(ingredient)
}

function openDeleteIngredientModal(ingredient: Ingredient) {
  selectedIngredient.value = ingredient
  showDeleteIngredientModal.value = true
}

function closeDeleteIngredientModal() {
  showDeleteIngredientModal.value = false
  selectedIngredient.value = null
}

function deleteIngredient() {
  if (!selectedIngredient.value) return
  const index = ingredients.value.findIndex((i) => i.id === selectedIngredient.value!.id)
  if (index !== -1) {
    ingredients.value.splice(index, 1)
  }
  closeDeleteIngredientModal()
}

function onSaveIngredient(payload: Partial<Ingredient> & { name: string; quantity: number; unit: string }) {
  if (payload.id != null) {
    const index = ingredients.value.findIndex((i) => i.id === payload.id)
    const existing = index !== -1 ? ingredients.value[index] : undefined
    if (existing) {
      ingredients.value[index] = {
        id: existing.id,
        name: payload.name,
        quantity: payload.quantity,
        unit: payload.unit,
      }
    }
  } else {
    const nextId = Math.max(0, ...ingredients.value.map((i) => i.id)) + 1
    ingredients.value.push({
      id: nextId,
      name: payload.name,
      quantity: payload.quantity,
      unit: payload.unit,
    })
  }
  closeAddEditIngredientModal()
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold text-neutral-900 dark:text-white">
      Ingredients Inventory
    </h1>
    <p class="text-neutral-600 dark:text-neutral-400">
      Track and manage ingredients stock.
    </p>

    <!-- Add ingredient button -->
    <div class="flex flex-wrap items-end gap-3 mb-5!">
      <UButton class="ml-auto" color="primary" variant="subtle" icon="i-lucide-plus" @click="addIngredient">
        Add Ingredient
      </UButton>
    </div>

    <!-- Ingredients table -->
    <AdminIngredientsTableComponent :ingredients="ingredients" @edit="onEditIngredient"
      @delete="openDeleteIngredientModal" />

    <!-- Add / Edit ingredient modal -->
    <AdminIngredientsAddEditIngredient v-if="showAddEditIngredientModal" :open="showAddEditIngredientModal"
      :ingredient="selectedIngredient" @close="closeAddEditIngredientModal" @save="onSaveIngredient" />

    <!-- Delete ingredient modal -->
    <SharedPromptCard v-if="showDeleteIngredientModal" :open="showDeleteIngredientModal" :title="`Delete Ingredient`"
      :description="`Are you sure you want to delete ${selectedIngredient?.name}?`" :buttonText="`Delete`"
      :type="`error`" @close="closeDeleteIngredientModal" @confirm="deleteIngredient" />
  </div>
</template>

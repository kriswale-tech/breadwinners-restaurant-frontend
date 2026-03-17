<script setup lang="ts">
import type { Inventory } from '~/types/inventory'

const inventoryStore = useInventoryStore()

const selectedIngredient = ref<Inventory | null>(null)

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

function openAddEditIngredientModal(ingredient?: Inventory | null) {
  selectedIngredient.value = ingredient ?? null
  showAddEditIngredientModal.value = true
}

function onEditIngredient(ingredient: Inventory) {
  openAddEditIngredientModal(ingredient)
}

function openDeleteIngredientModal(ingredient: Inventory) {
  selectedIngredient.value = ingredient
  showDeleteIngredientModal.value = true
}

function closeDeleteIngredientModal() {
  showDeleteIngredientModal.value = false
  selectedIngredient.value = null
}

function deleteIngredient() {
  if (!selectedIngredient.value) return
  inventoryStore.deleteIngredient(selectedIngredient.value.id)
  closeDeleteIngredientModal()
}

onMounted(async () => {
  await callOnce("getIngredients", () => inventoryStore.getIngredients())
})
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
      <UButton class="ml-auto" color="primary" variant="subtle" icon="i-lucide-plus" :loading="inventoryStore.loading"
        @click="addIngredient">
        Add Ingredient
      </UButton>
    </div>

    <!-- Ingredients table -->
    <AdminIngredientsTableComponent :ingredients="inventoryStore.ingredients" @edit="onEditIngredient"
      @delete="openDeleteIngredientModal" />

    <!-- Add / Edit ingredient modal -->
    <AdminIngredientsAddEditIngredient v-if="showAddEditIngredientModal" :open="showAddEditIngredientModal"
      :ingredient="selectedIngredient" @close="closeAddEditIngredientModal" />

    <!-- Delete ingredient modal -->
    <SharedPromptCard v-if="showDeleteIngredientModal" :open="showDeleteIngredientModal" :title="`Delete Ingredient`"
      :description="`Are you sure you want to delete ${selectedIngredient?.name}?`" :button-text="`Delete`" type="error"
      @close="closeDeleteIngredientModal" @confirm="deleteIngredient" />
  </div>
</template>

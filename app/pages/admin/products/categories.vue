<script setup lang="ts">
import { categories, type Category } from '~/data/products'

const selectedCategory = ref<Category | null>(null)

const showAddEditCategoryModal = ref(false)
const showDeleteCategoryModal = ref(false)

function addCategory() {
    selectedCategory.value = null
    showAddEditCategoryModal.value = true
}

function closeAddEditCategoryModal() {
    showAddEditCategoryModal.value = false
    selectedCategory.value = null
}

function openAddEditCategoryModal(category?: Category) {
    selectedCategory.value = category ?? null
    showAddEditCategoryModal.value = true
}

function onEditCategory(category: Category) {
    openAddEditCategoryModal(category)
}

function openDeleteCategoryModal(category: Category) {
    selectedCategory.value = category
    showDeleteCategoryModal.value = true
}

function closeDeleteCategoryModal() {
    showDeleteCategoryModal.value = false
    selectedCategory.value = null
}

function deleteCategory() {
    if (!selectedCategory.value) return
    const index = categories.value.findIndex((c) => c.id === selectedCategory.value!.id)
    if (index !== -1) {
        categories.value.splice(index, 1)
    }
    closeDeleteCategoryModal()
}

function onSaveCategory(payload: Partial<Category> & { name: string }) {
    if (payload.id != null) {
        const index = categories.value.findIndex((c) => c.id === payload.id)
        const existing = index !== -1 ? categories.value[index] : undefined
        if (existing) {
            categories.value[index] = {
                id: existing.id,
                name: payload.name,
                description: payload.description,
            }
        }
    } else {
        const nextId = Math.max(0, ...categories.value.map((c) => c.id)) + 1
        categories.value.push({
            id: nextId,
            name: payload.name,
            description: payload.description,
        })
    }
    closeAddEditCategoryModal()
}
</script>

<template>
    <div>
        <!-- Add category button -->
        <div class="flex flex-wrap items-end gap-3 mb-5!">
            <UButton class="ml-auto" color="primary" variant="subtle" icon="i-lucide-plus" @click="addCategory">Add
                Category</UButton>
        </div>

        <!-- Categories table -->
        <AdminProductsCategoryTableComponent :categories="categories" @edit="onEditCategory"
            @delete="openDeleteCategoryModal" />

        <!-- Add / Edit category modal -->
        <AdminProductsAddEditCategory v-if="showAddEditCategoryModal" :open="showAddEditCategoryModal"
            :category="selectedCategory" @close="closeAddEditCategoryModal" @save="onSaveCategory" />

        <!-- Delete category modal -->
        <SharedPromptCard v-if="showDeleteCategoryModal" @close="closeDeleteCategoryModal"
            :open="showDeleteCategoryModal" :title="`Delete Category`"
            :description="`Are you sure you want to delete ${selectedCategory?.name}?`" :buttonText="`Delete`"
            :type="`error`" @confirm="deleteCategory" />
    </div>
</template>

<style lang="css" scoped></style>
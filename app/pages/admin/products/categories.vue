<script setup lang="ts">
import type { ProductCategory } from '~/types/products'

const productStore = useProductStore()

const selectedCategory = ref<ProductCategory | null>(null)

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

function openAddEditCategoryModal(category?: ProductCategory) {
    selectedCategory.value = category ?? null
    showAddEditCategoryModal.value = true
}

function onEditCategory(category: ProductCategory) {
    openAddEditCategoryModal(category)
}

function openDeleteCategoryModal(category: ProductCategory) {
    selectedCategory.value = category
    showDeleteCategoryModal.value = true
}

function closeDeleteCategoryModal() {
    showDeleteCategoryModal.value = false
    selectedCategory.value = null
}

async function deleteCategory() {
    if (!selectedCategory.value) return
    await productStore.deleteCategory(selectedCategory.value.id)
    closeDeleteCategoryModal()
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
        <AdminProductsCategoryTableComponent @edit="onEditCategory" @delete="openDeleteCategoryModal" />

        <!-- Add / Edit category modal -->
        <AdminProductsAddEditCategory v-if="showAddEditCategoryModal" :open="showAddEditCategoryModal"
            :category="selectedCategory" @close="closeAddEditCategoryModal" />

        <!-- Delete category modal -->
        <SharedPromptCard v-if="showDeleteCategoryModal" @close="closeDeleteCategoryModal"
            :open="showDeleteCategoryModal" :title="`Delete Category`"
            :description="`Are you sure you want to delete ${selectedCategory?.name}?`" :buttonText="`Delete`"
            :type="`error`" @confirm="deleteCategory" />
    </div>
</template>

<style lang="css" scoped></style>
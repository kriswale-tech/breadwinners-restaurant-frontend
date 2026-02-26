<script setup lang="ts">
import type { Product } from '~/data/products'

const searchQuery = ref('')
const categoryFilter = ref('')
const categoryOptions = [
    { label: 'All', value: 'all' },
    { label: 'Bread', value: 'bread' },
    { label: 'Cake', value: 'cake' },
    { label: 'Pastry', value: 'pastry' },
]

const selectedProduct = ref<Product | null>(null)

function addProduct() {
    openAddEditProductModal()
}

const showAddEditProductModal = ref(false)
const showDeleteProductModal = ref(false)

function openAddEditProductModal(product?: Product) {
    selectedProduct.value = product ?? null
    showAddEditProductModal.value = true
}

function closeAddEditProductModal() {
    showAddEditProductModal.value = false
    selectedProduct.value = null
}

function editProduct(product: Product) {
    openAddEditProductModal(product)
}

function deleteProduct() {
    console.log('deleteProduct', selectedProduct.value)
}

function closeDeleteProductModal() {
    showDeleteProductModal.value = false
    selectedProduct.value = null
}

function openDeleteProductModal(product: Product) {
    selectedProduct.value = product
    showDeleteProductModal.value = true
}
</script>

<template>
    <div>
        <!-- Filters -->
        <div class="flex flex-wrap items-end gap-3 mb-5!">
            <UInput v-model="searchQuery" placeholder="Search by Product Name..." class="min-w-0 flex-1 sm:max-w-xs"
                icon="i-lucide-search" />
            <div class="flex items-center gap-2">
                <span>Category:</span>
                <USelect v-model="categoryFilter" :items="categoryOptions" placeholder="Category" value-key="value"
                    class="w-full sm:w-40" />
            </div>
            <!-- <div class="flex items-center gap-2">
                <span>Shop:</span>
                <USelect v-model="shopFilter" :items="shopOptions" placeholder="Shop" value-key="value"
                    class="w-full sm:w-48" />
            </div> -->

            <!-- Add Product Button -->
            <UButton class="ml-auto" color="primary" variant="subtle" icon="i-lucide-plus" @click="addProduct">Add
                Product</UButton>
        </div>

        <!-- Products Table -->
        <AdminProductsTableComponent @edit="editProduct" @delete="openDeleteProductModal" />

        <!-- Modals -->
        <!-- add and edit product modal -->
        <AdminProductsAddEditProduct v-if="showAddEditProductModal" @close="closeAddEditProductModal"
            :open="showAddEditProductModal" :product="selectedProduct" />

        <!-- delete product modal -->
        <SharedPromptCard v-if="showDeleteProductModal" @close="closeDeleteProductModal" :open="showDeleteProductModal"
            :title="`Delete Product`" :description="`Are you sure you want to delete ${selectedProduct?.name}?`"
            :buttonText="`Delete`" :type="`error`" @confirm="deleteProduct" />
    </div>
</template>

<style lang="css" scoped></style>
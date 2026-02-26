<script setup lang="ts">
import { packages, type ProductPackage, type ProductPackageItem, type ProductStatus } from '~/data/products'

type SavePackagePayload = {
    id?: number
    name: string
    description?: string
    image?: string
    price: number
    status?: ProductStatus
    items: { product: import('~/data/products').Product; quantity: number }[]
}

const selectedPackage = ref<ProductPackage | null>(null)

const showAddEditPackageModal = ref(false)
const showDeletePackageModal = ref(false)

function addPackage() {
    selectedPackage.value = null
    showAddEditPackageModal.value = true
}

function closeAddEditPackageModal() {
    showAddEditPackageModal.value = false
    selectedPackage.value = null
}

function openAddEditPackageModal(productPackage?: ProductPackage) {
    selectedPackage.value = productPackage ?? null
    showAddEditPackageModal.value = true
}

function onEditPackage(productPackage: ProductPackage) {
    openAddEditPackageModal(productPackage)
}

function openDeletePackageModal(productPackage: ProductPackage) {
    selectedPackage.value = productPackage
    showDeletePackageModal.value = true
}

function closeDeletePackageModal() {
    showDeletePackageModal.value = false
    selectedPackage.value = null
}

function deletePackage() {
    if (!selectedPackage.value) return
    const index = packages.value.findIndex((p: ProductPackage) => p.id === selectedPackage.value!.id)
    if (index !== -1) {
        packages.value.splice(index, 1)
    }
    closeDeletePackageModal()
}

function onSavePackage(payload: SavePackagePayload) {
    const nextItemId =
        packages.value.reduce((max, p) => Math.max(max, ...p.items.map((i: ProductPackageItem) => i.id)), 0) + 1
    const items: ProductPackageItem[] = payload.items.map((item, index) => ({
        id: nextItemId + index,
        product: item.product,
        quantity: item.quantity,
    }))

    if (payload.id != null) {
        const index = packages.value.findIndex((p) => p.id === payload.id)
        const existing = index !== -1 ? packages.value[index] : undefined
        if (existing) {
            packages.value[index] = {
                id: existing.id,
                name: payload.name,
                description: payload.description,
                image: payload.image,
                price: payload.price,
                status: payload.status,
                items,
            }
        }
    } else {
        const nextId = Math.max(0, ...packages.value.map((p) => p.id)) + 1
        packages.value.push({
            id: nextId,
            name: payload.name,
            description: payload.description,
            image: payload.image,
            price: payload.price,
            status: payload.status ?? 'active',
            items,
        })
    }
    closeAddEditPackageModal()
}
</script>

<template>
    <div>
        <!-- Add category button -->
        <div class="flex flex-wrap items-end gap-3 mb-5!">
            <UButton class="ml-auto" color="primary" variant="subtle" icon="i-lucide-plus" @click="addPackage">Create
                Package</UButton>
        </div>

        <!-- Packages table -->
        <AdminProductsPackageTableComponent :packages="packages" @edit="onEditPackage"
            @delete="openDeletePackageModal" />

        <!-- Add / Edit package modal -->
        <AdminProductsAddEditPackage v-if="showAddEditPackageModal" :open="showAddEditPackageModal"
            :package="selectedPackage" @close="closeAddEditPackageModal" @save="onSavePackage" />

        <!-- Delete package modal -->
        <SharedPromptCard v-if="showDeletePackageModal" @close="closeDeletePackageModal" :open="showDeletePackageModal"
            :title="`Delete Package`" :description="`Are you sure you want to delete ${selectedPackage?.name}?`"
            :buttonText="`Delete`" :type="`error`" @confirm="deletePackage" />
    </div>
</template>

<style lang="css" scoped></style>
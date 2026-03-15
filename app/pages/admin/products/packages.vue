<script setup lang="ts">
import type { ProductPackage } from '~/types/products'

const productStore = useProductStore()

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

function onEditPackage(pkg: ProductPackage) {
  selectedPackage.value = pkg
  showAddEditPackageModal.value = true
}

function openDeletePackageModal(pkg: ProductPackage) {
  selectedPackage.value = pkg
  showDeletePackageModal.value = true
}

function closeDeletePackageModal() {
  showDeletePackageModal.value = false
  selectedPackage.value = null
}

async function deletePackage() {
  if (!selectedPackage.value?.id) return
  await productStore.deletePackage(selectedPackage.value.id)
  closeDeletePackageModal()
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end gap-3 mb-5!">
      <UButton class="ml-auto" color="primary" variant="subtle" icon="i-lucide-plus" @click="addPackage">
        Create Package
      </UButton>
    </div>

    <AdminProductsPackageTableComponent @edit="onEditPackage" @delete="openDeletePackageModal" />

    <AdminProductsAddEditPackage
      v-if="showAddEditPackageModal"
      :open="showAddEditPackageModal"
      :pkg="selectedPackage"
      @close="closeAddEditPackageModal"
    />

    <SharedPromptCard
      v-if="showDeletePackageModal"
      :open="showDeletePackageModal"
      title="Delete Package"
      :description="`Are you sure you want to delete ${selectedPackage?.name}?`"
      button-text="Delete"
      type="error"
      @close="closeDeletePackageModal"
      @confirm="deletePackage"
    />
  </div>
</template>

<style lang="css" scoped></style>

<script setup lang="ts">
import type { ProductionList } from '~/types/inventory'

const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const dateFilter = ref<string>('')
const productFilter = ref<string>('all')

const selectedRecord = ref<ProductionList | null>(null)
const showDetailsModal = ref(false)

const productOptions = computed(() => {
    const names = [...new Set(productStore.products.map((p) => p.name))].sort()
    return [
        { label: 'All products', value: 'all' as const },
        ...names.map((name) => ({ label: name, value: name })),
    ]
})

const filteredHistory = computed(() => {
    let list = inventoryStore.production

    if (dateFilter.value) {
        list = list.filter((r) => r.created_at.slice(0, 10) === dateFilter.value)
    }

    if (productFilter.value !== 'all') {
        list = list.filter((r) => r.product_name === productFilter.value)
    }

    return list
})

function openDetails(record: ProductionList) {
    selectedRecord.value = record
    showDetailsModal.value = true
}

function closeDetails() {
    showDetailsModal.value = false
    selectedRecord.value = null
}

onMounted(() => {
    inventoryStore.getProduction()
})
</script>

<template>
    <div class="space-y-4">
        <!-- Filters -->
        <div class="flex flex-wrap items-end gap-3 mb-5!">
            <div class="flex items-center gap-2">
                <span>Date:</span>
                <UInput v-model="dateFilter" type="date" class="w-full sm:w-52" />
            </div>

            <div class="flex items-center gap-2">
                <span>Product:</span>
                <USelect v-model="productFilter" :items="productOptions" value-key="value" placeholder="All products"
                    class="w-full sm:w-56" />
            </div>
        </div>

        <!-- History table -->
        <AdminProductionHistoryTable :records="filteredHistory" @view="openDetails" />

        <!-- Details modal -->
        <AdminProductionHistoryDetails v-model:open="showDetailsModal" :record-id="selectedRecord?.id ?? null" />
    </div>
</template>

<style lang="css" scoped></style>
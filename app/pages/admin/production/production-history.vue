<script setup lang="ts">
import { productionHistory, type ProductionRecord } from '~/data/production'
import { products } from '~/data/products'

const dateFilter = ref<string>('')
const productFilter = ref<number | 'all'>('all')

const selectedRecord = ref<ProductionRecord | null>(null)
const showDetailsModal = ref(false)

const productOptions = computed(() => [
    { label: 'All products', value: 'all' as const },
    ...products.map((p) => ({ label: p.name, value: p.id })),
])

const filteredHistory = computed(() => {
    let list = productionHistory.value

    if (dateFilter.value) {
        list = list.filter((r) => r.date.slice(0, 10) === dateFilter.value)
    }

    if (productFilter.value !== 'all') {
        list = list.filter((r) => r.productId === productFilter.value)
    }

    return list
})

function openDetails(record: ProductionRecord) {
    selectedRecord.value = record
    showDetailsModal.value = true
}

function closeDetails() {
    showDetailsModal.value = false
    selectedRecord.value = null
}
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
        <AdminProductionHistoryDetails v-model:open="showDetailsModal" :record="selectedRecord" />
    </div>
</template>

<style lang="css" scoped></style>
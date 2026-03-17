<script setup lang="ts">
import type { ProductionDetails } from '~/types/inventory'

const inventoryStore = useInventoryStore()

const props = defineProps<{
    open: boolean
    recordId: number | null
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const details = ref<ProductionDetails | null>(null)
const loading = ref(false)
const loadFailed = ref(false)

watch(
    () => [props.open, props.recordId],
    async () => {
        if (props.open && props.recordId != null) {
            loading.value = true
            loadFailed.value = false
            details.value = null
            try {
                const result = await inventoryStore.getProductionDetails(props.recordId)
                details.value = result ?? null
                if (!result) loadFailed.value = true
            } catch {
                loadFailed.value = true
            } finally {
                loading.value = false
            }
        } else {
            details.value = null
            loadFailed.value = false
        }
    },
    { immediate: true },
)

function formatDateTime(value: string): string {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

function close() {
    emit('update:open', false)
}
</script>

<template>
    <UModal
        :open="open"
        title="Production details"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-2xl' }"
        @update:open="emit('update:open', $event)"
    >
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>

        <template #body>
            <div v-if="loading" class="flex items-center justify-center py-8 text-neutral-500">
                Loading...
            </div>
            <div v-else-if="loadFailed" class="py-8 text-center text-neutral-500 dark:text-neutral-400">
                Failed to load production details.
            </div>
            <div v-else-if="details" class="space-y-4 text-sm text-neutral-700 dark:text-neutral-200">
                <div class="grid gap-3 sm:grid-cols-2">
                    <div>
                        <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Date & time
                        </p>
                        <p class="font-medium">
                            {{ formatDateTime(details.created_at) }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Produced by
                        </p>
                        <p class="font-medium">
                            {{ details.produced_by_name }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Product
                        </p>
                        <p class="font-medium">
                            {{ details.product_name }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Quantity produced
                        </p>
                        <p class="font-medium">
                            {{ details.quantity_produced }}
                        </p>
                    </div>
                </div>

                <div>
                    <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
                        Ingredients used
                    </p>
                    <ul class="space-y-1">
                        <li
                            v-for="(line, index) in details.ingredients_used"
                            :key="line.ingredient?.id ?? index"
                            class="flex items-center justify-between gap-3"
                        >
                            <span>
                                {{ line.ingredient?.name ?? '—' }}
                            </span>
                            <span class="text-neutral-600 dark:text-neutral-300">
                                {{ line.quantity_used }} {{ line.ingredient?.unit ?? '' }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Close" @click="close" />
            </div>
        </template>
    </UModal>
</template>


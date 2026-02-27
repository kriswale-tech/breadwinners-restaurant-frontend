<script setup lang="ts">
import type { ProductionRecord } from '~/data/production'

const props = defineProps<{
    open: boolean
    record: ProductionRecord | null
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const record = computed(() => props.record)

function close() {
    emit('update:open', false)
}
</script>

<template>
    <UModal
        :open="open"
        :title="record ? record.productName : 'Production details'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-2xl' }"
        @update:open="emit('update:open', $event)"
    >
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>

        <template #body>
            <div v-if="record" class="space-y-4 text-sm text-neutral-700 dark:text-neutral-200">
                <div class="grid gap-3 sm:grid-cols-2">
                    <div>
                        <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Date
                        </p>
                        <p class="font-medium">
                            {{ new Date(record.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Produced by
                        </p>
                        <p class="font-medium">
                            {{ record.producedBy }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Product
                        </p>
                        <p class="font-medium">
                            {{ record.productName }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Quantity produced
                        </p>
                        <p class="font-medium">
                            {{ record.quantityProduced }}
                        </p>
                    </div>
                </div>

                <div>
                    <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
                        Ingredients used
                    </p>
                    <ul class="space-y-1">
                        <li
                            v-for="line in record.ingredients"
                            :key="line.ingredientId"
                            class="flex items-center justify-between gap-3"
                        >
                            <span>
                                {{ line.ingredientName }}
                            </span>
                            <span class="text-neutral-600 dark:text-neutral-300">
                                {{ line.quantityUsed }} {{ line.unit }}
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


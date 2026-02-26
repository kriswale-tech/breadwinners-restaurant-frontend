<script setup lang="ts">
type PromptType = 'success' | 'warning' | 'error'

const props = withDefaults(
    defineProps<{
        open: boolean
        title: string
        description: string
        buttonText: string
        type?: PromptType
    }>(),
    {
        type: 'success',
    },
)

const emit = defineEmits<{
    'close': [value: boolean]
    cancel: []
    confirm: []
}>()

const typeConfig: Record<
    PromptType,
    {
        icon: string
        color: 'success' | 'warning' | 'error'
        bg: string
    }
> = {
    success: {
        icon: 'i-lucide-check-circle-2',
        color: 'success',
        bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    warning: {
        icon: 'i-lucide-alert-triangle',
        color: 'warning',
        bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    },
    error: {
        icon: 'i-lucide-octagon-alert',
        color: 'error',
        bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    },
}

const current = computed(() => typeConfig[props.type])

function handleCancel() {
    emit('cancel')
    emit('close', false)
}

function handleConfirm() {
    emit('confirm')
    emit('close', false)
}
</script>

<template>
    <UModal :open="open" :title="title" description="" :ui="{ content: 'w-[calc(100vw-2rem)] max-w-md' }"
        @update:open="emit('close', $event)">
        <!-- No trigger: controlled entirely by v-model:open from parent -->
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>

        <template #body>
            <div class="space-y-3">
                <div class="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                    <span class="mt-0.5 flex size-8 items-center justify-center rounded-full" :class="current.bg">
                        <Icon :name="current.icon" class="size-4" />
                    </span>
                    <p class="leading-relaxed">
                        {{ description }}
                    </p>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-between gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Cancel" @click="handleCancel" />
                <UButton :color="current.color" :label="buttonText" @click="handleConfirm" />
            </div>
        </template>
    </UModal>
</template>

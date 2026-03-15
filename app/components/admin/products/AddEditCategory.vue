<script setup lang="ts">
import type { ProductCategory } from '~/types/products'

const props = withDefaults(
  defineProps<{
    open: boolean
    category?: ProductCategory | null
  }>(),
  { category: null },
)

const emit = defineEmits<{
  close: [value: boolean]
}>()

const productStore = useProductStore()

const isEdit = computed(() => !!props.category)
const submitting = ref(false)

const name = ref('')
const description = ref('')

function resetForm() {
  name.value = ''
  description.value = ''
}

watch(
  () => [props.open, props.category],
  () => {
    if (props.open) {
      if (props.category) {
        name.value = props.category.name
        description.value = props.category.description
      }
      else {
        resetForm()
      }
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  submitting.value = true
  const payload = {
    name: name.value,
    description: description.value || undefined,
  }

  try {
    if (isEdit.value && props.category)
      await productStore.updateCategory(props.category.id, payload)
    else
      await productStore.createCategory(payload)

    close()
  }
  finally {
    submitting.value = false
  }
}

function close() {
  emit('close', false)
}
</script>

<template>
    <UModal
        :open="open"
        :title="isEdit ? 'Edit category' : 'Add category'"
        :description="isEdit ? 'Update the category details below.' : 'Fill in the details to add a new category.'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-lg' }"
        @update:open="emit('close', $event)"
    >
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>
        <template #body>
            <form id="add-edit-category-form" class="space-y-5" @submit.prevent="handleSubmit">
                <UFormField label="Name" name="name" required>
                    <UInput v-model="name" placeholder="e.g. Loaves" size="lg" required class="w-full" />
                </UFormField>

                <UFormField label="Description" name="description">
                    <UTextarea
                        v-model="description"
                        placeholder="Short description of the category..."
                        :rows="3"
                        class="w-full"
                    />
                </UFormField>
            </form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Cancel" @click="close" />
                <UButton
                    type="submit"
                    form="add-edit-category-form"
                    color="success"
                    label="Save"
                    class="ml-auto"
                    :loading="submitting"
                    :disabled="!name || submitting"
                />
            </div>
        </template>
    </UModal>
</template>

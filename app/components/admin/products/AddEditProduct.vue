<script setup lang="ts">
import type { Product } from '~/types/products'

const props = withDefaults(
  defineProps<{
    open: boolean
    product?: Product | null
  }>(),
  { product: null },
)

const emit = defineEmits<{
  close: [value: boolean]
}>()

const productStore = useProductStore()
const config = useRuntimeConfig()

const isEdit = computed(() => !!props.product)
const submitting = ref(false)

const name = ref('')
const description = ref('')
const price = ref<string>('0')
const categoryId = ref<number | undefined>(undefined)
const isActive = ref(true)
const imageFile = ref<File | null>(null)
const imageUrl = ref('')
const objectUrl = ref<string | null>(null)

const categoryOptions = computed(() =>
  productStore.categories.map((c) => ({ label: c.name, value: c.id })),
)

function revokePreview() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = null
  }
}

function resetForm() {
  name.value = ''
  description.value = ''
  price.value = '0'
  categoryId.value = undefined
  isActive.value = true
  imageFile.value = null
  imageUrl.value = ''
  revokePreview()
}

watch(
  () => [props.open, props.product],
  () => {
    if (props.open) {
      if (props.product) {
        name.value = props.product.name
        description.value = props.product.description
        price.value = props.product.price
        categoryId.value = props.product.category_id ?? undefined
        isActive.value = props.product.is_active
        imageUrl.value = props.product.image
          ? new URL(props.product.image, String(config.public.apiBase)).toString()
          : ''
        imageFile.value = null
        revokePreview()
      }
      else {
        resetForm()
      }
    }
  },
  { immediate: true },
)

watch(imageFile, (file: File | null) => {
  revokePreview()
  if (file) {
    objectUrl.value = URL.createObjectURL(file)
  }
})

const previewUrl = computed<string | null>(() => {
  return (objectUrl.value || imageUrl.value || null) as string | null
})

function buildFormData(): FormData {
  const fd = new FormData()
  fd.append('name', name.value)
  fd.append('description', description.value)
  fd.append('price', price.value)
  fd.append('is_active', String(isActive.value))
  if (categoryId.value != null)
    fd.append('category_id', String(categoryId.value))
  if (imageFile.value)
    fd.append('image', imageFile.value)
  return fd
}

async function handleSubmit() {
  submitting.value = true

  try {
    const formData = buildFormData()

    if (isEdit.value && props.product)
      await productStore.updateProduct(props.product.id, formData)
    else
      await productStore.createProduct(formData)

    close()
  }
  catch (error) {
    console.error(error)
  }
  finally {
    submitting.value = false
  }
}

function close() {
  emit('close', false)
}

onUnmounted(revokePreview)
</script>

<template>
    <UModal :open="open" :title="isEdit ? 'Edit product' : 'Add product'"
        :description="isEdit ? 'Update the product details below.' : 'Fill in the details to add a new product.'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-lg' }" @update:open="emit('close', $event)">
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>
        <template #body>
            <form id="add-edit-product-form" class="space-y-5" @submit.prevent="handleSubmit">
                <UFormField label="Product name" name="name" required>
                    <UInput v-model="name" placeholder="e.g. Artisan Sourdough" size="lg" required class="w-full" />
                </UFormField>

                <UFormField label="Image" name="image" description="PNG, JPG or GIF. Leave empty to keep existing.">
                    <div class="space-y-2">
                        <UFileUpload v-model="imageFile" accept="image/*" label="Drop image here or click to upload"
                            description="Optional. Max 5MB." icon="i-lucide-image" variant="area" class="min-h-32" />
                        <div v-if="previewUrl"
                            class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800/50">
                            <img :src="previewUrl" alt="Preview" class="h-14 w-14 rounded-md object-cover">
                            <span class="text-sm text-neutral-500 dark:text-neutral-400">
                                {{ imageFile ? 'New image selected' : 'Current image' }}
                            </span>
                        </div>
                    </div>
                </UFormField>

                <UFormField label="Description" name="description">
                    <UTextarea v-model="description" placeholder="Short description of the product..." :rows="3"
                        class="w-full" />
                </UFormField>

                <div class="grid gap-5 sm:grid-cols-2">
                    <UFormField label="Price (GHS)" name="price" required>
                        <UInput v-model="price" type="number" step="0.01" min="0" placeholder="0.00" size="lg"
                            required class="w-full" />
                    </UFormField>

                    <UFormField label="Category" name="category">
                        <USelect v-model="categoryId" :items="categoryOptions" value-key="value"
                            placeholder="Select category" size="lg" class="w-full" />
                    </UFormField>
                </div>

                <UFormField label="Status" name="status" description="Active products are visible; disabled are hidden.">
                    <USwitch v-model="isActive" :label="isActive ? 'Active' : 'Disabled'" />
                </UFormField>
            </form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Cancel" @click="close" />
                <UButton type="submit" form="add-edit-product-form" color="success" label="Save" class="ml-auto"
                    :loading="submitting" :disabled="!name || !price || submitting" />
            </div>
        </template>
    </UModal>
</template>

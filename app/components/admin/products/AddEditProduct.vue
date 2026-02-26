<script setup lang="ts">
import type { Product, ProductStatus } from '~/data/products'

const props = withDefaults(
    defineProps<{
        open: boolean
        product?: Product | null
    }>(),
    { product: null }
)

const emit = defineEmits<{
    'close': [value: boolean]
    save: [payload: Partial<Product> & { name: string; price: number }]
}>()

const isEdit = computed(() => !!props.product)

const name = ref('')
const description = ref('')
const price = ref<number>(0)
const category = ref('')
const isActive = ref(true)
const imageFile = ref<File | undefined>(undefined)
const imageUrl = ref('') // existing image URL when editing
const objectUrl = ref<string | null>(null) // for revoking preview

const categoryOptions = [
    { label: 'Loaves', value: 'Loaves' },
    { label: 'Brioche', value: 'Brioche' },
    { label: 'Whole wheat', value: 'Whole wheat' },
    { label: 'Rolls', value: 'Rolls' },
    { label: 'Pastries', value: 'Pastries' },
]

function resetForm() {
    name.value = ''
    description.value = ''
    price.value = 0
    category.value = ''
    isActive.value = true
    imageFile.value = undefined
    imageUrl.value = ''
    revokePreview()
}

function revokePreview() {
    if (objectUrl.value) {
        URL.revokeObjectURL(objectUrl.value)
        objectUrl.value = null
    }
}

watch(
    () => [props.open, props.product],
    () => {
        if (props.open) {
            if (props.product) {
                name.value = props.product.name
                description.value = props.product.description ?? ''
                price.value = Number(props.product.price) || 0
                category.value = props.product.category ?? ''
                imageUrl.value = props.product.image ?? ''
                imageFile.value = undefined
                isActive.value = props.product.status !== 'disabled'
                revokePreview()
            } else {
                resetForm()
            }
        }
    },
    { immediate: true }
)

watch(imageFile, (file) => {
    revokePreview()
    if (file) {
        objectUrl.value = URL.createObjectURL(file)
    }
})

const previewUrl = computed(() => {
    if (objectUrl.value) return objectUrl.value
    return imageUrl.value || null
})

onUnmounted(() => {
    revokePreview()
})

async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

async function handleSubmit() {
    let image = imageUrl.value
    if (imageFile.value) {
        image = await fileToDataUrl(imageFile.value)
    }

    emit('save', {
        ...(props.product?.id != null && { id: props.product.id }),
        name: name.value,
        description: description.value || undefined,
        price: price.value,
        category: category.value || undefined,
        image: image || undefined,
        status: (isActive.value ? 'active' : 'disabled') as ProductStatus,
    })
    emit('close', false)
}

function close() {
    emit('close', false)
}
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
                        <UInput v-model.number="price" type="number" step="0.01" min="0" placeholder="0.00" size="lg"
                            required class="w-full" />
                    </UFormField>

                    <UFormField label="Category" name="category">
                        <USelect v-model="category" :items="categoryOptions" value-key="value"
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
                    :disabled="!name || (typeof price !== 'number' && Number.isNaN(Number(price)))" />
            </div>
        </template>
    </UModal>
</template>

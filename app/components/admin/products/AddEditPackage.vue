<script setup lang="ts">
import type { Product, ProductPackage, ProductStatus } from '~/data/products'
import { products } from '~/data/products'

const props = withDefaults(
    defineProps<{
        open: boolean
        package?: ProductPackage | null
    }>(),
    { package: null }
)

const emit = defineEmits<{
    'close': [value: boolean]
    save: [payload: {
        id?: number
        name: string
        description?: string
        image?: string
        price: number
        status?: ProductStatus
        items: { product: Product; quantity: number }[]
    }]
}>()

const isEdit = computed(() => !!props.package)

const name = ref('')
const description = ref('')
const price = ref<number>(0)
const isActive = ref(true)
const imageFile = ref<File | undefined>(undefined)
const imageUrl = ref('')
const objectUrl = ref<string | null>(null)

type FormItem = { product: Product; quantity: number }
const formItems = ref<FormItem[]>([])

const productOptions = computed(() =>
    products.map((p) => ({ label: p.name, value: p }))
)

const selectedProduct = ref<Product | undefined>(undefined)
const quantityToAdd = ref(1)

function revokePreview() {
    if (objectUrl.value) {
        URL.revokeObjectURL(objectUrl.value)
        objectUrl.value = null
    }
}

function resetForm() {
    name.value = ''
    description.value = ''
    price.value = 0
    isActive.value = true
    formItems.value = []
    selectedProduct.value = undefined
    quantityToAdd.value = 1
    imageFile.value = undefined
    imageUrl.value = ''
    revokePreview()
}

watch(
    () => [props.open, props.package],
    () => {
        if (props.open) {
            if (props.package) {
                name.value = props.package.name
                description.value = props.package.description ?? ''
                price.value = Number(props.package.price) || 0
                isActive.value = props.package.status !== 'disabled'
                formItems.value = props.package.items.map((i) => ({
                    product: i.product,
                    quantity: i.quantity,
                }))
                imageUrl.value = props.package.image ?? ''
                imageFile.value = undefined
                revokePreview()
                selectedProduct.value = undefined
                quantityToAdd.value = 1
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

function addItem() {
    const product = selectedProduct.value
    if (!product || quantityToAdd.value < 1) return
    formItems.value.push({ product, quantity: quantityToAdd.value })
    selectedProduct.value = undefined
    quantityToAdd.value = 1
}

function removeItem(index: number) {
    formItems.value.splice(index, 1)
}

async function handleSubmit() {
    let image = imageUrl.value
    if (imageFile.value) {
        image = await fileToDataUrl(imageFile.value)
    }
    emit('save', {
        ...(props.package?.id != null && { id: props.package.id }),
        name: name.value,
        description: description.value || undefined,
        image: image || undefined,
        price: price.value,
        status: (isActive.value ? 'active' : 'disabled') as ProductStatus,
        items: formItems.value,
    })
    emit('close', false)
}

function close() {
    emit('close', false)
}
</script>

<template>
    <UModal
        :open="open"
        :title="isEdit ? 'Edit package' : 'Add package'"
        :description="isEdit ? 'Update the package details below.' : 'Fill in the details to add a new package.'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-2xl' }"
        @update:open="emit('close', $event)"
    >
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>
        <template #body>
            <form id="add-edit-package-form" class="space-y-5" @submit.prevent="handleSubmit">
                <UFormField label="Package name" name="name" required>
                    <UInput v-model="name" placeholder="e.g. Bread Bundle" size="lg" required class="w-full" />
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
                    <UTextarea
                        v-model="description"
                        placeholder="Short description of the package..."
                        :rows="2"
                        class="w-full"
                    />
                </UFormField>

                <UFormField
                    label="Products in package"
                    name="items"
                    description="Search and select a product, set quantity, then add to the list."
                >
                    <div class="flex flex-wrap items-end gap-2">
                        <USelectMenu
                            v-model="selectedProduct"
                            :items="productOptions"
                            placeholder="Search product..."
                            class="min-w-0 flex-1 sm:min-w-48"
                            value-key="value"
                        />
                        <UInput
                            v-model.number="quantityToAdd"
                            type="number"
                            min="1"
                            placeholder="Qty"
                            class="w-20"
                            size="md"
                        />
                        <UButton
                            type="button"
                            color="primary"
                            variant="soft"
                            icon="i-lucide-plus"
                            label="Add"
                            :disabled="!selectedProduct || quantityToAdd < 1"
                            @click="addItem"
                        />
                    </div>

                    <ul v-if="formItems.length" class="mt-3 space-y-2">
                        <li
                            v-for="(item, index) in formItems"
                            :key="index"
                            class="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800/50"
                        >
                            <span class="text-sm font-medium text-neutral-900 dark:text-white">
                                {{ item.product.name }} x {{ item.quantity }}
                            </span>
                            <UButton
                                type="button"
                                icon="i-lucide-x"
                                color="error"
                                variant="ghost"
                                size="xs"
                                aria-label="Remove"
                                @click="removeItem(index)"
                            />
                        </li>
                    </ul>
                    <p v-else class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        No products added yet.
                    </p>
                </UFormField>

                <div class="grid gap-5 sm:grid-cols-2">
                    <UFormField label="Price (GHS)" name="price" required>
                        <UInput
                            v-model.number="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            size="lg"
                            required
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Status" name="status" description="Active packages are visible; disabled are hidden.">
                        <USwitch v-model="isActive" :label="isActive ? 'Active' : 'Disabled'" />
                    </UFormField>
                </div>
            </form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Cancel" @click="close" />
                <UButton
                    type="submit"
                    form="add-edit-package-form"
                    color="success"
                    label="Save"
                    class="ml-auto"
                    :disabled="!name || (typeof price !== 'number' && Number.isNaN(Number(price))) || formItems.length === 0"
                />
            </div>
        </template>
    </UModal>
</template>

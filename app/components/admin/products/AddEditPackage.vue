<script setup lang="ts">
import type { Product, ProductPackage } from '~/types/products'
const config = useRuntimeConfig()

const props = withDefaults(
    defineProps<{
        open: boolean
        pkg?: ProductPackage | null
    }>(),
    { pkg: null },
)

const emit = defineEmits<{
    close: [value: boolean]
}>()

const productStore = useProductStore()
const isEdit = computed(() => !!props.pkg)
const submitting = ref(false)

const name = ref('')
const description = ref('')
const price = ref<string>('0')
const isActive = ref(true)
const imageFile = ref<File | null>(null)
const imageUrl = ref('')
const objectUrl = ref<string | null>(null)

type FormItem = { productId: number; productName: string; quantity: number }
const formItems = ref<FormItem[]>([])

const productOptions = computed(() =>
    productStore.products.map((p) => ({ label: p.name, value: p })),
)

const selectedProduct = ref<Product | undefined>(undefined)
const quantityToAdd = ref(1)

function resetForm() {
    name.value = ''
    description.value = ''
    price.value = '0'
    isActive.value = true
    formItems.value = []
    selectedProduct.value = undefined
    quantityToAdd.value = 1
    imageFile.value = null
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
    () => [props.open, props.pkg],
    () => {
        if (props.open) {
            if (props.pkg) {
                name.value = props.pkg.name
                description.value = props.pkg.description
                price.value = props.pkg.price
                isActive.value = props.pkg.is_active
                formItems.value = props.pkg.items.map((i) => ({
                    productId: i.product,
                    productName: i.product_name ?? '',
                    quantity: i.quantity,
                }))
                selectedProduct.value = undefined
                quantityToAdd.value = 1
                imageUrl.value = props.pkg.image
                    ? new URL(props.pkg.image, String(config.public.apiBase)).toString()
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

function addItem() {
    const product = selectedProduct.value
    if (!product || quantityToAdd.value < 1)
        return

    formItems.value.push({
        productId: product.id,
        productName: product.name,
        quantity: quantityToAdd.value,
    })
    selectedProduct.value = undefined
    quantityToAdd.value = 1
}

function removeItem(index: number) {
    formItems.value.splice(index, 1)
}

function buildPayload(): ProductPackage {
    return {
        ...(props.pkg?.id != null && { id: props.pkg.id }),
        name: name.value,
        description: description.value,
        price: price.value,
        image: props.pkg?.image ?? null,
        is_active: isActive.value,
        items: formItems.value.map((i) => ({
            product: i.productId,
            quantity: i.quantity,
        })),
    }
}

async function handleSubmit() {
    submitting.value = true
    const payload = buildPayload()

    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('description', payload.description)
    formData.append('price', payload.price)
    formData.append('is_active', String(payload.is_active))
    formData.append('items', JSON.stringify(payload.items))
    if (imageFile.value) {
        formData.append('image', imageFile.value)
    }

    try {
        if (isEdit.value && props.pkg?.id != null)
            await productStore.updatePackage(props.pkg.id, formData)
        else
            await productStore.createPackage(formData)

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
</script>

<template>
    <UModal :open="open" :title="isEdit ? 'Edit package' : 'Add package'"
        :description="isEdit ? 'Update the package details below.' : 'Fill in the details to add a new package.'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-2xl' }" @update:open="emit('close', $event)">
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
                    <UTextarea v-model="description" placeholder="Short description of the package..." :rows="2"
                        class="w-full" />
                </UFormField>

                <UFormField label="Products in package" name="items"
                    description="Search and select a product, set quantity, then add to the list.">
                    <div class="flex flex-wrap items-end gap-2">
                        <USelectMenu v-model="selectedProduct" :items="productOptions" placeholder="Search product..."
                            class="min-w-0 flex-1 sm:min-w-48" value-key="value" />
                        <UInput v-model.number="quantityToAdd" type="number" min="1" placeholder="Qty" class="w-20"
                            size="md" />
                        <UButton type="button" color="primary" variant="soft" icon="i-lucide-plus" label="Add"
                            :disabled="!selectedProduct || quantityToAdd < 1" @click="addItem" />
                    </div>

                    <ul v-if="formItems.length" class="mt-3 space-y-2">
                        <li v-for="(item, index) in formItems" :key="index"
                            class="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800/50">
                            <span class="text-sm font-medium text-neutral-900 dark:text-white">
                                {{ item.productName }} x {{ item.quantity }}
                            </span>
                            <UButton type="button" icon="i-lucide-x" color="error" variant="ghost" size="xs"
                                aria-label="Remove" @click="removeItem(index)" />
                        </li>
                    </ul>
                    <p v-else class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        No products added yet.
                    </p>
                </UFormField>

                <div class="grid gap-5 sm:grid-cols-2">
                    <UFormField label="Price (GHS)" name="price" required>
                        <UInput v-model="price" type="number" step="0.01" min="0" placeholder="0.00" size="lg" required
                            class="w-full" />
                    </UFormField>

                    <UFormField label="Status" name="status"
                        description="Active packages are visible; disabled are hidden.">
                        <USwitch v-model="isActive" :label="isActive ? 'Active' : 'Disabled'" />
                    </UFormField>
                </div>
            </form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Cancel" @click="close" />
                <UButton type="submit" form="add-edit-package-form" color="success" label="Save" class="ml-auto"
                    :loading="submitting" :disabled="!name || !price || formItems.length === 0 || submitting" />
            </div>
        </template>
    </UModal>
</template>

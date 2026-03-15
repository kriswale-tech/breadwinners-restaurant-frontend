<script setup lang="ts">
import type { UserCreateUpdatePayload, UsersList, UserRole } from '~/types'
import type { ErrorResponse } from '~/types/error'

const props = withDefaults(
    defineProps<{
        open: boolean
        user?: UsersList | null
    }>(),
    { user: null },
)

const emit = defineEmits<{
    close: [value: boolean]
}>()

const usersStore = useUsersStore()
const shopStore = useShopStore()
const toast = useToast()

const isEdit = computed(() => !!props.user)
const submitting = ref(false)

const firstName = ref('')
const lastName = ref('')
const role = ref<UserRole>('staff')
const shopId = ref<number | undefined>(undefined)
const phoneNumber = ref('')
const address = ref('')
const avatarFile = ref<File | undefined>(undefined)
const avatarUrl = ref('')
const objectUrl = ref<string | null>(null)

const roleOptions: { label: string; value: UserRole }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Staff', value: 'staff' },
]

const shopOptions = computed(() =>
    shopStore.shops.map((s) => ({ label: s.name, value: s.id })),
)

const isShopDisabled = computed(() => role.value === 'admin')

watch(role, (newRole) => {
    if (newRole === 'admin') {
        shopId.value = undefined
    }
})

function revokePreview() {
    if (objectUrl.value) {
        URL.revokeObjectURL(objectUrl.value)
        objectUrl.value = null
    }
}

function resetForm() {
    firstName.value = ''
    lastName.value = ''
    role.value = 'staff'
    shopId.value = undefined
    phoneNumber.value = ''
    address.value = ''
    avatarFile.value = undefined
    avatarUrl.value = ''
    revokePreview()
}

watch(avatarFile, (file) => {
    revokePreview()
    if (file) {
        objectUrl.value = URL.createObjectURL(file)
    }
})

const previewUrl = computed(() => {
    if (objectUrl.value) return objectUrl.value
    return avatarUrl.value || null
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

watch(
    () => [props.open, props.user],
    () => {
        if (props.open) {
            if (props.user) {
                firstName.value = props.user.first_name
                lastName.value = props.user.last_name
                role.value = props.user.role ?? 'staff'
                phoneNumber.value = props.user.phone_number
                address.value = props.user.address ?? ''
                avatarUrl.value = props.user.avatar ?? ''
                avatarFile.value = undefined
                revokePreview()

                const matchedShop = shopStore.shops.find(
                    (s) => s.name === props.user!.shop_name,
                )
                shopId.value = matchedShop?.id
            } else {
                resetForm()
            }
        }
    },
    { immediate: true },
)

function buildPayload(): FormData {
    const fd = new FormData()
    fd.append('first_name', firstName.value)
    fd.append('last_name', lastName.value)
    fd.append('phone_number', phoneNumber.value)
    fd.append('role', role.value)
    if (shopId.value != null) fd.append('shop', String(shopId.value))
    if (address.value) fd.append('address', address.value)
    if (avatarFile.value) fd.append('avatar', avatarFile.value)
    return fd
}

const phoneError = ref('')

watch(phoneNumber, () => {
    phoneError.value = ''
})

async function handleSubmit() {
    if (!PhoneNumberValidator(phoneNumber.value)) {
        phoneError.value = 'Phone number must be 10 digits and start with 0'
        return
    }

    submitting.value = true

    try {
        const payload = buildPayload()

        if (isEdit.value && props.user) {
            await usersStore.updateUser(props.user.id, payload)
        } else {
            await usersStore.createUser(payload)
        }

        close()
    } catch (error: unknown) {
        const errorResponse = error as ErrorResponse
        toast.add({
            title: errorResponse.message || 'Error',
            description: errorResponse.detail || 'Something went wrong. Please try again.',
            color: 'error',
            icon: 'i-lucide-alert-circle',
        })
    } finally {
        submitting.value = false
    }
}

function close() {
    emit('close', false)
}

onMounted(() => {
    if (shopStore.shops.length === 0) {
        shopStore.getShops()
    }
})
</script>

<template>
    <UModal :open="open" :title="isEdit ? 'Edit user' : 'Add user'"
        :description="isEdit ? 'Update the user details below.' : 'Fill in the details to add a new user.'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-2xl' }" @update:open="emit('close', $event)">
        <template #default>
            <span class="hidden" aria-hidden="true" />
        </template>
        <template #body>
            <form id="add-edit-user-form" class="space-y-5" @submit.prevent="handleSubmit">
                <div class="grid gap-5 sm:grid-cols-2">
                    <UFormField label="First name" name="firstName" required>
                        <UInput v-model="firstName" placeholder="e.g. Ama" size="lg" required class="w-full" />
                    </UFormField>

                    <UFormField label="Last name" name="lastName" required>
                        <UInput v-model="lastName" placeholder="e.g. Mensah" size="lg" required class="w-full" />
                    </UFormField>
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                    <UFormField label="Role" name="role" required>
                        <USelect v-model="role" :items="roleOptions" value-key="value" placeholder="Select role"
                            size="lg" class="w-full" />
                    </UFormField>

                    <UFormField label="Shop" name="shop">
                        <USelect v-model="shopId" :items="shopOptions" value-key="value" placeholder="Select shop"
                            size="lg" class="w-full" :disabled="isShopDisabled" />
                    </UFormField>
                </div>

                <UFormField label="Phone number" name="phoneNumber" required
                    :description="phoneError ? undefined : 'This is the phone number the user signs in with.'"
                    :error="phoneError || undefined">
                    <UInput v-model="phoneNumber" type="tel" placeholder="e.g. 0551234567" size="lg" required
                        class="w-full" :color="phoneError ? 'error' : undefined" :readonly="isEdit" />
                </UFormField>

                <UFormField label="Avatar" name="avatar" description="Optional profile image. PNG, JPG or GIF.">
                    <div class="space-y-2">
                        <UFileUpload v-model="avatarFile" accept="image/*" label="Drop image here or click to upload"
                            description="Optional. Max 5MB." icon="i-lucide-image" variant="area" class="min-h-32" />
                        <div v-if="previewUrl"
                            class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800/50">
                            <img :src="previewUrl" alt="Avatar preview" class="h-14 w-14 rounded-full object-cover">
                            <span class="text-sm text-neutral-500 dark:text-neutral-400">
                                {{ avatarFile ? 'New image selected' : 'Current avatar' }}
                            </span>
                        </div>
                    </div>
                </UFormField>

                <UFormField label="Address" name="address">
                    <UTextarea v-model="address" placeholder="Optional address..." :rows="2" class="w-full" />
                </UFormField>
            </form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Cancel" @click="close" />
                <UButton type="submit" form="add-edit-user-form" color="success" label="Save" class="ml-auto"
                    :loading="submitting" :disabled="!firstName || !lastName || !phoneNumber || submitting" />
            </div>
        </template>
    </UModal>
</template>

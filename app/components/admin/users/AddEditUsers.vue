<script setup lang="ts">
import type { User, UserRole } from '~/data/users'

const props = withDefaults(
    defineProps<{
        open: boolean
        user?: User | null
    }>(),
    { user: null },
)

const emit = defineEmits<{
    'close': [value: boolean]
    save: [payload: Partial<User> & { firstName: string; lastName: string; phoneNumber: string; role: UserRole }]
}>()

const isEdit = computed(() => !!props.user)

const firstName = ref('')
const lastName = ref('')
const role = ref<UserRole>('staff')
const phoneNumber = ref('')
const address = ref('')
const bio = ref('')
const avatarFile = ref<File | undefined>(undefined)
const avatarUrl = ref('')
const objectUrl = ref<string | null>(null)

const roleOptions: { label: string; value: UserRole }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Staff', value: 'staff' },
]

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
    phoneNumber.value = ''
    address.value = ''
    bio.value = ''
    avatarFile.value = undefined
    avatarUrl.value = ''
    revokePreview()
}

watch(
    () => [props.open, props.user],
    () => {
        if (props.open) {
            if (props.user) {
                firstName.value = props.user.firstName
                lastName.value = props.user.lastName
                role.value = props.user.role
                phoneNumber.value = props.user.phoneNumber
                address.value = props.user.address ?? ''
                bio.value = props.user.bio ?? ''
                avatarUrl.value = props.user.avatar ?? ''
                avatarFile.value = undefined
                revokePreview()
            } else {
                resetForm()
            }
        }
    },
    { immediate: true },
)

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

async function handleSubmit() {
    let avatar = avatarUrl.value
    if (avatarFile.value) {
        avatar = await fileToDataUrl(avatarFile.value)
    }

    emit('save', {
        ...(props.user?.id != null && { id: props.user.id }),
        firstName: firstName.value,
        lastName: lastName.value,
        role: role.value,
        phoneNumber: phoneNumber.value,
        address: address.value || undefined,
        bio: bio.value || undefined,
        avatar: avatar || undefined,
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
        :title="isEdit ? 'Edit user' : 'Add user'"
        :description="isEdit ? 'Update the user details below.' : 'Fill in the details to add a new user.'"
        :ui="{ content: 'w-[calc(100vw-2rem)] max-w-2xl' }"
        @update:open="emit('close', $event)"
    >
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

                <UFormField label="Role" name="role" required>
                    <USelect
                        v-model="role"
                        :items="roleOptions"
                        value-key="value"
                        placeholder="Select role"
                        size="lg"
                        class="w-full sm:w-60"
                    />
                </UFormField>

                <UFormField
                    label="Phone number"
                    name="phoneNumber"
                    required
                    description="This is the phone number the user signs in with."
                >
                    <UInput
                        v-model="phoneNumber"
                        type="tel"
                        placeholder="e.g. 0551234567"
                        size="lg"
                        required
                        class="w-full"
                    />
                </UFormField>

                <UFormField label="Avatar" name="avatar" description="Optional profile image. PNG, JPG or GIF.">
                    <div class="space-y-2">
                        <UFileUpload
                            v-model="avatarFile"
                            accept="image/*"
                            label="Drop image here or click to upload"
                            description="Optional. Max 5MB."
                            icon="i-lucide-image"
                            variant="area"
                            class="min-h-32"
                        />
                        <div
                            v-if="previewUrl"
                            class="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800/50"
                        >
                            <img :src="previewUrl" alt="Avatar preview" class="h-14 w-14 rounded-full object-cover">
                            <span class="text-sm text-neutral-500 dark:text-neutral-400">
                                {{ avatarFile ? 'New image selected' : 'Current avatar' }}
                            </span>
                        </div>
                    </div>
                </UFormField>

                <UFormField label="Address" name="address">
                    <UTextarea
                        v-model="address"
                        placeholder="Optional address..."
                        :rows="2"
                        class="w-full"
                    />
                </UFormField>

                <UFormField label="Bio" name="bio">
                    <UTextarea
                        v-model="bio"
                        placeholder="Optional short bio..."
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
                    form="add-edit-user-form"
                    color="success"
                    label="Save"
                    class="ml-auto"
                    :disabled="!firstName || !lastName || !phoneNumber"
                />
            </div>
        </template>
    </UModal>
</template>


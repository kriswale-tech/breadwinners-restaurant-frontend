<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
import type { ErrorResponse } from '~/types/error'

const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const uid = computed(() => String(route.params.uid ?? ''))
const token = computed(() => String(route.params.token ?? ''))

function validatePasswords() {
  if (!password.value || !confirmPassword.value) {
    toast.add({
      title: 'Missing password',
      description: 'Please enter and confirm your new password.',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
    return false
  }

  if (password.value !== confirmPassword.value) {
    toast.add({
      title: 'Passwords do not match',
      description: 'Make sure both password fields are the same.',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
    return false
  }

  if (password.value.length < 8) {
    toast.add({
      title: 'Password too short',
      description: 'Password must be at least 8 characters.',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
    return false
  }

  return true
}

async function handleSubmit() {
  if (!validatePasswords()) return

  isSubmitting.value = true

  // Simulate submit – log payload to console
  // Replace with real API call later
  const payload = {
    uid: uid.value,
    token: token.value,
    password: confirmPassword.value,
  }

  try {
    await authStore.setupPassword(payload)
    toast.add({
      title: 'Password set',
      description: 'Your password has been set. You can now login.',
      color: 'success',
      icon: 'i-lucide-check',
    })
  }
  catch (error) {
    console.error(error)
    const errorResponse = error as ErrorResponse
    toast.add({
      title: errorResponse.message || 'Error',
      description: errorResponse.detail || 'An error occurred while setting your password.',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
    return
  } finally {
    isSubmitting.value = false
  }

  navigateTo('/admin/auth/login')

}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
    <UCard class="w-full max-w-md border border-neutral-200 dark:border-neutral-800">
      <div class="space-y-2 mb-6">
        <h1 class="text-xl font-semibold text-neutral-900 dark:text-white">
          Set your password
        </h1>
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          Create a new password to complete your account setup.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <UFormField label="New password" name="password" required>
          <UInput v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter a strong password"
            size="lg" class="w-full">
            <template #trailing>
              <button type="button"
                class="flex items-center justify-center px-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 pointer-events-auto"
                @click="showPassword = !showPassword">
                <Icon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-5" />
              </button>
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Confirm password" name="confirmPassword" required description="Must match the new password.">
          <UInput v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Re-enter your password" size="lg" class="w-full">
            <template #trailing>
              <button type="button"
                class="flex items-center justify-center px-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 pointer-events-auto"
                @click="showConfirmPassword = !showConfirmPassword">
                <Icon :name="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-5" />
              </button>
            </template>
          </UInput>
        </UFormField>

        <UButton type="submit" color="primary" class="w-full mt-2" :loading="isSubmitting" :disabled="isSubmitting"
          icon="i-lucide-lock">
          Set password
        </UButton>
      </form>
    </UCard>
  </div>
</template>

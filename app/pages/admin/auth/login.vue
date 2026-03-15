<script setup lang="ts">
const authStore = useAuthStore()
const toast = useToast()
const phone = ref('0208232081')
const password = ref('christian_amoakohene')
const showPassword = ref(false)

async function onSubmit() {
    try {
        await authStore.login(phone.value, password.value)
    }
    catch (error) {
        console.error(error)
        toast.add({
            title: 'Error',
            description: (error as any)?.detail || 'An error occurred while logging in',
            color: 'error',
        })
        return
    }
    navigateTo('/admin')
}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center px-4">
        <div class="w-full max-w-sm space-y-4 border p-4 rounded-lg border-neutral-200 dark:border-neutral-800">
            <div class="text-center">
                <h1 class="text-2xl font-semibold text-neutral-900 dark:text-white">
                    Admin login
                </h1>
                <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Sign in to continue
                </p>
            </div>

            <form class="space-y-4" @submit.prevent="onSubmit">
                <UFormField label="Phone number" name="phone" required>
                    <UInput v-model="phone" type="tel" placeholder="Enter your phone number" size="lg" class="w-full"
                        required />
                </UFormField>

                <UFormField label="Password" name="password" required>
                    <UInput v-model="password" :type="showPassword ? 'text' : 'password'"
                        placeholder="Enter your password" size="lg" class="w-full" required>
                        <template #trailing>
                            <button type="button"
                                class="flex items-center justify-center px-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 pointer-events-auto"
                                @click="showPassword = !showPassword">
                                <Icon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-5" />
                            </button>
                        </template>
                    </UInput>
                </UFormField>

                <UButton type="submit" block size="lg" color="primary" label="Sign in" class="cursor-pointer" />
            </form>
        </div>
    </div>
</template>

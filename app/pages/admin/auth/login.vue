<script setup lang="ts">
const phone = ref('')
const password = ref('')

function onSubmit() {
    // TODO: handle login
    console.log({ phone: phone.value, password: password.value })
}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center px-4">
        <div class="w-full max-w-sm space-y-6 border p-4 rounded-lg border-neutral-200 dark:border-neutral-800">
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
                    <UInput v-model="phone" type="tel" placeholder="Enter your phone number" size="lg" class="w-full" />
                </UFormField>

                <UFormField label="Password" name="password" required>
                    <UInput v-model="password" type="password" placeholder="Enter your password" size="lg"
                        class="w-full" />
                </UFormField>

                <UButton type="submit" block size="lg" color="primary" label="Sign in" />
            </form>
        </div>
    </div>
</template>

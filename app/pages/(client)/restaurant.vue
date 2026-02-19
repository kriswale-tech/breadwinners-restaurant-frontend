<script setup lang="ts">
definePageMeta({
    theme: 'amber'
})

</script>

<template>
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
        <div class="max-w-xl w-full text-center bg-white dark:bg-neutral-900 rounded-xl shadow-md p-8">
            <div class="flex items-center justify-center mb-4">
                <Icon name="heroicons:clock" class="size-12 text-primary-600" />
            </div>
            <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-200 mb-2">Restaurant — Coming Soon</h1>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">We're putting the finishing touches on our
                restaurant features. Stay tuned — great food is on the way.</p>

            <div class="flex items-center justify-center gap-3">
                <UButton to="/" color="primary" variant="solid">Back to Home</UButton>
                <NuxtLink to="/contact" class="text-sm text-neutral-600 dark:text-neutral-300 underline">Contact us
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped></style>
<script setup lang="ts">
definePageMeta({
  theme: 'green',
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-xl w-full text-center bg-white dark:bg-neutral-900 rounded-xl shadow-md p-8">
      <div class="flex items-center justify-center mb-4">
        <Icon name="heroicons:truck" class="size-12 text-primary-600" />
      </div>
      <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-200 mb-2">
        Track Order — Coming Soon
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Order tracking is on the way. You’ll be able to follow your delivery in real time.
      </p>

      <div class="flex items-center justify-center gap-3">
        <UButton to="/" color="primary" variant="solid">Back to Home</UButton>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
definePageMeta({
  theme: 'amber',
})
</script>

<template>
  <div class="min-h-screen px-4 py-16">
    <div class="container space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-200">Contact us</h1>
        <p class="mt-2 text-gray-700 dark:text-gray-300">
          Legon Campus
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6">
          <div class="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
            <Icon name="heroicons:phone" class="size-5 text-primary-600" />
            Phone
          </div>
          <div class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">+233 24 123 4567</div>
          <div class="text-sm text-neutral-600 dark:text-neutral-300">+233 20 765 4321</div>
        </div>

        <div class="rounded-xl bg-white dark:bg-neutral-900 shadow-sm p-6">
          <div class="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
            <Icon name="heroicons:envelope" class="size-5 text-primary-600" />
            Email
          </div>
          <div class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">hello@breadwinners.com</div>
        </div>
      </div>
    </div>
  </div>
</template>


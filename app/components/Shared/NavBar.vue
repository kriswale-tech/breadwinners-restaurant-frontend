<script setup lang="ts">
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-transparent">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <!-- Left: Home -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        <Icon name="heroicons:home" class="size-5" />
        <span>Home</span>
      </NuxtLink>

      <!-- Center: BreadWinners & Restaurant -->
      <div class="flex items-center gap-8">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <Icon name="lucide:croissant" class="size-5" />
          <span>BreadWinners</span>
        </NuxtLink>
        <NuxtLink
          to="/restaurant"
          class="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <Icon name="heroicons:building-storefront" class="size-5" />
          <span>Restaurant</span>
        </NuxtLink>
      </div>

      <!-- Right: Track order -->
      <UButton
        to="/track-order"
        variant="soft"
        color="primary"
        class="flex items-center gap-2"
      >
        <Icon name="heroicons:truck" class="size-5" />
        <span>Track order</span>
      </UButton>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const shopStore = useShopStore()


const navClass = computed(() =>
  `mx-auto flex items-center justify-between px-4 transition-all duration-300 max-w-7xl py-2 rounded-full bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm`
)

const linkClass = computed(() =>
  'flex items-center gap-2 text-sm font-medium text-primary-900 dark:text-white transition'
)

</script>

<template>
  <header class="fixed inset-x-4 top-4 z-50">
    <nav :class="navClass">
      <!-- Left: Home -->
      <NuxtLink :to="'/'" :class="linkClass">
        <NuxtImg src="/images/logo.avif" alt="BreadWinners" class="w-32" />
      </NuxtLink>

      <!-- Center: BreadWinners & Restaurant -->

      <NuxtLink to="/menu" :class="linkClass" class="hover:text-amber-600">
        <Icon name="heroicons:book-open" class="size-5" />
        <span>See our menu</span>
      </NuxtLink>

      <!-- Right: Track order -->
      <div class="flex items-center gap-4">
        <UButton to="/track-order" variant="ghost" color="neutral" class="flex items-center gap-2">
          <Icon name="heroicons:truck" class="size-5" />
          <span>Track order</span>
        </UButton>

        <!-- cart -->
        <SharedCartComponent />
      </div>
    </nav>
  </header>
</template>

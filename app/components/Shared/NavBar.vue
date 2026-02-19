<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const isScrolled = ref(false)

let raf = 0
function onScroll() {
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 8
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // initialize
  isScrolled.value = window.scrollY > 8
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})

const headerClass = computed(() =>
  isScrolled.value
    ? 'fixed inset-x-4 top-4 z-50'
    : 'fixed inset-x-0 top-0 z-50'
)

const navBase =
  'mx-auto flex items-center justify-between px-4 transition-all duration-300'

const navClass = computed(() =>
  isScrolled.value
    ? `${navBase} max-w-7xl py-2 rounded-full bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm`
    : `${navBase} max-w-7xl py-4 bg-transparent`
)

const linkClass = computed(() =>
  isScrolled.value
    ? 'flex items-center gap-2 text-sm font-medium text-primary-900 dark:text-white transition'
    : 'flex items-center gap-2 text-sm font-medium text-gray-700 transition dark:text-gray-300'
)
</script>

<template>
  <header :class="headerClass">
    <nav :class="navClass">
      <!-- Left: Home -->
      <NuxtLink :to="'/'" :class="linkClass">
        <Icon name="heroicons:home" class="size-5" />
        <span>Home</span>
      </NuxtLink>

      <!-- Center: BreadWinners & Restaurant -->
      <div class="flex items-center gap-8">
        <NuxtLink :to="'/breadwinners'" :class="linkClass">
          <Icon name="lucide:croissant" class="size-5" />
          <span>Bread Winners</span>
        </NuxtLink>
        <NuxtLink :to="'/restaurant'" :class="linkClass">
          <Icon name="heroicons:building-storefront" class="size-5" />
          <span>Restaurant</span>
        </NuxtLink>
      </div>

      <!-- Right: Track order -->
      <UButton to="/track-order" variant="soft" color="primary" class="flex items-center gap-2">
        <Icon name="heroicons:truck" class="size-5" />
        <span>Track order</span>
      </UButton>
    </nav>
  </header>
</template>

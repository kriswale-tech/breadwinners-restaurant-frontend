<script setup lang="ts">
const toaster = { position: 'top-center' as const }

const authStore = useAuthStore()

if (authStore.isLoggedIn) {
  await navigateTo('/admin')
}
</script>

<template>
  <UApp :toaster="toaster">
    <UiAppTheme>
      <slot />
    </UiAppTheme>
  </UApp>
</template>

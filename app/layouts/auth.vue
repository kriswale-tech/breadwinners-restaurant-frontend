<script setup lang="ts">
const toaster = { position: 'top-center' as const }
</script>

<template>
  <UApp :toaster="toaster">
    <UiAppTheme>
      <slot />
    </UiAppTheme>
  </UApp>
</template>

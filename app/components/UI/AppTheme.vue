<script setup lang="ts">
const theme = useTheme()

// Watch theme changes and update data-theme attribute on document root (client only)
// CSS handles the actual variable switching via attribute selectors
watch(() => theme.value, (color) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', color)
  }
}, { immediate: true })
</script>

<template>
  <slot />
</template>

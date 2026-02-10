<script setup lang="ts">
// Default layout for the client.
// This layout is used for all pages that are not admin pages.
</script>

<template>
  <div>
    <UApp>
      <SharedNavBar />
      <slot />
    </UApp>
  </div>
</template>
<script setup lang="ts">
// Default layout for the client.
// This layout is used for all pages that are not admin pages.
</script>

<template>
  <div class="font-inter">
    <UApp>
      <UIAppTheme>
        <SharedNavBar />
        <SharedCartComponent />
        <slot />
        <SharedFooter />
      </UIAppTheme>
    </UApp>
  </div>
</template>
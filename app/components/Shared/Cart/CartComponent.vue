<script setup lang="ts">
const isCartOpen = ref(false)

function toggleCart() {
  isCartOpen.value = !isCartOpen.value
}

function closeCart() {
  isCartOpen.value = false
}

provide('cartOpen', {
  isCartOpen,
  toggleCart,
  closeCart,
})
</script>

<template>
  <div>
    <div class="fixed bottom-6 right-6 z-50">
      <SharedCartIcon />
    </div>

    <SharedCartOrderInfo />
  </div>
</template>

<style lang="scss" scoped></style>
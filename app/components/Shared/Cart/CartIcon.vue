<script setup lang="ts">
const cartStore = useCartStore()
const { toggleCart } = inject<{ toggleCart: () => void }>('cartOpen')!
</script>

<template>
    <button type="button"
        class="relative rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-100"
        aria-label="Open cart" @click="toggleCart()">
        <Icon name="heroicons:shopping-cart" class="size-8 " />

        <!-- Cart count - ClientOnly to prevent hydration mismatch -->
        <ClientOnly>
            <span v-if="cartStore.totalItems > 0"
                class="absolute top-0 right-0 translate-x-1.5 -translate-y-1 bg-red-600 text-white rounded-full h-5 min-w-5 px-1 py-0.5 flex items-center justify-center text-sm border border-white font-bold">
                {{ cartStore.totalItems }}
            </span>
        </ClientOnly>
    </button>
</template>

<style lang="css" scoped></style>
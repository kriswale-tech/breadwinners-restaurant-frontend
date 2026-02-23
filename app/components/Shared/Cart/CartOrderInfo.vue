<script setup lang="ts">
const cartStore = useCartStore()
const { isCartOpen, closeCart } = inject<{ isCartOpen: Ref<boolean>; closeCart: () => void }>('cartOpen')!

const formattedTotal = computed(() =>
    cartStore.totalPrice.toFixed(2)
)

function close() {
    closeCart()
}

function clearAll() {
    cartStore.clearCart()
    close()
}

function goToCheckout() {
    close()
    navigateTo('/checkout')
}
</script>

<template>
    <Teleport to="body">
        <!-- Backdrop -->
        <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isCartOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" aria-hidden="true"
                @click="close" />
        </Transition>

        <!-- Sidebar -->
        <Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="translate-x-full"
            enter-to-class="translate-x-0" leave-active-class="transition-transform duration-250 ease-in"
            leave-from-class="translate-x-0" leave-to-class="translate-x-full">
            <aside v-if="isCartOpen"
                class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-neutral-900"
                role="dialog" aria-modal="true" aria-label="Cart">
                <!-- Header with close -->
                <div
                    class="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-700">
                    <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
                        Your cart
                    </h2>
                    <UButton icon="heroicons:x-mark" size="md" color="neutral" variant="ghost" aria-label="Close cart"
                        class="-mr-1" @click="close" />
                </div>

                <!-- Items list -->
                <div class="flex-1 overflow-y-auto px-4 py-4">
                    <div v-if="cartStore.items.length === 0"
                        class="flex flex-col items-center justify-center py-12 text-center">
                        <Icon name="heroicons:shopping-cart" class="size-16 text-neutral-300 dark:text-neutral-600" />
                        <p class="mt-4 text-neutral-600 dark:text-neutral-400">
                            Your cart is empty
                        </p>
                    </div>
                    <ul v-else class="flex flex-col gap-3">
                        <li v-for="item in cartStore.items" :key="item.id">
                            <SharedCartItem :item="item" />
                        </li>
                    </ul>
                </div>

                <!-- Summary & actions -->
                <div v-if="cartStore.items.length > 0"
                    class="shrink-0 border-t border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                    <div class="mb-4 flex items-center justify-between text-sm">
                        <span class="text-neutral-600 dark:text-neutral-400">
                            {{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'item' : 'items' }}
                        </span>
                        <span class="text-lg font-semibold text-neutral-900 dark:text-white">
                            Total: GH₵{{ formattedTotal }}
                        </span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <UButton block size="lg" color="primary" label="Proceed to checkout" @click="goToCheckout" />
                        <UButton block size="md" color="neutral" variant="soft" label="Clear cart"
                            icon="heroicons:trash" @click="clearAll" />
                    </div>
                </div>
            </aside>
        </Transition>
    </Teleport>
</template>

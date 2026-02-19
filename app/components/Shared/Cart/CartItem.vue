<script setup lang="ts">
import type { CartItemType } from '~/stores/cart-store'

const props = defineProps<{
    item: CartItemType
}>()

const cartStore = useCartStore()

const price = computed(() => {
    const p = props.item.price
    return typeof p === 'string' ? parseFloat(p) : p
})

const lineTotal = computed(() => (price.value * props.item.quantity).toFixed(2))

function increase() {
    cartStore.updateQuantity(props.item.id, props.item.quantity + 1)
}

function decrease() {
    if (props.item.quantity <= 1) return
    cartStore.updateQuantity(props.item.id, props.item.quantity - 1)
}

function onQuantityChange(e: Event) {
    const input = e.target as HTMLInputElement
    const parsed = parseInt(input.value, 10)
    if (!Number.isNaN(parsed) && parsed >= 1) {
        cartStore.updateQuantity(props.item.id, parsed)
    } else {
        input.value = String(props.item.quantity)
    }
}

function remove() {
    cartStore.removeFromCart(props.item.id)
}
</script>

<template>
    <div class="cart-item relative flex items-center gap-3 overflow-hidden rounded-xl border border-neutral-200 p-3 shadow-sm dark:border-neutral-700"
        :class="item.image ? '' : 'bg-white dark:bg-neutral-800'">
        <div v-if="item.image" class="cart-item-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${item.image})` }" aria-hidden="true" />
        <div class="cart-item-overlay absolute inset-0 rounded-xl"
            :class="item.image ? 'bg-linear-to-r from-black/85 via-black/60 to-black/40' : ''" aria-hidden="true" />

        <div class="relative z-10 min-w-0 flex-1 space-y-1">
            <p class="truncate font-medium" :class="item.image ? 'text-white' : 'text-neutral-900 dark:text-white'">
                {{ item.name }}
            </p>
            <p v-if="item.description" class="mt-0.5 line-clamp-2 text-xs"
                :class="item.image ? 'text-white/90' : 'text-neutral-500 dark:text-neutral-400'">
                {{ item.description }}
            </p>
            <p class="text-lg font-semibold mt-2"
                :class="item.image ? 'text-white/95' : 'text-neutral-600 dark:text-neutral-400'">
                GH₵{{ lineTotal }}
            </p>
        </div>

        <div class="relative z-10 flex items-center gap-1">
            <UButton icon="heroicons:minus" size="xs" :color="item.image ? 'neutral' : 'neutral'"
                :variant="item.image ? 'solid' : 'soft'" :disabled="item.quantity <= 1" aria-label="Decrease quantity"
                @click="decrease" />
            <input type="number" :value="item.quantity" min="1"
                class="quantity-input w-12 rounded border px-1 py-1 text-center text-sm font-medium tabular-nums outline-none"
                :class="item.image
                    ? 'border-white/30 bg-white/20 text-white placeholder-white/60 focus:ring-white/50'
                    : 'border-neutral-200 bg-white text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white'"
                aria-label="Quantity" @change="onQuantityChange">
            <UButton icon="heroicons:plus" size="xs" :variant="item.image ? 'solid' : 'soft'" color="neutral"
                aria-label="Increase quantity" @click="increase" />
            <UButton icon="heroicons:trash" size="xs" color="info" variant="solid" aria-label="Remove item"
                @click="remove" />
        </div>
    </div>
</template>

<style scoped>
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.quantity-input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
}
</style>

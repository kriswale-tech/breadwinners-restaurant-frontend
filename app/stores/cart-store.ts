import { defineStore } from 'pinia'
import type { Product } from '~/data/products'

export interface CartItemType extends Product {
    quantity: number
}

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItemType[]>([])

    function addToCart(product: Product, quantity = 1) {
        const existing = items.value.find(item => item.id === product.id)
        if (existing) {
            existing.quantity += quantity
        } else {
            items.value.push({ ...product, quantity })
        }
    }

    function removeFromCart(productId: number) {
        items.value = items.value.filter(item => item.id !== productId)
    }

    function updateQuantity(productId: number, quantity: number) {
        const item = items.value.find(i => i.id === productId)
        if (item) item.quantity = quantity
    }

    function clearCart() {
        items.value = []
    }

    const totalItems = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    const totalPrice = computed(() =>
        items.value.reduce((sum, item) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
            return sum + price * item.quantity
        }, 0)
    )

    return {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    }
})
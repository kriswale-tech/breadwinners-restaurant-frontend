import { defineStore } from 'pinia'
import type { Product, ProductPackage } from '~/types/products'
import type { OrderCreatePayload } from '~/types/orders'

/**
 * Cart line: product or package. Use `item_id` (e.g. product-1 vs package-1) so numeric ids never collide.
 */
export type CartLine =
    | (Product & { quantity: number; item_type: 'product'; item_id: string })
    | (ProductPackage & { quantity: number; item_type: 'package'; item_id: string })

/** @deprecated Use CartLine — kept for existing imports */
export type CartItemType = CartLine

function productCartId(id: number) {
    return `product-${id}`
}

function packageCartId(id: number) {
    return `package-${id}`
}

export type AddToCartPayload =
    | { kind: 'product'; data: Product; quantity?: number }
    | { kind: 'package'; data: ProductPackage; quantity?: number }

export const useCartStore = defineStore('cart', () => {
    const { post } = useApi()
    const items = ref<CartLine[]>([])
    const shopId = ref<number | null>(null)
    const toast = useToast()
    const loading = ref(false)

    watch(() => items.value, (newItems) => {
        if (newItems.length === 0) {
            shopId.value = null
            console.log('shopId from watch', shopId.value)
        }
    })

    function addToCart(payload: AddToCartPayload, shop: number) {
        if (shopId.value !== null && shopId.value !== shop) {
            toast.add({
                title: 'Cart is not empty',
                description: 'Please clear the cart before adding items from another shop',
                color: 'warning',
                actions: [
                    {
                        label: 'Yes, clear cart',
                        color: 'error',
                        variant: 'soft',
                        onClick: () => clearCart()
                    }
                ]
            })
            return
        }
        shopId.value = shop;
        console.log('shopId', shopId.value)
        const quantity = payload.quantity ?? 1
        const item_id = payload.kind === 'product' ? productCartId(payload.data.id) : packageCartId(payload.data.id)
        const existing = items.value.find((i) => i.item_id === item_id)
        if (existing) {
            existing.quantity += quantity
            return
        }
        if (payload.kind === 'product') {
            items.value.push({
                ...payload.data,
                quantity,
                item_type: 'product',
                item_id,
            })
        } else {
            items.value.push({
                ...payload.data,
                quantity,
                item_type: 'package',
                item_id,
            })
        }
    }

    function removeFromCart(itemId: string) {
        items.value = items.value.filter((i) => i.item_id !== itemId)
    }

    function updateQuantity(itemId: string, quantity: number) {
        const item = items.value.find((i) => i.item_id === itemId)
        if (item) item.quantity = quantity
    }

    function clearCart() {
        items.value = []
    }

    const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

    const totalPrice = computed(() =>
        items.value.reduce((sum, item) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
            return sum + price * item.quantity
        }, 0),
    )

    // ========================= ORDER OPERATIONS =========================
    async function createOrder(payload: OrderCreatePayload) {
        loading.value = true
        try {
            await post<void>(`shops/${shopId.value}/orders/`, payload)
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        createOrder,
        loading,
        shopId,
    }
}, {
    persist: true,
})

import { defineStore } from 'pinia'
import type { Product, ProductPackage } from '~/types/products'
import type { OrderCreatePayload, OrderDetail } from '~/types/orders'

export interface PaystackData {
    authorization_url: string
    access_code: string
    reference: string
}

export interface VerifyPaymentResponse {
    status: string
    message: string
    order: OrderDetail
}

export interface TrackOrderResponse {
    status: string
    message: string
    order?: OrderDetail | null
}

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
    const { post, get } = useApi()
    const items = ref<CartLine[]>([])
    const toast = useToast()
    const loading = ref(false)


    function addToCart(payload: AddToCartPayload,) {
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
    async function createOrder(payload: OrderCreatePayload, shopId: number) {
        loading.value = true
        try {
            const response = await post<PaystackData>(`shops/${shopId}/orders/initialize-payment/`, payload)
            return response
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            loading.value = false
        }
    }

    async function verifyPayment(reference: string, shopId: number) {
        try {
            const response = await get<VerifyPaymentResponse>(`shops/${shopId}/orders/verify-payment/?reference=${reference}`)
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async function createOrderWithoutPayment(payload: OrderCreatePayload, shopId: number) {
        loading.value = true
        try {
            const order = await post<OrderDetail>(`shops/${shopId}/orders/`, payload)
            toast.add({
                title: 'Success',
                description: 'Order created successfully',
                color: 'success',
                icon: 'heroicons:check-circle',
            })
            return order
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            loading.value = false
        }
    }

    async function trackOrder(phone: string, orderNumber: string) {
        const q = new URLSearchParams({
            customer_phone: phone,
            order_number: orderNumber,
        })
        const response = await get<TrackOrderResponse>(`orders/track/?${q.toString()}`)
        return response
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
        verifyPayment,
        createOrderWithoutPayment,
        trackOrder,
    }
}, {
    persist: true,
})

import type { OrderItem } from "~/data/order"
import type { Product } from "~/types/products"
import type { OrderCreatePayload, Order, OrderDetail, OrderStatistics } from "~/types/orders"
import type { ErrorResponse } from "~/types/error"
export interface OrderItemType extends Product {
    quantity: number
}

export const useOrderStore = defineStore('order', () => {
    const { get, post, patch, del } = useApi()
    const { selectedShop } = useShopStore()
    const toast = useToast()
    const orders = ref<Order[]>([])
    const loading = ref(false)
    const orderStatistics = ref<OrderStatistics | null>(null)
    //  ========================= CART ORDER OPERATIONS =========================
    const itemsInCart = ref<OrderItemType[]>([])

    const totalPrice = computed(() => {
        return itemsInCart.value.reduce((sum, item) => sum + (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity, 0)
    })

    function addToCart(product: Product, quantity = 1) {
        const existing = itemsInCart.value.find(item => item.id === product.id)
        if (existing) {
            existing.quantity += quantity
        } else {
            itemsInCart.value.push({ ...product, quantity })
        }
    }

    function clearCart() {
        itemsInCart.value = []
    }

    function removeProduct(productId: number) {
        itemsInCart.value = itemsInCart.value.filter(item => item.id !== productId)
    }

    //  ========================= ORDER OPERATIONS =========================
    async function createOrder(payload: OrderCreatePayload) {
        loading.value = true
        try {
            await post<void>(`shops/${selectedShop?.id}/orders/`, payload)
            await getOrders()
            toast.add({
                title: 'Success',
                description: 'Order created successfully',
                color: 'success',
                icon: 'heroicons:check-circle',
            })
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            loading.value = false
        }
    }

    async function getOrders() {
        loading.value = true
        try {
            const response = await get<Order[]>(`shops/${selectedShop?.id}/orders/`)
            await getOrderStatistics()
            orders.value = response
        } catch (error) {
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to get orders',
                color: 'error',
                icon: 'heroicons:x-circle',
            })
        } finally {
            loading.value = false
        }
    }

    async function getOrderDetail(orderId: number) {
        loading.value = true
        try {
            const response = await get<OrderDetail>(`shops/${selectedShop?.id}/orders/${orderId}/`)
            return response
        } catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to get order detail',
                color: 'error',
                icon: 'heroicons:x-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function updateOrder(orderId: number, payload: Record<string, string>) {
        loading.value = true
        try {
            await patch<void>(`shops/${selectedShop?.id}/orders/${orderId}/`, payload)
            await getOrders()
            toast.add({
                title: 'Success',
                description: 'Order updated successfully',
                color: 'success',
                icon: 'heroicons:check-circle',
            })
        } catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            throw errorResponse
        } finally {
            loading.value = false
        }
    }

    async function getOrderStatistics() {
        loading.value = true
        try {
            const response = await get<OrderStatistics>(`shops/${selectedShop?.id}/orders/statistics/`)
            orderStatistics.value = response
        } catch (error) {
            console.error(error)
        }
    }

    return {
        orders,
        itemsInCart,
        loading,
        addToCart,
        totalPrice,
        clearCart,
        removeProduct,

        createOrder,
        getOrders,
        getOrderDetail,
        updateOrder,
        orderStatistics,
        getOrderStatistics,
    }
},
    {
        persist: {
            omit: ['loading', 'itemsInCart']
        }
    }

)
import type { Shop } from "~/types/index"

export interface Order {
    id: number
    shop: number
    shop_name: string
    customer_name: string
    customer_phone: string
    status: OrderStatus
    total_amount: string
    delivery_method: DeliveryMethod
    order_number: string
    created_at: string
    updated_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'done' | 'delivered'

export type DeliveryMethod = 'pickup' | 'delivery'

export interface OrderItem {
    id?: number
    product?: number
    product_name?: string
    package?: number
    package_name?: string
    quantity: number
    unit_price: string | number
    total_price: string | number
    item_type?: string
}

export interface OrderCreatePayload {
    customer_name: string
    customer_phone: string
    total_amount: string | number
    delivery_method: DeliveryMethod
    delivery_address?: string
    address_latitude?: string | number
    address_longitude?: string | number
    delivery_notes?: string
    email?: string
    items: OrderItem[]
    callback_url?: string
}

export interface OrderDetail {
    id: number
    shop: Shop
    customer_name: string
    customer_phone: string
    status: OrderStatus
    total_amount: string | number
    delivery_method: DeliveryMethod
    order_number: string
    created_at: string
    updated_at: string
    email?: string
    delivery_address?: string
    address_latitude?: string | number
    address_longitude?: string | number
    delivery_notes?: string
    items: OrderItem[]
}

export interface OrderStatistics {
    pending: number
    confirmed: number
    cancelled: number
    delivered: number
    done: number
}
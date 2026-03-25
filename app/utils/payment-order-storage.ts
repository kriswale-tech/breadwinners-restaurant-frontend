import type { OrderDetail } from '~/types/orders'

const STORAGE_PREFIX = 'breadwinners:checkout:payment-order:v1:'

function storageKey(orderNumber: string) {
    return `${STORAGE_PREFIX}${orderNumber}`
}

/** Persist verified order for the payment-success receipt page (client-only). */
export function storePaymentOrderDetail(order: OrderDetail) {
    if (!import.meta.client || !order.order_number) return
    localStorage.setItem(storageKey(order.order_number), JSON.stringify(order))
}

/**
 * Read order snapshot for `orderNumber`.
 * Returns `null` if missing or invalid JSON.
 */
export function getPaymentOrderDetail(orderNumber: string): OrderDetail | null {
    if (!import.meta.client || !orderNumber) return null
    const raw = localStorage.getItem(storageKey(orderNumber))
    if (raw == null) return null
    try {
        return JSON.parse(raw) as OrderDetail
    } catch {
        return null
    }
}

/** Clear stored order snapshot for `orderNumber`. */
export function clearPaymentOrderDetail(orderNumber: string) {
    if (!import.meta.client || !orderNumber) return
    localStorage.removeItem(storageKey(orderNumber))
}

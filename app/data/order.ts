export type OrderStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Done' | 'Delivered'

export type DeliveryType = 'pickup' | 'delivery'

export interface OrderItem {
    name: string
    unitPrice: number
    quantity: number
}

export interface Order {
    orderId: string
    date: string
    status: OrderStatus
    phoneNumber: string
    customerName: string
    amount: number
    shop: string
    /** Customer email, optional */
    email?: string
    /** Pickup or delivery */
    deliveryType?: DeliveryType
    /** Delivery address (when deliveryType is delivery) */
    address?: string
    /** Coordinates for map (when deliveryType is delivery) */
    coordinates?: { lat: number; lng: number }
    /** Notes from customer for delivery */
    deliveryNotes?: string
    /** Line items (if not set, derived from amount for display) */
    items?: OrderItem[]
}

export const statusBadgeColor: Record<OrderStatus, 'warning' | 'info' | 'error' | 'success' | 'neutral'> = {
    Pending: 'warning',
    Confirmed: 'neutral',
    Cancelled: 'error',
    Done: 'info',
    Delivered: 'success',
}

export const orders = ref<Order[]>([
    {
        orderId: '1001',
        date: '2025-02-23T10:30:00',
        status: 'Pending',
        phoneNumber: '0201234567',
        customerName: 'Jane Doe',
        email: 'jane.doe@example.com',
        amount: 45.5,
        shop: 'Breadwinners Main',
        deliveryType: 'delivery',
        address: '123 High Street, Accra',
        coordinates: { lat: 5.6037, lng: -0.187 },
        deliveryNotes: 'Please ring the bell.',
        items: [
            { name: 'Whole Wheat Loaf', unitPrice: 12.5, quantity: 2 },
            { name: 'Croissant', unitPrice: 5.0, quantity: 4 },
        ],
    },
    {
        orderId: '1002',
        date: '2025-02-23T09:15:00',
        status: 'Confirmed',
        phoneNumber: '0249876543',
        customerName: 'John Smith',
        amount: 28.0,
        shop: 'Breadwinners East',
        deliveryType: 'pickup',
        items: [
            { name: 'Baguette', unitPrice: 8.0, quantity: 2 },
            { name: 'Butter Roll', unitPrice: 4.0, quantity: 3 },
        ],
    },
    {
        orderId: '1003',
        date: '2025-02-22T16:45:00',
        status: 'Delivered',
        phoneNumber: '0551112233',
        customerName: 'Ama Mensah',
        email: 'ama.mensah@example.com',
        amount: 62.0,
        shop: 'Breadwinners Main',
        deliveryType: 'delivery',
        address: '45 Independence Ave, Accra',
        coordinates: { lat: 5.556, lng: -0.1969 },
        deliveryNotes: 'Leave at gate.',
        items: [
            { name: 'Sourdough', unitPrice: 18.0, quantity: 1 },
            { name: 'Cinnamon Roll', unitPrice: 11.0, quantity: 4 },
        ],
    },
    {
        orderId: '1004',
        date: '2025-02-22T14:00:00',
        status: 'Cancelled',
        phoneNumber: '0205556677',
        customerName: 'Kofi Asante',
        amount: 15.0,
        shop: 'Breadwinners West',
        deliveryType: 'pickup',
        items: [{ name: 'Muffin', unitPrice: 5.0, quantity: 3 }],
    },
    {
        orderId: '1005',
        date: '2025-02-22T11:20:00',
        status: 'Done',
        phoneNumber: '0543334455',
        customerName: 'Abena Osei',
        amount: 38.5,
        shop: 'Breadwinners East',
        deliveryType: 'pickup',
        items: [
            { name: 'Whole Wheat Loaf', unitPrice: 12.5, quantity: 1 },
            { name: 'Danish', unitPrice: 8.5, quantity: 3 },
        ],
    },
])
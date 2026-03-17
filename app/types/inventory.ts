
export interface Inventory {
    id: number
    name: string
    unit: string
    inventory_id: number
    quantity: number
    shop_id: number
    shop_name: string
}

export interface InventoryCreateUpdatePayload {
    name: string
    unit: string
    quantity: number
}

export interface ProductionRecordPayload {
    product: number
    quantity_produced: number
    ingredients: {
        ingredient: number
        quantity_used: number
    }[]
}

export interface ProductionList {
    id: number
    created_at: string
    product_name: string
    quantity_produced: number
    produced_by_name: string
}


export interface ProductionDetails {
    shop: number
    product: number
    product_name: string
    quantity_produced: number
    created_at: string
    produced_by: number
    produced_by_name: string
    ingredients_used: {
        ingredient: Inventory
        quantity_used: number
    }[]
}
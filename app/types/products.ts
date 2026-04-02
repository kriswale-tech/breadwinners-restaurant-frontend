export interface Product {
    id: number
    name: string
    description: string
    price: string
    image: string
    is_active: boolean
    category_id: number | null
    category_name: string | null
    shop_id: number
    shop_name: string
    created_at: string
    updated_at: string
}

export interface ProductCreateUpdatePayload {
    name: string
    description: string
    price: string
    image: string | null
    category_id: number | null
    is_active: boolean
}

export interface ProductCategory {
    id: number
    name: string
    description: string
    shop_id: number
    shop_name: string
    created_at: string
    updated_at: string
}

export interface CategoryCreateUpdatePayload {
    name: string
    description?: string
}

export interface ProductPackageItem {
    id?: number
    product: number
    product_name?: string
    quantity: number
}

export interface ProductPackage {
    id: number
    name: string
    description: string
    price: string
    image?: string
    is_active: boolean
    items: ProductPackageItem[]
    /** When present, used for cart / routing (e.g. home catalog) */
    shop_id?: number
    created_at?: string
    updated_at?: string
}
export type UserRole = 'admin' | 'staff'

export interface Shop {
    id: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
}

export interface Profile {
    id: number
    user: number
    shop: Shop
    role: UserRole
    address: string
    bio: string
    avatar: string
}

export interface User {
    id: number
    first_name: string
    last_name: string
    phone_number: string
    date_joined: string
    last_login: string
    profile: Profile
}

export interface UsersList {
    id: number
    phone_number: string
    first_name: string
    last_name: string
    date_joined: string
    last_login: string | null
    role: UserRole | null
    avatar: string | null
    shop: string | null
    shop_name: string | null
    address: string | null
    is_password_set: boolean
}

export interface UserCreateUpdatePayload {
    first_name: string
    last_name: string
    phone_number: string
    role: UserRole
    shop?: number
    address?: string
    bio?: string
    avatar?: File
}

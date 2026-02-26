export type UserRole = 'admin' | 'staff'

export interface User {
    id: number
    firstName: string
    lastName: string
    role: UserRole
    phoneNumber: string
    address?: string
    bio?: string
    avatar?: string
    lastLogin?: string
}

export const users = ref<User[]>([
    {
        id: 1,
        firstName: 'Ama',
        lastName: 'Mensah',
        role: 'admin',
        phoneNumber: '0551112233',
        address: 'Accra, Ghana',
        bio: 'Store manager at Breadwinners Main.',
        avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Ama%20Mensah',
        lastLogin: '2025-02-24T09:30:00',
    },
    {
        id: 2,
        firstName: 'John',
        lastName: 'Smith',
        role: 'staff',
        phoneNumber: '0249876543',
        address: 'Tema, Ghana',
        bio: 'Morning shift staff.',
        avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=John%20Smith',
        lastLogin: '2025-02-23T15:10:00',
    },
    {
        id: 3,
        firstName: 'Abena',
        lastName: 'Osei',
        role: 'staff',
        phoneNumber: '0203334455',
        bio: 'Part-time cashier.',
        avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Abena%20Osei',
        lastLogin: '2025-02-22T18:45:00',
    },
])


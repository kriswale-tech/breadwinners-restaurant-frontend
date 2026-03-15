import type { UsersList } from "~/types"

export const useUsersStore = defineStore('users', () => {
    const { get, post, put, del } = useApi()
    const toast = useToast()

    const users = ref<UsersList[]>([])
    const loading = ref(false)

    async function getUsers() {
        try {
            loading.value = true
            const result = await get<UsersList[]>('/users/')
            users.value = result
        }
        catch (error) {
            console.error(error)
            toast.add({
                title: 'Error',
                description: (error as any)?.detail || 'An error occurred while getting users',
                color: 'error',
            })
        } finally {
            loading.value = false
        }
    }


    async function createUser(formData: FormData) {
        try {
            loading.value = true
            await post<void>('/users/', formData)
            toast.add({
                title: 'Success',
                description: 'User created successfully',
                color: 'success',
            })
            await getUsers()
        }
        catch (error) {
            console.error(error)
            throw error
        } finally {
            loading.value = false
        }
    }

    async function updateUser(id: number, formData: FormData) {
        try {
            loading.value = true
            await put<void>(`/users/${id}/`, formData)
            toast.add({
                title: 'Success',
                description: 'User updated successfully',
                color: 'success',
            })
            await getUsers()
        }
        catch (error) {
            console.error(error)
            throw error
        } finally {
            loading.value = false
        }
    }

    async function deleteUser(id: number) {
        try {
            loading.value = true
            await del<void>(`/users/${id}/`)
            toast.add({
                title: 'Success',
                description: 'User deleted successfully',
                color: 'success',
            })
            await getUsers()
        }
        catch (error) {
            console.error(error)
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        users,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
        loading,
    }
}, {
    persist: true
})
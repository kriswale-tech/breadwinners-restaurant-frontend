import type { User } from "~/types"


export const useAuthStore = defineStore('auth', () => {
    const { $api } = useNuxtApp()

    const isLoggedIn = ref(false)
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const user = ref<User | null>(null)

    const userRole = computed(() => user.value?.profile?.role ?? 'super_admin')

    function setTokens(payload: { accessToken: string; refreshToken: string }) {
        accessToken.value = payload.accessToken
        refreshToken.value = payload.refreshToken
        isLoggedIn.value = true
    }

    function clearTokens() {
        accessToken.value = null
        refreshToken.value = null
        user.value = null
        isLoggedIn.value = false
    }

    async function getUser() {
        try {
            const result = await $api<User>('/user/')
            user.value = result
            console.log('user', user.value)
            console.log(result)
        }
        catch (error) {
            clearTokens()
            throw error
        }
    }

    async function login(phone_number: string, password: string) {
        try {
            const result = await $api<{
                access: string
                refresh: string
            }>('/auth/login/', {
                method: 'POST',
                body: {
                    phone_number,
                    password,
                },
            })

            setTokens({
                accessToken: result.access,
                refreshToken: result.refresh,
            })

            // Get the user data
            await getUser()

            console.log('login result', result)
        }
        catch (error) {
            clearTokens()
            throw error
        }
    }

    async function setupPassword(payload: { uid: string, token: string, password: string }) {
        try {
            const result = await $api<void>('/auth/setup-password/', {
                method: 'POST',
                body: payload,
            })
        }
        catch (error) {
            clearTokens()
            throw error
        }
    }

    function logout() {
        clearTokens()
    }

    return {
        isLoggedIn,
        accessToken,
        refreshToken,
        login,
        logout,
        setTokens,
        clearTokens,
        user,
        userRole,
        setupPassword,
    }
}, {
    persist: true
})
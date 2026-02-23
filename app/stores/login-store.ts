

export const useLoginStore = defineStore('login', () => {
    const isLoggedIn = ref(false)
    const phone = '0200000000'
    const password = 'password'

    function login(phone: string, password: string) {
        if (phone === phone && password === password) {
            isLoggedIn.value = true
        }
    }

    function logout() {
        isLoggedIn.value = false
    }

    return {
        isLoggedIn,
        login,
        logout
    }
}, {
    persist: true
})
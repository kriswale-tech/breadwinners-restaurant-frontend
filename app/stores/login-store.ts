

export const useLoginStore = defineStore('login', () => {
    const isLoggedIn = ref(false)
    const phone = '0200000000'
    const password = 'password'

    function login(phoneNumber: string, pass: string) {
        if (phoneNumber === phone && pass === password) {
            isLoggedIn.value = true
            return true
        }
        else {
            return false
        }
    }

    function logout() {
        isLoggedIn.value = false
    }

    return {
        isLoggedIn,
        login,
        logout,
    }
}, {
    persist: true
})
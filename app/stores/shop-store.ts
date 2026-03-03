

export const useShopStore = defineStore('shop', () => {
    const selectedShop = ref<{ label: string; value: string } | undefined>(undefined)

    return {
        selectedShop,
    }
}, {
    persist: true
})

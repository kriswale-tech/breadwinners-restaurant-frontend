import type { Shop } from "~/types"

export const useShopStore = defineStore('shop', () => {
    const { get } = useApi()

    const shops = ref<Shop[]>([])
    const loading = ref(false)

    const selectedShop = ref<Shop | undefined>(undefined)

    function setSelectedShop(shopId: number) {
        selectedShop.value = shops.value.find(shop => shop.id === shopId)
        if (window !== undefined) {
            localStorage.setItem('selectedShop', JSON.stringify(selectedShop.value))
        }
    }

    function getSelectedShop() {
        if (window !== undefined) {
            const shop = localStorage.getItem('selectedShop')
            if (shop) {
                selectedShop.value = JSON.parse(shop)
            }
        }
        return selectedShop.value
    }

    async function getShops() {
        const result = await get<Shop[]>('/shops/')
        shops.value = result
    }

    return {
        selectedShop,
        getShops,
        shops,
        setSelectedShop,
        loading,
        getSelectedShop,
    }
}, {
    persist: true
})

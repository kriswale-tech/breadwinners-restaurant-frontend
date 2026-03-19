import type { Product } from "~/types/products"




export const useClientProductStore = defineStore('client-product', () => {
    const products = ref<Product[]>([])


    return {
        products
    }
}, {
    persist: true
})


import type { Product, ProductCategory, ProductPackage } from "~/types/products"


interface ClientProductsByShop {
    shopId: number
    products: Product[]
}


export const useClientProductStore = defineStore('client-product', () => {
    const { get } = useApi()
    const products = ref<ClientProductsByShop[]>([])
    const loading = ref(false)

    // for individual shop pages
    const shopProducts = ref<Product[]>([])
    const shopCategories = ref<ProductCategory[]>([])
    const shopPackages = ref<ProductPackage[]>([])


    async function fetchProductsByShop(shopId: number) {
        try {
            loading.value = true
            const response = await get<Product[]>(`/shops/${shopId}/products`)
            products.value = products.value.filter(product => product.shopId !== shopId)
            products.value.push({
                shopId: shopId,
                products: response
            })
        } catch (error) {
            console.error(error)
        } finally {
            loading.value = false
        }
    }

    async function fetchProducts(shopId: number) {
        try {
            loading.value = true
            const response = await get<Product[]>(`/shops/${shopId}/products`)
            shopProducts.value = response
        } catch (error) {
            console.error(error)
        } finally {
            loading.value = false
        }
    }

    async function fetchShopCategories(shopId: number) {
        try {
            const response = await get<ProductCategory[]>(`/shops/${shopId}/product-categories`)
            shopCategories.value = response
        } catch (error) {
            console.error(error)
        }
        finally {
            loading.value = false
        }
    }

    async function fetchShopPackages(shopId: number) {
        try {
            const response = await get<ProductPackage[]>(`/shops/${shopId}/packages`)
            shopPackages.value = response
        } catch (error) {
            console.error(error)
        }
    }

    return {
        products,
        fetchProductsByShop,
        loading,
        fetchProducts,
        shopProducts,
        shopCategories,
        fetchShopCategories,
        shopPackages,
        fetchShopPackages
    }
},)


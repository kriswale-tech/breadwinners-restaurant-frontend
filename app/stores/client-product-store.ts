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

    /** Home / global catalog (not tied to a single shop route) */
    const homePackages = ref<ProductPackage[]>([])
    const homeProducts = ref<Product[]>([])
    const homeCategories = ref<ProductCategory[]>([])


    async function fetchProductsByShop(shopId: number) {
        try {
            loading.value = true
            const response = await get<Product[]>(`products/`)
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
            const response = await get<Product[]>(`products/`)
            shopProducts.value = response
        } catch (error) {
            console.error(error)
        } finally {
            loading.value = false
        }
    }

    async function fetchShopCategories(shopId: number) {
        try {
            const response = await get<ProductCategory[]>(`product-categories/`)
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
            const response = await get<ProductPackage[]>(`packages/`)
            shopPackages.value = response
        } catch (error) {
            console.error(error)
        }
    }

    async function fetchHomeCatalog() {
        loading.value = true
        try {
            const [packagesRes, productsRes, categoriesRes] = await Promise.all([
                get<ProductPackage[]>(`packages/`),
                get<Product[]>(`products/`),
                get<ProductCategory[]>(`product-categories/`),
            ])
            homePackages.value = packagesRes
            homeProducts.value = productsRes
            homeCategories.value = categoriesRes
        } catch (error) {
            console.error(error)
        } finally {
            loading.value = false
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
        fetchShopPackages,
        homePackages,
        homeProducts,
        homeCategories,
        fetchHomeCatalog,
    }
},)


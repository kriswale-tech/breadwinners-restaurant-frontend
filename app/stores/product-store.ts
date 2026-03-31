import type { Product, ProductCategory, CategoryCreateUpdatePayload, ProductPackage } from '~/types/products'
import type { ErrorResponse } from '~/types/error'

export interface ProductStatistics {
    products: number
    categories: number
    packages: number
}

export const useProductStore = defineStore('product', () => {
    const toast = useToast()
    const { get, post, put, del } = useApi()
    const { selectedShop } = useShopStore()

    const products = ref<Product[]>([])
    const categories = ref<ProductCategory[]>([])
    const loading = ref(false)
    const packages = ref<ProductPackage[]>([])
    const productStatistics = ref<ProductStatistics>({
        products: 0,
        categories: 0,
        packages: 0,
    })

    // PRODUCTS ========================================================
    async function getProducts() {
        try {
            loading.value = true
            const result = await get<Product[]>(`products/`)
            products.value = result
            await getProductStatistics()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to get products',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function createProduct(formData: FormData) {
        try {
            loading.value = true
            await post<void>(`products/`, formData)
            toast.add({
                title: 'Success',
                description: 'Product created successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            await getProducts()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to create product',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function updateProduct(id: number, formData: FormData) {
        try {
            loading.value = true
            await put<void>(`products/${id}/`, formData)
            toast.add({
                title: 'Success',
                description: 'Product updated successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            await getProducts()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to update product',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function deleteProduct(id: number) {
        try {
            loading.value = true
            await del<void>(`products/${id}/`)
            toast.add({
                title: 'Success',
                description: 'Product deleted successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            await getProducts()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to delete product',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    // CATEGORIES ========================================================

    async function getCategories() {
        try {
            loading.value = true
            const result = await get<ProductCategory[]>(`product-categories/`)
            categories.value = result
            await getProductStatistics()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to get categories',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function createCategory(payload: CategoryCreateUpdatePayload) {
        try {
            loading.value = true
            const result = await post<ProductCategory>(`product-categories/`, payload)
            toast.add({
                title: 'Success',
                description: 'Category created successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            await getCategories()
        }
        catch (error) {
            console.error(error)
            throw error
        }
        finally {
            loading.value = false
        }
    }

    async function updateCategory(id: number, payload: CategoryCreateUpdatePayload) {
        try {
            loading.value = true
            const result = await put<ProductCategory>(`product-categories/${id}/`, payload)
            toast.add({
                title: 'Success',
                description: 'Category updated successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            categories.value = categories.value.map(category => category.id === id ? result : category)
            await getCategories()
        }
        catch (error) {
            console.error(error)
            throw error
        }
        finally {
            loading.value = false
        }
    }

    async function deleteCategory(id: number) {
        try {
            loading.value = true
            await del<void>(`product-categories/${id}/`)
            toast.add({
                title: 'Success',
                description: 'Category deleted successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            await getCategories()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to delete category',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    // PACKAGES ========================================================

    async function getPackages() {
        try {
            loading.value = true
            const result = await get<ProductPackage[]>(`packages/`)
            packages.value = result
            await getProductStatistics()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to get packages',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function createPackage(formData: FormData) {

        try {
            loading.value = true
            await post<ProductPackage>(`packages/`, formData)
            toast.add({
                title: 'Success',
                description: 'Package created successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            await getPackages()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to create package',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
            throw error
        }
        finally {
            loading.value = false
        }
    }

    async function updatePackage(id: number, formData: FormData) {
        try {
            loading.value = true
            await put<ProductPackage>(`packages/${id}/`, formData)
            toast.add({
                title: 'Success',
                description: 'Package updated successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            await getPackages()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to update package',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }
    async function deletePackage(id: number) {
        try {
            loading.value = true
            await del<void>(`packages/${id}/`)
            toast.add({
                title: 'Success',
                description: 'Package deleted successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
            await getPackages()
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to delete package',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function getProductStatistics() {
        try {
            loading.value = true
            const result = await get<ProductStatistics>(`product-statistics/`)
            productStatistics.value = result
        }
        catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to get product statistics',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }


    return {
        products,
        categories,
        packages,
        loading,
        getProducts,
        getCategories,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        getPackages,
        createPackage,
        updatePackage,
        deletePackage,
        productStatistics,
        getProductStatistics,
    }
},
    {
        persist: true
    }
)
import type { Inventory, InventoryCreateUpdatePayload, ProductionDetails, ProductionList, ProductionRecordPayload } from '~/types/inventory'
import type { ErrorResponse } from '~/types/error'

export const useInventoryStore = defineStore('inventory', () => {
    const { get, post, put, del } = useApi()
    const { selectedShop } = useShopStore()
    const toast = useToast()

    const ingredients = ref<Inventory[]>([])
    const production = ref<ProductionList[]>([])
    const loading = ref(false)

    async function getIngredients() {
        try {
            loading.value = true
            const result = await get<Inventory[]>(`shops/${selectedShop?.id}/ingredients/`)
            ingredients.value = result
        } catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to get ingredients',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        } finally {
            loading.value = false
        }
    }

    async function createIngredient(payload: InventoryCreateUpdatePayload) {
        try {
            loading.value = true
            await post<void>(`shops/${selectedShop?.id}/ingredients/`, payload)
            await getIngredients()
            toast.add({
                title: 'Success',
                description: 'Ingredient created successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
        } catch (error) {
            throw error
        }
        finally {
            loading.value = false
        }
    }

    async function updateIngredient(id: number, payload: InventoryCreateUpdatePayload) {
        try {
            loading.value = true
            await put<void>(`shops/${selectedShop?.id}/ingredients/${id}/`, payload)
            await getIngredients()
            toast.add({
                title: 'Success',
                description: 'Ingredient updated successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
        } catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to update ingredient',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function deleteIngredient(id: number) {
        try {
            loading.value = true
            await del<void>(`shops/${selectedShop?.id}/ingredients/${id}/`)
            await getIngredients()
            toast.add({
                title: 'Success',
                description: 'Ingredient deleted successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
        } catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to delete ingredient',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    async function getProduction() {
        try {
            loading.value = true
            const result = await get<ProductionList[]>(`shops/${selectedShop?.id}/production-batches/`)
            production.value = result
        } catch (error) {
            console.error(error)
        }
        finally {
            loading.value = false
        }
    }

    async function recordProduction(payload: ProductionRecordPayload) {
        try {
            loading.value = true
            await post<void>(`shops/${selectedShop?.id}/production-batches/`, payload)
            await getProduction()
            await getIngredients()
            toast.add({
                title: 'Success',
                description: 'Production recorded successfully',
                color: 'success',
                icon: 'i-lucide-check-circle',
            })
        } catch (error) {
            throw error
        }
        finally {
            loading.value = false
        }
    }

    async function getProductionDetails(id: number) {
        try {
            loading.value = true
            const result = await get<ProductionDetails>(`shops/${selectedShop?.id}/production-batches/${id}/`)
            return result
        } catch (error) {
            console.error(error)
            const errorResponse = error as ErrorResponse
            toast.add({
                title: errorResponse.message || 'Error',
                description: errorResponse.detail || 'Failed to get production details',
                color: 'error',
                icon: 'i-lucide-alert-circle',
            })
        }
        finally {
            loading.value = false
        }
    }

    return {
        ingredients,
        loading,
        getIngredients,
        createIngredient,
        updateIngredient,
        deleteIngredient,
        production,
        getProduction,
        recordProduction,
        getProductionDetails,
    }
})
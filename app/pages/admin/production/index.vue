<script setup lang="ts">
const productStore = useProductStore()
const inventoryStore = useInventoryStore()

onMounted(async () => {
    await callOnce("getProducts", () => productStore.getProducts())
    await callOnce("getIngredients", () => inventoryStore.getIngredients())
})
</script>

<template>
    <div>
        <AdminProductionForm />
    </div>
</template>

<style lang="css" scoped></style>
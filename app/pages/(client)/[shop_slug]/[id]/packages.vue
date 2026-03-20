<script setup lang="ts">
const clientProductStore = useClientProductStore()
</script>

<template>
    <div>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
            Our bread packages.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SharedPackageCard v-for="shopPackage in clientProductStore.shopPackages" :key="shopPackage.id"
                :package="shopPackage" />
        </div>
    </div>
</template>

<style lang="css" scoped></style>
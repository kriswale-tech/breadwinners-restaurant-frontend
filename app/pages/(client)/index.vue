<script setup lang="ts">
const shopStore = useShopStore()
definePageMeta({
    theme: 'amber'
})

const images = [
    {
        src: 'images/header/header-1.png',
        alt: 'Bread'
    },
    {
        src: 'images/header/header-2.png',
        alt: 'Bread'
    },
    {
        src: 'images/header/header-3.png',
        alt: 'Bread'
    }
]

</script>

<template>
    <div>
        <SharedHeader :images="images" />

        <SharedBreadService />



        <div class="container mx-auto px-4 py-16 space-y-16">
            <SharedProductsAndPackages />
        </div>
    </div>
</template>

<style lang="css" scoped></style>
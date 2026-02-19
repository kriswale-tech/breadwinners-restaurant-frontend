<script setup lang="ts">

</script>

<template>
    <div
        class="bg-primary-600 text-white rounded-full p-2 size-14 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-100">
        <Icon name="heroicons:shopping-cart" class="size-8 text-white" />

        <!-- Cart count -->
        <span
            class="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-600 text-white rounded-full h-6 min-w-6 px-1 py-0.5 flex items-center justify-center text-sm border border-white font-bold">100</span>
    </div>
</template>

<style lang="css" scoped></style>
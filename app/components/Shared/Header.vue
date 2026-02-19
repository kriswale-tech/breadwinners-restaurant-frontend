<script setup lang="ts">

const props = defineProps<{
    title: string
    description: string
}>()

</script>

<template>
    <div class="relative h-[600px] bg-linear-to-b from-primary-50 via-primary-100 to-neutral-100">

        <!-- Centered caption -->
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="max-w-3xl text-center px-4 pt-16">
                <h1
                    class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary-900 dark:text-primary-200 drop-shadow-sm">
                    {{ props.title }}
                </h1>
                <p class="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 font-playfair">
                    {{ props.description }}
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped></style>
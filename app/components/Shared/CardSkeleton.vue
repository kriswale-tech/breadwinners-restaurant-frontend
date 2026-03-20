<script setup lang="ts">
const props = defineProps<{
    count?: number
}>()
</script>

<template>
    <div v-for="index in props.count ?? 4" :key="`skeleton-${index}`"
        class="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4">
        <USkeleton class="h-48 w-full rounded-md" />
        <div class="mt-4 space-y-2">
            <USkeleton class="h-5 w-3/4" />
            <USkeleton class="h-4 w-1/3" />
        </div>
        <div class="mt-4 flex items-center justify-between">
            <USkeleton class="h-9 w-20 rounded-md" />
            <USkeleton class="h-4 w-14" />
        </div>
    </div>
</template>

<style lang="css" scoped></style>
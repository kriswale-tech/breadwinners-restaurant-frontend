<script setup lang="ts">
definePageMeta({
    theme: 'green'
})

const tabs = [
    {
        label: 'All',
        value: ''
    },
    {
        label: 'Categories',
        value: 'categories'
    },
    {
        label: 'Packages',
        value: 'packages'
    },
]

const activeTab = ref('')

function onTabChange(value: string | number) {
    activeTab.value = value as string
    navigateTo(`/breadwinners/${value}`)
}
</script>

<template>
    <SharedHeader title="Bread Winners" description="People's favorite breads." />

    <main class="mt-16 container min-h-screen">
        <UTabs :items="tabs" :content="false" variant="pill" class="max-w-lg mx-auto" size="lg" color="neutral"
            v-model="activeTab" @update:model-value="onTabChange" />

        <!-- Pages -->
        <div class="mt-8">
            <NuxtPage />
        </div>

    </main>
</template>

<style lang="css" scoped></style>
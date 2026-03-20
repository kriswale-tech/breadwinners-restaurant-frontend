<script setup lang="ts">
const route = useRoute()
const shopStore = useShopStore()
const clientProductStore = useClientProductStore()
const shop = computed(() => shopStore.shops.find(shop => shop.id === Number(route.params.id)))



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

watch(route, () => {
    activeTab.value = route.path.split('/').pop() || ''
}, { immediate: true })

function onTabChange(value: string | number) {
    activeTab.value = value as string
    navigateTo(`/${route.params.shop_slug}/${route.params.id}/${value}`)
}

onMounted(async () => {
    await callOnce('fetch-shop-categories', () => clientProductStore.fetchShopCategories(Number(route.params.id)))
    await callOnce('fetch-shop-products', () => clientProductStore.fetchProducts(Number(route.params.id)))
    await callOnce('fetch-shop-packages', () => clientProductStore.fetchShopPackages(Number(route.params.id)))
})



</script>

<template>
    <div class="" v-if="!shop?.is_active">
        <div class="min-h-screen flex items-center justify-center px-4 py-12">
            <div class="max-w-xl w-full text-center bg-white dark:bg-neutral-900 rounded-xl shadow-md p-8">
                <div class="flex items-center justify-center mb-4">
                    <Icon name="heroicons:clock" class="size-12 text-primary-600" />
                </div>
                <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-200 mb-2">{{ shop?.name }} — Coming
                    Soon</h1>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">We're putting the finishing touches on our
                    {{ shop?.name }} features. Stay tuned — great food is on the way.</p>

                <div class="flex items-center justify-center gap-3">
                    <UButton to="/" color="primary" variant="solid">Back to Home</UButton>
                    <NuxtLink to="/contact" class="text-sm text-neutral-600 dark:text-neutral-300 underline">Contact us
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
    <div class="" v-else>
        <SharedHeader :title="shop?.name ?? ''" :description="shop?.description ?? ''" />

        <main class="mt-16 container min-h-screen">
            <UTabs :items="tabs" :content="false" variant="pill" class="max-w-lg mx-auto" size="lg" color="neutral"
                v-model="activeTab" @update:model-value="onTabChange" />

            <!-- Pages -->
            <div class="mt-8">
                <NuxtPage />
            </div>

        </main>
    </div>
</template>

<style lang="css" scoped></style>
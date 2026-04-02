<script setup lang="ts">
definePageMeta({
    theme: 'amber',
})

const clientProductStore = useClientProductStore()

const activePackages = computed(() =>
    clientProductStore.homePackages.filter((p) => p.is_active),
)

function filteredProducts(categoryId: number) {
    return clientProductStore.homeProducts.filter(
        (product) => product.is_active && product.category_id === categoryId,
    )
}

/** IDs we actually render as category sections (from API) */
const validCategoryIds = computed(
    () => new Set(clientProductStore.homeCategories.map((c) => c.id)),
)

/**
 * Active products shown in the last block: no category, or `category_id` points to a category
 * that no longer exists in the list (stale / deleted category).
 */
const uncategorizedProducts = computed(() =>
    clientProductStore.homeProducts.filter((product) => {
        if (!product.is_active) return false
        const cid = product.category_id
        if (cid == null) return true
        return !validCategoryIds.value.has(cid)
    }),
)

const hasCategoryProducts = computed(() =>
    clientProductStore.homeCategories.some((c) => filteredProducts(c.id).length > 0),
)

const hasMenuContent = computed(
    () =>
        activePackages.value.length > 0
        || hasCategoryProducts.value
        || uncategorizedProducts.value.length > 0,
)

const showSkeleton = computed(
    () =>
        clientProductStore.loading
        && clientProductStore.homeProducts.length === 0
        && clientProductStore.homePackages.length === 0,
)

onMounted(async () => {
    await callOnce('fetchHomeCatalog', () => clientProductStore.fetchHomeCatalog())
})
</script>

<template>
    <div class="container py-16  mt-20 min-h-screen">
        <div class="mb-12 text-center">
            <h1 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                Our menu
            </h1>
            <p class="mt-3 text-neutral-600 dark:text-neutral-400">
                Bundles first — then everything we bake, sorted by category.
            </p>
        </div>

        <template v-if="showSkeleton">
            <div class="space-y-16">
                <div>
                    <USkeleton class="mb-6 h-9 w-48 rounded-md" />
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <SharedCardSkeleton :count="4" />
                    </div>
                </div>
                <div>
                    <USkeleton class="mb-6 h-9 w-64 rounded-md" />
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <SharedCardSkeleton :count="8" />
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <!-- Packages first -->
            <section v-if="activePackages.length" class="mb-16 space-y-6">
                <div>
                    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">
                        Packages
                    </h2>
                    <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        Curated bundles — great value for gatherings or your weekly stash.
                    </p>
                </div>
                <div
                    class="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:justify-items-stretch">
                    <SharedPackageCard v-for="pkg in activePackages" :key="pkg.id" :package="pkg" />
                </div>
            </section>

            <!-- Products by category (same structure as shop categories page) -->
            <section class="space-y-16">
                <template v-for="category in clientProductStore.homeCategories" :key="category.id">
                    <template v-if="filteredProducts(category.id).length > 0">
                        <div>
                            <p class="mb-3 text-2xl font-bold text-gray-700 dark:text-gray-300">
                                {{ category.name }}

                                <span class="block text-sm font-normal text-gray-500 dark:text-gray-400">
                                    {{ category.description }}
                                </span>
                            </p>
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                <SharedProductCard v-for="product in filteredProducts(category.id)" :key="product.id"
                                    :product="product" />
                            </div>
                        </div>
                    </template>
                </template>
            </section>

            <!-- Uncategorized — always last -->
            <section v-if="uncategorizedProducts.length"
                class="mt-16 border-t border-neutral-200 pt-16 dark:border-neutral-800">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">
                        Extras & one-offs
                    </h2>
                    <p class="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        Good stuff that didn't fit a shelf — limited runs, specials, and surprises.
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <SharedProductCard v-for="product in uncategorizedProducts" :key="product.id" :product="product" />
                </div>
            </section>

            <p v-if="!showSkeleton && !hasMenuContent" class="text-center text-neutral-500 dark:text-neutral-400">
                Nothing on the menu yet — check back soon.
            </p>
        </template>
    </div>
</template>

<style lang="css" scoped></style>

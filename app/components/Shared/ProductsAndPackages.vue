<script setup lang="ts">
import type { ProductPackage } from '~/types/products'

const clientProductStore = useClientProductStore()
const shopStore = useShopStore()

const fallbackShopId = computed(() =>
    shopStore.shops.find((s) => s.is_active)?.id,
)

const activePackages = computed(() =>
    clientProductStore.homePackages.filter((p) => p.is_active),
)

const activeProducts = computed(() =>
    clientProductStore.homeProducts.filter((p) => p.is_active),
)

function packageShopId(pkg: ProductPackage): number | undefined {
    return pkg.shop_id ?? fallbackShopId.value
}

const showPackagesSkeleton = computed(
    () => clientProductStore.loading && activePackages.value.length === 0,
)

const showProductsSkeleton = computed(
    () => clientProductStore.loading && activeProducts.value.length === 0,
)

onMounted(async () => {
    if (!shopStore.shops.length) await shopStore.getShops()
    await clientProductStore.fetchHomeCatalog()
})
</script>

<template>
    <div class="space-y-20">
        <!-- Packages -->
        <section aria-labelledby="packages-heading">
            <div class="mx-auto max-w-3xl text-center">
                <p class="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Curated for you
                </p>
                <h2 id="packages-heading"
                    class="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                    Pick a bundle that fits your table
                </h2>
                <p class="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Ready-made bundles at a better price — pick what fits you and go.
                </p>
            </div>

            <div
                class="mt-12 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:justify-items-stretch">
                <template v-if="showPackagesSkeleton">
                    <SharedCardSkeleton :count="3" />
                </template>
                <template v-else-if="activePackages.length">
                    <SharedPackageCard v-for="pkg in activePackages" :key="pkg.id" :package="pkg"
                        :shop-id="packageShopId(pkg)" />
                </template>
                <p v-else class="col-span-full text-center text-sm text-neutral-500 dark:text-neutral-400">
                    No packages available right now — check back soon.
                </p>
            </div>
        </section>

        <!-- Products -->
        <section aria-labelledby="products-heading">
            <div class="mx-auto max-w-3xl text-center">
                <p class="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    The full spread
                </p>
                <h2 id="products-heading"
                    class="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                    Explore every loaf, roll, and treat we bake
                </h2>
                <p class="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    From crusty classics to seasonal favorites — browse the whole lineup and find your next obsession.
                    Add what you love; your cart’s ready when you are.
                </p>
            </div>

            <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <template v-if="showProductsSkeleton">
                    <SharedCardSkeleton :count="8" />
                </template>
                <template v-else-if="activeProducts.length">
                    <SharedProductCard v-for="product in activeProducts" :key="product.id" :product="product"
                        :shop-id="product.shop_id" />
                </template>
                <p v-else class="col-span-full text-center text-sm text-neutral-500 dark:text-neutral-400">
                    No products available right now — check back soon.
                </p>
            </div>
        </section>
    </div>
</template>

<style lang="css" scoped></style>

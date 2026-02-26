<script setup lang="ts">
import { products } from '~/data/products'

const productsCount = computed(() => products.length)
const categoriesCount = computed(() => 0)
const packagesCount = computed(() => 0)
</script>

<template>
    <div class="grid gap-4 sm:grid-cols-3">
        <UCard class="border border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center gap-3">
                <div
                    class="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Icon name="i-lucide-package" class="size-5" />
                </div>
                <div>
                    <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Products
                    </p>
                    <p class="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
                        {{ productsCount }}
                    </p>
                </div>
            </div>
        </UCard>

        <UCard class="border border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center gap-3">
                <div
                    class="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Icon name="i-lucide-folder" class="size-5" />
                </div>
                <div>
                    <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Categories
                    </p>
                    <p class="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
                        {{ categoriesCount }}
                    </p>
                </div>
            </div>
        </UCard>

        <UCard class="border border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center gap-3">
                <div
                    class="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Icon name="i-lucide-box" class="size-5" />
                </div>
                <div>
                    <p class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Packages
                    </p>
                    <p class="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
                        {{ packagesCount }}
                    </p>
                </div>
            </div>
        </UCard>
    </div>
</template>

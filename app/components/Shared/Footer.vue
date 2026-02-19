<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
    <footer class="bg-neutral-900 text-neutral-200">
        <div class="container mx-auto px-4 py-12">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div class="flex items-start gap-3">
                    <Icon name="heroicons:heart-solid" class="size-6 text-primary-400 mt-1" />
                    <div>
                        <NuxtLink to="/" class="text-lg font-semibold hover:text-primary-300">BreadWinners</NuxtLink>
                        <div class="text-sm text-neutral-400">Fresh bakes & local flavors</div>
                        <div class="mt-2 text-sm text-neutral-400">Location: Legon Campus</div>
                    </div>
                </div>

                <nav class="flex gap-6">
                    <NuxtLink to="/breadwinners" class="text-neutral-300 hover:text-white">Bread Winners</NuxtLink>
                    <NuxtLink to="/restaurant" class="text-neutral-300 hover:text-white">Restaurant</NuxtLink>
                    <NuxtLink to="/track-order" class="text-neutral-300 hover:text-white">Track Order</NuxtLink>
                </nav>

                <div class="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div>
                        <div class="text-sm font-semibold text-neutral-200">Contact us</div>
                        <div class="text-sm text-neutral-400 mt-1">+233 24 123 4567</div>
                        <div class="text-sm text-neutral-400">+233 20 765 4321</div>
                    </div>

                    <div class="flex items-center gap-4">
                        <UButton variant="outline" color="primary" class="text-sm">Subscribe</UButton>

                        <div class="flex items-center gap-3">
                            <a aria-label="Instagram" href="#" class="text-neutral-300 hover:text-white">
                                <Icon name="fa:instagram" class="size-5" />
                            </a>
                            <a aria-label="TikTok" href="#" class="text-neutral-300 hover:text-white">
                                <Icon name="simple-icons:tiktok" class="size-5" />
                            </a>
                            <a aria-label="TikTok-2" href="#" class="text-neutral-300 hover:text-white">
                                <Icon name="simple-icons:tiktok" class="size-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 text-xs text-neutral-500 text-center">
                © {{ year }} BreadWinners. All rights reserved.
            </div>
        </div>
    </footer>
</template>

<style scoped></style>

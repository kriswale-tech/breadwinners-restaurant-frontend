<script setup lang="ts">
const highlights = [
    {
        icon: 'heroicons:bolt',
        title: 'Fresh, fast',
        line: 'From oven to you without the wait — quick service that keeps up with your cravings.',
        iconWrapClass:
            'bg-amber-100 text-amber-700 dark:bg-amber-950/45 dark:text-amber-300',
    },
    {
        icon: 'heroicons:heart',
        title: 'We actually care',
        line: 'Real people, real smiles. Customer care that treats you like a regular, every time.',
        iconWrapClass:
            'bg-rose-100 text-rose-600 dark:bg-rose-950/45 dark:text-rose-300',
    },
    {
        icon: 'heroicons:trophy',
        title: 'Bread that makes you a breadwinner',
        line: 'Quality you can taste — the kind of loaf that turns a snack into a win.',
        iconWrapClass:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-300',
    },
    {
        icon: 'heroicons:device-phone-mobile',
        title: 'Order anywhere',
        line: 'Couch, campus, commute — tap, order, and we\'ll handle the rest.',
        iconWrapClass:
            'bg-sky-100 text-sky-700 dark:bg-sky-950/45 dark:text-sky-300',
    },
]
</script>

<template>
    <section
        class="border-y border-neutral-200/80 bg-linear-to-b from-amber-50/40 via-white to-neutral-50/30 py-16 dark:border-neutral-800 dark:from-amber-950/20 dark:via-neutral-950 dark:to-neutral-900/50 sm:py-20"
        aria-labelledby="bread-service-heading">
        <div class="container mx-auto max-w-6xl px-4">
            <div class="mx-auto max-w-2xl text-center">
                <p class="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Why BreadWinners
                </p>
                <h2 id="bread-service-heading"
                    class="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                    More than bread — it’s how we show up for you
                </h2>
                <p class="mt-4 text-base text-neutral-600 dark:text-neutral-400">
                    Speed, heart, and flavor — all in one place. Here’s what you get every time you choose us.
                </p>
            </div>

            <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8" role="list">
                <li v-for="item in highlights" :key="item.title"
                    class="group rounded-2xl border border-neutral-200/90 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition hover:border-primary-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-primary-900/60">
                    <div class="flex size-12 items-center justify-center rounded-xl" :class="item.iconWrapClass">
                        <Icon :name="item.icon" class="size-6" aria-hidden="true" />
                    </div>
                    <h3 class="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                        {{ item.title }}
                    </h3>
                    <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {{ item.line }}
                    </p>
                </li>
            </ul>

            <div class="mt-12 text-center">
                <UButton to="/track-order" variant="solid" color="primary" size="lg"
                    class="flex items-center gap-2 w-fit mx-auto">
                    <Icon name="heroicons:book-open" class="size-5" />
                    See our menu
                </UButton>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped></style>

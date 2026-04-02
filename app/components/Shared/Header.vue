<script setup lang="ts">
type HeaderImage =
    | string
    | {
        src: string
        alt?: string
    }

const props = defineProps<{
    images: HeaderImage[]
    /** Carousel height (tailwind class), e.g. `h-[600px]` */
    heightClass?: string
    autoplayMs?: number
    showArrows?: boolean
    showDots?: boolean
}>()

const heightClass = computed(() => props.heightClass ?? 'h-[800px]')
const autoplayMs = computed(() => props.autoplayMs ?? 10000)
const showArrows = computed(() => props.showArrows ?? true)
const showDots = computed(() => props.showDots ?? true)

const items = computed(() =>
    (props.images ?? []).map((img) =>
        typeof img === 'string' ? { src: img, alt: '' } : { src: img.src, alt: img.alt ?? '' },
    ),
)

const activeIndex = ref(0)

function goTo(index: number) {
    if (items.value.length === 0) return
    const max = items.value.length
    activeIndex.value = ((index % max) + max) % max
}

function next() {
    goTo(activeIndex.value + 1)
}

function prev() {
    goTo(activeIndex.value - 1)
}

let timer: number | undefined

function startAutoplay() {
    if (!import.meta.client) return
    stopAutoplay()
    if (items.value.length <= 1) return
    if (autoplayMs.value <= 0) return
    timer = window.setInterval(() => next(), autoplayMs.value)
}

function stopAutoplay() {
    if (!import.meta.client) return
    if (timer != null) window.clearInterval(timer)
    timer = undefined
}

watch(
    () => [items.value.length, autoplayMs.value] as const,
    () => startAutoplay(),
    { immediate: true },
)

onBeforeUnmount(() => stopAutoplay())
</script>

<template>
    <div class="relative overflow-hidden bg-linear-to-b from-primary-50 via-primary-100 to-neutral-100"
        :class="heightClass">
        <!-- Slides -->
        <div class="absolute inset-0">
            <template v-if="items.length">
                <!-- Stack slides and crossfade with opacity -->
                <img v-for="(img, i) in items" :key="img.src" :src="img.src" :alt="img.alt"
                    class="header-slide absolute inset-0 h-full w-full object-cover"
                    :class="{ 'is-active': i === activeIndex }" :loading="i === activeIndex ? 'eager' : 'lazy'" />
            </template>

            <!-- Fallback background when no images passed -->
            <div v-else class="h-full w-full bg-linear-to-b from-primary-50 via-primary-100 to-neutral-100" />
        </div>

        <!-- Gradient overlay for readability if you add overlays later -->
        <div class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />

        <!-- Arrows -->
        <div v-if="showArrows && items.length > 1"
            class="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between px-4">
            <UButton class="pointer-events-auto" color="neutral" variant="solid" icon="heroicons:chevron-left"
                aria-label="Previous" @click="prev" />
            <UButton class="pointer-events-auto" color="neutral" variant="solid" icon="heroicons:chevron-right"
                aria-label="Next" @click="next" />
        </div>

        <!-- Dots -->
        <div v-if="showDots && items.length > 1"
            class="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-2">
            <button v-for="(_, i) in items" :key="i" type="button" class="h-2 w-2 rounded-full transition"
                :class="i === activeIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'"
                :aria-label="`Go to slide ${i + 1}`" @click="goTo(i)" />
        </div>
    </div>
</template>

<style scoped>
.header-slide {
    opacity: 0;
    transition: opacity 2400ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity;
}

.header-slide.is-active {
    opacity: 1;
}
</style>
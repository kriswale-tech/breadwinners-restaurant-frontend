import type { ThemeColor } from '~/composables/useTheme'

export default defineNuxtPlugin(() => {
    const theme = useTheme()
    const route = useRoute()

    // Function to get theme from page meta or default to 'amber'
    function getPageTheme(): ThemeColor {
        const pageMeta = route.meta as { theme?: ThemeColor }
        return pageMeta.theme || 'neutral'
    }

    // Function to apply theme to document root (client only)
    function applyTheme(color: ThemeColor) {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', color)
        }
    }

    // Watch route changes and update theme based on page meta
    watch(() => route.path, () => {
        const pageTheme = getPageTheme()
        theme.value = pageTheme
        applyTheme(pageTheme)
    }, { immediate: true })

    // Also watch for meta changes (in case meta is updated dynamically)
    watch(() => route.meta, () => {
        const pageTheme = getPageTheme()
        theme.value = pageTheme
        applyTheme(pageTheme)
    })
})

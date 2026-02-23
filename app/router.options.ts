import type { RouteLocationNormalized } from 'vue-router'

export default {
    scrollBehavior(
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        savedPosition: { left?: number; top?: number } | null
    ) {
        // browser back/forward
        if (savedPosition) {
            return savedPosition
        }

        // Nested under same section (e.g. /breadwinners → /breadwinners/packages): preserve scroll only when from is not root
        if (from.path !== '/' && to.path.startsWith(from.path) && to.path !== from.path) {
            return false
        }

        // Sibling routes with same parent and multiple segments (e.g. /breadwinners/packages → /breadwinners/categories)
        const fromSegments = from.path.split('/').filter(Boolean)
        const toSegments = to.path.split('/').filter(Boolean)
        if (fromSegments.length >= 2 && toSegments.length >= 2) {
            const fromParent = fromSegments.slice(0, -1).join('/')
            const toParent = toSegments.slice(0, -1).join('/')
            if (fromParent === toParent) return false
        }

        // Default: scroll to top (e.g. / → /checkout, or any cross-page navigation)
        return { top: 0 }
    }
}

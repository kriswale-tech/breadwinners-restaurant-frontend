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

        // same parent route (nested navigation, e.g. /breadwinners → /breadwinners/packages)
        if (to.path.startsWith(from.path)) {
            return false
        }

        // sibling routes (same parent, e.g. /breadwinners/packages → /breadwinners/categories): preserve scroll
        const fromParent = from.path.split('/').slice(0, -1).join('/') || '/'
        const toParent = to.path.split('/').slice(0, -1).join('/') || '/'
        if (fromParent === toParent) {
            return false
        }

        // default: scroll top
        return { top: 0 }
    }
}

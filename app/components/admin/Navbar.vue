<script setup lang="ts">
const route = useRoute()

const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items: { label: string; to?: string; icon?: string }[] = [
    { label: 'Admin', to: '/admin', icon: 'i-lucide-layout-dashboard' },
  ]

  // Build a breadcrumb entry for each segment after /admin
  for (let i = 1; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    if (!segment) continue

    const to = '/' + pathSegments.slice(0, i + 1).join('/')
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    items.push({ label, to })
  }

  return items
})
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
    <UBreadcrumb :items="breadcrumbItems" />
    <AdminShopSelector />
  </header>
</template>

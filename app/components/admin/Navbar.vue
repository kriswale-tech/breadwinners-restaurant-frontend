<script setup lang="ts">
const loginStore = useLoginStore()
const route = useRoute()

function handleLogout() {
  loginStore.logout()
  navigateTo('/admin/auth/login')
}

const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items: { label: string; to?: string; icon?: string }[] = [
    { label: 'Admin', to: '/admin', icon: 'i-lucide-layout-dashboard' },
  ]
  if (pathSegments.length > 1) {
    const last = pathSegments.at(-1)
    if (last) {
      const label = last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ')
      items.push({ label })
    }
  }
  return items
})

const dropdownItems = [
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: handleLogout,
      color: 'error',
    },
  ],
]
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
    <UBreadcrumb :items="breadcrumbItems" />
    <UDropdownMenu :items="dropdownItems">
      <UAvatar size="xl" alt="Admin" icon="i-lucide-user" class="cursor-pointer" />
    </UDropdownMenu>
  </header>
</template>

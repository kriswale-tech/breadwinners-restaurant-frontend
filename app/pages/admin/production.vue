<script setup lang="ts">
const route = useRoute()

const tabs = [
  {
    label: 'Cook',
    // icon: 'i-lucide-package',
    value: '',
  },
  {
    label: 'History',
    // icon: 'i-lucide-folder',
    value: 'production-history',
  },

]

const activeTab = ref('')

watch(route, () => {
  activeTab.value = route.path.split('/').pop() || ''
}, { immediate: true })


function onTabChange(value: string | number) {
  activeTab.value = value as string
  navigateTo(`/admin/production/${value}`)
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold text-neutral-900 dark:text-white">
      Production
    </h1>
    <p class="text-neutral-600 dark:text-neutral-400">
      This is where you record production orders and track inventory.
    </p>

    <!-- tab links -->
    <UTabs :items="tabs" variant="link" class="mt-10!" v-model="activeTab" @update:model-value="onTabChange" />

    <!-- pages -->
    <div class="">
      <NuxtPage />
    </div>

  </div>
</template>

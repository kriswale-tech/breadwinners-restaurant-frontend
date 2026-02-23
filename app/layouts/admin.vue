<script setup lang="ts">
const loginStore = useLoginStore()

if (!loginStore.isLoggedIn) {
    await navigateTo('/admin/auth/login')
}

</script>

<template>
    <div>
        <UApp>
            <div class="flex">
                <div class="w-64 shrink-0 h-screen">
                    <AdminSidebarComponent />
                </div>
                <div class="flex-1 min-w-0">
                    <AdminNavbar />
                    <div class="p-4">
                        <slot />
                    </div>
                </div>
            </div>
        </UApp>

    </div>
</template>

<style scoped></style>
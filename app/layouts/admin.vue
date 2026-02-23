<script setup lang="ts">
const loginStore = useLoginStore()

if (!loginStore.isLoggedIn) {
    await navigateTo('/admin/auth/login')
}

</script>

<template>
    <div>
        admin layout
        <slot />
    </div>
</template>

<style scoped></style>
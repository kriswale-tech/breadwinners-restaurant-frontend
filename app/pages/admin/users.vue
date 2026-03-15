<script setup lang="ts">
import type { UsersList } from '~/types'

const usersStore = useUsersStore()

const selectedUser = ref<UsersList | null>(null)

const showAddEditUserModal = ref(false)
const showDeleteUserModal = ref(false)

function addUser() {
  selectedUser.value = null
  showAddEditUserModal.value = true
}

function closeAddEditUserModal() {
  showAddEditUserModal.value = false
  selectedUser.value = null
}

function onEditUser(user: UsersList) {
  selectedUser.value = user
  showAddEditUserModal.value = true
}

function openDeleteUserModal(user: UsersList) {
  selectedUser.value = user
  showDeleteUserModal.value = true
}

function closeDeleteUserModal() {
  showDeleteUserModal.value = false
  selectedUser.value = null
}

async function deleteUser() {
  if (!selectedUser.value) return
  await usersStore.deleteUser(selectedUser.value.id)
  closeDeleteUserModal()
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold text-neutral-900 dark:text-white">
      Users
    </h1>
    <p class="text-neutral-600 dark:text-neutral-400">
      Manage admin and staff users.
    </p>

    <!-- Add user button -->
    <div class="flex flex-wrap items-end gap-3 mb-5!">
      <UButton class="ml-auto" color="primary" variant="subtle" icon="i-lucide-plus" @click="addUser">
        Add User
      </UButton>
    </div>

    <!-- Users Table -->
    <AdminUsersTableComponent @edit="onEditUser" @delete="openDeleteUserModal" />

    <!-- Add / Edit user modal -->
    <AdminUsersAddEditUsers
      v-if="showAddEditUserModal"
      :open="showAddEditUserModal"
      :user="selectedUser"
      @close="closeAddEditUserModal"
    />

    <!-- Remove user -->
    <SharedPromptCard
      v-if="showDeleteUserModal"
      :open="showDeleteUserModal"
      title="Remove User"
      :description="`Are you sure you want to remove ${selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : 'this user'}?`"
      button-text="Remove"
      type="error"
      @close="closeDeleteUserModal"
      @confirm="deleteUser"
    />
  </div>
</template>

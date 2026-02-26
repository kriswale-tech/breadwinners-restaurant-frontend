<script setup lang="ts">
import { users, type User } from '~/data/users'

const selectedUser = ref<User | null>(null)

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

function openAddEditUserModal(user?: User) {
  selectedUser.value = user ?? null
  showAddEditUserModal.value = true
}

function onEditUser(user: User) {
  openAddEditUserModal(user)
}

function openDeleteUserModal(user: User) {
  selectedUser.value = user
  showDeleteUserModal.value = true
}

function closeDeleteUserModal() {
  showDeleteUserModal.value = false
  selectedUser.value = null
}

function deleteUser() {
  if (!selectedUser.value) return
  const index = users.value.findIndex((u) => u.id === selectedUser.value!.id)
  if (index !== -1) {
    users.value.splice(index, 1)
  }
  closeDeleteUserModal()
}

type SaveUserPayload = Partial<User> & {
  firstName: string
  lastName: string
  phoneNumber: string
  role: User['role']
}

function onSaveUser(payload: SaveUserPayload) {
  if (payload.id != null) {
    const index = users.value.findIndex((u) => u.id === payload.id)
    const existing = index !== -1 ? users.value[index] : undefined
    if (existing) {
      users.value[index] = {
        id: existing.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        phoneNumber: payload.phoneNumber,
        address: payload.address,
        bio: payload.bio,
        avatar: payload.avatar,
        lastLogin: existing.lastLogin,
      }
    }
  } else {
    const nextId = Math.max(0, ...users.value.map((u) => u.id)) + 1
    users.value.push({
      id: nextId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
      bio: payload.bio,
      avatar: payload.avatar,
    })
  }
  closeAddEditUserModal()
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
      <UButton class="ml-auto" color="primary" variant="subtle" icon="i-lucide-plus" @click="addUser">Add
        User</UButton>
    </div>

    <!-- Users Table -->
    <AdminUsersTableComponent @edit="onEditUser" @delete="openDeleteUserModal" />

    <!-- Add / Edit user modal -->
    <AdminUsersAddEditUsers v-if="showAddEditUserModal" :open="showAddEditUserModal" :user="selectedUser"
      @close="closeAddEditUserModal" @save="onSaveUser" />

    <!-- Remove user -->
    <SharedPromptCard v-if="showDeleteUserModal" :open="showDeleteUserModal" :title="`Remove User`"
      :description="`Are you sure you want to remove ${selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'this user'}?`"
      :buttonText="`Remove`" :type="`error`" @close="closeDeleteUserModal" @confirm="deleteUser" />
  </div>
</template>

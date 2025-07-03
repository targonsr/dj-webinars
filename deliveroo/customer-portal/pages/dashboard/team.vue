<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Team Management
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your company team members and their permissions
        </p>
      </div>
      <button
        @click="showInviteModal = true"
        class="btn-primary"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Invite Member
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading team members...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Error Loading Team
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        There was a problem loading your team members.
      </p>
      <button 
        @click="loadTeamData" 
        class="btn-primary"
      >
        Try Again
      </button>
    </div>

    <!-- Team Members Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Member
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Permissions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Active
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="member in teamMembers"
              :key="member.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      class="h-10 w-10 rounded-full"
                      :src="`https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&seed=${member.id}`"
                      :alt="member.firstName + ' ' + member.lastName"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ member.firstName }} {{ member.lastName }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ member.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getRoleColor(member.role)
                  ]"
                >
                  {{ formatRole(member.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="permission in member.permissions.slice(0, 2)"
                    :key="permission"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {{ formatPermission(permission) }}
                  </span>
                  <span
                    v-if="member.permissions.length > 2"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    +{{ member.permissions.length - 2 }} more
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    member.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ member.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(member.updatedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="editMember(member)"
                    class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Edit member"
                  >
                    <PencilIcon class="h-5 w-5 mr-1" />
                    <span>Edit</span>
                  </button>
                  <button
                    v-if="member.role !== 'COMPANY_ADMIN'"
                    @click="confirmRemoveMember(member)"
                    class="flex items-center text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    title="Remove member"
                  >
                    <TrashIcon class="h-5 w-5 mr-1" />
                    <span>Remove</span>
                  </button>
                  <button
                    v-else
                    disabled
                    class="flex items-center text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    title="Cannot remove company admin"
                  >
                    <TrashIcon class="h-5 w-5 mr-1" />
                    <span>Remove</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invite Member Modal -->
    <div
      v-if="showInviteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showInviteModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Invite Team Member
          </h3>
          
          <form @submit.prevent="inviteMember" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address *
              </label>
              <input
                v-model="inviteForm.email"
                type="email"
                required
                class="input"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <select
                v-model="inviteForm.role"
                required
                class="input"
              >
                <option value="">Select role</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permissions
              </label>
              <div class="space-y-2">
                <label
                  v-for="permission in availablePermissions"
                  :key="permission.value"
                  class="flex items-center"
                >
                  <input
                    v-model="inviteForm.permissions"
                    type="checkbox"
                    :value="permission.value"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {{ permission.name }}
                  </span>
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showInviteModal = false"
                class="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="inviteLoading"
                class="btn-primary"
              >
                <span v-if="!inviteLoading">Send Invitation</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showConfirmationModal"
      title="Remove Team Member"
      :message="`Are you sure you want to remove ${memberToRemove?.firstName} ${memberToRemove?.lastName} from the team? This action cannot be undone.`"
      confirm-text="Remove"
      confirm-button-style="danger"
      @close="showConfirmationModal = false"
      @confirm="removeMember"
    />
  </div>
</template>

<script setup lang="ts">
import {
  UserPlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'
import { teamApi } from '~/api/team.api'
import type { User } from '~/model/user'

interface InviteForm {
  email: string
  role: string
  permissions: string[]
}

const showInviteModal = ref(false)
const showConfirmationModal = ref(false)
const memberToRemove = ref<User | null>(null)

// Direct state management like dashboard
const teamMembers = ref<User[]>([])
const availablePermissions = ref<any[]>([])
const isLoading = ref(false)
const isError = ref(false)
const inviteLoading = ref(false)

const loadTeamData = async () => {
  isLoading.value = true
  isError.value = false
  
  try {
    const [membersData, permissionsData] = await Promise.all([
      teamApi.getTeamMembers(),
      teamApi.getAvailablePermissions()
    ])
    
    teamMembers.value = membersData
    availablePermissions.value = permissionsData
  } catch (error) {
    isError.value = true
    console.error('Error fetching team data:', error)
  } finally {
    isLoading.value = false
  }
}

// Load team data on mount
onMounted(() => {
  loadTeamData()
})

const inviteForm = reactive<InviteForm>({
  email: '',
  role: '',
  permissions: []
})

const formatRole = (role: string) => {
  return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatPermission = (permission: string) => {
  return permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getRoleColor = (role: string) => {
  const colors = {
    'COMPANY_ADMIN': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'EMPLOYEE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'VIEWER': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const inviteMember = async () => {
  inviteLoading.value = true
  
  try {
    await teamApi.inviteTeamMember(inviteForm)
    
    // Reset form and close modal
    inviteForm.email = ''
    inviteForm.role = ''
    inviteForm.permissions = []
    showInviteModal.value = false
    
    // Reload team data
    await loadTeamData()
  } catch (error) {
    console.error('Failed to send invitation:', error)
  } finally {
    inviteLoading.value = false
  }
}

const editMember = (member: User) => {
  console.log('Edit member:', member)
}

const confirmRemoveMember = (member: User) => {
  memberToRemove.value = member
  showConfirmationModal.value = true
}

const removeMember = async () => {
  if (!memberToRemove.value) return
  
  try {
    await teamApi.removeTeamMember(memberToRemove.value.id)
    
    // Close modal and reload data
    showConfirmationModal.value = false
    memberToRemove.value = null
    await loadTeamData()
  } catch (error) {
    console.error('Failed to remove team member:', error)
  }
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
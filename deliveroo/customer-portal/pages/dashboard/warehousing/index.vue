<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Warehousing Requests
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your storage and warehousing requests
        </p>
      </div>
      <NuxtLink
        to="/dashboard/warehousing/new"
        class="btn-primary"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        New Request
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="card p-6 mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select v-model="filters.status" class="input">
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
            <option value="RECEIVED">Received</option>
            <option value="STORED">Stored</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Storage Type
          </label>
          <select v-model="filters.storageType" class="input">
            <option value="">All Types</option>
            <option value="AMBIENT">Ambient</option>
            <option value="REFRIGERATED">Refrigerated</option>
            <option value="FROZEN">Frozen</option>
            <option value="CLIMATE_CONTROLLED">Climate Controlled</option>
            <option value="HAZARDOUS">Hazardous</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="input"
            placeholder="From date"
          />
        </div>
        
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="btn-outline w-full"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading warehousing requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Error Loading Requests
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        There was a problem loading your warehousing requests.
      </p>
      <button 
        @click="loadWarehousingRequests" 
        class="btn-primary"
      >
        Try Again
      </button>
    </div>

    <!-- Requests Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Request
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Storage Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Volume/Weight
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="request in requests"
              :key="request.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ request.requestNumber }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ request.storageLocation || 'Not assigned' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {{ formatStorageType(request.storageType) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div>{{ request.estimatedVolume }} m³</div>
                <div class="text-gray-500 dark:text-gray-400">{{ request.estimatedWeight }} kg</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ request.estimatedStorageDuration.value }} {{ request.estimatedStorageDuration.unit }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(request.status)
                  ]"
                >
                  {{ formatStatus(request.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <NuxtLink
                  :to="`/dashboard/requests/warehousing/${request.id}`"
                  class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <EyeIcon class="w-5 h-5 mr-1" />
                  <span>View</span>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, EyeIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { warehousingApi } from '~/api/warehousing.api'
import type { WarehousingRequest } from '~/model/warehousing'

const filters = reactive({
  status: '',
  storageType: '',
  dateFrom: ''
})

// Direct state management like dashboard
const requests = ref<WarehousingRequest[]>([])
const isLoading = ref(false)
const isError = ref(false)

const loadWarehousingRequests = async () => {
  isLoading.value = true
  isError.value = false
  
  try {
    requests.value = await warehousingApi.getWarehousingRequests(filters)
  } catch (error) {
    isError.value = true
    console.error('Error fetching warehousing requests:', error)
  } finally {
    isLoading.value = false
  }
}

// Load requests on mount
onMounted(() => {
  loadWarehousingRequests()
})

// Watch filters for changes
watch(filters, () => {
  loadWarehousingRequests()
}, { deep: true })

const clearFilters = () => {
  filters.status = ''
  filters.storageType = ''
  filters.dateFrom = ''
}

const formatStorageType = (type: string) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status: string) => {
  const colors = {
    'SUBMITTED': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'APPROVED': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'RECEIVED': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'STORED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'COMPLETED': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Transportation Requests
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your road transportation requests across Europe
        </p>
      </div>
      <NuxtLink
        to="/dashboard/transportation/new"
        class="btn-primary"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        New Request
      </NuxtLink>
    </div>

    <!-- Filters -->
    <TransportationRequestsFilters
      :filters="filters"
      @update:filters="updateFilters"
      @clear-filters="clearFilters"
    />

    <!-- Data Table -->
    <TransportationRequestsDataTable :filters="filters" />
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import TransportationRequestsFilters from './TransportationRequestsFilters.vue'
import TransportationRequestsDataTable from './TransportationRequestsDataTable.vue'
import { type TransportationRequestFilters } from './transportation-requests-filter'

// Filter state management
const filters = reactive<TransportationRequestFilters>({
  status: '',
  serviceType: '',
  dateFrom: ''
})

// Handle filter updates from the filters component
const updateFilters = (newFilters: TransportationRequestFilters) => {
  filters.status = newFilters.status
  filters.serviceType = newFilters.serviceType
  filters.dateFrom = newFilters.dateFrom
}

// Handle clear filters event
const clearFilters = () => {
  filters.status = ''
  filters.serviceType = ''
  filters.dateFrom = ''
}
</script>

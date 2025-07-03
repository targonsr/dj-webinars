<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          All Requests
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage all your transportation and warehousing requests
        </p>
      </div>
      <div class="flex space-x-3">
        <NuxtLink
          to="/dashboard/transportation/new"
          class="btn-primary"
        >
          <TruckIcon class="w-5 h-5 mr-2" />
          New Transportation
        </NuxtLink>
        <NuxtLink
          to="/dashboard/warehousing/new"
          class="btn-secondary"
        >
          <BuildingStorefrontIcon class="w-5 h-5 mr-2" />
          New Warehousing
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-6 mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select v-model="filters.type" class="input">
            <option value="">All Types</option>
            <option value="Transportation">Transportation</option>
            <option value="Warehousing">Warehousing</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select v-model="filters.status" class="input">
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="In Transit">In Transit</option>
            <option value="Stored">Stored</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date From
          </label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="input"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date To
          </label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="input"
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

    <!-- DataTable Component -->
    <DataTable
      title="Your Requests"
      description="View and manage all your transportation and warehousing requests"
      :data="allRequestsQuery.data.value?.data || []"
      :columns="columns"
      :loading="allRequestsQuery.isLoading.value"
      :error="allRequestsQuery.isError.value"
      :header-actions="headerActions"
      :row-actions="rowActions"
      :pagination="paginationData"
      loading-text="Loading requests..."
      error-title="Error Loading Requests"
      error-message="There was a problem loading your requests."
      empty-title="No Requests Found"
      empty-message="No requests found matching your criteria."
      :empty-icon="ExclamationTriangleIcon"
      @retry="allRequestsQuery.refetch()"
      @previous-page="previousPage"
      @next-page="nextPage"
      @go-to-page="goToPage"
    >
      <!-- Request ID with tracking number -->
      <template #cell-id="{ item, value }">
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ value }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ item.trackingNumber || 'Not assigned' }}
          </div>
        </div>
      </template>
      
      <!-- Type badge -->
      <template #cell-type="{ value }">
        <span 
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getTypeColor(value)
          ]"
        >
          {{ value }}
        </span>
      </template>
      
      <!-- Details with sub-details -->
      <template #cell-details="{ item, value }">
        <div>
          <div class="text-sm text-gray-900 dark:text-white">
            {{ value }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ item.subDetails }}
          </div>
        </div>
      </template>
      
      <!-- Status badge -->
      <template #cell-status="{ value }">
        <span
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getStatusColor(value)
          ]"
        >
          {{ value }}
        </span>
      </template>
      
      <!-- Formatted date -->
      <template #cell-date="{ value }">
        <span class="text-sm text-gray-900 dark:text-white">
          {{ formatDate(value) }}
        </span>
      </template>
    </DataTable>

    <!-- Second DataTable Example - Active Deliveries -->
    <div class="mt-12">
      <DataTable
        title="Active Deliveries"
        description="Track your active transportation deliveries"
        :data="activeDeliveries"
        :columns="deliveryColumns"
        :loading="false"
        :error="false"
        :header-actions="deliveryHeaderActions"
        :row-actions="deliveryRowActions"
        :show-pagination="false"
        empty-title="No Active Deliveries"
        empty-message="All your deliveries have been completed."
        :empty-icon="TruckIcon"
      >
        <!-- Formatted date for estimated delivery -->
        <template #cell-estimatedDelivery="{ value }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ formatDate(value) }}
          </span>
        </template>
        
        <!-- Status badge for delivery status -->
        <template #cell-status="{ value }">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getDeliveryStatusColor(value)
            ]"
          >
            {{ value }}
          </span>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  EyeIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { requestsApi } from '~/api/requests.api'
import type { RequestFilters } from '~/model/requests'

const currentPage = ref(1)
const itemsPerPage = 10

const filters = reactive<RequestFilters>({
  type: '',
  status: '',
  serviceType: '',
  storageType: '',
  dateFrom: '',
  dateTo: ''
})

// TanStack Query for fetching all requests
const allRequestsQuery = useQuery({
  queryKey: ['allRequests', { filters: toRef(filters), page: currentPage, limit: itemsPerPage }],
  queryFn: async () => {
    const filtersValue = unref(filters)
    const pageValue = unref(currentPage)
    return await requestsApi.getAllRequests(filtersValue, pageValue, itemsPerPage)
  },
  // Keep previous data while loading new data
  placeholderData: (previousData) => previousData,
})

// Column definitions
const columns = [
  {
    key: 'id',
    label: 'Request ID'
  },
  {
    key: 'type',
    label: 'Type'
  },
  {
    key: 'details',
    label: 'Details'
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'date',
    label: 'Date Created'
  }
]

// Header actions
const headerActions = [
  {
    label: 'View All',
    handler: () => navigateTo('/dashboard/requests'),
    variant: 'outline' as const
  }
]

// Row actions
const rowActions = [
  {
    label: 'View',
    handler: (item: any) => navigateTo(getRequestDetailUrl(item)),
    icon: EyeIcon
  },
  {
    label: 'Track',
    handler: (item: any) => trackShipment(item.trackingNumber),
    icon: MapPinIcon,
    condition: (item: any) => item.trackingNumber && item.type === 'Transportation'
  }
]

// Active Deliveries Example Data
const activeDeliveries = ref([
  {
    id: 'TRK-001',
    trackingNumber: 'TRK123456',
    destination: 'New York, NY',
    estimatedDelivery: new Date('2024-01-25'),
    status: 'In Transit',
    progress: 75
  },
  {
    id: 'TRK-002',
    trackingNumber: 'TRK123457',
    destination: 'Los Angeles, CA',
    estimatedDelivery: new Date('2024-01-26'),
    status: 'In Transit',
    progress: 45
  }
])

// Delivery columns
const deliveryColumns = [
  {
    key: 'trackingNumber',
    label: 'Tracking Number'
  },
  {
    key: 'destination',
    label: 'Destination'
  },
  {
    key: 'estimatedDelivery',
    label: 'Est. Delivery'
  },
  {
    key: 'status',
    label: 'Status'
  }
]

// Delivery header actions
const deliveryHeaderActions = [
  {
    label: 'Track All Shipments',
    handler: () => navigateTo('/dashboard/tracking'),
    variant: 'primary' as const
  }
]

// Delivery row actions
const deliveryRowActions = [
  {
    label: 'Track',
    handler: (item: any) => trackShipment(item.trackingNumber),
    icon: MapPinIcon
  }
]

// Utility functions for slot rendering
const getTypeColor = (type: string) => {
  const colors = {
    'Transportation': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Warehousing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusColor = (status: string) => {
  const colors = {
    'Submitted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'In Transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Stored': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Completed': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getDeliveryStatusColor = (status: string) => {
  const colors = {
    'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Out for Delivery': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Computed values for pagination
const totalPages = computed(() => {
  const data = allRequestsQuery.data.value
  return data ? Math.ceil(data.total / itemsPerPage) : 0
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const paginationData = computed(() => ({
  currentPage: currentPage.value,
  totalPages: totalPages.value,
  total: allRequestsQuery.data.value?.total || 0,
  startIndex: startIndex.value,
  endIndex: endIndex.value,
  visiblePages: visiblePages.value
}))

// Actions
const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key as keyof RequestFilters] = ''
  })
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Utility functions
const getRequestDetailUrl = (request: any) => {
  if (request.type === 'Transportation') {
    return `/dashboard/requests/transportation/${request.id}`
  } else if (request.type === 'Warehousing') {
    return `/dashboard/requests/warehousing/${request.id}`
  }
  return '/dashboard/requests'
}

const trackShipment = (trackingNumber: string) => {
  navigateTo(`/dashboard/tracking?number=${trackingNumber}`)
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
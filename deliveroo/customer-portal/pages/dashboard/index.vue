<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Welcome back, {{ authStore.user?.firstName }}! Here's what's happening with your logistics.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="card p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component
              :is="stat.icon"
              :class="[
                'h-8 w-8',
                stat.color
              ]"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ stat.name }}
              </dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.name"
          :to="action.href"
          class="group relative card p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component
                :is="action.icon"
                class="h-6 w-6 text-success-600 dark:text-success-400"
              />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ action.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ action.description }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Requests -->
    <div class="card mb-8">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Your Requests
          </h2>
          <NuxtLink
            to="/dashboard/requests"
            class="text-sm text-success-600 hover:text-success-500 dark:text-success-400 font-medium"
          >
            View all
          </NuxtLink>
        </div>
      </div>
      
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Request
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="request in recentRequests"
              :key="request.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ request.id }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ request.route }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getTypeColor(request.type)
                  ]"
                >
                  {{ request.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(request.status)
                  ]"
                >
                  {{ request.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(request.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <NuxtLink
                  :to="getRequestDetailUrl(request)"
                  class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <EyeIcon class="w-4 h-4 mr-1" />
                  <span>View</span>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Active Deliveries -->
    <div class="card">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Active Deliveries
          </h2>
          <NuxtLink
            to="/dashboard/tracking"
            class="text-sm text-success-600 hover:text-success-500 dark:text-success-400 font-medium"
          >
            Track all shipments
          </NuxtLink>
        </div>
      </div>
      
      <div v-if="activeDeliveriesLoading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">Loading active deliveries...</p>
      </div>
      
      <div v-else-if="activeDeliveriesError" class="p-8 text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
          <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Error Loading Deliveries
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          There was a problem loading your active deliveries.
        </p>
        <button 
          @click="loadActiveDeliveries" 
          class="btn-primary"
        >
          Try Again
        </button>
      </div>
      
      <div v-else-if="activeDeliveries.length === 0" class="p-8 text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <TruckIcon class="h-8 w-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Active Deliveries
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          You don't have any shipments in transit at the moment.
        </p>
        <NuxtLink
          to="/dashboard/transportation/new"
          class="btn-primary"
        >
          Create New Shipment
        </NuxtLink>
      </div>
      
      <div v-else class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tracking #
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Route
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Service
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Current Location
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Est. Delivery
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="delivery in activeDeliveries"
              :key="delivery.trackingNumber"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ delivery.trackingNumber }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="flex items-center space-x-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span class="truncate max-w-[80px]">{{ delivery.origin.split(',')[0] }}</span>
                  <ArrowRightIcon class="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span class="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  <span class="truncate max-w-[80px]">{{ delivery.destination.split(',')[0] }}</span>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ formatServiceType(delivery.serviceType) }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="truncate max-w-[120px]">{{ getCurrentLocation(delivery) }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(delivery.estimatedDelivery) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="trackShipment(delivery.trackingNumber)"
                  class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <MapPinIcon class="w-4 h-4 mr-1" />
                  <span>Track</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  EyeIcon, 
  MapPinIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  TruckIcon
} from '@heroicons/vue/24/outline'
import { mockDashboardStats, mockQuickActions, mockRecentRequests } from '~/model/dashboard/dashboard.mocks'
import { trackingApi } from '~/api/tracking.api'
import type { ShipmentTracking } from '~/model/tracking'

const authStore = useAuthStore()

const stats = mockDashboardStats
const quickActions = mockQuickActions
const recentRequests = mockRecentRequests

// Active deliveries state
const activeDeliveries = ref<ShipmentTracking[]>([])
const activeDeliveriesLoading = ref(false)
const activeDeliveriesError = ref(false)

const loadActiveDeliveries = async () => {
  activeDeliveriesLoading.value = true
  activeDeliveriesError.value = false
  
  try {
    const allShipments = await trackingApi.getAllShipments()
    
    // Filter for shipments that are in transit (not delivered)
    activeDeliveries.value = Object.values(allShipments)
      .filter(shipment => shipment.status === 'IN_TRANSIT')
      .sort((a, b) => {
        if (!a.estimatedDelivery || !b.estimatedDelivery) return 0
        return new Date(a.estimatedDelivery).getTime() - new Date(b.estimatedDelivery).getTime()
      })
  } catch (error) {
    activeDeliveriesError.value = true
    console.error('Error loading active deliveries:', error)
  } finally {
    activeDeliveriesLoading.value = false
  }
}

// Load active deliveries on mount
onMounted(() => {
  loadActiveDeliveries()
})

const getTypeColor = (type: string) => {
  const colors = {
    'Transportation': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Warehousing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusColor = (status: string) => {
  const colors = {
    'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Stored': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Delivered': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getRequestDetailUrl = (request: any) => {
  if (request.type === 'Transportation') {
    return `/dashboard/requests/transportation/${request.id}`
  } else if (request.type === 'Warehousing') {
    return `/dashboard/requests/warehousing/${request.id}`
  }
  return '/dashboard/requests'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const formatServiceType = (type: string) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'Not available'
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const getCurrentLocation = (delivery: ShipmentTracking) => {
  // Find the current location from tracking events
  const currentEvent = delivery.trackingEvents.find(event => event.type === 'current')
  if (currentEvent) {
    return currentEvent.name
  }
  
  // If no current event, find the last completed event
  const completedEvents = delivery.trackingEvents
    .filter(event => event.isCompleted)
    .sort((a, b) => {
      if (!a.actualTime || !b.actualTime) return 0
      return new Date(b.actualTime).getTime() - new Date(a.actualTime).getTime()
    })
  
  if (completedEvents.length > 0) {
    return completedEvents[0].name
  }
  
  return 'Unknown'
}

const trackShipment = (trackingNumber: string) => {
  navigateTo(`/dashboard/tracking?number=${trackingNumber}`)
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
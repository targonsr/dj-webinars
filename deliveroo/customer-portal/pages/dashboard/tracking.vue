<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Shipment Tracking
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Track your shipments in real-time across Europe
      </p>
    </div>

    <!-- Search Section -->
    <div class="card p-6 mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label for="trackingNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tracking Number
          </label>
          <input
            id="trackingNumber"
            v-model="searchTrackingNumber"
            type="text"
            class="input"
            placeholder="Enter tracking number (e.g., TRK123456789)"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="trackShipment"
            :disabled="!searchTrackingNumber || !searchTrackingNumber.trim()"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MapIcon class="w-5 h-5 mr-2" />
            Track Shipment
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading shipment details...</p>
    </div>

    <!-- Tracking Results -->
    <div v-else-if="currentShipment" class="space-y-8">
      <!-- Shipment Overview -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Shipment Details
          </h2>
          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              getStatusColor(currentShipment.status)
            ]"
          >
            {{ formatStatus(currentShipment.status) }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tracking Number</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentShipment.trackingNumber }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Service Type</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatServiceType(currentShipment.serviceType) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Origin</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentShipment.origin }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Destination</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ currentShipment.destination }}</dd>
          </div>
        </div>

        <!-- Delivery Information -->
        <div v-if="currentShipment.estimatedDelivery || currentShipment.actualDelivery" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div v-if="currentShipment.estimatedDelivery">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Delivery</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDateTime(currentShipment.estimatedDelivery) }}</dd>
            </div>
            <div v-if="currentShipment.actualDelivery">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Delivery</dt>
              <dd class="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">{{ formatDateTime(currentShipment.actualDelivery) }}</dd>
            </div>
          </div>
        </div>
      </div>

      <!-- Map -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Live Tracking Map
        </h3>
        <div id="map" class="h-96 rounded-lg bg-gray-100 dark:bg-gray-700"></div>
        
        <!-- Map Legend -->
        <div class="mt-4 flex flex-wrap gap-4 text-sm">
          <div class="flex items-center">
            <span class="text-lg mr-2">🚛</span>
            <span class="text-gray-600 dark:text-gray-300">Current Position</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2">📦</span>
            <span class="text-gray-600 dark:text-gray-300">Pickup</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2">🏁</span>
            <span class="text-gray-600 dark:text-gray-300">Delivery</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2">⛽</span>
            <span class="text-gray-600 dark:text-gray-300">Refueling</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2">🛌</span>
            <span class="text-gray-600 dark:text-gray-300">Driver Rest</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2">🏭</span>
            <span class="text-gray-600 dark:text-gray-300">Warehouse</span>
          </div>
          <div class="flex items-center">
            <span class="text-lg mr-2">🛃</span>
            <span class="text-gray-600 dark:text-gray-300">Customs</span>
          </div>
        </div>
      </div>

      <!-- Progress Timeline -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Shipment Progress
        </h3>
        <RequestTimeline :updates="currentShipment.updates" />
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="searchAttempted && (!currentShipment || isError)" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        <span v-if="isError">Error Loading Shipment</span>
        <span v-else>Shipment Not Found</span>
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        <span v-if="isError">There was an error loading the shipment details. Please try again.</span>
        <span v-else>We couldn't find a shipment with tracking number "{{ searchTrackingNumber }}".</span>
      </p>
      <p class="text-sm text-gray-400 dark:text-gray-500">
        Please check the tracking number and try again.
      </p>
    </div>

    <!-- Initial State -->
    <div v-else class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
        <MapIcon class="h-8 w-8 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Track Your Shipment
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        Enter a tracking number above to see real-time shipment information and location.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MapIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import type { ShipmentTracking } from '~/model/tracking'
import { trackingApi } from '~/api/tracking.api'

const route = useRoute()
const searchTrackingNumber = ref('')
const searchAttempted = ref(false)
const isLoading = ref(false)
const isError = ref(false)
const currentShipment = ref<ShipmentTracking | null>(null)

let map: any = null
let mapInitialized = false

// Initialize from URL parameter
onMounted(() => {
  const trackingParam = route.query.number as string
  if (trackingParam) {
    searchTrackingNumber.value = trackingParam
    trackShipment()
  }
})

// Watch for currentShipment changes to initialize/update map
watch(currentShipment, async (newShipment) => {
  if (newShipment && !mapInitialized) {
    // Wait for DOM to be updated
    await nextTick()
    // Small delay to ensure the map container is fully rendered
    setTimeout(async () => {
      await initializeMap()
      await updateMap()
    }, 100)
  } else if (newShipment && mapInitialized) {
    await updateMap()
  }
}, { immediate: false })

const trackShipment = async () => {
  if (!searchTrackingNumber.value || !searchTrackingNumber.value.trim()) return
  
  searchAttempted.value = true
  isLoading.value = true
  isError.value = false
  currentShipment.value = null
  
  try {
    const result = await trackingApi.getShipmentByTrackingNumber(searchTrackingNumber.value.trim())
    currentShipment.value = result
  } catch (error) {
    isError.value = true
    console.error('Error fetching shipment tracking:', error)
  } finally {
    isLoading.value = false
  }
}

const initializeMap = async () => {
  if (typeof window !== 'undefined') {
    const mapContainer = document.getElementById('map')
    if (!mapContainer) {
      console.error('Map container not found')
      return
    }

    const L = await import('leaflet')
    
    map = L.map('map').setView([52.2297, 21.0122], 6)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
    
    mapInitialized = true
  }
}

const updateMap = async () => {
  if (!map || !currentShipment.value || !mapInitialized) return
  
  const L = await import('leaflet')
  
  // Clear existing layers
  map.eachLayer((layer: any) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer)
    }
  })
  
  const shipment = currentShipment.value
  
  // Add route polyline
  const routeCoords: [number, number][] = shipment.route.map(point => [point.lat, point.lng])
  L.polyline(routeCoords, { color: '#059669', weight: 4, opacity: 0.7 }).addTo(map)
  
  // Add tracking event markers with enhanced tooltips and circular backgrounds
  shipment.trackingEvents.forEach((event) => {
    let iconHtml = ''
    let backgroundColor = ''
    let borderColor = ''
    let popupContent = ''
    
    switch (event.type) {
      case 'pickup':
        iconHtml = '📦'
        backgroundColor = '#10b981'
        borderColor = '#059669'
        popupContent = `<div class="font-semibold text-green-600 mb-2">✅ Pickup Completed</div>`
        break
      case 'delivery':
        iconHtml = '🏁'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Delivery Completed</div>`
          : `<div class="font-semibold text-blue-600 mb-2">📍 Delivery Destination</div>`
        break
      case 'refuel':
        iconHtml = '⛽'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Refueling Completed</div>`
          : `<div class="font-semibold text-blue-600 mb-2">⛽ Planned Refuel Stop</div>`
        break
      case 'rest':
        iconHtml = '🛌'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Rest Period Completed</div>`
          : `<div class="font-semibold text-blue-600 mb-2">🛌 Planned Rest Stop</div>`
        break
      case 'warehouse':
        iconHtml = '🏭'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Transit Completed</div>`
          : `<div class="font-semibold text-blue-600 mb-2">🏭 Transit Hub</div>`
        break
      case 'customs':
        iconHtml = '🛃'
        backgroundColor = event.isCompleted ? '#10b981' : '#3b82f6'
        borderColor = event.isCompleted ? '#059669' : '#2563eb'
        popupContent = event.isCompleted 
          ? `<div class="font-semibold text-green-600 mb-2">✅ Customs Cleared</div>`
          : `<div class="font-semibold text-blue-600 mb-2">🛃 Customs Checkpoint</div>`
        break
      case 'current':
        iconHtml = '🚛'
        backgroundColor = '#f59e0b'
        borderColor = '#d97706'
        popupContent = `<div class="font-semibold text-orange-600 mb-2">🚛 Current Position</div>`
        break
      default:
        iconHtml = '📍'
        backgroundColor = '#6b7280'
        borderColor = '#4b5563'
        popupContent = `<div class="font-semibold text-gray-600 mb-2">📍 ${event.name}</div>`
    }
    
    // Add location and description
    popupContent += `<div class="font-medium text-gray-800 mb-1">${event.name}</div>`
    popupContent += `<div class="text-gray-600 text-sm mb-3">${event.description}</div>`
    
    // Add timing information
    if (event.isCompleted && event.actualTime) {
      popupContent += `<div class="border-t pt-2 mt-2">`
      if (event.estimatedTime) {
        const estimatedDate = new Date(event.estimatedTime)
        const actualDate = new Date(event.actualTime)
        const timeDiff = actualDate.getTime() - estimatedDate.getTime()
        const minutesDiff = Math.round(timeDiff / (1000 * 60))
        
        popupContent += `<div class="text-xs text-gray-500 mb-1">Estimated: ${formatDateTime(event.estimatedTime)}</div>`
        popupContent += `<div class="text-xs font-medium ${minutesDiff <= 0 ? 'text-green-600' : 'text-orange-600'}">
          Actual: ${formatDateTime(event.actualTime)}
          ${minutesDiff !== 0 ? `(${minutesDiff > 0 ? '+' : ''}${minutesDiff} min)` : ' (On time)'}
        </div>`
      } else {
        popupContent += `<div class="text-xs font-medium text-green-600">Completed: ${formatDateTime(event.actualTime)}</div>`
      }
      popupContent += `</div>`
    } else if (!event.isCompleted && event.estimatedTime) {
      popupContent += `<div class="border-t pt-2 mt-2">`
      popupContent += `<div class="text-xs text-blue-600 font-medium">ETA: ${formatDateTime(event.estimatedTime)}</div>`
      popupContent += `</div>`
    }
    
    // Create custom icon with circular background
    const customIcon = L.divIcon({
      html: `
        <div style="
          width: 32px; 
          height: 32px; 
          background-color: ${backgroundColor}; 
          border: 3px solid ${borderColor}; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${iconHtml}
        </div>
      `,
      className: 'custom-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
    
    L.marker([event.lat, event.lng], { icon: customIcon })
      .bindPopup(popupContent, { maxWidth: 250 })
      .addTo(map)
  })
  
  // Fit map to route bounds
  const bounds = L.latLngBounds(routeCoords as [number, number][])
  map.fitBounds(bounds, { padding: [20, 20] })
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatServiceType = (type: string) => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatDateTime = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'PICKUP_SCHEDULED': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'PICKED_UP': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'IN_TRANSIT': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'DELIVERED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<style>
.custom-map-marker {
  background: transparent !important;
  border: none !important;
}
</style>
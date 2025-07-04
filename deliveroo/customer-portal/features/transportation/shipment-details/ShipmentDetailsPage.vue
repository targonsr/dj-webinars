<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <NuxtLink to="/dashboard/transportation" class="text-success-600 hover:text-success-500 dark:text-success-400 flex items-center">
          <ArrowLeftIcon class="w-5 h-5 mr-1" />
          Back to Shipments
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-4">Shipment {{ id }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Detailed view of shipment</p>
      </div>
    </div>

    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading shipment details...</p>
    </div>

    <div v-else-if="isError" class="card p-8 text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Shipment</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">There was a problem loading the shipment details.</p>
      <button @click="refetch" class="btn-primary">Try Again</button>
    </div>

    <div v-else-if="shipment" class="space-y-8">
      <!-- Overview -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Overview</h2>
          <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', getStatusColor(shipment.status)]">
            {{ formatStatus(shipment.status) }}
          </span>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Shipment #</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ shipment.shipmentNumber }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Service Type</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatServiceType(shipment.serviceType) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatStatus(shipment.priority) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tracking #</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ shipment.trackingNumber }}</dd>
          </div>
        </div>
      </div>

      <!-- Route -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Route</h3>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Pickup
            </h4>
            <p class="text-sm text-gray-900 dark:text-white">{{ shipment.pickupLocation.address.street }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ shipment.pickupLocation.address.city }}, {{ shipment.pickupLocation.address.country }}</p>
          </div>
          <div>
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              Delivery
            </h4>
            <p class="text-sm text-gray-900 dark:text-white">{{ shipment.deliveryLocation.address.street }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ shipment.deliveryLocation.address.city }}, {{ shipment.deliveryLocation.address.country }}</p>
          </div>
        </div>
      </div>

      <!-- Timing -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Timing</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled Pickup</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(shipment.scheduledPickupDate) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled Delivery</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(shipment.scheduledDeliveryDate) }}</dd>
          </div>
          <div v-if="shipment.actualPickupDate">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Pickup</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(shipment.actualPickupDate) }}</dd>
          </div>
          <div v-if="shipment.actualDeliveryDate">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Delivery</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(shipment.actualDeliveryDate) }}</dd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useRoute } from '#app'
import { useShipmentDetails } from './shipment-details-api'
import type { Shipment } from '~/features/transportation/shipment-listing/shipment.model'
import type { Ref } from 'vue'

const route = useRoute()
const id = route.params.id as string
const { data: shipment, isLoading, isError, refetch } = useShipmentDetails(id) as unknown as { data: Ref<Shipment>; isLoading: Ref<boolean>; isError: Ref<boolean>; refetch: () => void }

function formatServiceType(type: string) {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}
function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}
function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    PICKUP_SCHEDULED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    IN_TRANSIT: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    AWAITING_PAYMENT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    PAID: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
</script>

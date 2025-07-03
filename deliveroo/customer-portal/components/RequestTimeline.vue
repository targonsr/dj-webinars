<template>
  <div class="flow-root">
    <ul role="list" class="-mb-8">
      <li
        v-for="(update, updateIdx) in reversedUpdates"
        :key="update.id"
      >
        <div class="relative pb-8">
          <span
            v-if="updateIdx !== reversedUpdates.length - 1"
            class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          />
          <div class="relative flex space-x-3">
            <div>
              <span
                :class="[
                  'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900',
                  getProgressColor(update.status)
                ]"
              >
                <CheckIcon class="h-5 w-5 text-white" aria-hidden="true" />
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ formatStatus(update.status) }}
                  <span v-if="update.location" class="font-medium">{{ locationPrefix }} {{ update.location }}</span>
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ update.description }}
                </p>
                
                <!-- Enhanced timing information -->
                <div v-if="update.estimatedTime || update.actualTime" class="mt-2 space-y-1">
                  <div v-if="update.estimatedTime" class="text-xs text-gray-500 dark:text-gray-400">
                    <span class="font-medium">Estimated:</span> {{ formatDateTime(update.estimatedTime) }}
                  </div>
                  <div v-if="update.actualTime" class="text-xs">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Actual:</span>
                    <span :class="getTimingColor(update.estimatedTime, update.actualTime)">
                      {{ formatDateTime(update.actualTime) }}
                      <span v-if="update.estimatedTime" class="ml-1">
                        {{ getTimingDifference(update.estimatedTime, update.actualTime) }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                <time :datetime="update.timestamp.toISOString()">
                  {{ formatDateTime(update.timestamp) }}
                </time>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'

interface TimelineUpdate {
  id: string
  timestamp: Date
  status: string
  location?: string
  description: string
  estimatedTime?: Date | string
  actualTime?: Date | string
}

interface Props {
  updates: TimelineUpdate[]
  locationPrefix?: string
}

const props = withDefaults(defineProps<Props>(), {
  locationPrefix: 'in'
})

// Reverse the order to show most recent first
const reversedUpdates = computed(() => {
  return [...props.updates].reverse()
})

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const getProgressColor = (status: string) => {
  const colors = {
    'SUBMITTED': 'bg-yellow-500',
    'APPROVED': 'bg-blue-500',
    'RECEIVED': 'bg-purple-500',
    'STORED': 'bg-green-500',
    'COMPLETED': 'bg-gray-500',
    'PICKUP_SCHEDULED': 'bg-yellow-500',
    'PICKED_UP': 'bg-blue-500',
    'IN_TRANSIT': 'bg-purple-500',
    'DELIVERED': 'bg-green-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}

const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

const getTimingColor = (estimatedTime?: Date | string, actualTime?: Date | string) => {
  if (!estimatedTime || !actualTime) {
    return 'text-gray-700 dark:text-gray-300'
  }
  
  const estimated = typeof estimatedTime === 'string' ? new Date(estimatedTime) : estimatedTime
  const actual = typeof actualTime === 'string' ? new Date(actualTime) : actualTime
  const timeDiff = actual.getTime() - estimated.getTime()
  
  if (timeDiff <= 0) {
    return 'text-green-600 dark:text-green-400' // On time or early
  } else if (timeDiff <= 30 * 60 * 1000) { // Within 30 minutes
    return 'text-yellow-600 dark:text-yellow-400' // Slight delay
  } else {
    return 'text-red-600 dark:text-red-400' // Significant delay
  }
}

const getTimingDifference = (estimatedTime?: Date | string, actualTime?: Date | string) => {
  if (!estimatedTime || !actualTime) return ''
  
  const estimated = typeof estimatedTime === 'string' ? new Date(estimatedTime) : estimatedTime
  const actual = typeof actualTime === 'string' ? new Date(actualTime) : actualTime
  const timeDiff = actual.getTime() - estimated.getTime()
  const minutesDiff = Math.round(timeDiff / (1000 * 60))
  
  if (minutesDiff === 0) {
    return '(On time)'
  } else if (minutesDiff > 0) {
    return `(+${minutesDiff} min late)`
  } else {
    return `(${Math.abs(minutesDiff)} min early)`
  }
}
</script>
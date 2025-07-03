<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Reports & Analytics
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Analyze your logistics performance and costs
      </p>
    </div>

    <!-- Date Range Filter -->
    <div class="card p-6 mb-8">
      <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="w-full sm:w-auto">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Date
          </label>
          <input
            v-model="dateRange.from"
            type="date"
            class="input"
          />
        </div>
        <div class="w-full sm:w-auto">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To Date
          </label>
          <input
            v-model="dateRange.to"
            type="date"
            class="input"
          />
        </div>
        <div class="w-full sm:w-auto flex items-end">
          <button
            @click="generateReports"
            class="btn-primary w-full sm:w-auto"
          >
            <ChartBarIcon class="w-5 h-5 mr-2" />
            Generate Reports
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <TruckIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Shipments
              </dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ metrics.totalShipments }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                On-Time Delivery
              </dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ metrics.onTimeDelivery }}%
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CurrencyEuroIcon class="h-8 w-8 text-yellow-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Cost
              </dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                €{{ metrics.totalCost.toLocaleString() }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <BuildingStorefrontIcon class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Storage Volume
              </dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ metrics.storageVolume }} m³
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
      <!-- Shipment Trends -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Shipment Trends
        </h3>
        <div class="h-64">
          <Line
            :data="shipmentTrendsData"
            :options="shipmentTrendsOptions"
          />
        </div>
      </div>

      <!-- Cost Analysis -->
      <div class="card p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Cost Breakdown
        </h3>
        <div class="h-64">
          <Doughnut
            :data="costBreakdownData"
            :options="costBreakdownOptions"
          />
        </div>
      </div>
    </div>

    <!-- Performance Table -->
    <div class="card mb-8">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Route Performance
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Route
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Shipments
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                On-Time %
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Avg Cost
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Revenue
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="route in routePerformance"
              :key="route.route"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ route.route }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ route.shipments }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    route.onTimePercentage >= 95 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : route.onTimePercentage >= 85
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ route.onTimePercentage }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                €{{ route.avgCost.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                €{{ route.totalRevenue.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Export Options -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Export Reports
      </h3>
      <div class="flex flex-wrap gap-4">
        <button
          @click="exportReport('pdf')"
          class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 btn-outline"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
          <span>Export PDF</span>
        </button>
        <button
          @click="exportReport('excel')"
          class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 btn-outline"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
          <span>Export Excel</span>
        </button>
        <button
          @click="exportReport('csv')"
          class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 btn-outline"
        >
          <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChartBarIcon,
  ChartPieIcon,
  TruckIcon,
  CheckCircleIcon,
  CurrencyEuroIcon,
  BuildingStorefrontIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'
import { Line, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js'
import { mockMetrics, mockRoutePerformance } from '~/model/dashboard/dashboard.mocks'
import { dashboardApi } from '~/api/dashboard.api'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler)

const dateRange = reactive({
  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  to: new Date().toISOString().split('T')[0]
})

const metrics = ref(mockMetrics)
const routePerformance = ref(mockRoutePerformance)
const isLoading = ref(false)

// Shipment Trends Chart Data
const shipmentTrendsData = computed(() => {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'
  
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Transportation',
        data: [42, 38, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        borderColor: '#2563eb', // primary-600
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Warehousing',
        data: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
        borderColor: '#16a34a', // success-600
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Shipment Trends Chart Options
const shipmentTrendsOptions = computed(() => {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#4b5563'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#4b5563'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#d1d5db' : '#4b5563',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#4b5563',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} shipments`
          }
        }
      }
    }
  }
})

// Cost Breakdown Chart Data
const costBreakdownData = computed(() => {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'
  
  return {
    labels: ['Transportation', 'Warehousing', 'Customs', 'Insurance', 'Handling'],
    datasets: [
      {
        data: [45, 25, 10, 12, 8],
        backgroundColor: [
          '#2563eb', // primary-600
          '#16a34a', // success-600
          '#ea580c', // accent-600
          '#9333ea', // purple-600
          '#0d9488', // secondary-600
        ],
        borderColor: isDark ? '#1f2937' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 15
      }
    ]
  }
})

// Cost Breakdown Chart Options
const costBreakdownOptions = computed(() => {
  const colorMode = useColorMode()
  const isDark = colorMode.value === 'dark'
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: isDark ? '#d1d5db' : '#4b5563',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#4b5563',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}% (€${(metrics.value.totalCost * context.raw / 100).toLocaleString()})`
          }
        }
      }
    }
  }
})

const generateReports = async () => {
  isLoading.value = true
  try {
    await dashboardApi.generateReports(dateRange)
    // In a real application, we would fetch updated data here
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    isLoading.value = false
  } catch (error) {
    console.error('Failed to generate reports:', error)
    isLoading.value = false
  }
}

const exportReport = async (format: string) => {
  try {
    await dashboardApi.exportReport(format)
  } catch (error) {
    console.error(`Failed to export report as ${format}:`, error)
  }
}

// Watch for color mode changes to update charts
const colorMode = useColorMode()
watch(colorMode, () => {
  // Force chart re-render by triggering a reactive update
  metrics.value = { ...metrics.value }
})

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
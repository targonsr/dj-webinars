<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Billing & Payments
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage your billing information and payment history
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading billing information...</p>
    </div>

    <template v-else>
      <!-- Credit Overview -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CreditCardIcon class="h-8 w-8 text-primary-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Credit Limit
                </dt>
                <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                  €{{ creditInfo.limit.toLocaleString() }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BanknotesIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Available Credit
                </dt>
                <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                  €{{ (creditInfo.limit - creditInfo.used).toLocaleString() }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-8 w-8 text-yellow-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Outstanding Balance
                </dt>
                <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                  €{{ creditInfo.used.toLocaleString() }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CalendarDaysIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Payment Terms
                </dt>
                <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ paymentTerms }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Credit Usage Chart -->
      <div class="card p-6 mb-8">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Credit Usage
        </h2>
        <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div
            class="bg-primary-600 h-4 rounded-full transition-all duration-300"
            :style="{ width: `${(creditInfo.used / creditInfo.limit) * 100}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span>€0</span>
          <span>€{{ creditInfo.limit.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Recent Invoices -->
      <div class="card mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Recent Invoices
          </h2>
          <button class="btn-outline">
            <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
            Export All
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invoice
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="invoice in invoices"
                :key="invoice.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ invoice.number }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ invoice.description }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(invoice.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  €{{ invoice.amount.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getInvoiceStatusColor(invoice.status)
                    ]"
                  >
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(invoice.dueDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <button
                      @click="downloadInvoice(invoice)"
                      class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <DocumentArrowDownIcon class="w-5 h-5 mr-1" />
                      <span>Download</span>
                    </button>
                    <button
                      v-if="invoice.status === 'Unpaid'"
                      @click="payInvoice(invoice)"
                      class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <CreditCardIcon class="w-5 h-5 mr-1" />
                      <span>Pay Now</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="card">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Payment Methods
          </h2>
          <button class="btn-primary">
            <PlusIcon class="w-5 h-5 mr-2" />
            Add Payment Method
          </button>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <CreditCardIcon class="h-8 w-8 text-gray-400" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ method.type }} ending in {{ method.last4 }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    Expires {{ method.expiryMonth }}/{{ method.expiryYear }}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  v-if="method.isDefault"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Default
                </span>
                <button
                  v-if="!method.isDefault"
                  @click="setDefaultPaymentMethod(method)"
                  class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <StarIcon class="w-5 h-5 mr-1" />
                  <span>Set as Default</span>
                </button>
                <button
                  @click="removePaymentMethod(method)"
                  class="flex items-center text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <TrashIcon class="w-5 h-5 mr-1" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  CreditCardIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { billingApi } from '~/api/billing.api'
import type { Invoice, PaymentMethod, CreditInfo } from '~/model/billing'

const paymentTerms = ref('30 days')

// Direct state management like dashboard
const creditInfo = ref<CreditInfo>({ limit: 0, used: 0 })
const invoices = ref<Invoice[]>([])
const paymentMethods = ref<PaymentMethod[]>([])
const isLoading = ref(false)
const isError = ref(false)

const loadBillingInfo = async () => {
  isLoading.value = true
  isError.value = false
  
  try {
    const [creditData, invoicesData, paymentMethodsData] = await Promise.all([
      billingApi.getCreditInfo(),
      billingApi.getInvoices(),
      billingApi.getPaymentMethods()
    ])
    
    creditInfo.value = creditData
    invoices.value = invoicesData
    paymentMethods.value = paymentMethodsData
  } catch (error) {
    isError.value = true
    console.error('Error fetching billing information:', error)
  } finally {
    isLoading.value = false
  }
}

// Load billing info on mount
onMounted(() => {
  loadBillingInfo()
})

const setDefaultPaymentMethod = async (method: PaymentMethod) => {
  try {
    // Update local state immediately for better UX
    paymentMethods.value = paymentMethods.value.map(m => ({
      ...m,
      isDefault: m.id === method.id
    }))
    
    // In a real app, you'd make an API call here
    console.log('Setting default payment method:', method.id)
  } catch (error) {
    console.error('Error setting default payment method:', error)
    // Revert on error
    await loadBillingInfo()
  }
}

const removePaymentMethod = async (method: PaymentMethod) => {
  if (confirm('Are you sure you want to remove this payment method?')) {
    try {
      // Remove from local state immediately for better UX
      paymentMethods.value = paymentMethods.value.filter(m => m.id !== method.id)
      
      // In a real app, you'd make an API call here
      console.log('Removing payment method:', method.id)
    } catch (error) {
      console.error('Error removing payment method:', error)
      // Revert on error
      await loadBillingInfo()
    }
  }
}

const downloadInvoice = async (invoice: Invoice) => {
  try {
    console.log('Downloading invoice:', invoice.number)
    // In a real app, you'd download the PDF here
  } catch (error) {
    console.error('Error downloading invoice:', error)
  }
}

const payInvoice = async (invoice: Invoice) => {
  try {
    console.log('Paying invoice:', invoice.number)
    // In a real app, you'd redirect to payment flow
  } catch (error) {
    console.error('Error processing payment:', error)
  }
}

const addPaymentMethod = () => {
  console.log('Add payment method')
  // In a real app, you'd open a modal or redirect to add payment method
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getInvoiceStatusColor = (status: string) => {
  const colors = {
    'PAID': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'OVERDUE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'DRAFT': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
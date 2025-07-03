// Simple composables for data fetching without Vue Query
import { dashboardApi } from '~/api/dashboard.api'
import { requestsApi } from '~/api/requests.api'
import { warehousingApi } from '~/api/warehousing.api'
import { trackingApi } from '~/api/tracking.api'
import { billingApi } from '~/api/billing.api'
import { teamApi } from '~/api/team.api'
import type { TransportationRequest } from '~/model/transportation'
import type { WarehousingRequest } from '~/model/warehousing'
import type { RequestFilters, PaginatedRequests } from '~/model/requests'
import type { ShipmentTracking } from '~/model/tracking'
import type { CreditInfo, Invoice, PaymentMethod } from '~/model/billing'
import type { User } from '~/model/user'

// Warehousing requests composable
export function useWarehousingRequests(filters: any = {}) {
  const data = ref<WarehousingRequest[]>([])
  const isLoading = ref(false)
  const isError = ref(false)
  const hasInitialLoad = ref(false)

  const refetch = async () => {
    isLoading.value = true
    isError.value = false
    try {
      data.value = await warehousingApi.getWarehousingRequests(filters)
    } catch (error) {
      isError.value = true
      console.error('Error fetching warehousing requests:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await refetch()
    hasInitialLoad.value = true
  })

  // Watch filters and refetch after initial load
  watchEffect(() => {
    // Access filter properties to create reactivity dependency
    const status = unref(filters.status || filters?.status)
    const storageType = unref(filters.storageType || filters?.storageType)
    const dateFrom = unref(filters.dateFrom || filters?.dateFrom)
    
    // Only refetch after initial load and when not currently loading
    if (hasInitialLoad.value && !isLoading.value) {
      refetch()
    }
  })

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    refetch
  }
}

// All requests composable
export function useAllRequests(filters: RequestFilters = {} as RequestFilters, page = 1, limit = 10) {
  const data = ref<PaginatedRequests<any> | null>(null)
  const isLoading = ref(false)
  const isError = ref(false)
  const hasInitialLoad = ref(false)

  const refetch = async () => {
    isLoading.value = true
    isError.value = false
    try {
      data.value = await requestsApi.getAllRequests(filters, page, limit)
    } catch (error) {
      isError.value = true
      console.error('Error fetching all requests:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await refetch()
    hasInitialLoad.value = true
  })

  // Watch filters and refetch after initial load
  watchEffect(() => {
    // Access filter properties to create reactivity dependency
    const type = unref(filters.type || filters?.type)
    const status = unref(filters.status || filters?.status)
    const dateFrom = unref(filters.dateFrom || filters?.dateFrom)
    const dateTo = unref(filters.dateTo || filters?.dateTo)
    
    // Only refetch after initial load and when not currently loading
    if (hasInitialLoad.value && !isLoading.value) {
      refetch()
    }
  })

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    refetch
  }
}

// Transportation request details composable
export function useTransportationRequestDetails(id: string) {
  const data = ref<TransportationRequest | null>(null)
  const isLoading = ref(false)
  const isError = ref(false)

  const refetch = async () => {
    if (!id) return
    
    isLoading.value = true
    isError.value = false
    try {
      data.value = await requestsApi.getTransportationRequestById(id)
    } catch (error) {
      isError.value = true
      console.error('Error fetching transportation request details:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    refetch()
  })

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    refetch
  }
}

// Warehousing request details composable
export function useWarehousingRequestDetails(id: string) {
  const data = ref<WarehousingRequest | null>(null)
  const isLoading = ref(false)
  const isError = ref(false)

  const refetch = async () => {
    if (!id) return
    
    isLoading.value = true
    isError.value = false
    try {
      data.value = await requestsApi.getWarehousingRequestById(id)
    } catch (error) {
      isError.value = true
      console.error('Error fetching warehousing request details:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    refetch()
  })

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    refetch
  }
}

// Shipment tracking composable
export function useShipmentTracking(trackingNumber: string) {
  const data = ref<ShipmentTracking | null>(null)
  const isLoading = ref(false)
  const isError = ref(false)

  const refetch = async () => {
    if (!trackingNumber) return
    
    isLoading.value = true
    isError.value = false
    try {
      data.value = await trackingApi.getShipmentByTrackingNumber(trackingNumber)
    } catch (error) {
      isError.value = true
      console.error('Error fetching shipment tracking:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    refetch
  }
}

// Active shipments composable
export function useActiveShipments() {
  const data = ref<ShipmentTracking[]>([])
  const isLoading = ref(false)
  const isError = ref(false)

  const refetch = async () => {
    isLoading.value = true
    isError.value = false
    try {
      const allShipments = await trackingApi.getAllShipments()
      data.value = Object.values(allShipments)
        .filter(shipment => shipment.status === 'IN_TRANSIT')
        .sort((a, b) => {
          if (!a.estimatedDelivery || !b.estimatedDelivery) return 0
          return new Date(a.estimatedDelivery).getTime() - new Date(b.estimatedDelivery).getTime()
        })
    } catch (error) {
      isError.value = true
      console.error('Error fetching active shipments:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    refetch()
  })

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    refetch
  }
}

// Billing info composable
export function useBillingInfo() {
  const creditInfoData = ref<CreditInfo | null>(null)
  const invoicesData = ref<Invoice[]>([])
  const paymentMethodsData = ref<PaymentMethod[]>([])
  const isLoading = ref(false)
  const isError = ref(false)

  const fetchCreditInfo = async () => {
    try {
      creditInfoData.value = await billingApi.getCreditInfo()
    } catch (error) {
      console.error('Error fetching credit info:', error)
    }
  }

  const fetchInvoices = async () => {
    try {
      invoicesData.value = await billingApi.getInvoices()
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      paymentMethodsData.value = await billingApi.getPaymentMethods()
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    }
  }

  const fetchAll = async () => {
    isLoading.value = true
    isError.value = false
    try {
      await Promise.all([
        fetchCreditInfo(),
        fetchInvoices(),
        fetchPaymentMethods()
      ])
    } catch (error) {
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchAll()
  })

  const setDefaultPaymentMethod = async (method: any) => {
    try {
      const updatedMethods = paymentMethodsData.value.map(m => ({
        ...m,
        isDefault: m.id === method.id
      }))
      paymentMethodsData.value = updatedMethods
    } catch (error) {
      console.error('Error setting default payment method:', error)
    }
  }

  return {
    creditInfoQuery: {
      data: readonly(creditInfoData),
      isLoading: readonly(isLoading),
      isError: readonly(isError)
    },
    invoicesQuery: {
      data: readonly(invoicesData),
      isLoading: readonly(isLoading),
      isError: readonly(isError)
    },
    paymentMethodsQuery: {
      data: readonly(paymentMethodsData),
      isLoading: readonly(isLoading),
      isError: readonly(isError)
    },
    setDefaultPaymentMethodMutation: {
      mutate: setDefaultPaymentMethod,
      isPending: readonly(isLoading)
    }
  }
}

// Team management composable
export function useTeamManagement() {
  const teamMembersData = ref<User[]>([])
  const availablePermissionsData = ref([])
  const isLoading = ref(false)
  const isError = ref(false)

  const fetchTeamMembers = async () => {
    try {
      teamMembersData.value = await teamApi.getTeamMembers()
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const fetchAvailablePermissions = async () => {
    try {
      availablePermissionsData.value = await teamApi.getAvailablePermissions()
    } catch (error) {
      console.error('Error fetching available permissions:', error)
    }
  }

  const fetchAll = async () => {
    isLoading.value = true
    isError.value = false
    try {
      await Promise.all([
        fetchTeamMembers(),
        fetchAvailablePermissions()
      ])
    } catch (error) {
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchAll()
  })

  const inviteTeamMember = async (inviteData: any) => {
    try {
      await teamApi.inviteTeamMember(inviteData)
      await fetchTeamMembers() // Refresh the list
    } catch (error) {
      console.error('Error inviting team member:', error)
      throw error
    }
  }

  const removeTeamMember = async (memberId: string) => {
    try {
      await teamApi.removeTeamMember(memberId)
      await fetchTeamMembers() // Refresh the list
    } catch (error) {
      console.error('Error removing team member:', error)
      throw error
    }
  }

  return {
    teamMembersQuery: {
      data: readonly(teamMembersData),
      isLoading: readonly(isLoading),
      isError: readonly(isError),
      refetch: fetchTeamMembers
    },
    availablePermissionsQuery: {
      data: readonly(availablePermissionsData),
      isLoading: readonly(isLoading),
      isError: readonly(isError)
    },
    inviteTeamMemberMutation: {
      mutateAsync: inviteTeamMember,
      isPending: readonly(isLoading)
    },
    removeTeamMemberMutation: {
      mutate: removeTeamMember,
      isPending: readonly(isLoading)
    }
  }
}
import { mockAllRequests, mockTransportationRequestDetail, mockWarehousingRequestDetail } from '~/model/requests/requests.mocks'
import { mockTransportationRequests } from '~/model/transportation/transportation.mocks'
import { mockWarehousingRequests } from '~/model/warehousing/warehousing.mocks'
import type { RequestFilters, PaginatedRequests } from '~/model/requests'

export const requestsApi = {
  async getAllRequests(filters: RequestFilters, page: number = 1, limit: number = 10): Promise<PaginatedRequests<any>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filteredRequests = [...mockAllRequests]
    
    // Apply filters
    if (filters.type) {
      filteredRequests = filteredRequests.filter(req => req.type === filters.type)
    }
    if (filters.status) {
      filteredRequests = filteredRequests.filter(req => req.status === filters.status)
    }
    if (filters.dateFrom) {
      filteredRequests = filteredRequests.filter(req => new Date(req.date) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      filteredRequests = filteredRequests.filter(req => new Date(req.date) <= new Date(filters.dateTo))
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filteredRequests.slice(startIndex, endIndex)
    
    return {
      data: paginatedData,
      total: filteredRequests.length,
      page,
      limit
    }
  },

  async getTransportationRequestById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // First check if we have the detailed mock
    if (id === 'TR-2024-001') {
      return mockTransportationRequestDetail
    }
    
    // Otherwise, look through the transportation requests
    const request = mockTransportationRequests.find(req => req.id === id)
    if (request) {
      return request
    }
    
    return null
  },

  async getWarehousingRequestById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // First check if we have the detailed mock
    if (id === 'WH-2024-001') {
      return mockWarehousingRequestDetail
    }
    
    // Otherwise, look through the warehousing requests
    const request = mockWarehousingRequests.find(req => req.id === id)
    if (request) {
      return request
    }
    
    return null
  }
}
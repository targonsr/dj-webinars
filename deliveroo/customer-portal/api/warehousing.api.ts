import { mockWarehousingRequests } from '~/model/warehousing/warehousing.mocks'
import type { WarehousingRequest } from '~/model/warehousing'

export const warehousingApi = {
  async getWarehousingRequests(filters: any = {}): Promise<WarehousingRequest[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700))
    
    let filteredRequests = [...mockWarehousingRequests]
    
    // Apply filters
    if (filters.status) {
      filteredRequests = filteredRequests.filter(req => req.status === filters.status)
    }
    if (filters.storageType) {
      filteredRequests = filteredRequests.filter(req => req.storageType === filters.storageType)
    }
    if (filters.dateFrom) {
      filteredRequests = filteredRequests.filter(req => 
        new Date(req.plannedStartDate) >= new Date(filters.dateFrom)
      )
    }
    
    return filteredRequests
  },

  async createWarehousingRequest(data: any) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const requestNumber = `WH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    return {
      id: requestNumber,
      requestNumber,
      ...data,
      status: 'SUBMITTED',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}
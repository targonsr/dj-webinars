import { mockShipments } from '~/model/tracking/tracking.mocks'
import type { ShipmentTracking } from '~/model/tracking'

export const trackingApi = {
  async getShipmentByTrackingNumber(trackingNumber: string): Promise<ShipmentTracking | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return mockShipments[trackingNumber.trim()] || null
  },

  async getAllShipments(): Promise<Record<string, ShipmentTracking>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockShipments
  }
}
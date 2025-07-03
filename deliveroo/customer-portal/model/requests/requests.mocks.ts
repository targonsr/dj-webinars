import type { TransportationRequest } from '../transportation'
import type { WarehousingRequest } from '../warehousing'

export const mockAllRequests = [
  {
    id: 'TR-2024-001',
    requestNumber: 'TR-2024-001',
    type: 'Transportation',
    status: 'In Transit',
    details: 'Warsaw → Berlin',
    subDetails: 'Electronics components',
    date: new Date('2024-01-15'),
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'WH-2024-002',
    requestNumber: 'WH-2024-002',
    type: 'Warehousing',
    status: 'Stored',
    details: 'Krakow Warehouse',
    subDetails: '50 m³ ambient storage',
    date: new Date('2024-01-14'),
    trackingNumber: null
  },
  {
    id: 'TR-2024-003',
    requestNumber: 'TR-2024-003',
    type: 'Transportation',
    status: 'Delivered',
    details: 'Gdansk → Hamburg',
    subDetails: 'Automotive parts',
    date: new Date('2024-01-13'),
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'WH-2024-004',
    requestNumber: 'WH-2024-004',
    type: 'Warehousing',
    status: 'In Progress',
    details: 'Warsaw Warehouse',
    subDetails: '25 m³ refrigerated storage',
    date: new Date('2024-01-12'),
    trackingNumber: null
  },
  {
    id: 'TR-2024-005',
    requestNumber: 'TR-2024-005',
    type: 'Transportation',
    status: 'Submitted',
    details: 'Prague → Vienna',
    subDetails: 'Food products',
    date: new Date('2024-01-11'),
    trackingNumber: null
  },
  // Add more mock data for pagination testing
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `TR-2024-${String(i + 6).padStart(3, '0')}`,
    requestNumber: `TR-2024-${String(i + 6).padStart(3, '0')}`,
    type: i % 2 === 0 ? 'Transportation' : 'Warehousing',
    status: ['Submitted', 'In Progress', 'In Transit', 'Delivered', 'Stored'][i % 5],
    details: i % 2 === 0 ? `Route ${i + 1}` : `Warehouse ${i + 1}`,
    subDetails: i % 2 === 0 ? 'Various goods' : `${(i + 1) * 10} m³ storage`,
    date: new Date(2024, 0, 10 - i),
    trackingNumber: i % 3 === 0 ? `TRK${String(i + 100000000).slice(-9)}` : null
  }))
]

export const mockTransportationRequestDetail = {
  id: 'TR-2024-001',
  requestNumber: 'TR-2024-001',
  status: 'IN_TRANSIT',
  serviceType: 'FULL_TRUCKLOAD',
  priority: 'NORMAL',
  trackingNumber: 'TRK123456789',
  pickupLocation: {
    address: {
      street: 'ul. Logistyczna 123',
      city: 'Warsaw',
      country: 'Poland'
    },
    contactPerson: 'John Doe',
    contactPhone: '+48123456789'
  },
  deliveryLocation: {
    address: {
      street: 'Hauptstraße 456',
      city: 'Berlin',
      country: 'Germany'
    },
    contactPerson: 'Jane Smith',
    contactPhone: '+49123456789'
  },
  cargo: {
    description: 'Electronic components',
    weight: 1500,
    packaging: 'PALLETS',
    quantity: 5,
    unitType: 'pallets',
    value: 25000,
    fragile: true
  },
  requiresInsurance: true,
  estimatedCost: 2500,
  finalCost: null,
  currency: 'EUR',
  progressUpdates: [
    {
      id: '1',
      timestamp: new Date('2024-01-15T08:00:00'),
      status: 'PICKUP_SCHEDULED',
      location: 'Warsaw, Poland',
      description: 'Pickup scheduled for 08:00'
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T09:30:00'),
      status: 'PICKED_UP',
      location: 'Warsaw, Poland',
      description: 'Cargo successfully picked up'
    },
    {
      id: '3',
      timestamp: new Date('2024-01-15T14:00:00'),
      status: 'IN_TRANSIT',
      location: 'Dresden, Germany',
      description: 'In transit to destination'
    }
  ]
}

export const mockWarehousingRequestDetail = {
  id: 'WH-2024-001',
  requestNumber: 'WH-2024-001',
  status: 'STORED',
  storageType: 'AMBIENT',
  priority: 'NORMAL',
  storageLocation: 'Warehouse A-12',
  estimatedVolume: 50,
  estimatedWeight: 1000,
  estimatedStorageDuration: { value: 3, unit: 'months' },
  securityLevel: 'STANDARD',
  requiresTemperatureControl: false,
  requiresHumidityControl: false,
  requiresSpecialHandling: false,
  cargo: {
    description: 'Electronic components and spare parts for automotive industry',
    cargoType: 'GENERAL_CARGO',
    packaging: 'PALLETS',
    quantity: 20,
    unitType: 'pallets',
    value: 45000
  },
  handlingServices: ['LOADING', 'UNLOADING', 'SORTING'],
  valueAddedServices: ['LABELING', 'QUALITY_CONTROL'],
  estimatedCost: 1500,
  finalCost: null,
  billingType: 'MONTHLY',
  currency: 'EUR',
  progressUpdates: [
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:00:00'),
      status: 'SUBMITTED',
      location: 'System',
      description: 'Warehousing request submitted and under review'
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T14:00:00'),
      status: 'APPROVED',
      location: 'Krakow Facility',
      description: 'Request approved, storage space allocated'
    },
    {
      id: '3',
      timestamp: new Date('2024-01-16T09:00:00'),
      status: 'RECEIVED',
      location: 'Warehouse A-12',
      description: 'Cargo received and inspection completed'
    },
    {
      id: '4',
      timestamp: new Date('2024-01-16T11:30:00'),
      status: 'STORED',
      location: 'Warehouse A-12',
      description: 'Items successfully stored and inventory updated'
    }
  ]
}
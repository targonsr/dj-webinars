import type { Address, CargoDetails, Priority, RequestStatus, ProgressUpdate } from '../common'

export interface TransportationRequest {
  id: string;
  requestNumber: string;
  type: 'TRANSPORTATION';
  status: RequestStatus;
  priority: Priority;
  
  // Pickup and Delivery Information
  pickupLocation: LocationDetails;
  deliveryLocation: LocationDetails;
  
  // Cargo Information
  cargo: CargoDetails;
  
  // Service Requirements
  serviceType: TransportServiceType;
  vehicleRequirements: VehicleRequirements;
  
  // Timing
  requestedPickupDate: Date;
  requestedDeliveryDate: Date;
  
  // Special Requirements
  specialInstructions?: string;
  requiresInsurance: boolean;
  requiresCustomsClearance: boolean;
  
  // Pricing and Billing
  estimatedCost?: number;
  finalCost?: number;
  currency: string;
  
  // Tracking
  trackingNumber?: string;
  currentLocation?: string;
  progressUpdates: ProgressUpdate[];
  
  // Metadata
  createdBy: string;
  assignedTo?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationDetails {
  address: Address;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  operatingHours: OperatingHours;
  accessInstructions?: string;
  loadingType: LoadingType;
  facilityType: FacilityType;
}

export interface OperatingHours {
  monday: { open: string; close: string; };
  tuesday: { open: string; close: string; };
  wednesday: { open: string; close: string; };
  thursday: { open: string; close: string; };
  friday: { open: string; close: string; };
  saturday: { open: string; close: string; };
  sunday: { open: string; close: string; };
}

export interface VehicleRequirements {
  vehicleType: VehicleType;
  capacity: number;
  specialEquipment: string[];
  driverRequirements: string[];
}

export enum TransportServiceType {
  FULL_TRUCKLOAD = 'FULL_TRUCKLOAD',
  LESS_THAN_TRUCKLOAD = 'LESS_THAN_TRUCKLOAD',
  EXPRESS_DELIVERY = 'EXPRESS_DELIVERY',
  OVERSIZED_CARGO = 'OVERSIZED_CARGO',
  HAZARDOUS_MATERIALS = 'HAZARDOUS_MATERIALS'
}

export enum VehicleType {
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  TRAILER = 'TRAILER',
  REFRIGERATED = 'REFRIGERATED',
  FLATBED = 'FLATBED',
  TANKER = 'TANKER'
}

export enum LoadingType {
  DOCK = 'DOCK',
  GROUND = 'GROUND',
  CRANE = 'CRANE',
  FORKLIFT = 'FORKLIFT'
}

export enum FacilityType {
  WAREHOUSE = 'WAREHOUSE',
  FACTORY = 'FACTORY',
  PORT = 'PORT',
  DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
  RETAIL_STORE = 'RETAIL_STORE'
}
import type { CargoDetails, Priority, RequestStatus, ProgressUpdate } from '../common'

export interface WarehousingRequest {
  id: string;
  requestNumber: string;
  type: 'WAREHOUSING';
  status: RequestStatus;
  priority: Priority;
  
  // Storage Information
  storageType: StorageType;
  estimatedVolume: number;
  estimatedWeight: number;
  
  // Cargo Information
  cargo: CargoDetails;
  
  // Duration
  estimatedStorageDuration: StorageDuration;
  plannedStartDate: Date;
  plannedEndDate?: Date;
  
  // Service Requirements
  handlingServices: HandlingService[];
  valueAddedServices: ValueAddedService[];
  
  // Special Requirements
  securityLevel: SecurityLevel;
  requiresTemperatureControl: boolean;
  requiresHumidityControl: boolean;
  requiresSpecialHandling: boolean;
  specialInstructions?: string;
  
  // Pricing
  estimatedCost?: number;
  finalCost?: number;
  currency: string;
  billingType: BillingType;
  
  // Tracking
  storageLocation?: string;
  inventoryStatus: InventoryStatus;
  progressUpdates: ProgressUpdate[];
  
  // Metadata
  createdBy: string;
  assignedTo?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageDuration {
  value: number;
  unit: 'days' | 'weeks' | 'months' | 'years';
}

export enum StorageType {
  AMBIENT = 'AMBIENT',
  REFRIGERATED = 'REFRIGERATED',
  FROZEN = 'FROZEN',
  CLIMATE_CONTROLLED = 'CLIMATE_CONTROLLED',
  HAZARDOUS = 'HAZARDOUS',
  SECURE = 'SECURE'
}

export enum HandlingService {
  LOADING = 'LOADING',
  UNLOADING = 'UNLOADING',
  SORTING = 'SORTING',
  PICKING = 'PICKING',
  PACKING = 'PACKING'
}

export enum ValueAddedService {
  LABELING = 'LABELING',
  REPACKAGING = 'REPACKAGING',
  QUALITY_CONTROL = 'QUALITY_CONTROL',
  CROSS_DOCKING = 'CROSS_DOCKING',
  KITTING = 'KITTING'
}

export enum SecurityLevel {
  STANDARD = 'STANDARD',
  HIGH = 'HIGH',
  MAXIMUM = 'MAXIMUM'
}

export enum BillingType {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
  PER_UNIT = 'PER_UNIT',
  PER_PALLET = 'PER_PALLET'
}

export enum InventoryStatus {
  PENDING_ARRIVAL = 'PENDING_ARRIVAL',
  RECEIVED = 'RECEIVED',
  IN_STORAGE = 'IN_STORAGE',
  PICKED = 'PICKED',
  DISPATCHED = 'DISPATCHED'
}
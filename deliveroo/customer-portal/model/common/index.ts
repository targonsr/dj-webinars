// Common interfaces used across multiple domains
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface ContactInfo {
  primaryEmail: string;
  primaryPhone: string;
  website?: string;
  emergencyContact: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'm';
}

export interface TemperatureRange {
  min: number;
  max: number;
  unit: 'C' | 'F';
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum RequestStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED_AT_TERMINAL = 'ARRIVED_AT_TERMINAL',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  STORED = 'STORED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export enum CargoType {
  GENERAL_CARGO = 'GENERAL_CARGO',
  BULK_DRY = 'BULK_DRY',
  BULK_LIQUID = 'BULK_LIQUID',
  CONTAINERIZED = 'CONTAINERIZED',
  BREAK_BULK = 'BREAK_BULK',
  HAZARDOUS = 'HAZARDOUS',
  OVERSIZED = 'OVERSIZED',
  PERISHABLE = 'PERISHABLE',
  VALUABLE = 'VALUABLE'
}

export enum PackagingType {
  PALLETS = 'PALLETS',
  BOXES = 'BOXES',
  CRATES = 'CRATES',
  BULK = 'BULK',
  CONTAINERS = 'CONTAINERS'
}

export enum HazardousClass {
  CLASS_1 = 'CLASS_1', // Explosives
  CLASS_2 = 'CLASS_2', // Gases
  CLASS_3 = 'CLASS_3', // Flammable liquids
  CLASS_4 = 'CLASS_4', // Flammable solids
  CLASS_5 = 'CLASS_5', // Oxidizing substances
  CLASS_6 = 'CLASS_6', // Toxic substances
  CLASS_7 = 'CLASS_7', // Radioactive materials
  CLASS_8 = 'CLASS_8', // Corrosive substances
  CLASS_9 = 'CLASS_9'  // Miscellaneous dangerous goods
}

export interface CargoDetails {
  description: string;
  cargoType: CargoType;
  weight: number; // in kg
  dimensions: Dimensions;
  value: number;
  currency: string;
  packaging: PackagingType;
  hazardousClass?: HazardousClass;
  temperatureRequirements?: TemperatureRange;
  stackable: boolean;
  fragile: boolean;
  quantity: number;
  unitType: string;
}

export interface ProgressUpdate {
  id: string;
  timestamp: Date;
  status: RequestStatus;
  location?: string;
  description: string;
  updatedBy: string;
  attachments?: string[];
  estimatedTime?: Date | string;
  actualTime?: Date | string;
}
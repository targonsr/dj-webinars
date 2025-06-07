export interface Truck {
  id: string;
  model: string;
  driver: string;
  status: 'On Route' | 'Available' | 'Maintenance';
  capacity: string;
  location: string;
}

export type VehicleFilters = { 
  status: 'On Route' | 'Available' | 'Maintenance'; 
  location: string;
  driver: string;
}
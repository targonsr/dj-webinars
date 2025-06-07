import { useQuery } from '@tanstack/react-query';
import { getVehicles, getVehicleDetails } from './vehicles.http';
import { VehicleFilters } from './vehicles.model';

export const useTrucksQuery = (filters: Partial<VehicleFilters> = {}) => {
  return useQuery({
    queryKey: ['trucks', filters],
    queryFn: () => getVehicles(filters),
  });
};

export const useTruckQuery = (id: string) => {
  return useQuery({
    queryKey: ['truck', id],
    queryFn: () => getVehicleDetails(id),
  });
};

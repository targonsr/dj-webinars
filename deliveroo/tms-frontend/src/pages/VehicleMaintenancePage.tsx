import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehicles } from '@/model/vehicles/vehicles.mocks';
import { VehicleMaintenance } from '@/components/vehicles/VehicleMaintenance';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const VehicleMaintenancePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you'd fetch this from an API
  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => {
      const foundVehicle = vehicles.find(v => v.id === id);
      if (foundVehicle) {
        return Promise.resolve(foundVehicle);
      } else {
        return Promise.reject(new Error('Vehicle not found'));
      }
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (isError || !vehicle) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorBoundary message="Could not fetch vehicle data. Please try again." />
      </div>
    );
  }

  return <VehicleMaintenance vehicle={vehicle} onBack={() => navigate('/vehicles')} />;
};
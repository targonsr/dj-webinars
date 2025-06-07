import { getAuthHeaders } from '@/contexts/session.token';
import { API_BASE_URL } from './http.config';
import { MOCK_MODE, delay } from './mock.http';
import { mockTrucks } from './vehicles.mocks';
import { Truck, VehicleFilters } from './vehicles.model';

/**
 * HTTP GET <api>/vehicles
 */
export const getVehicles = async (filters: Partial<VehicleFilters> = {}): Promise<Truck[]> => {
  try {
    if (MOCK_MODE) {
      await delay(300, 500);
      
      let filteredTrucks = [...mockTrucks];
      
      // Apply filters if provided
      if (filters?.status) {
        filteredTrucks = filteredTrucks.filter(truck => truck.status === filters.status);
      }
      
      if (filters?.location) {
        filteredTrucks = filteredTrucks.filter(truck => 
          truck.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters?.driver) {
        filteredTrucks = filteredTrucks.filter(truck => 
          truck.driver.toLowerCase().includes(filters.driver!.toLowerCase())
        );
      }
      
      return filteredTrucks;
    }

    // Real API call
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.driver) params.append('driver', filters.driver);
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/vehicles${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (MOCK_MODE) {
        await delay(300, 500);
        return mockTrucks;
    }
  }
};

/**
 * HTTP GET <api>/vehicles/:id
 */
export const getVehicleDetails = async (id: string): Promise<Truck | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle details: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (MOCK_MODE) {
      await delay(200, 400);
      return mockTrucks.find(truck => truck.id === id);
    }
  }
};

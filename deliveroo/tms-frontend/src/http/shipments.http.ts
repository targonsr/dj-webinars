import { Shipment } from './shipments.model';
import { mockShipments } from './shipments.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../contexts/session.token';
import { delay, MOCK_MODE } from './mock.http';

export async function getShipments(filters?: { driver?: string; status?: string; location?: string }): Promise<Shipment[]> {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters?.driver) queryParams.append('driver', filters.driver);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.location) queryParams.append('location', filters.location);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/shipments${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (MOCK_MODE) {
      await delay(300, 500);
      
      // Apply filters to mock data
      let filteredShipments = [...mockShipments];
      
      if (filters?.driver) {
        filteredShipments = filteredShipments.filter(s => 
          s.driver.toLowerCase().includes(filters.driver!.toLowerCase())
        );
      }
      if (filters?.status) {
        filteredShipments = filteredShipments.filter(s => 
          s.status.toLowerCase().includes(filters.status!.toLowerCase())
        );
      }
      if (filters?.location) {
        filteredShipments = filteredShipments.filter(s => 
          s.origin.toLowerCase().includes(filters.location!.toLowerCase()) ||
          s.destination.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      return filteredShipments;
    }
    throw error;
  }
}

export async function getShipmentDetails(id: string): Promise<Shipment | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (MOCK_MODE) {
      await delay(300, 500);
      return mockShipments.find(shipment => shipment.id === id);
    }
    throw error;
  }
}
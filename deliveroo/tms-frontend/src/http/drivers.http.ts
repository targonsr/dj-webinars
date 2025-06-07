import { Driver } from './drivers.model';
import { mockDrivers } from './drivers.mocks';
import { API_BASE_URL } from './http.config';
import { getAuthHeaders } from '../contexts/session.token';
import { delay, MOCK_MODE } from './mock.http';
import { getShipments } from './shipments.http';
import { Shipment } from './shipments.model';

/**
 * HTTP GET <api>/drivers
 */
export async function getDrivers(): Promise<Driver[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (MOCK_MODE){
      await delay(300, 500);
      return mockDrivers;
    }
  }
}

/**
 * HTTP GET <api>/drivers/:id
 */
export async function getDriverDetails(id: string): Promise<Driver> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (MOCK_MODE){
      await delay(300, 500);
      return mockDrivers.find(driver => driver.id === id) as Driver;
    }
  }
}

/**
 * HTTP POST <api>/drivers/:id/shipments
 */
export async function getDriverShipments(id: Driver['id']): Promise<Shipment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}/shipments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (MOCK_MODE){
      await delay(300, 500);

      const driver = mockDrivers.find(d => d.id === id);
      if (!driver) return [];
      return getShipments({ driver: driver.name });
    }
  }
}
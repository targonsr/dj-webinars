
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrucksQuery } from '@/http/vehicles.queries';
import LiveFleetMap from '@/pages/vehicles/LiveFleetMap';
import {  } from './FleetMap';
import { mockFleetLocation } from '@/http/fleet-location.mocks';

// Remove problematic Leaflet imports and use a simple static map placeholder
const TrackFleet = () => {
  const { data: trucks = [], isLoading } = useTrucksQuery();

  // Generate random coordinates for trucks
  const truckLocations = mockFleetLocation;

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading fleet data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Track Fleet</h1>
        <p className="text-gray-600">Monitor all active trucks in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Fleet Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Active Trucks</p>
              <p className="text-2xl font-bold text-green-600">{trucks.filter(t => t.status === 'On Route').length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-blue-600">{trucks.filter(t => t.status === 'Available').length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">{trucks.filter(t => t.status === 'Maintenance').length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Static Map Placeholder */}
        <LiveFleetMap truckLocations={truckLocations} />
      </div>

      {/* Truck List */}
      <Card>
        <CardHeader>
          <CardTitle>Truck Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Truck ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Model</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Driver</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Location</th>
                </tr>
              </thead>
              <tbody>
                {trucks.map((truck) => (
                  <tr key={truck.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{truck.id}</td>
                    <td className="py-3 px-4">{truck.model}</td>
                    <td className="py-3 px-4">{truck.driver}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        truck.status === 'On Route' ? 'bg-green-100 text-green-800' :
                        truck.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {truck.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{truck.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackFleet;

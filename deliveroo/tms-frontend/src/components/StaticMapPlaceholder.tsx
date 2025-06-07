import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface StaticMapPlaceholderProps {
  shipment: {
    id: string | number;
    origin: string;
    destination: string;
  };
}

const StaticMapPlaceholder: React.FC<StaticMapPlaceholderProps> = ({ shipment }) => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Live Tracking</CardTitle>
      <CardDescription>Current shipment location and route</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Route Tracking</h3>
          <p className="text-gray-500 mb-4">Shipment #{shipment.id} route visualization</p>
          <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm mx-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Origin</span>
                </div>
                <span className="text-xs text-gray-500">{shipment.origin}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Current</span>
                </div>
                <span className="text-xs text-gray-500">Hartford, CT</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm font-medium">Destination</span>
                </div>
                <span className="text-xs text-gray-500">{shipment.destination}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StaticMapPlaceholder; 
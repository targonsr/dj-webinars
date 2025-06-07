import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FleetMap } from './FleetMap';
import { FleetLocation } from '@/http/fleet-location.mocks';

interface LiveFleetMapProps {
  truckLocations: FleetLocation[];
}

const LiveFleetMap: React.FC<LiveFleetMapProps> = ({ truckLocations }) => {

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Live Fleet Map</CardTitle>
        <CardDescription>Real-time truck locations</CardDescription>
      </CardHeader>
      <CardContent className="h-96 rounded-lg overflow-hidden">
        <FleetMap items={truckLocations.map((t, idx) => ({
          coordinates: [t.coordinates.latitude, t.coordinates.longitude],
          description: {
            title: t.truck.model,
            content: <>
              <span className="block">
                <strong>Driver</strong>: {t.truck.driver}
              </span>
              <span className="block">
                <strong>Status</strong>: {t.truck.status}
              </span>
              ID: {t.truck.id}
            </>,
          }
        }))} />
      </CardContent>
    </Card>
  );
};

export default LiveFleetMap;

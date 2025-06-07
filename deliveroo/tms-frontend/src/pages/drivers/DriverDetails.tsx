
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { useDriverDetailsQuery, useDriverShipmentsQuery } from '@/http/drivers.queries';
import { useAtom } from 'jotai';
import { selectedDriverAtom } from '@/store/filters';

const DriverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: driver, isLoading: driverLoading } = useDriverDetailsQuery(id || '');
  const { data: shipments = [], isLoading: shipmentsLoading } = useDriverShipmentsQuery(id || '');
  const [, setSelectedDriver] = useAtom(selectedDriverAtom);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDriverShipments = () => {
    if (driver) {
      setSelectedDriver(driver.name);
      navigate('/shipments');
    }
  };

  if (driverLoading) {
    return <div className="flex items-center justify-center h-64">Loading driver details...</div>;
  }

  if (!driver) {
    return <div className="flex items-center justify-center h-64">Driver not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/drivers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Drivers
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Details</h1>
          <p className="text-gray-600">Complete driver information and history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Information */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{driver.name}</h3>
              <Badge className={driver.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {driver.status}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-medium">{driver.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Location</p>
                <p className="font-medium">{driver.currentLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-medium">⭐ {driver.rating}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="font-medium">{driver.deliveries}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Type</p>
                <p className="font-medium">CDL Class A</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hire Date</p>
                <p className="font-medium">Jan 15, 2020</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Shipments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>Latest shipments assigned to this driver</CardDescription>
              </div>
              <Button onClick={handleViewDriverShipments}>
                View All Shipments
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {shipmentsLoading ? (
              <div>Loading shipments...</div>
            ) : shipments.length > 0 ? (
              <div className="space-y-4">
                {shipments.slice(0, 5).map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">Shipment {shipment.id}</p>
                          <p className="text-sm text-gray-600">{shipment.origin} → {shipment.destination}</p>
                        </div>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">ETA: {shipment.eta}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/shipments/${shipment.id}/track`)}
                    >
                      Track
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No shipments assigned to this driver</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{driver.deliveries}</p>
              <p className="text-sm text-gray-600">Total Deliveries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-gray-600">On-Time Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">2</p>
              <p className="text-sm text-gray-600">Incidents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{driver.rating}</p>
              <p className="text-sm text-gray-600">Customer Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDetails;

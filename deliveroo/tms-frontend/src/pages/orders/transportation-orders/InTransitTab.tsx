import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { shipmentFiltersAtom, selectedDriverAtom } from '@/store/filters';
import { useShipmentsQuery } from '@/http/shipments.queries';
import { useDriversQuery } from '@/http/drivers.queries';
import { useEffect } from 'react';

const ShipmentsTab = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useAtom(shipmentFiltersAtom);
  const [selectedDriver, setSelectedDriver] = useAtom(selectedDriverAtom);
  const { data: drivers = [] } = useDriversQuery();
  
  // Apply selected driver filter when coming from driver details
  useEffect(() => {
    if (selectedDriver) {
      setFilters(prev => ({ ...prev, driver: selectedDriver }));
      setSelectedDriver(''); // Clear after applying
    }
  }, [selectedDriver, setFilters, setSelectedDriver]);

  const { data: shipments = [], isLoading } = useShipmentsQuery(filters);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrackShipment = (shipmentId: string) => {
    navigate(`/shipments/${shipmentId}/track`);
  };

  const clearFilters = () => {
    setFilters({ driver: '', status: '', location: '' });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading shipments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Driver</label>
              <Select 
                value={filters.driver || undefined} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, driver: value || '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All drivers" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map(driver => (
                    <SelectItem key={driver.id} value={driver.name}>{driver.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={filters.status || undefined} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value || '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Loading">Loading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Shipment {shipment.id}</CardTitle>
                <Badge className={getStatusColor(shipment.status)}>
                  {shipment.status}
                </Badge>
              </div>
              <CardDescription>Driver: {shipment.driver}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-medium">{shipment.origin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To</p>
                <p className="font-medium">{shipment.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ETA</p>
                <p className="font-medium">{shipment.eta}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => handleTrackShipment(shipment.id)}
              >
                Track Shipment
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {shipments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No shipments match the current filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentsTab; 

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useDriversQuery } from '@/http/drivers.queries';

const Drivers = () => {
  const navigate = useNavigate();
  const { data: drivers = [], isLoading } = useDriversQuery();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'off duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const driversData = drivers.map(driver => ({
    name: driver.name.split(' ')[0],
    deliveries: driver.deliveries,
    rating: driver.rating * 20
  }));

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading drivers...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
        <p className="text-gray-600">Your assigned drivers and their status</p>
      </div>

      {/* Stats Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Performance</CardTitle>
          <CardDescription>Deliveries completed by each driver</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driversData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deliveries" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <Card 
            key={driver.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/drivers/${driver.id}`)}
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{driver.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(driver.status)}>
                      {driver.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Location</span>
                <span className="font-medium">{driver.currentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <span className="font-medium">⭐ {driver.rating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Deliveries</span>
                <span className="font-medium">{driver.deliveries}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Drivers;

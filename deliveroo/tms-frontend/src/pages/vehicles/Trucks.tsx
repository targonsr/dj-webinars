
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTrucksQuery } from '@/http/vehicles.queries';
import { AlertTriangle, Calendar, Wrench } from 'lucide-react';

const Trucks = () => {
  const [activeTab, setActiveTab] = useState('maintenance');
  const { data: trucks = [], isLoading } = useTrucksQuery();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on route': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusData = [
    { name: 'Available', value: trucks.filter(t => t.status === 'Available').length, color: '#10b981' },
    { name: 'On Route', value: trucks.filter(t => t.status === 'On Route').length, color: '#3b82f6' },
    { name: 'Maintenance', value: trucks.filter(t => t.status === 'Maintenance').length, color: '#ef4444' }
  ];

  const capacityData = trucks.map(truck => ({
    id: truck.id,
    capacity: parseInt(truck.capacity.replace(/[^\d]/g, '')),
    model: truck.model.split(' ')[0]
  }));

  // Mock maintenance data
  const maintenanceItems = [
    { id: 1, vehicle: 'TR001', type: 'Oil Change', dueDate: '2024-01-20', urgency: 'high', description: 'Engine oil change required' },
    { id: 2, vehicle: 'TR003', type: 'Brake Inspection', dueDate: '2024-01-25', urgency: 'medium', description: 'Brake system inspection due' },
    { id: 3, vehicle: 'TR002', type: 'Battery Check', dueDate: '2024-01-30', urgency: 'low', description: 'Battery voltage check' },
    { id: 4, vehicle: 'TR005', type: 'Suspension', dueDate: '2024-01-18', urgency: 'high', description: 'Suspension system service' },
  ];

  const urgentMaintenanceCount = maintenanceItems.filter(item => item.urgency === 'high').length;
  const urgentVehicleCount = trucks.filter(t => t.status === 'Maintenance').length;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading fleet data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
        <p className="text-gray-600">Comprehensive fleet oversight and maintenance tracking</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="maintenance" className="relative">
            Fleet Maintenance
            {urgentMaintenanceCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {urgentMaintenanceCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="relative">
            Vehicles Management
            {urgentVehicleCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {urgentVehicleCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="overview">Old Management Panel</TabsTrigger>
        </TabsList>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Urgent Maintenance</p>
                    <p className="text-2xl font-bold text-red-600">{urgentMaintenanceCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Due This Week</p>
                    <p className="text-2xl font-bold text-orange-600">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">In Service</p>
                    <p className="text-2xl font-bold text-blue-600">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>Upcoming and overdue maintenance items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge className={getUrgencyColor(item.urgency)}>
                        {item.urgency}
                      </Badge>
                      <div>
                        <p className="font-medium">{item.vehicle} - {item.type}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Due: {item.dueDate}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.dueDate) < new Date() ? 'Overdue' : 'Upcoming'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trucks.map((truck) => (
              <Card key={truck.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Truck {truck.id}</CardTitle>
                      <CardDescription>{truck.model}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(truck.status)}>
                      {truck.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium">{truck.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-medium">{truck.capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Location</p>
                    <p className="font-medium">{truck.location}</p>
                  </div>
                  {truck.status === 'Maintenance' && (
                    <div className="bg-red-50 p-2 rounded border-l-4 border-red-400">
                      <p className="text-sm text-red-800 font-medium">Maintenance Required</p>
                      <p className="text-xs text-red-600">Oil change overdue</p>
                    </div>
                  )}
                  <div className="pt-2">
                    <div className="text-4xl text-center">🚛</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Fleet Status</CardTitle>
                <CardDescription>Current status distribution of trucks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Capacity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Truck Capacity</CardTitle>
                <CardDescription>Load capacity by truck</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={capacityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="id" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="capacity" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trucks;

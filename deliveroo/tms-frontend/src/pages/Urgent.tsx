
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUrgentItems } from '@/http/urgent.queries';

const Urgent = () => {
  const { data: urgentItems = [], isLoading } = useUrgentItems();

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return '⏰';
      case 'maintenance': return '🔧';
      case 'payment': return '💳';
      case 'driver': return '👨‍💼';
      default: return '⚠️';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading urgent items...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Urgent Items</h1>
        <p className="text-gray-600">Action items requiring immediate attention</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {urgentItems.map((item) => (
          <Card key={item.id} className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-900">{item.message}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Required Action</p>
                  <p className="text-sm font-medium">{item.action}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned to</p>
                  <p className="text-sm font-medium">{item.assignee}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  Take Action
                </Button>
                <Button variant="outline" size="sm">
                  Reassign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {urgentItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No urgent items require attention at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Urgent;

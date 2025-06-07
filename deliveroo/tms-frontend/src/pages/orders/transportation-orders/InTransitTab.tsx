import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InTransitOrder } from '@/http/orders.model';

interface InTransitTabProps {
  inTransitOrders: InTransitOrder[];
}

const InTransitTab: React.FC<InTransitTabProps> = ({ inTransitOrders }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>In Transit</CardTitle>
        <CardDescription>Orders currently being transported</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inTransitOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{order.id} - {order.customer}</h3>
                  <p className="text-gray-600">Driver: {order.driver}</p>
                </div>
                <Badge className={order.delay ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {order.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Elapsed Time</p>
                  <p className="font-medium">{order.elapsedTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Distance Covered</p>
                  <p className="font-medium">{order.distanceCovered} / {order.totalDistance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(parseInt(order.distanceCovered) / parseInt(order.totalDistance)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delay</p>
                  <p className="font-medium text-red-600">
                    {order.delay ? order.estimatedDelay : 'None'}
                  </p>
                </div>
              </div>

              {order.delay && (
                <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                  <p className="text-sm text-red-800">
                    ⚠️ Delivery delayed by {order.estimatedDelay} due to traffic conditions
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InTransitTab;

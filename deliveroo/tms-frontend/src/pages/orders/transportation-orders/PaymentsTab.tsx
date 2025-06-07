import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/http/orders.model';

interface PaymentsTabProps {
  paymentsData: Payment[];
  getPaymentStatusColor: (status: string) => string;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ paymentsData, getPaymentStatusColor }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <CardDescription>Invoice and payment tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Payment ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Order</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Payer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{payment.id}</td>
                  <td className="py-3 px-4">{payment.orderId}</td>
                  <td className="py-3 px-4 font-semibold">{payment.amount}</td>
                  <td className="py-3 px-4">
                    <Badge className={getPaymentStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{payment.dueDate}</td>
                  <td className="py-3 px-4">{payment.payer}</td>
                  <td className="py-3 px-4">
                    <a 
                      href={payment.invoiceLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Invoice
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsTab;

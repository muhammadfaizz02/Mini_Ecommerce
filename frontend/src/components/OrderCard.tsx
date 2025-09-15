// OrderCard.tsx
import React from 'react';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const formattedDate = new Date(order.created_at).toLocaleDateString();
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Order #{order.id}</h3>
          <p className="text-gray-600 text-sm">{formattedDate}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {order.status}
          </span>
          <span className="text-xl font-bold">${order.total_amount.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Customer Information</h4>
        <p>{order.customer_name}</p>
        <p className="text-gray-600">{order.customer_email}</p>
        <p className="text-gray-600 text-sm mt-1">{order.customer_address}</p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Order Items</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>Product #{item.product_id} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
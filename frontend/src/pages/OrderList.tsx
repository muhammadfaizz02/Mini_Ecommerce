import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import OrderCard from '../components/OrderCard';

const OrderList: React.FC = () => {
  const { orders, loading, error } = useOrders();
  const navigate = useNavigate();

  const handleOrderClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div 
              key={order.id} 
              onClick={() => handleOrderClick(order.id)}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
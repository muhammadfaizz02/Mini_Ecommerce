import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetail } from '../hooks/useOrderDetail';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { order, loading, error } = useOrderDetail(orderId ? parseInt(orderId) : 0);

  if (loading) return <div className="flex justify-center items-center h-64">Loading order details...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!order) return <div className="text-center py-12">Order not found.</div>;

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    shipped: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate('/orders')}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Orders
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order #{order.id}</h1>
            <p className="text-gray-600">Placed on {formattedDate}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <p className="text-xl font-bold mt-2">${order.total_amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Customer Name</p>
              <p className="text-gray-700">{order.customer_name}</p>
            </div>
            <div>
              <p className="font-medium">Email Address</p>
              <p className="text-gray-700">{order.customer_email}</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium">Shipping Address</p>
              <p className="text-gray-700 whitespace-pre-line">{order.customer_address}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center border-b pb-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                  {item.product && item.product.image_url ? (
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">
                    {item.product ? item.product.name : `Product #${item.product_id}`}
                  </h3>
                  {item.product && (
                    <p className="text-gray-600 text-sm">{item.product.category}</p>
                  )}
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  <p className="text-gray-600">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-xl font-bold">${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Order Status Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium">Order Placed</p>
              <p className="text-gray-600 text-sm">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              order.status !== 'pending' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {order.status !== 'pending' ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-4">
              <p className="font-medium">Processing</p>
              <p className="text-gray-600 text-sm">
                {order.status !== 'pending' ? 'Your order is being processed' : 'Waiting for processing'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              ['shipped', 'completed'].includes(order.status) ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {['shipped', 'completed'].includes(order.status) ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-4">
              <p className="font-medium">Shipped</p>
              <p className="text-gray-600 text-sm">
                {['shipped', 'completed'].includes(order.status) 
                  ? 'Your order has been shipped' 
                  : 'Not yet shipped'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              order.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {order.status === 'completed' ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-4">
              <p className="font-medium">Delivered</p>
              <p className="text-gray-600 text-sm">
                {order.status === 'completed' 
                  ? 'Your order has been delivered' 
                  : 'Not yet delivered'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
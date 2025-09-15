import { useState, useEffect } from 'react';
import axios from 'axios';
import { Order } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/orders/`);
        setOrders(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const createOrder = async (orderData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders/`, orderData);
      return response.data;
    } catch (err) {
      throw new Error('Failed to create order');
    }
  };

  // Fungsi baru untuk mendapatkan order by ID
  const getOrderById = async (orderId: number): Promise<Order | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      return null;
    }
  };

  return { orders, loading, error, createOrder, getOrderById };
};
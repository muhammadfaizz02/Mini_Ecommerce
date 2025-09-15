import { useState, useEffect } from 'react';
import axios from 'axios';
import { Order } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const useOrderDetail = (orderId: number) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
        setOrder(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  return { order, loading, error };
};
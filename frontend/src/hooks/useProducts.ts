// useProducts.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const useProducts = (
  category?: string, 
  minPrice?: number, 
  maxPrice?: number, 
  sortBy?: string
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (minPrice !== undefined) params.append('min_price', minPrice.toString());
        if (maxPrice !== undefined) params.append('max_price', maxPrice.toString());
        if (sortBy) params.append('sort_by', sortBy);
        
        const response = await axios.get(`${API_BASE_URL}/products/?${params}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, minPrice, maxPrice, sortBy]);

  return { products, loading, error };
};
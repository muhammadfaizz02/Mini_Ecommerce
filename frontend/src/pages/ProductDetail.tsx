import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

const ProductDetail: React.FC<{ addToCart: (product: Product) => void }> = ({ addToCart }) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const { products, loading, error } = useProducts();
  const product = products.find(p => p.id === parseInt(productId || '0'));

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!product) return <div className="text-center py-12">Product not found.</div>;

  const handleAddToCart = () => {
    addToCart(product);
    // Show notification (you can implement a toast notification system)
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg overflow-hidden">
          <img
            src={product.image_url || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
          
          {product.category && (
            <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm mb-4">
              {product.category}
            </span>
          )}
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
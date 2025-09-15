import React, { useState, useMemo, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product, CartItem } from '../types';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';

const ProductList: React.FC<{ addToCart: (product: Product) => void }> = ({ addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const { products, loading, error } = useProducts(
    selectedCategory || undefined,
    priceRange.min,
    priceRange.max,
    selectedSort || undefined
  );

  // Sort products locally jika backend tidak support sort
  const sortedProducts = useMemo(() => {
    if (!selectedSort) return products;
    
    return [...products].sort((a, b) => {
      switch (selectedSort) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [products, selectedSort]);

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return sortedProducts.slice(startIndex, startIndex + productsPerPage);
  }, [sortedProducts, currentPage, productsPerPage]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  }, [products]);

  const handlePriceChange = useCallback((min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          onCategoryChange={setSelectedCategory}
          onPriceChange={handlePriceChange}
          onSortChange={handleSortChange}
        />
        
        <div className="flex-1">
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {currentProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCart(product)} 
              />
            ))}
          </div>
          
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
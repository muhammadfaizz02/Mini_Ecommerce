import React, { useState, useMemo } from 'react';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onSortChange: (sort: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onPriceChange,
  onSortChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Normalize categories to remove duplicates (case-insensitive)
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();
    return categories.filter(category => {
      const normalized = category.toLowerCase().trim();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    }).sort((a, b) => a.localeCompare(b));
  }, [categories]);

  const handleApplyPriceFilter = () => {
    const min = minPrice === '' ? 0 : Number(minPrice);
    const max = maxPrice === '' ? 1000 : Number(maxPrice);
    
    // Validasi input
    if (min < 0) {
      alert('Minimum price cannot be negative');
      return;
    }
    if (max < 0) {
      alert('Maximum price cannot be negative');
      return;
    }
    if (min > max) {
      alert('Minimum price cannot be greater than maximum price');
      return;
    }
    
    onPriceChange(min, max);
  };

  const handleSortChange = (sort: string) => {
    onSortChange(sort);
  };

  const handleClearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    onPriceChange(0, 1000); // Reset ke default
  };

  return (
    <div className="relative">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-md mb-4 flex items-center"
      >
        <span>Filters</span>
        <svg
          className={`ml-2 h-5 w-5 transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Desktop Filter Sidebar */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block md:relative md:top-0 md:left-0`}>
        <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>
          
          {/* Sort Options */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Sort By</h3>
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={selectedCategory === ''}
                  onChange={() => onCategoryChange('')}
                  className="mr-2"
                />
                <span>All Categories</span>
              </label>
              
              {uniqueCategories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() => onCategoryChange(category)}
                    className="mr-2"
                  />
                  <span className="capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Price Range ($)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="1000"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleApplyPriceFilter}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 text-sm"
                >
                  Apply Price
                </button>
                <button
                  onClick={handleClearPriceFilter}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded hover:bg-gray-400 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
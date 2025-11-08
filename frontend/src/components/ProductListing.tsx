import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import productService from '../services/productService';

export function ProductListing() {
  const { category } = useParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Get page title based on route
  const getPageTitle = () => {
    if (window.location.pathname.includes('/collections')) return 'COLLECTIONS';
    if (window.location.pathname.includes('/sale')) return 'SALE';
    if (category) return category.toUpperCase();
    return 'ALL PRODUCTS';
  };

  useEffect(() => {
    // Get search query from URL
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [category, sortBy, priceRanges, selectedSizes, selectedRatings, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        sort: sortBy,
      };

      // Handle category from URL params
      if (category && category !== 'all') {
        params.category = category;
      }

      // Handle search query
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Apply price range filters
      if (priceRanges.length > 0) {
        const minPrices: number[] = [];
        const maxPrices: number[] = [];
        
        priceRanges.forEach(range => {
          if (range === 'under500') {
            minPrices.push(0);
            maxPrices.push(500);
          } else if (range === '500-1000') {
            minPrices.push(500);
            maxPrices.push(1000);
          } else if (range === '1000-2000') {
            minPrices.push(1000);
            maxPrices.push(2000);
          } else if (range === 'above2000') {
            minPrices.push(2000);
            maxPrices.push(999999);
          }
        });

        if (minPrices.length > 0) {
          params.minPrice = Math.min(...minPrices);
          params.maxPrice = Math.max(...maxPrices);
        }
      }

      // Apply size filters
      if (selectedSizes.length > 0) {
        params.sizes = selectedSizes.join(',');
      }

      // Apply rating filter (get minimum rating)
      if (selectedRatings.length > 0) {
        params.rating = Math.min(...selectedRatings);
      }

      const data = await productService.getAllProducts(params);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const togglePriceRange = (range: string) => {
    setPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setPriceRanges([]);
    setSelectedSizes([]);
    setSelectedRatings([]);
    setSearchQuery('');
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="uppercase text-[#1E1E1E] mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : getPageTitle()}
            </h1>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `Showing ${products.length} products`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:block ${
              showFilters ? 'block' : 'hidden'
            } bg-white rounded-2xl p-6 shadow-md h-fit`}
          >
            <h3 className="uppercase text-[#1E1E1E] mb-4">Filters</h3>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-[#1E1E1E] mb-3">Price Range</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={priceRanges.includes('under500')}
                    onChange={() => togglePriceRange('under500')}
                    className="w-4 h-4 accent-[#FF3B30]"
                  />
                  <span>Under ₹500</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={priceRanges.includes('500-1000')}
                    onChange={() => togglePriceRange('500-1000')}
                    className="w-4 h-4 accent-[#FF3B30]"
                  />
                  <span>₹500 - ₹1000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={priceRanges.includes('1000-2000')}
                    onChange={() => togglePriceRange('1000-2000')}
                    className="w-4 h-4 accent-[#FF3B30]"
                  />
                  <span>₹1000 - ₹2000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={priceRanges.includes('above2000')}
                    onChange={() => togglePriceRange('above2000')}
                    className="w-4 h-4 accent-[#FF3B30]"
                  />
                  <span>Above ₹2000</span>
                </label>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <h4 className="text-[#1E1E1E] mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedSizes.includes(size)
                        ? 'bg-[#FF3B30] text-white border-[#FF3B30]'
                        : 'bg-white text-[#1E1E1E] border-gray-300 hover:border-[#FF3B30]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h4 className="text-[#1E1E1E] mb-3">Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                      className="w-4 h-4 accent-[#FF3B30]"
                    />
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {(priceRanges.length > 0 || selectedSizes.length > 0 || selectedRatings.length > 0) && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 mb-3 border-2 border-[#FF3B30] text-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{products.length} Products</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30]"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found.</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={product.images[0]}
                      rating={product.rating}
                      category={product.category}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

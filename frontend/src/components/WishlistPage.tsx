import { useEffect } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { WishlistButton } from './WishlistButton';

export function WishlistPage() {
  const { wishlist, loading, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    refreshWishlist();
  }, []);

  const handleAddToCart = async (productId: string, defaultSize: string) => {
    try {
      await addToCart(productId, 1, defaultSize);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E1E1E] uppercase mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist?.products.length || 0} {wishlist?.products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Empty State */}
        {!wishlist?.products || wishlist.products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-md text-center">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-6" />
            <h3 className="text-[#1E1E1E] text-xl font-semibold mb-3">Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-8">
              Save your favorite items here and never lose track of what you love!
            </p>
            <Link
              to="/products/all"
              className="inline-block px-8 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all group"
              >
                {/* Product Image */}
                <Link to={`/product/${product._id}`} className="block relative">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Remove from Wishlist Button */}
                  <div className="absolute top-4 right-4">
                    <div className="p-2 bg-white rounded-full shadow-md">
                      <WishlistButton productId={product._id} />
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-[#1E1E1E] font-semibold mb-2 hover:text-[#FF3B30] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xl font-bold text-[#1E1E1E]">₹{product.price}</p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </p>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <span className="text-green-600 text-sm">In Stock</span>
                    ) : (
                      <span className="text-red-600 text-sm">Out of Stock</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {product.stock > 0 ? (
                      <>
                        <Link
                          to={`/product/${product._id}`}
                          className="flex-1 px-4 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors text-center text-sm font-medium"
                        >
                          View Details
                        </Link>
                        {product.sizes && product.sizes.length > 0 && (
                          <button
                            onClick={() => handleAddToCart(product._id, product.sizes[0])}
                            className="p-2 border-2 border-[#FF3B30] text-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition-colors"
                            title="Add to cart"
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlist?.products && wishlist.products.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/products/all"
              className="inline-block px-8 py-3 border-2 border-[#FF3B30] text-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

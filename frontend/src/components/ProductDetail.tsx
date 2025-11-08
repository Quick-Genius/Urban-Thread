import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Star, Truck, ShieldCheck, RefreshCw, Store, Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { WishlistButton } from './WishlistButton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import reviewService from '../services/reviewService';
import { ProductCard } from './ProductCard';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id!);
      setProduct(data.product);
      
      // Load related products from same category
      if (data.product.category) {
        const relatedData = await productService.getProductsByCategory(data.product.category);
        setRelatedProducts(relatedData.products.filter((p: any) => p._id !== id).slice(0, 3));
      }

      // Load reviews
      await loadReviews();
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await reviewService.getProductReviews(id!);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (!reviewComment.trim()) {
      alert('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview._id, {
          rating: reviewRating,
          comment: reviewComment,
        });
        alert('Review updated successfully!');
        setEditingReview(null);
      } else {
        await reviewService.createReview(id!, {
          rating: reviewRating,
          comment: reviewComment,
        });
        alert('Review submitted successfully!');
      }
      
      setReviewRating(5);
      setReviewComment('');
      await loadReviews();
      await loadProduct();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    // Scroll to review form
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewService.deleteReview(reviewId);
      alert('Review deleted successfully!');
      await loadReviews();
      await loadProduct();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const getUserReview = () => {
    return reviews.find((review) => review.user._id === user?.id);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity, selectedSize);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">Product Not Found</h2>
          <Link to="/products/all" className="text-[#FF3B30] hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-600 mb-8">
          <Link to="/" className="hover:text-[#FF3B30]">
            Home
          </Link>
          <span>/</span>
          <Link to={`/products/${product.category}`} className="hover:text-[#FF3B30] capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#1E1E1E]">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white shadow-lg"
            >
              <ImageWithFallback
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-[#FF3B30] shadow-lg'
                      : 'border-gray-200 hover:border-[#FF3B30]'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-[#1E1E1E] mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-[#FF3B30] text-[#FF3B30]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating || 0} ({product.numReviews || 0} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#1E1E1E]">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="bg-[#FF3B30] text-white px-3 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[#1E1E1E] mb-3">Select Size</h4>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'bg-[#FF3B30] text-white border-[#FF3B30]'
                          : 'bg-white text-[#1E1E1E] border-gray-300 hover:border-[#FF3B30]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h4 className="text-[#1E1E1E] mb-3">Quantity</h4>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#FF3B30] transition-colors"
                >
                  -
                </button>
                <span className="text-[#1E1E1E] w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#FF3B30] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FF3B30] text-white uppercase rounded-lg hover:bg-[#007AFF] transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <div className="p-4 border-2 border-gray-300 rounded-lg hover:border-[#FF3B30] transition-all">
                <WishlistButton productId={product._id} size="lg" />
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                <Truck className="w-6 h-6 text-[#FF3B30]" />
                <div>
                  <p className="text-[#1E1E1E]">Free Delivery</p>
                  <p className="text-gray-600">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                <RefreshCw className="w-6 h-6 text-[#FF3B30]" />
                <div>
                  <p className="text-[#1E1E1E]">Easy Returns</p>
                  <p className="text-gray-600">12 days return</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#FF3B30]" />
                <div>
                  <p className="text-[#1E1E1E]">Secure Payment</p>
                  <p className="text-gray-600">100% secure</p>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            {product.seller && (
             <div className="bg-white rounded-lg shadow-md mb-8 h-64 w-full p-4 flex flex-col justify-between h-64">

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#FF3B30] rounded-full flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#1E1E1E] font-semibold text-sm mb-1.5 leading-tight">
                      {product.seller.name || 'UrbanThread Seller'}
                    </h4>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#FF3B30] text-[#FF3B30]" />
                        <span className="font-semibold text-[#1E1E1E]">{product.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600">
                        <span className="font-semibold text-[#1E1E1E]">{product.sold || 0}</span> Sold
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {product.seller.email && (
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 mt-0.5" />
                        <span className="truncate leading-relaxed">{product.seller.email}</span>
                      </div>
                    )}
                    {product.seller.address ? (
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 mt-0.5" />
                        <span className="leading-relaxed line-clamp-2">{product.seller.address}</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 mt-0.5" />
                        <span className="leading-relaxed">Mumbai, Maharashtra, India</span>
                      </div>
                    )}
                  </div>
                  {product.seller.phone && (
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 mt-0.5" />
                      <span className="leading-relaxed">{product.seller.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 font-semibold">
                    {product.seller.bio || 'Trusted seller on UrbanThread'}
                  </p>
                </div>
              </div>
            )}

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="text-[#1E1E1E] mb-4">Product Features</h4>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-[#FF3B30] rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews and Ratings Section */}
        <div className="mb-16">
          <h2 className="uppercase text-[#1E1E1E] mb-6">Reviews & Ratings</h2>
          
          {/* Top Grid - Rating Summary and Write Review Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Review Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#1E1E1E] mb-2">
                    {product.rating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'fill-[#FF3B30] text-[#FF3B30]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{product.numReviews || 0} Reviews</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 mb-2">
                        <span className="text-gray-600 text-sm w-6">{star}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF3B30]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-600 text-sm w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Write Review Form */}
            <div>
              {/* Write Review Form */}
          {isAuthenticated ? (
            !getUserReview() || editingReview ? (
              <div id="review-form" className="bg-white rounded-2xl p-8 shadow-md mb-6">
                <h3 className="text-[#1E1E1E] text-lg font-semibold mb-4">
                  {editingReview ? 'Edit Your Review' : 'Write a Review'}
                </h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="text-[#1E1E1E] mb-2 block">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                              star <= reviewRating
                                ? 'fill-[#FF3B30] text-[#FF3B30]'
                                : 'text-gray-300 hover:text-[#FF3B30]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-[#1E1E1E] mb-2 block">Your Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors disabled:bg-gray-300"
                    >
                      {submittingReview ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                    </button>
                    {editingReview && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReview(null);
                          setReviewRating(5);
                          setReviewComment('');
                        }}
                        className="px-6 py-3 border-2 border-gray-300 text-[#1E1E1E] rounded-lg hover:border-[#FF3B30] transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                <p className="text-blue-800">
                  You have already reviewed this product. You can edit or delete your review below.
                </p>
              </div>
            )
          ) : (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 mb-6 text-center">
              <p className="text-gray-600 mb-4">Please sign in to write a review</p>
              <Link
                to="/signin"
                className="inline-block px-6 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
            </div>
          </div>

          {/* Reviews List - Full Width Below */}
          <div>
            <h3 className="text-[#1E1E1E] text-lg font-semibold mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-md text-center">
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="bg-white rounded-2xl p-6 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FF3B30] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {review.user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-[#1E1E1E] font-semibold">{review.user.name}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-[#FF3B30] text-[#FF3B30]'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-500 text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {user?.id === review.user._id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-2 text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit review"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="uppercase text-[#1E1E1E] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div key={relatedProduct._id} whileHover={{ y: -5 }}>
                  <ProductCard
                    id={relatedProduct._id}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    image={relatedProduct.images[0]}
                    rating={relatedProduct.rating}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

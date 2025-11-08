import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, loading } = useCart();
  const [promoCode, setPromoCode] = useState('');

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-6" />
          <h2 className="text-[#1E1E1E] mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some awesome products to your cart!</p>
          <Link
            to="/products/all"
            className="inline-block px-8 py-4 bg-[#FF3B30] text-white uppercase rounded-lg hover:bg-[#007AFF] transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="uppercase text-[#1E1E1E] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-6">
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-[#1E1E1E]">{item.product.name}</h3>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-gray-400 hover:text-[#FF3B30] transition-colors"
                        disabled={loading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-4">Size: {item.size}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-[#FF3B30] transition-colors flex items-center justify-center disabled:opacity-50"
                          disabled={loading}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-[#1E1E1E] w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-[#FF3B30] transition-colors flex items-center justify-center disabled:opacity-50"
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[#1E1E1E]">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              <h3 className="text-[#1E1E1E] uppercase mb-6">Order Summary</h3>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-[#1E1E1E] mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-[#1E1E1E] text-white rounded-lg hover:bg-[#FF3B30] transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#1E1E1E]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-[#1E1E1E]">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#FF3B30]">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                {subtotal < 999 && (
                  <p className="text-gray-600">
                    Add ₹{999 - subtotal} more for FREE shipping!
                  </p>
                )}
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#1E1E1E]">Total</span>
                  <span className="text-[#1E1E1E]">₹{total}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full px-6 py-4 bg-[#FF3B30] text-white uppercase text-center rounded-lg hover:bg-[#007AFF] transition-all shadow-lg"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products/all"
                className="block w-full px-6 py-3 text-[#1E1E1E] text-center rounded-lg hover:bg-gray-100 transition-all mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Plus, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import addressService from '../services/addressService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  
  // Address form state
  const [address, setAddress] = useState({
    name: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  useEffect(() => {
    loadSavedAddresses();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setSavedAddresses(data.addresses || []);
      // Auto-select default address or first address
      if (data.addresses && data.addresses.length > 0) {
        const defaultAddr = data.addresses.find((addr: any) => addr.isDefault);
        setSelectedAddressId(defaultAddr?._id || data.addresses[0]._id);
      } else {
        setShowNewAddressForm(true);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setShowNewAddressForm(true);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const getSelectedAddress = () => {
    return savedAddresses.find(addr => addr._id === selectedAddressId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      let shippingAddress;

      // Use selected saved address or new address
      if (selectedAddressId && !showNewAddressForm) {
        const selectedAddr = getSelectedAddress();
        if (!selectedAddr) {
          alert('Please select a delivery address');
          setSubmitting(false);
          return;
        }
        shippingAddress = {
          fullName: selectedAddr.fullName,
          phone: selectedAddr.phone,
          addressLine1: selectedAddr.addressLine1,
          addressLine2: selectedAddr.addressLine2 || '',
          city: selectedAddr.city,
          state: selectedAddr.state,
          pinCode: selectedAddr.pinCode,
        };
      } else {
        // Validate new address form
        if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pinCode) {
          alert('Please fill in all required address fields');
          setSubmitting(false);
          return;
        }
        // Save new address first
        await addressService.createAddress(address);
        shippingAddress = {
          fullName: address.fullName,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || '',
          city: address.city,
          state: address.state,
          pinCode: address.pinCode,
        };
      }

      // Create order
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
        })),
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCost: shipping,
        discount,
        total,
      };

      await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear cart
      await clearCart();
      
      alert('Order placed successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Order failed:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="uppercase text-[#1E1E1E] mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#1E1E1E] uppercase">Delivery Address</h3>
                {!showNewAddressForm && savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-[#FF3B30] border-2 border-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                )}
              </div>

              {loadingAddresses ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading addresses...</p>
                </div>
              ) : showNewAddressForm ? (
                <>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="mb-4 text-[#FF3B30] hover:underline"
                    >
                      ← Use saved address
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">Address Label</label>
                      <input
                        type="text"
                        name="name"
                        value={address.name}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="Home, Office, etc."
                      />
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="+91 1234567890"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[#1E1E1E] mb-2 block">Address Line 1</label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={address.addressLine1}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="House No., Building Name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[#1E1E1E] mb-2 block">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={address.addressLine2}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="Road Name, Area, Colony"
                      />
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">City</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">State</label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">PIN Code</label>
                      <input
                        type="text"
                        name="pinCode"
                        value={address.pinCode}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === addr._id
                          ? 'border-[#FF3B30] bg-[#FF3B30]/5'
                          : 'border-gray-300 hover:border-[#FF3B30]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1 w-5 h-5 accent-[#FF3B30]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-[#FF3B30]" />
                          <span className="font-semibold text-[#1E1E1E]">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-[#FF3B30] text-white text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[#1E1E1E] font-medium">{addr.fullName}</p>
                        <p className="text-gray-600 text-sm">{addr.addressLine1}</p>
                        {addr.addressLine2 && (
                          <p className="text-gray-600 text-sm">{addr.addressLine2}</p>
                        )}
                        <p className="text-gray-600 text-sm">
                          {addr.city}, {addr.state} - {addr.pinCode}
                        </p>
                        <p className="text-gray-600 text-sm">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-[#1E1E1E] uppercase mb-6">Payment Method</h3>
              <div className="space-y-4">
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#FF3B30] bg-[#FF3B30]/5'
                      : 'border-gray-300 hover:border-[#FF3B30]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-5 h-5 accent-[#FF3B30]"
                  />
                  <CreditCard className="w-6 h-6 text-[#1E1E1E]" />
                  <span className="text-[#1E1E1E]">Credit / Debit Card</span>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#FF3B30] bg-[#FF3B30]/5'
                      : 'border-gray-300 hover:border-[#FF3B30]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="w-5 h-5 accent-[#FF3B30]"
                  />
                  <Wallet className="w-6 h-6 text-[#1E1E1E]" />
                  <span className="text-[#1E1E1E]">UPI / Wallets</span>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#FF3B30] bg-[#FF3B30]/5'
                      : 'border-gray-300 hover:border-[#FF3B30]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-5 h-5 accent-[#FF3B30]"
                  />
                  <span className="text-[#1E1E1E]">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-[#1E1E1E] mb-2 block">Card Number</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">Expiry Date</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">CVV</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="mt-6">
                  <label className="text-[#1E1E1E] mb-2 block">UPI ID</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                    placeholder="yourname@upi"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              <h3 className="text-[#1E1E1E] uppercase mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#1E1E1E]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-[#1E1E1E]">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-[#FF3B30]">-₹{discount}</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#1E1E1E] font-bold">Total</span>
                  <span className="text-[#1E1E1E] font-bold">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Link
                    to="/products/all"
                    className="block w-full px-6 py-4 bg-[#FF3B30] text-white uppercase text-center rounded-lg hover:bg-[#007AFF] transition-all shadow-lg"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="block w-full px-6 py-4 bg-[#FF3B30] text-white uppercase text-center rounded-lg hover:bg-[#007AFF] transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </button>
              )}

              <Link
                to="/cart"
                className="block w-full px-6 py-3 text-[#1E1E1E] text-center rounded-lg hover:bg-gray-100 transition-all mt-4"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

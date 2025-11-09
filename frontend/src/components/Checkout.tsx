import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Plus, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import addressService from '../services/addressService';
import paymentService from '../services/paymentService';
import api from '../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [submitting, setSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [checkingFirstOrder, setCheckingFirstOrder] = useState(true);
  
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
  const baseShipping = subtotal > 999 ? 0 : 99;
  const shipping = promoApplied ? 0 : baseShipping;
  const discount = 0;
  const total = subtotal + shipping - discount;

  useEffect(() => {
    loadSavedAddresses();
    loadRazorpayScript();
    checkIfFirstOrder();
  }, []);

  const checkIfFirstOrder = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      const orders = response.data.orders || [];
      
      // Check if user has any completed orders
      const hasCompletedOrders = orders.some((order: any) => 
        order.paymentStatus === 'paid' || order.status === 'delivered'
      );
      
      if (!hasCompletedOrders && orders.length === 0) {
        setIsFirstOrder(true);
        // Auto-apply first order promo
        setPromoCode('FIRST2024');
        setPromoApplied(true);
      }
    } catch (error) {
      console.error('Failed to check order history:', error);
    } finally {
      setCheckingFirstOrder(false);
    }
  };

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  };

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

  const handleApplyPromo = () => {
    const validPromoCodes = ['FREESHIP', 'FREESHIP2024', 'NODELIVERY', 'FIRST2024'];
    
    if (validPromoCodes.includes(promoCode.toUpperCase())) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
  };

  const getSelectedAddress = () => {
    return savedAddresses.find(addr => addr._id === selectedAddressId);
  };

  const handleRazorpayPayment = async (orderData: any, orderId: string) => {
    try {
      // Create Razorpay order
      const { order: razorpayOrder } = await paymentService.createRazorpayOrder(total);
      const razorpayKey = await paymentService.getRazorpayKey();

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'UrbanThread',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            // Clear cart
            await clearCart();
            alert('Payment successful! Order placed.');
            navigate('/dashboard');
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: orderData.shippingAddress.fullName,
          contact: orderData.shippingAddress.phone,
        },
        theme: {
          color: '#FF3B30',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        alert('Payment failed: ' + response.error.description);
        setSubmitting(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      alert('Failed to initiate payment');
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (paymentMethod === 'razorpay' && !razorpayLoaded) {
      alert('Payment system is loading. Please try again.');
      return;
    }

    setSubmitting(true);
    try {
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

      const response = await api.post('/orders', orderData);
      const orderId = response.data.order._id;

      // Handle payment based on method
      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(orderData, orderId);
      } else if (paymentMethod === 'cod') {
        // Clear cart for COD
        await clearCart();
        alert('Order placed successfully! Pay on delivery.');
        navigate('/dashboard');
        setSubmitting(false);
      }
    } catch (error: any) {
      console.error('Order failed:', error);
      alert(error.response?.data?.message || 'Failed to place order');
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
                    paymentMethod === 'razorpay'
                      ? 'border-[#FF3B30] bg-[#FF3B30]/5'
                      : 'border-gray-300 hover:border-[#FF3B30]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="w-5 h-5 accent-[#FF3B30]"
                  />
                  <CreditCard className="w-6 h-6 text-[#1E1E1E]" />
                  <div className="flex-1">
                    <div className="text-[#1E1E1E] font-semibold">Pay Online</div>
                    <div className="text-sm text-gray-600">Cards, UPI, Wallets & More</div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Recommended
                  </span>
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
                  <Wallet className="w-6 h-6 text-[#1E1E1E]" />
                  <span className="text-[#1E1E1E]">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'razorpay' && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Secure Payment:</strong> You will be redirected to Razorpay's secure payment gateway to complete your transaction.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white text-xs rounded border">💳 Cards</span>
                    <span className="px-2 py-1 bg-white text-xs rounded border">📱 UPI</span>
                    <span className="px-2 py-1 bg-white text-xs rounded border">👛 Wallets</span>
                    <span className="px-2 py-1 bg-white text-xs rounded border">🏦 Net Banking</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Please keep exact change ready. COD orders may take longer to process.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              <h3 className="text-[#1E1E1E] uppercase mb-6">Order Summary</h3>

              {/* First Order Banner */}
              {isFirstOrder && !checkingFirstOrder && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[#FF3B30] to-[#FF6B30] rounded-lg text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🎉</span>
                    <h4 className="font-bold text-lg">First Order Special!</h4>
                  </div>
                  <p className="text-sm mb-2">
                    Welcome! Enjoy FREE delivery on your first order with code <strong>FIRST2024</strong>
                  </p>
                  <p className="text-xs opacity-90">
                    Already applied to your order ✓
                  </p>
                </div>
              )}

              {/* Promo Code Section */}
              <div className="mb-6">
                <label className="text-[#1E1E1E] font-semibold mb-2 block">Promo Code</label>
                {promoApplied ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border-2 border-green-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-700 font-semibold">{promoCode.toUpperCase()}</span>
                      <span className="text-green-600 text-sm">✓ Applied</span>
                      {isFirstOrder && promoCode.toUpperCase() === 'FIRST2024' && (
                        <span className="px-2 py-0.5 bg-[#FF3B30] text-white text-xs rounded-full">
                          First Order
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError('');
                        }}
                        placeholder="Enter promo code"
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={!promoCode.trim()}
                        className="px-6 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-600 text-sm">{promoError}</p>
                    )}
                    <p className="text-gray-500 text-xs">
                      {isFirstOrder ? 'Use FIRST2024 for free delivery on your first order' : 'Try: FREESHIP for free delivery'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#1E1E1E]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <div className="text-right">
                    {promoApplied && baseShipping > 0 ? (
                      <>
                        <span className="text-gray-400 line-through mr-2">₹{baseShipping}</span>
                        <span className="text-green-600 font-semibold">FREE</span>
                      </>
                    ) : (
                      <span className="text-[#1E1E1E]">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-[#FF3B30]">-₹{discount}</span>
                </div>
                {promoApplied && baseShipping > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Promo Savings</span>
                    <span className="font-semibold">-₹{baseShipping}</span>
                  </div>
                )}
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

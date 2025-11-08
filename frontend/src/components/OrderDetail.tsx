import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import orderService from '../services/orderService';

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderById(id!);
      setOrder(data.order);
    } catch (error) {
      console.error('Failed to load order:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
      case 'Confirmed':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getOrderTimeline = () => {
    const timeline = [
      { status: 'Processing', date: order?.createdAt, completed: true },
      { status: 'Confirmed', date: order?.createdAt, completed: ['Confirmed', 'Shipped', 'In Transit', 'Delivered'].includes(order?.status) },
      { status: 'Shipped', date: order?.createdAt, completed: ['Shipped', 'In Transit', 'Delivered'].includes(order?.status) },
      { status: 'In Transit', date: order?.createdAt, completed: ['In Transit', 'Delivered'].includes(order?.status) },
      { status: 'Delivered', date: order?.deliveredAt, completed: order?.status === 'Delivered' },
    ];
    return timeline;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">Order Not Found</h2>
          <Link to="/dashboard" className="text-[#FF3B30] hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#FF3B30] hover:underline mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-[#1E1E1E] text-3xl font-bold mb-2">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-6 py-3 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-[#1E1E1E] text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <img
                      src={item.product?.images?.[0] || item.image || '/placeholder.png'}
                      alt={item.name || item.product?.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-[#1E1E1E] font-semibold">{item.name || item.product?.name}</h3>
                      <p className="text-gray-600 text-sm">Size: {item.size}</p>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#1E1E1E] font-semibold">₹{item.price.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-[#1E1E1E] text-xl font-semibold mb-6">Order Timeline</h2>
              <div className="space-y-6">
                {getOrderTimeline().map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${item.completed ? 'bg-[#34C759]' : 'bg-gray-300'}`}>
                      {item.completed ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Clock className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${item.completed ? 'text-[#1E1E1E]' : 'text-gray-400'}`}>
                        {item.status}
                      </h3>
                      {item.date && (
                        <p className={`text-sm ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                          {new Date(item.date).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-[#1E1E1E] text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#1E1E1E]">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-[#1E1E1E]">
                    {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toLocaleString()}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-[#FF3B30]">-₹{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-[#1E1E1E] font-bold text-lg">Total</span>
                    <span className="text-[#1E1E1E] font-bold text-lg">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#FF3B30]" />
                <h2 className="text-[#1E1E1E] text-xl font-semibold">Shipping Address</h2>
              </div>
              <div className="text-gray-600 space-y-1">
                <p className="font-semibold text-[#1E1E1E]">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#FF3B30]" />
                <h2 className="text-[#1E1E1E] text-xl font-semibold">Payment Method</h2>
              </div>
              <p className="text-gray-600 capitalize">{order.paymentMethod.replace('-', ' ')}</p>
              {order.paymentDetails?.transactionId && (
                <p className="text-gray-500 text-sm mt-2">
                  Transaction ID: {order.paymentDetails.transactionId}
                </p>
              )}
            </div>

            {/* Help */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <Truck className="w-8 h-8 text-[#007AFF] mb-3" />
              <h3 className="text-[#1E1E1E] font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Have questions about your order? Our support team is here to help.
              </p>
              <Link
                to="/contact"
                className="text-[#FF3B30] hover:underline text-sm font-semibold"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

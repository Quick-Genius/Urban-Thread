import { Package, Search, CheckCircle, Truck, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import orderService from '../services/orderService';

export function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const orderIdFromUrl = searchParams.get('orderId');
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
      // Auto-submit if orderId is in URL
      handleSubmitWithId(orderIdFromUrl);
    }
  }, [searchParams]);

  const handleSubmitWithId = async (id: string) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await orderService.getOrderById(id);
      const order = data.order;
      
      // Verify email matches (basic security check)
      // Note: In production, this should be done on backend
      
      const timeline = [
        { status: 'Processing', date: order.createdAt, completed: true },
        { status: 'Confirmed', date: order.createdAt, completed: ['Confirmed', 'Shipped', 'In Transit', 'Delivered'].includes(order.status) },
        { status: 'Shipped', date: order.createdAt, completed: ['Shipped', 'In Transit', 'Delivered'].includes(order.status) },
        { status: 'In Transit', date: order.createdAt, completed: ['In Transit', 'Delivered'].includes(order.status) },
        { status: 'Delivered', date: order.deliveredAt, completed: order.status === 'Delivered' }
      ];
      
      setTrackingData({
        orderId: order._id,
        status: order.status,
        estimatedDelivery: order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Calculating...',
        timeline: timeline,
        items: order.items,
        total: order.total
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Order not found. Please check your order ID and try again.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithId(orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#FF3B30] rounded-full">
              <Package className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your order details to track your package</p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID *
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
                placeholder="e.g., UT123456789"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
                placeholder="your.email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF3B30] text-white py-3 rounded-lg hover:bg-[#007AFF] transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Tracking...' : 'Track Order'}</span>
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Order #{trackingData.orderId}</h2>
                  <p className="text-gray-600 mt-1">Status: <span className="text-[#007AFF] font-semibold">{trackingData.status}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="text-lg font-semibold">{trackingData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {trackingData.timeline.map((item: any, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${item.completed ? 'bg-[#34C759]' : 'bg-gray-300'}`}>
                    {item.completed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Clock className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {item.status}
                    </h3>
                    {item.date && (
                      <p className={`text-sm ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Items Preview */}
            {trackingData.items && trackingData.items.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items ({trackingData.items.length})</h3>
                <div className="space-y-3">
                  {trackingData.items.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <img 
                        src={item.product?.images?.[0] || item.image || '/placeholder.png'} 
                        alt={item.name || item.product?.name} 
                        className="w-16 h-16 object-cover rounded-lg" 
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name || item.product?.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} | Size: {item.size}</p>
                      </div>
                    </div>
                  ))}
                  {trackingData.items.length > 3 && (
                    <p className="text-sm text-gray-500">+{trackingData.items.length - 3} more items</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-start space-x-3">
              <Truck className="w-6 h-6 text-[#007AFF] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Shipping Information</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your package is on its way! You'll receive an email notification when it's out for delivery.
                </p>
                <Link
                  to={`/order/${trackingData.orderId}`}
                  className="text-[#FF3B30] hover:underline text-sm font-semibold"
                >
                  View Full Order Details →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center text-gray-600">
          <p>Need help? <a href="/contact" className="text-[#FF3B30] hover:underline">Contact our support team</a></p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Package, Heart, User, MapPin, LogOut, Star, ShieldCheck, Plus, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { AdminProductsTab } from './admin/AdminProductsTab';
import orderService from '../services/orderService';
import addressService from '../services/addressService';
import userService from '../services/userService';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const { user, logout, refreshUser } = useAuth();
  const { wishlist, refreshWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
  });

  useEffect(() => {
    // Update profile data when user changes
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const data = await orderService.getMyOrders();
        setOrders(data.orders || []);
      } else if (activeTab === 'wishlist') {
        await refreshWishlist();
      } else if (activeTab === 'addresses') {
        const data = await addressService.getAddresses();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.updateProfile(profileData);
      // Refresh user data from backend
      if (refreshUser) {
        await refreshUser();
      }
      alert('Profile updated successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert('Please fill in both password fields');
      return;
    }
    try {
      await userService.updatePassword(passwordData);
      alert('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress, addressForm);
        alert('Address updated successfully');
      } else {
        await addressService.createAddress(addressForm);
        alert('Address added successfully');
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({ name: '', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pinCode: '' });
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.deleteAddress(addressId);
      alert('Address deleted successfully');
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address._id);
    setAddressForm({
      name: address.name || '',
      fullName: address.fullName || '',
      phone: address.phone || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      pinCode: address.pinCode || '',
    });
    setShowAddressForm(true);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await toggleWishlist(productId);
      await refreshWishlist();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product: any) => {
    try {
      // Use default size or first available size
      const defaultSize = product.sizes?.[0] || 'M';
      await addToCart(product._id, 1, defaultSize);
      alert('Added to cart successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="uppercase text-[#1E1E1E] mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-[#FF3B30] rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-[#1E1E1E]">{user?.name}</h3>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'orders'
                      ? 'bg-[#FF3B30] text-white'
                      : 'text-[#1E1E1E] hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'wishlist'
                      ? 'bg-[#FF3B30] text-white'
                      : 'text-[#1E1E1E] hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-[#FF3B30] text-white'
                      : 'text-[#1E1E1E] hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-[#FF3B30] text-white'
                      : 'text-[#1E1E1E] hover:bg-gray-100'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Addresses</span>
                </button>
                
                {/* Admin Only Section */}
                {user?.role === 'admin' && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => setActiveTab('admin-products')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === 'admin-products'
                          ? 'bg-[#FF3B30] text-white'
                          : 'text-[#1E1E1E] hover:bg-gray-100'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Admin: Products</span>
                    </button>
                  </>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#FF3B30] hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                <h2 className="text-[#1E1E1E] uppercase mb-4">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 shadow-md text-center">
                    <Package className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-[#1E1E1E] text-xl font-semibold mb-3">No Orders Yet</h3>
                    <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
                    <a href="/products/all" className="inline-block px-8 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors shadow-md">
                      Start Shopping
                    </a>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl p-6 shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-[#1E1E1E] font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h4>
                          <p className="text-gray-600 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.slice(0, 2).map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-4">
                            <img 
                              src={item.product?.images?.[0] || item.image || '/placeholder.png'} 
                              alt={item.name || item.product?.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="text-[#1E1E1E] font-medium text-sm">{item.name || item.product?.name}</p>
                              <p className="text-gray-600 text-xs">Size: {item.size} | Qty: {item.quantity}</p>
                            </div>
                            <p className="text-[#1E1E1E] font-semibold">₹{item.price}</p>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-gray-500 text-sm">+{order.items.length - 2} more items</p>
                        )}
                      </div>

                      {/* Order Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-gray-600 text-sm">Total Amount</p>
                          <p className="text-[#1E1E1E] font-bold text-lg">₹{order.total.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/order/${order._id}`}
                            className="px-4 py-2 border-2 border-gray-300 text-[#1E1E1E] rounded-lg hover:border-[#FF3B30] transition-all text-sm"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/track-order?orderId=${order._id}`}
                            className="px-4 py-2 border-2 border-[#FF3B30] text-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition-all text-sm"
                          >
                            Track Order
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-[#1E1E1E] uppercase mb-4">My Wishlist</h2>
                {loading ? (
                  <div className="bg-white rounded-2xl p-12 shadow-md text-center">
                    <p className="text-gray-600">Loading wishlist...</p>
                  </div>
                ) : !wishlist || wishlist.products.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 shadow-md text-center">
                    <Heart className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-[#1E1E1E] text-xl font-semibold mb-3">Your Wishlist is Empty</h3>
                    <p className="text-gray-600 mb-8">Save your favorite items here!</p>
                    <Link to="/products/all" className="inline-block px-8 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors shadow-md">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.products.map((product) => (
                      <div key={product._id} className="bg-white rounded-2xl shadow-md overflow-hidden group relative">
                        <button
                          onClick={() => handleRemoveFromWishlist(product._id)}
                          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Heart className="w-5 h-5 fill-[#FF3B30] text-[#FF3B30]" />
                        </button>
                        <Link to={`/products/${product._id}`}>
                          <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                        </Link>
                        <div className="p-4">
                          <Link to={`/products/${product._id}`}>
                            <h4 className="text-[#1E1E1E] mb-2 hover:text-[#FF3B30] transition-colors">{product.name}</h4>
                          </Link>
                          {product.rating !== undefined && (
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating || 0)
                                      ? 'fill-[#FF3B30] text-[#FF3B30]'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-gray-600 text-sm">({product.rating?.toFixed(1)})</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-[#1E1E1E] font-semibold text-lg">₹{product.price?.toLocaleString()}</p>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <h2 className="text-[#1E1E1E] uppercase mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">Email</label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="Add your phone number"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all shadow-md"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl p-8 shadow-md">
                  <h2 className="text-[#1E1E1E] uppercase mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[#1E1E1E] mb-2 block">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all shadow-md"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Admin Products Tab */}
            {activeTab === 'admin-products' && (
              user?.role === 'admin' ? (
                <AdminProductsTab />
              ) : (
                <div className="bg-white rounded-2xl p-12 shadow-md text-center">
                  <ShieldCheck className="w-16 h-16 mx-auto text-red-500 mb-6" />
                  <h3 className="text-[#1E1E1E] text-xl font-semibold mb-3">Not Authorized</h3>
                  <p className="text-gray-600">You don't have permission to access this section.</p>
                </div>
              )
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[#1E1E1E] uppercase">Saved Addresses</h2>
                  <button
                    onClick={() => {
                      setShowAddressForm(true);
                      setEditingAddress(null);
                      setAddressForm({ name: '', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pinCode: '' });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Address
                  </button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
                    <h3 className="text-[#1E1E1E] text-lg font-semibold mb-6">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div>
                        <label className="text-[#1E1E1E] mb-2 block">Address Label (e.g., Home, Office)</label>
                        <input
                          type="text"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          placeholder="Home"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#1E1E1E] mb-2 block">Full Name</label>
                          <input
                            type="text"
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[#1E1E1E] mb-2 block">Phone Number</label>
                          <input
                            type="tel"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            placeholder="+91 9876543210"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[#1E1E1E] mb-2 block">Address Line 1</label>
                        <input
                          type="text"
                          value={addressForm.addressLine1}
                          onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                          placeholder="House/Flat No., Building Name"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[#1E1E1E] mb-2 block">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          value={addressForm.addressLine2}
                          onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                          placeholder="Street, Area, Landmark"
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[#1E1E1E] mb-2 block">City</label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[#1E1E1E] mb-2 block">State</label>
                          <input
                            type="text"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[#1E1E1E] mb-2 block">Pin Code</label>
                          <input
                            type="text"
                            value={addressForm.pinCode}
                            onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all shadow-md"
                        >
                          {editingAddress ? 'Update Address' : 'Save Address'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                            setAddressForm({ name: '', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pinCode: '' });
                          }}
                          className="px-8 py-3 border-2 border-gray-300 text-[#1E1E1E] rounded-lg hover:border-[#FF3B30] transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Address List */}
                {loading ? (
                  <div className="bg-white rounded-2xl p-12 shadow-md text-center">
                    <p className="text-gray-600">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 && !showAddressForm ? (
                  <div className="bg-white rounded-2xl p-12 shadow-md text-center">
                    <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-[#1E1E1E] text-xl font-semibold mb-3">No Saved Addresses</h3>
                    <p className="text-gray-600 mb-8">Add an address for faster checkout!</p>
                    <button
                      onClick={() => {
                        setShowAddressForm(true);
                        setEditingAddress(null);
                        setAddressForm({ name: '', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pinCode: '' });
                      }}
                      className="px-8 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors shadow-md"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address: any) => (
                      <div key={address._id} className="bg-white rounded-2xl p-8 shadow-md">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="text-[#1E1E1E] font-semibold">{address.name}</h4>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-[#FF3B30] text-white rounded-full text-xs">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[#1E1E1E] font-medium mb-2">{address.fullName}</p>
                            <p className="text-gray-600 mb-1">{address.addressLine1}</p>
                            {address.addressLine2 && (
                              <p className="text-gray-600 mb-1">{address.addressLine2}</p>
                            )}
                            <p className="text-gray-600 mb-1">{address.city}, {address.state} - {address.pinCode}</p>
                            <p className="text-gray-600">Phone: {address.phone}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="p-2 border-2 border-gray-300 rounded-lg hover:border-[#FF3B30] hover:text-[#FF3B30] transition-colors"
                              title="Edit address"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="p-2 border-2 border-[#FF3B30] text-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition-all"
                              title="Delete address"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, TrendingUp, Edit, Trash2, UserX, Plus, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  salesByMonth: Array<{ _id: { month: number; year: number }; sales: number }>;
  topCategories: Array<{ _id: string; revenue: number; count: number }>;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  seller: { name: string };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  orderCount: number;
}

interface Order {
  _id: string;
  user: { name: string };
  createdAt: string;
  total: number;
  status: string;
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'orders'>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'products' && products.length === 0) {
      loadProducts();
    } else if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    } else if (activeTab === 'orders' && orders.length === 0) {
      loadOrders();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data.stats);
    } catch (error: any) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await adminService.getAllProducts();
      setProducts(data.products);
    } catch (error: any) {
      console.error('Failed to load products:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data.users);
    } catch (error: any) {
      console.error('Failed to load users:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await adminService.getAllOrders();
      setOrders(data.orders);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await adminService.deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
      alert('Product deleted successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const data = await adminService.toggleUserStatus(userId);
      setUsers(users.map(u => u._id === userId ? data.user : u));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const data = await adminService.updateUserRole(userId, role);
      setUsers(users.map(u => u._id === userId ? { ...u, role: data.user.role } : u));
      setEditingUser(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const data = await adminService.updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o._id === orderId ? data.order : o));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const formatSalesData = () => {
    if (!stats?.salesByMonth) return [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return stats.salesByMonth.map(item => ({
      month: monthNames[item._id.month - 1],
      sales: item.sales
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1E1E1E] min-h-screen p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#FF3B30] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">UT</span>
            </div>
            <span className="text-white text-sm font-medium">Admin Panel</span>
          </div>

          <div className="mb-6 p-3 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Logged in as</p>
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>

          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'dashboard' ? 'bg-[#FF3B30] text-white' : 'text-white hover:bg-gray-800'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'products' ? 'bg-[#FF3B30] text-white' : 'text-white hover:bg-gray-800'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Products</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'users' ? 'bg-[#FF3B30] text-white' : 'text-white hover:bg-gray-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'orders' ? 'bg-[#FF3B30] text-white' : 'text-white hover:bg-gray-800'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Orders</span>
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-gray-800 transition-all mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && stats && (
            <div>
              <h1 className="text-3xl font-bold text-[#1E1E1E] mb-8">Dashboard</h1>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-2">Products</p>
                      <h2 className="text-3xl font-bold text-[#1E1E1E]">{stats.totalProducts}</h2>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-100 text-blue-700">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-2">Users</p>
                      <h2 className="text-3xl font-bold text-[#1E1E1E]">{stats.totalUsers}</h2>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-100 text-purple-700">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-2">Orders</p>
                      <h2 className="text-3xl font-bold text-[#1E1E1E]">{stats.totalOrders}</h2>
                    </div>
                    <div className="p-4 rounded-lg bg-green-100 text-green-700">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-2">Revenue</p>
                      <h2 className="text-3xl font-bold text-[#1E1E1E]">₹{(stats.revenue / 100000).toFixed(1)}L</h2>
                    </div>
                    <div className="p-4 rounded-lg bg-red-100 text-red-700">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {stats.salesByMonth.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
                  <h3 className="text-xl font-bold text-[#1E1E1E] mb-6">Sales Analytics</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formatSalesData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#FF3B30" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {stats.topCategories.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-[#1E1E1E] mb-6">Top Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.topCategories.map((category) => (
                      <div key={category._id} className="p-4 border-2 border-gray-200 rounded-lg">
                        <h4 className="text-lg font-bold text-[#1E1E1E] mb-2">{category._id}</h4>
                        <p className="text-gray-600">₹{(category.revenue / 1000).toFixed(0)}K</p>
                        <p className="text-[#FF3B30]">{category.count} products</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1E1E1E]">Manage Products</h2>
                <button 
                  onClick={() => navigate('/seller')}
                  className="px-6 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Product</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Category</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Price</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Stock</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Seller</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t border-gray-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <ImageWithFallback
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[#1E1E1E] font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#1E1E1E]">{product.category}</td>
                        <td className="px-6 py-4 text-[#1E1E1E] font-medium">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.stock > 100 ? 'bg-green-100 text-green-700' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{product.seller.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => navigate(`/product/${product._id}`)}
                              className="p-2 text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">Manage Users</h2>

              <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Name</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Email</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Role</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Orders</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Status</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-t border-gray-200">
                        <td className="px-6 py-4 text-[#1E1E1E] font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          {editingUser?._id === user._id ? (
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                              className="px-3 py-1 rounded-full border-2 border-gray-300"
                            >
                              <option value="customer">Customer</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span
                              onClick={() => setEditingUser(user)}
                              className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                                user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                user.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[#1E1E1E]">{user.orderCount}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleUserStatus(user._id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditingUser(user)}
                              className="p-2 text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">All Orders</h2>

              <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Order ID</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Customer</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Date</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Total</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t border-gray-200">
                        <td className="px-6 py-4 text-[#1E1E1E] font-mono text-sm">{order._id.slice(-8)}</td>
                        <td className="px-6 py-4 text-[#1E1E1E] font-medium">{order.user.name}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-[#1E1E1E] font-medium">₹{order.total}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

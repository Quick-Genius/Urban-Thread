import { useState } from 'react';
import { Plus, Edit, Trash2, Package, DollarSign, BarChart3 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function SellerCenter() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'listings' | 'sales'>('dashboard');

  const products = [
    {
      id: 1,
      name: 'Marvel Avengers Graphic Tee',
      price: 899,
      stock: 45,
      sold: 234,
      revenue: 210066,
      image: 'https://images.unsplash.com/photo-1643387848945-da63387848945-da63360662f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2MjExMzQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      name: 'Urban Streetwear Jacket',
      price: 1999,
      stock: 23,
      sold: 156,
      revenue: 311844,
      image: 'https://images.unsplash.com/photo-1716827172706-9f4c36b039eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBjbG90aGluZyUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NjIxOTc3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const stats = [
    { label: 'Total Products', value: '24', icon: Package, color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Sales', value: '₹5.2L', icon: DollarSign, color: 'bg-green-100 text-green-700' },
    { label: 'Orders', value: '347', icon: BarChart3, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1E1E1E] min-h-screen p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#FF3B30] rounded-lg flex items-center justify-center">
              <span className="text-white uppercase tracking-wider">UT</span>
            </div>
            <span className="text-white uppercase tracking-wider">Seller Center</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#FF3B30] text-white'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'add'
                  ? 'bg-[#FF3B30] text-white'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'listings'
                  ? 'bg-[#FF3B30] text-white'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>My Listings</span>
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'sales'
                  ? 'bg-[#FF3B30] text-white'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Sales</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="uppercase text-[#1E1E1E] mb-8">Seller Dashboard</h1>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 mb-2">{stat.label}</p>
                        <h2 className="text-[#1E1E1E]">{stat.value}</h2>
                      </div>
                      <div className={`p-4 rounded-lg ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Products */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-[#1E1E1E] uppercase mb-6">Top Performing Products</h3>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#1E1E1E]">{product.name}</h4>
                        <p className="text-gray-600">₹{product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Sold: {product.sold}</p>
                        <p className="text-[#FF3B30]">₹{product.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add Product Tab */}
          {activeTab === 'add' && (
            <div className="bg-white rounded-2xl p-6 shadow-md max-w-3xl">
              <h2 className="text-[#1E1E1E] uppercase mb-6">Add New Product</h2>
              <form className="space-y-6">
                <div>
                  <label className="text-[#1E1E1E] mb-2 block">Product Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                    placeholder="e.g., Marvel Graphic Tee"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#1E1E1E] mb-2 block">Category</label>
                    <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none">
                      <option>Men</option>
                      <option>Women</option>
                      <option>Kids</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#1E1E1E] mb-2 block">Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                      placeholder="899"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1E1E1E] mb-2 block">Description</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                    placeholder="Product description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#1E1E1E] mb-2 block">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="text-[#1E1E1E] mb-2 block">Available Sizes</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                      placeholder="S, M, L, XL"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1E1E1E] mb-2 block">Product Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#FF3B30] transition-colors cursor-pointer">
                    <Plus className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to upload images</p>
                    <p className="text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#FF3B30] text-white uppercase rounded-lg hover:bg-[#007AFF] transition-all"
                >
                  Add Product
                </button>
              </form>
            </div>
          )}

          {/* My Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              <h2 className="text-[#1E1E1E] uppercase mb-6">My Product Listings</h2>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-[#1E1E1E]">Product</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E]">Price</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E]">Stock</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E]">Sold</th>
                      <th className="text-left px-6 py-4 text-[#1E1E1E]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-gray-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[#1E1E1E]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#1E1E1E]">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full ${
                              product.stock > 20
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#1E1E1E]">{product.sold}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-lg transition-colors">
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

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div>
              <h2 className="text-[#1E1E1E] uppercase mb-6">Sales Overview</h2>
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="mb-8">
                  <h3 className="text-[#1E1E1E] mb-4">Revenue Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border-2 border-gray-200 rounded-lg">
                      <p className="text-gray-600 mb-2">Today</p>
                      <p className="text-[#1E1E1E]">₹12,450</p>
                    </div>
                    <div className="p-4 border-2 border-gray-200 rounded-lg">
                      <p className="text-gray-600 mb-2">This Week</p>
                      <p className="text-[#1E1E1E]">₹84,320</p>
                    </div>
                    <div className="p-4 border-2 border-gray-200 rounded-lg">
                      <p className="text-gray-600 mb-2">This Month</p>
                      <p className="text-[#1E1E1E]">₹3,21,910</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#1E1E1E] mb-4">Recent Orders</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center p-4 border-2 border-gray-200 rounded-lg">
                        <div>
                          <h4 className="text-[#1E1E1E]">Order #ORD00{i}</h4>
                          <p className="text-gray-600">2025-11-0{i}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#1E1E1E]">₹{899 * i}</p>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, AlertCircle } from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';
import { ProductRow } from './ProductRow';
import adminService from '../../services/adminService';
import { Product } from '../../types/product';

export function AdminProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllProducts();
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateProduct = async (productData: Product) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      showToast('Product created successfully', 'success');
      await loadProducts();
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const handleUpdateProduct = async (productData: Product) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${productData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      showToast('Product updated successfully', 'success');
      await loadProducts();
    } catch (error: any) {
      showToast(error.message, 'error');
      throw error;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await adminService.deleteProduct(productId);
      showToast('Product deleted successfully', 'success');
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleModalSubmit = async (productData: Product) => {
    if (editingProduct) {
      await handleUpdateProduct(productData);
    } else {
      await handleCreateProduct(productData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#FF3B30] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1E1E1E]">Admin: Products</h2>
        <button
          onClick={handleAddClick}
          className="px-6 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">
              {searchQuery ? 'No products found matching your search.' : 'No products yet. Add your first product!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Product</th>
                  <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Price</th>
                  <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Category</th>
                  <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Stock</th>
                  <th className="text-left px-6 py-4 text-[#1E1E1E] font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        product={editingProduct}
      />
    </div>
  );
}

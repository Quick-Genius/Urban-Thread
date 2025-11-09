import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import uploadService from '../../services/uploadService';
import { Product } from '../../types/product';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => Promise<void>;
  product?: Product | null;
}

export function ProductFormModal({ isOpen, onClose, onSubmit, product }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: 'men',
    stock: 0,
    sku: '',
    images: [],
    sizes: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'men',
        stock: 0,
        sku: '',
        images: [],
        sizes: [],
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price must be 0 or greater';
    }

    if (!Number.isInteger(formData.stock) || formData.stock < 0) {
      newErrors.stock = 'Stock must be a non-negative integer';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      if (files.length === 1) {
        const result = await uploadService.uploadImage(files[0], '/products');
        setFormData({ ...formData, images: [...formData.images, result.data.url] });
      } else {
        const result = await uploadService.uploadMultipleImages(files, '/products');
        const newUrls = result.data.map((img: any) => img.url);
        setFormData({ ...formData, images: [...formData.images, ...newUrls] });
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1E1E1E]">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:border-[#FF3B30]'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                  errors.price ? 'border-red-500' : 'border-gray-300 focus:border-[#FF3B30]'
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                  errors.stock ? 'border-red-500' : 'border-gray-300 focus:border-[#FF3B30]'
                }`}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                  errors.sku ? 'border-red-500' : 'border-gray-300 focus:border-[#FF3B30]'
                }`}
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '4-6Y', '6-8Y', '8-10Y'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    const sizes = formData.sizes || [];
                    if (sizes.includes(size)) {
                      setFormData({ ...formData, sizes: sizes.filter(s => s !== size) });
                    } else {
                      setFormData({ ...formData, sizes: [...sizes, size] });
                    }
                  }}
                  className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all ${
                    (formData.sizes || []).includes(size)
                      ? 'bg-[#FF3B30] text-white border-[#FF3B30]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF3B30]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {formData.sizes && formData.sizes.length > 0 
                ? `Selected: ${formData.sizes.join(', ')}`
                : 'No sizes selected (optional)'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images *
            </label>
            <div className="space-y-4">
              <label className="flex items-center justify-center w-full px-6 py-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FF3B30] transition-colors bg-gray-50">
                <div className="text-center">
                  {uploading ? (
                    <>
                      <Loader2 className="w-12 h-12 mx-auto text-[#FF3B30] animate-spin mb-4" />
                      <p className="text-base text-gray-600 font-medium">Uploading images...</p>
                      <p className="text-sm text-gray-500 mt-1">Please wait</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-base text-gray-700 font-medium mb-1">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                      <p className="text-xs text-gray-400 mt-2">You can select multiple images at once</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-2 py-1 bg-[#FF3B30] text-white text-xs rounded font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex-1 px-6 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

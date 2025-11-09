import { Edit, Trash2 } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="text-[#1E1E1E] font-medium">{product.name}</p>
            <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-[#1E1E1E] font-medium">₹{product.price.toFixed(2)}</td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            product.stock > 50
              ? 'bg-green-100 text-green-700'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.stock}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit product"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => product._id && onDelete(product._id)}
            className="p-2 text-[#FF3B30] hover:bg-red-50 rounded-lg transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

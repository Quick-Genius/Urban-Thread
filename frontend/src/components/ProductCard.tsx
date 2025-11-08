import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
}

export function ProductCard({ id, name, price, image, rating = 4.5 }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${id}`} className="block relative group">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
          <WishlistButton productId={id} />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-[#1E1E1E] font-semibold mb-2 hover:text-[#FF3B30] transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? 'fill-[#FF3B30] text-[#FF3B30]'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">({rating})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-[#1E1E1E]">₹{price}</p>
          <Link
            to={`/product/${id}`}
            className="px-4 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

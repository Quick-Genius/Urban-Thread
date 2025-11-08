import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function WishlistButton({ productId, className = '', size = 'md' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const inWishlist = isInWishlist(productId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    setLoading(true);
    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all ${
          inWishlist ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-gray-600 hover:text-[#FF3B30]'
        }`}
      />
    </button>
  );
}

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AddToCartButtonProps {
  productId: string;
  size: string;
  quantity?: number;
  className?: string;
  variant?: 'primary' | 'secondary';
  onSuccess?: () => void;
}

export function AddToCartButton({
  productId,
  size,
  quantity = 1,
  className = '',
  variant = 'primary',
  onSuccess,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (!size) {
      alert('Please select a size');
      return;
    }

    setLoading(true);
    try {
      await addToCart(productId, quantity, size);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const baseClasses = 'flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[#FF3B30] text-white hover:bg-[#007AFF]',
    secondary: 'border-2 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white',
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
        </>
      )}
    </button>
  );
}

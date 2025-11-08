import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
  [key: string]: any;
}

interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
}

interface WishlistContextType {
  wishlist: Wishlist | null;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data.wishlist);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    if (!wishlist) return false;
    return wishlist.products.some((p) => p._id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    try {
      const inWishlist = isInWishlist(productId);
      const data = await wishlistService.toggleWishlist(productId, inWishlist);
      setWishlist(data.wishlist);
    } catch (error: any) {
      console.error('Failed to toggle wishlist:', error);
      throw error;
    }
  };

  const refreshWishlist = async () => {
    await loadWishlist();
  };

  const value = {
    wishlist,
    loading,
    isInWishlist,
    toggleWishlist,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

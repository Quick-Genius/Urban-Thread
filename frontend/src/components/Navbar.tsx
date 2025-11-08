import { useState } from 'react';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#FF3B30] rounded-lg flex items-center justify-center">
              <span className="text-white uppercase tracking-wider">UT</span>
            </div>
            <span className="uppercase tracking-wider text-[#1E1E1E]">UrbanThread</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#1E1E1E] hover:text-[#FF3B30] transition-colors">
              HOME
            </Link>
            <Link to="/products/men" className="text-[#1E1E1E] hover:text-[#FF3B30] transition-colors">
              MEN
            </Link>
            <Link to="/products/women" className="text-[#1E1E1E] hover:text-[#FF3B30] transition-colors">
              WOMEN
            </Link>
            <Link to="/products/kids" className="text-[#1E1E1E] hover:text-[#FF3B30] transition-colors">
              KIDS
            </Link>
            <Link to="/products/accessories" className="text-[#1E1E1E] hover:text-[#FF3B30] transition-colors">
              ACCESSORIES
            </Link>
            <Link to="/collections" className="text-[#1E1E1E] hover:text-[#FF3B30] transition-colors">
              COLLECTIONS
            </Link>
            <Link to="/sale" className="text-[#FF3B30] hover:text-[#007AFF] transition-colors">
              SALE
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-[#1E1E1E]" />
            </button>
            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <Heart className="w-5 h-5 text-[#1E1E1E]" />
                  {wishlist && wishlist.products.length > 0 && (
                    <span className="absolute top-0 right-0 bg-[#FF3B30] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlist.products.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <ShoppingCart className="w-5 h-5 text-[#1E1E1E]" />
                  {getCartCount() > 0 && (
                    <span className="absolute top-0 right-0 bg-[#FF3B30] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </>
            )}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-[#1E1E1E]" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  {isAuthenticated ? (
                    <>
                      {user && (
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-semibold text-[#1E1E1E]">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      )}
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-[#1E1E1E] hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>
                      {user?.role === 'seller' && (
                        <Link
                          to="/seller"
                          className="block px-4 py-2 text-[#1E1E1E] hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Seller Center
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-[#1E1E1E] hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-[#FF3B30] hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signin"
                        className="block px-4 py-2 text-[#1E1E1E] hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-[#1E1E1E] hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-[#1E1E1E]" />
              ) : (
                <Menu className="w-6 h-6 text-[#1E1E1E]" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-[#FF3B30] transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <Link
              to="/"
              className="block py-2 text-[#1E1E1E] hover:text-[#FF3B30]"
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              to="/products/men"
              className="block py-2 text-[#1E1E1E] hover:text-[#FF3B30]"
              onClick={() => setIsMenuOpen(false)}
            >
              MEN
            </Link>
            <Link
              to="/products/women"
              className="block py-2 text-[#1E1E1E] hover:text-[#FF3B30]"
              onClick={() => setIsMenuOpen(false)}
            >
              WOMEN
            </Link>
            <Link
              to="/products/kids"
              className="block py-2 text-[#1E1E1E] hover:text-[#FF3B30]"
              onClick={() => setIsMenuOpen(false)}
            >
              KIDS
            </Link>
            <Link
              to="/products/accessories"
              className="block py-2 text-[#1E1E1E] hover:text-[#FF3B30]"
              onClick={() => setIsMenuOpen(false)}
            >
              ACCESSORIES
            </Link>
            <Link
              to="/collections"
              className="block py-2 text-[#1E1E1E] hover:text-[#FF3B30]"
              onClick={() => setIsMenuOpen(false)}
            >
              COLLECTIONS
            </Link>
            <Link
              to="/sale"
              className="block py-2 text-[#FF3B30] hover:text-[#007AFF]"
              onClick={() => setIsMenuOpen(false)}
            >
              SALE
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

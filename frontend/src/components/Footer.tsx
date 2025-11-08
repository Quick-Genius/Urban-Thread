import { Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#FF3B30] rounded-lg flex items-center justify-center">
                <span className="text-white uppercase tracking-wider">UT</span>
              </div>
              <span className="uppercase tracking-wider">UrbanThread</span>
            </div>
            <p className="text-gray-400 mb-4">
              Bold. Youthful. Trendy. Your destination for the coolest fashion.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-[#FF3B30] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-[#FF3B30] transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-[#FF3B30] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-[#FF3B30] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="uppercase mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products/men" className="text-gray-400 hover:text-white transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/products/women" className="text-gray-400 hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/products/kids" className="text-gray-400 hover:text-white transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-400 hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="uppercase mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on new arrivals and exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
              />
              <button className="px-4 py-2 bg-[#FF3B30] hover:bg-[#007AFF] rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 UrbanThread. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

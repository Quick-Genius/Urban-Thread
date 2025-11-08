import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { UserDashboard } from './components/UserDashboard';
import { SellerCenter } from './components/SellerCenter';
import { AdminPanel } from './components/AdminPanel';
import { ContactUs } from './components/ContactUs';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TrackOrder } from './components/TrackOrder';
import { HelpCenter } from './components/HelpCenter';
import { WishlistPage } from './components/WishlistPage';
import { OrderDetail } from './components/OrderDetail';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Routes with Navbar and Footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:category" element={<ProductListing />} />
                    <Route path="/collections" element={<ProductListing />} />
                    <Route path="/sale" element={<ProductListing />} />
                    <Route path="/search" element={<ProductListing />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                    <Route path="/help" element={<HelpCenter />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />

          {/* Routes without Navbar and Footer (Seller & Admin) */}
          <Route path="/seller" element={<ProtectedRoute requiredRole="seller"><SellerCenter /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

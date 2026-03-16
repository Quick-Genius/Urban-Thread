import { Navigate, useLocation } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'seller' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for Clerk to initialise and for our app user to load
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30]"></div>
      </div>
    );
  }

  // Not signed in — redirect to Clerk's sign-in page, preserving intended destination
  if (!isSignedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Role-based access control — wait for appUser to be provisioned
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

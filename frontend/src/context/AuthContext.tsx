import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import api from '../services/api';

interface AppUser {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [fetching, setFetching] = useState(false);

  // Fetch/provision our MongoDB user whenever Clerk session state resolves
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      setFetching(true);
      api
        .get('/auth/me')
        .then((res) => setAppUser(res.data.user))
        .catch(() => setAppUser(null))
        .finally(() => setFetching(false));
    } else {
      setAppUser(null);
    }
  }, [isLoaded, isSignedIn]);

  const logout = () => {
    signOut();
    setAppUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setAppUser(res.data.user);
    } catch {
      // silently ignore
    }
  };

  const value: AuthContextType = {
    user: appUser,
    loading: !isLoaded || fetching,
    logout,
    refreshUser,
    isAuthenticated: !!appUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Re-export Clerk's useAuth as useClerkSession for components that need raw token
export { useClerkAuth as useClerkSession };

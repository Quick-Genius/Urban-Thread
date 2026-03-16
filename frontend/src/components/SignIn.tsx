import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Chrome, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useSignIn, useAuth as useClerkAuth } from '@clerk/clerk-react';

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useClerkAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Destination after sign-in (respects ProtectedRoute redirect)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isSignedIn) {
      navigate(from, { replace: true });
    }
  }, [isSignedIn, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError('');
    setLoading(true);

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate(from, { replace: true });
      } else {
        setError('Sign-in requires additional verification. Please try again.');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: from,
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF3B30] rounded-2xl mb-4">
            <span className="text-white uppercase tracking-wider">UT</span>
          </div>
          <h1 className="text-[#1E1E1E] uppercase mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue shopping</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[#1E1E1E] mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[#1E1E1E] mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF3B30] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full px-6 py-3 bg-[#FF3B30] text-white uppercase rounded-lg hover:bg-[#007AFF] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-600">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={!isLoaded}
              className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-[#FF3B30] hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <Chrome className="w-5 h-5" />
              <span className="text-[#1E1E1E]">Sign in with Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FF3B30] hover:text-[#007AFF] transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

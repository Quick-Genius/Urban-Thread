import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Chrome, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useSignUp, useAuth as useClerkAuth } from '@clerk/clerk-react';

export function SignUp() {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useClerkAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email verification step
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const [firstName, ...rest] = name.trim().split(' ');
      await signUp.create({
        firstName,
        lastName: rest.join(' ') || undefined,
        emailAddress: email,
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError('');
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/dashboard');
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message || 'Google sign-up failed');
    }
  };

  // ── Email verification screen ───────────────────────────────────────────
  if (pendingVerification) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF3B30] rounded-2xl mb-4">
              <span className="text-white uppercase tracking-wider">UT</span>
            </div>
            <h1 className="text-[#1E1E1E] uppercase mb-2">Verify Your Email</h1>
            <p className="text-gray-600">We sent a 6-digit code to <strong>{email}</strong></p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="text-[#1E1E1E] mb-2 block">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none transition-colors"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-[#FF3B30] text-white uppercase rounded-lg hover:bg-[#007AFF] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration screen ────────────────────────────────────────────────
  return (
    <div className="bg-[#FAFAFA] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF3B30] rounded-2xl mb-4">
            <span className="text-white uppercase tracking-wider">UT</span>
          </div>
          <h1 className="text-[#1E1E1E] uppercase mb-2">Create Account</h1>
          <p className="text-gray-600">Join UrbanThread today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[#1E1E1E] mb-2 block">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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

            <div>
              <label className="text-[#1E1E1E] mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF3B30] focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF3B30] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Clerk bot protection CAPTCHA widget */}
            <div id="clerk-captcha" />

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full px-6 py-3 bg-[#FF3B30] text-white uppercase rounded-lg hover:bg-[#007AFF] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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
              onClick={handleGoogleSignUp}
              type="button"
              disabled={!isLoaded}
              className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-[#FF3B30] hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <Chrome className="w-5 h-5" />
              <span className="text-[#1E1E1E]">Sign up with Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#FF3B30] hover:text-[#007AFF] transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

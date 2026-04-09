import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../store/slices/authSlice';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    const mockUser = {
      id: 'u1',
      email: email,
      name: isLogin ? 'Alex Johnson' : name,
      role: email.includes('admin') ? 'admin' as const : 'user' as const
    };
    
    dispatch(setUser(mockUser));
    
    if (mockUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-slate-50/50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center mb-10">
              <Link to="/" className="flex items-center gap-2 text-primary mb-6">
                <span className="material-symbols-outlined text-4xl font-bold">cyclone</span>
                <h2 className="text-slate-900 text-2xl font-black uppercase tracking-tighter">Urban Thread</h2>
              </Link>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {isLogin ? 'Welcome Back' : 'Join the Thread'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isLogin 
                  ? 'Sign in to access your orders and account settings.' 
                  : 'Create an account to track orders and get early access.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot Password?</button>}
                </div>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-base hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10 mt-4"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span className="text-xs font-bold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/apple.svg" className="w-5 h-5" alt="Apple" />
                <span className="text-xs font-bold">Apple</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Protected by Urban Thread. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Auth;

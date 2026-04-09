import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { toggleCart } from '../../store/slices/cartSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 md:px-10 lg:px-40 py-3">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">cyclone</span>
            <h2 className="text-slate-900 text-xl font-black leading-tight tracking-tighter uppercase">Urban Thread</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-slate-600 hover:text-primary text-sm font-semibold transition-colors">Shop</Link>
            <Link to="/collections" className="text-slate-600 hover:text-primary text-sm font-semibold transition-colors">Collections</Link>
            <Link to="/editorial" className="text-slate-600 hover:text-primary text-sm font-semibold transition-colors">Editorial</Link>
          </nav>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4 md:gap-6">
          <div className="hidden sm:flex flex-1 max-w-xs relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input 
              className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 rounded-xl py-2 pl-10 pr-4 text-sm placeholder:text-slate-400" 
              placeholder="Search collection..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => dispatch(toggleCart())}
              className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-slate-700 relative"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <Link to="/dashboard" className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-slate-700">
              <span className="material-symbols-outlined">person</span>
            </Link>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
              <img 
                className="w-full h-full object-cover" 
                alt="User profile avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6NGrtBIWQeqySbtKZHhufpdwm8MWtldL6_D4cbRneWUWRPyF7dtYLV_Q8-ribCHvtimJwTTnk3rE69DXHIjlsF9CkAkbeoQboIW94ZGjRoNdPyAn-ErvzsGaaFotEbDp60vM5PQM9EJv8koR5bAc3CYin9XbW0-EvjMSG02pzKx1ArkT-dAk1bR1FZJJzWCVD8T1DLzDCDoe4kB1HEoeO0D6YtaiWwR6Be_SPlJ8qLOifIXuidRQuC-ZXOkp_PPFtLwcZ01lCvX_m"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

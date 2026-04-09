import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  const navItems = [
    { label: 'Analytics', icon: 'analytics', path: '/admin', end: true },
    { label: 'Products', icon: 'inventory_2', path: '/admin/products' },
    { label: 'Orders', icon: 'shopping_cart', path: '/admin/orders' },
    { label: 'Customers', icon: 'group', path: '/admin/customers' },
    { label: 'Settings', icon: 'settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  return (
    <div className="flex flex-1 overflow-hidden min-h-[calc(100vh-73px)]">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-slate-900 text-white p-6 gap-8 shrink-0">
        <div className="flex items-center gap-3 px-3">
          <div className="p-2 bg-primary rounded-lg">
            <span className="material-symbols-outlined text-white font-bold">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest">Admin Panel</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Urban Thread Suite</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">Management</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>

          <div className="px-3 flex items-center justify-between text-[10px] text-slate-500 font-medium uppercase tracking-widest">
            <span>v1.2.0</span>
            <span>Build #4289</span>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

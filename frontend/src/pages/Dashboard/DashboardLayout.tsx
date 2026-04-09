import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard', end: true },
    { label: 'My Orders', icon: 'shopping_bag', path: '/dashboard/orders' },
    { label: 'Wishlist', icon: 'favorite', path: '/dashboard/wishlist' },
    { label: 'Shipping Addresses', icon: 'location_on', path: '/dashboard/addresses' },
    { label: 'Payment Methods', icon: 'credit_card', path: '/dashboard/payments' },
    { label: 'Profile Settings', icon: 'person', path: '/dashboard/profile' },
  ];

  return (
    <div className="flex flex-1 overflow-hidden min-h-[calc(100vh-73px)]">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white p-6 gap-8 shrink-0">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-slate-200">
          <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

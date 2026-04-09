const AdminDashboard = () => {
  const stats = [
    { label: 'Monthly Revenue', value: '$124,500', trend: '+12.5%', icon: 'payments', color: 'blue' },
    { label: 'Active Orders', value: '842', trend: '+5.2%', icon: 'shopping_bag', color: 'amber' },
    { label: 'New Customers', value: '1,240', trend: '+18.3%', icon: 'person_add', color: 'green' },
    { label: 'Conversion Rate', value: '3.42%', trend: '-0.8%', icon: 'data_exploration', color: 'primary' },
  ];

  const recentOrders = [
    { id: '#UT-1024', customer: 'Sarah Miller', amount: '$240.00', status: 'Processing', date: '2 mins ago' },
    { id: '#UT-1023', customer: 'James Wilson', amount: '$1,120.00', status: 'Shipped', date: '45 mins ago' },
    { id: '#UT-1022', customer: 'Elena Rodriguez', amount: '$45.00', status: 'Delivered', date: '2 hours ago' },
    { id: '#UT-1021', customer: 'David Chen', amount: '$185.00', status: 'Processing', date: '5 hours ago' },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">Store Overview</h1>
          <p className="text-slate-500 font-medium">Hello Admin, here's what's happening with Urban Thread today.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Data
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            This Month
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color === 'primary' ? 'primary/10' : stat.color + '-50'} text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className={`text-xs font-black ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-primary'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sales Chart Mockup */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold">Revenue Performance</h3>
                <p className="text-slate-400 text-sm">Net sales growth for current period</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-white/10 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Revenue
                </span>
                <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-white/10 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Target
                </span>
              </div>
            </div>

            {/* Visual Chart Bars Mock */}
            <div className="flex items-end justify-between h-48 gap-4 px-4">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 45, 85, 60].map((height, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 hover:brightness-125 ${i === 7 ? 'bg-primary' : 'bg-primary/40'}`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black bg-white text-slate-900 px-2 py-1 rounded shadow-lg translate-y-[-4px] block">
                      ${(height * 1.2).toFixed(1)}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mt-6 px-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        </div>

        {/* Recent Orders Side Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="flex flex-col gap-6">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-none last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 text-lg">shopping_cart</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{order.customer}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{order.id} • {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{order.amount}</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${
                      order.status === 'Shipped' ? 'text-blue-500' : 
                      order.status === 'Delivered' ? 'text-green-500' : 'text-amber-500'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

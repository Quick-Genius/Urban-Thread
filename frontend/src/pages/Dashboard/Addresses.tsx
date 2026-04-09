const Addresses = () => {
  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'Alex Rivera',
      address: '123 Maple Street, Apt 4B',
      city: 'New York, NY 10001',
      country: 'United States',
      phone: '+1 (555) 012-3456',
      isDefault: true,
      icon: 'home'
    },
    {
      id: 2,
      type: 'Office',
      name: 'Alex Rivera (Urban Tech)',
      address: '450 Fashion Avenue, Suite 1200',
      city: 'New York, NY 10123',
      country: 'United States',
      phone: '+1 (555) 012-7890',
      isDefault: false,
      icon: 'business'
    },
    {
      id: 3,
      type: 'Summer House',
      name: 'Alex Rivera',
      address: '78 Ocean Drive',
      city: 'Montauk, NY 11954',
      country: 'United States',
      phone: '+1 (555) 012-9988',
      isDefault: false,
      icon: 'holiday_village'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Shipping Addresses</h1>
          <p className="text-slate-500">Manage your saved delivery locations for a faster checkout.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">add</span>
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div 
            key={addr.id} 
            className={`bg-white rounded-xl p-6 border-2 transition-all relative shadow-sm ${addr.isDefault ? 'border-primary' : 'border-slate-200 hover:border-slate-300'}`}
          >
            {addr.isDefault && (
              <div className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] uppercase font-black px-2 py-1 rounded">
                Default
              </div>
            )}
            <div className="flex items-start gap-4 mb-4">
              <div className={`${addr.isDefault ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'} p-2 rounded-lg`}>
                <span className="material-symbols-outlined">{addr.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">{addr.type}</h3>
                <p className="text-slate-500 text-sm">{addr.name}</p>
              </div>
            </div>
            <div className="space-y-1 mb-6">
              <p className="text-sm leading-relaxed text-slate-600">
                {addr.address}<br/>
                {addr.city}<br/>
                {addr.country}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-base">phone</span>
                {addr.phone}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 py-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">edit</span>
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-primary hover:bg-primary/5 py-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">delete</span>
                Delete
              </button>
            </div>
          </div>
        ))}
        
        <button className="rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group min-h-[250px]">
          <div className="size-12 rounded-full border-2 border-slate-200 flex items-center justify-center mb-3 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <span className="font-bold">Add Another Address</span>
          <p className="text-xs mt-1">Easily toggle between multiple locations</p>
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-primary/5 p-8 flex flex-col justify-center">
          <h4 className="text-xl font-bold mb-2">Service Area</h4>
          <p className="text-slate-500 text-sm mb-4">Urban Thread ships to all 50 states and international locations.</p>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <span className="material-symbols-outlined">verified</span>
            <span>Express Shipping Available</span>
          </div>
        </div>
        <div className="md:w-2/3 h-48 md:h-auto bg-slate-200 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_g96kWWRT0knn9p9ca6-oTqf8dWii4wByDahjVM9Akl8ogG-ck9KGx3ORAgDZN6AQfV8k4_-HGt727u7izjGhyiESsJQaylh1DM9HyaGyAw1JIfc1MnXAZRsPjzhNnC_wk3LvX_myKHUOPZFIWOWDy9fQfttnj1dzUb0LXzC1sly8sxPt8g8XSjcqBihuzhZigiflbk34tmAiBxg5_nn1UEhFpk2bkOPWMFlqJ-svMvyfJZh3doUvIaz1O2Ede9dDHISeJ46d1Nzd')` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="text-xs font-bold uppercase tracking-wider">3 Saved Locations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;

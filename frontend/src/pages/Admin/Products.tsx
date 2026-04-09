import { useState } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Essence Puffer Jacket', category: 'Outerwear', price: 220, stock: 45, status: 'Active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsKsLmNq2A0qRfilzDWoT13FEcOHR-UkhrTQR-cfdO_Pa6byygbBCybvisAfI7d_sc2zUimEGaOjnmSl_82ChdCwSo0rbQbC2EFLxkRHeaVyBFSykR4KtfsCoGeUgWH538sOz16v7fJTJBNj11LQyqVoYB2p8OgEhRceiSbIl1QC7eE9KjpWkBKeerBu2itsyIze0DdFFy38k0KZpwqcCUrTEvD9xoaewm9_FCqxyOSxV18j7tC21ZHxI1WSwZuP1STE3WyDptiAWM' },
    { id: '2', name: 'Urban Carryall', category: 'Accessories', price: 185, stock: 12, status: 'Active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkzb_dy0Nj9B_xG4mbAVyP2qVm6gu6uryv_jJjA5coXvNLiW4j4R4T3HOztkQxSBrWjDRR8X-TuQALIg26yVYwBJCuH2ZSkNsLksuiVRPTkAe_kxdtIz7o3q919xO5gyZLNY1WMrjXOSN7xhmk17XPpWZDhwYhsMeowpuR1OfK_sfyr6YlXRsWeu0mPnbNOsuJ3d7tCgA_mMenBcPaqRACzaIcIhP8EGqiK6PVn9XOtDac53sbknuHARVdxhpQ3_TC5v3p32qDgxDI' },
    { id: '3', name: 'Heavyweight Tee', category: 'Basics', price: 45, stock: 156, status: 'Draft', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2mElWNXPN91vBf04Un_A81SzltC8N3iyGmsZ3azF4NnRWeK7g6_5pGF8kX78qVZzhM2nDq8jIEIwtcKMGWyK3S10lKyCkvNqofDC8IhUGK4B8hJth9Qw7YBT3k71oPVVtoxQ1OLWiQ5eSQ108HT7_Z-sv7HMQXgoz09hpx0Gi_v6fMUkziTN4gNx953Ofc5fI_AiRf7CbxGSHcDuuP-OTxUwJdcqZgY5RChHVUGoykC8s5HZgnQM7qXv1GQCD1vP2L7wKQO0lrsI7' },
    { id: '4', name: 'Linen Relaxed Shorts', category: 'Summer', price: 75, stock: 0, status: 'Out of Stock', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0QttrYleoBPPD7hF9kSValqTn-i1uexx9gtE4bPjfmEPTX9FGS2Xr5P1Ebwp16YAGxieGAKlTLk3U3ibGG6Q4eFEVg4GIav2jj4MHI5xkh-_WzS19PmFFW0eV39BwCpY3Cd-_yXGCJuWpkj7GO4bRJVKDze21CWS_9jzWn1XK8XopHBVbXUAn0IFIajCMLvKp1-jRfhniDAv42NlJYuUEK_F29XuRlHbXpOQa4gaO6ZItCrKfz-WrxvnZjPz_l-hqpUYL1dk154hP' },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-slate-500 font-medium">Manage your inventory, pricing, and product details here.</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:brightness-110 shadow-xl shadow-primary/20 transition-all">
          <span className="material-symbols-outlined font-black">add</span>
          Add New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search products by name, ID or category..." 
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filters
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Info</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: #UT-PROD-{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-600 px-3 py-1 bg-slate-100 rounded-full">{product.category}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">${product.price.toFixed(2)}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-slate-900">{product.stock} units</p>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock > 20 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, (product.stock / 200) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      product.status === 'Active' ? 'bg-green-50 text-green-600' : 
                      product.status === 'Draft' ? 'bg-slate-50 text-slate-400' : 'bg-primary/5 text-primary'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-slate-300">inventory_2</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search or add a new product to the catalog.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Showing 1 - {products.length} of 1,240 items</p>
        <div className="flex gap-2">
          <button className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;

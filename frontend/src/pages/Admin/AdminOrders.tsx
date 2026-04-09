const AdminOrders = () => {
  const orders = [
    { id: '#UT-1024', customer: 'Sarah Miller', items: 3, total: 240.00, status: 'Processing', date: 'Oct 24, 14:22' },
    { id: '#UT-1023', customer: 'James Wilson', items: 1, total: 1120.00, status: 'Shipped', date: 'Oct 23, 09:45' },
    { id: '#UT-1022', customer: 'Elena Rodriguez', items: 2, total: 45.00, status: 'Delivered', date: 'Oct 22, 18:30' },
    { id: '#UT-1021', customer: 'David Chen', items: 5, total: 185.00, status: 'Processing', date: 'Oct 21, 11:15' },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Orders Management</h1>
        <p className="text-slate-500 font-medium">Fulfill orders, manage returns, and update shipping statuses.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Order Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Items</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900">{order.id}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{order.date}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900">{order.customer}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{order.items} Items</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900">${order.total.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : 
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <select className="text-xs font-bold bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Change Status</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

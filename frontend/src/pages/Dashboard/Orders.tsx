const Orders = () => {
  const ongoingOrders = [
    {
      id: '#UT-88291',
      date: 'Oct 24, 2023',
      total: 248.50,
      status: 'Processing',
      items: [
        { name: 'Urban Parka', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6dSrPaa7fjsWoIBOEqhRDJD2twJfFIhksvv0DBxAJ9yVUtyZ4eEpPnsBnQOR1TCJsPJUbKczTI-icUHdIJ0Su_N3s-P-K4oX7D5HuP01i_oUFH1WUKffOygrxKtBKz2xYnrY-1CnsXSpXCoS9HQkMcHaa7LfEaGofklc9GQL9ywLyzsZ8HmKAUWktRMX_XfylhvaHq8iQBoetsIUzeXYLE8vSpD1zfZQ0n0qjsYD1nMmI9uAIjXtWuFXK_atb55WpF46QEv3XgODX' },
        { name: 'Cotton Tee', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYbraZIjMPxq6WLSnCSx-j6AQHyZzlKaNhdkaqmjeu027f3yr6RnRyaLDuxNwHk0sXCHf0ZzHtdx_wEg1BxXflHcUYib90x2CsyRfewmrsjIroF889CxE8--qu0OZq1U9LJ53I7-atxQp55wsTIhiS8y6Uut9kqh1FnHxqxu5X6xdhdXTdcUraYpGC-Ue958cK_DLDFggHJ_1YpKZqT4TEnP0km3qRij3-wTudMYiVLoZ4VRg60QyXXBpmRQsTaFAJSUzqpUdNiQPw' }
      ],
      extraItems: 1,
      deliveryDate: 'Oct 28 - Oct 30'
    },
    {
      id: '#UT-87102',
      date: 'Oct 12, 2023',
      total: 89.00,
      status: 'Shipped',
      items: [
        { name: 'Urban Velocity Sneakers', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi5jY826HZIij1JzhuG3fjjt4ZlbSVroFKIfkje4pnB6AXnDFDc9FkgzXiWNV320uq2USiU80cAK6pE6xi3-AiqKULe_Q0TyDOmT1d8P1fwKiMjQw6r8QiEb_SnVTOyO3Q2VxKQKryhZv6lfqDTdmzRm-KcBVswOFH4CLhlOhIDmbFKxZomQQjaNSkcaM39kHqpAiG2VN5vYrsef_dJ9xDgD9FDwuvXfl4BhCZoKOp6_0EfUKpJ8RnsdheBy8EhxRJq5QOjmiWbLfb' }
      ],
      deliveryStatus: 'In transit: Out for delivery today'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
          <p className="mt-1 text-slate-500">Track, manage and view your order history.</p>
        </div>
        <div className="flex gap-2 rounded-xl bg-slate-50 p-1 border border-slate-200">
          <button className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm">Ongoing</button>
          <button className="rounded-lg px-4 py-2 text-xs font-bold text-slate-500 hover:bg-white transition-all">Completed</button>
          <button className="rounded-lg px-4 py-2 text-xs font-bold text-slate-500 hover:bg-white transition-all">Cancelled</button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {ongoingOrders.map((order) => (
          <div key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order ID</p>
                  <p className="text-sm font-bold text-slate-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Placed</p>
                  <p className="text-sm font-medium text-slate-600">{order.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
                  <p className="text-sm font-bold text-slate-900">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
                  order.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {order.status === 'Processing' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                  {order.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="flex flex-1 items-center gap-4">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="h-16 w-16 rounded-xl border-2 border-white bg-slate-100 shadow-sm overflow-hidden">
                        <img alt={item.name} className="h-full w-full object-cover" src={item.image} />
                      </div>
                    ))}
                    {order.extraItems && (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-white bg-slate-200 text-xs font-bold text-slate-500">
                        +{order.extraItems}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {order.items[0].name} {order.items.length > 1 || order.extraItems ? `& ${ (order.items.length - 1) + (order.extraItems || 0) } other items` : ''}
                    </p>
                    <p className="text-xs text-slate-500">{order.deliveryDate ? `Estimated delivery: ${order.deliveryDate}` : order.deliveryStatus}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="flex-1 min-w-[120px] rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 min-w-[120px] rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-slate-900 p-8 text-white">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-xl font-bold">Urban Thread Rewards</h3>
            <p className="mt-2 text-slate-400">You have <span className="text-primary font-bold">1,240 points</span>. You're only 260 points away from a $25 discount on your next order!</p>
          </div>
          <button className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors">
            View Rewards
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;

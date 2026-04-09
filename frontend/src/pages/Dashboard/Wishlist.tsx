
const Wishlist = () => {
  const wishlistItems = [
    {
      id: 'tee-1',
      name: 'Classic White Linen Shirt',
      price: 89.00,
      description: 'Hand-woven lightweight linen, perfect for summer layering and breathable comfort.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVxvHSkw1fcKKwyCqbA4rPyquRL1qrtA06a4sXqBYBGsIHM1KP8KqeFhiXwf4hbHRn6rsuxtN4XwIEPzWoXuvRMjf__2_Tr2rbkRGDMJg8HEXHxKJjseWA9SVb8RKPb6bd0FxgSGMn3SSstUyO6Rp8cqDXP_ut_C-7Jzo37QBlR6TAKIp0Qorys7eY---LdF9Dqv9DPkQ0UtckxJyP-51NXUSvq2dF1o_TCMSBDgObcNICBkS185Tm1sitLuV6xICVHYmNEppfsiGt',
      tag: 'Premium',
      rating: 4.8,
      inStock: true
    },
    {
      id: 'denim-1',
      name: 'Urban Selvedge Denim',
      price: 145.00,
      description: 'Raw 14oz selvedge denim with a modern straight fit and reinforced stitching.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDloEXYCeWsXE30bzTsBhyzLjtnPPsylvLJnl4SCm9fCxmbX1g8QAsjV-OHdNnIrkR1S3mCJBQwBbq66l7k_NPYF6m_nTyl9d5WUaYKYvp420Z9QM7j3q8d3jBjoTGgRKyBL4_dNrTkuGE9mjcTgxz9buUUASGPztbDs4w5mz13aD0qAWXSgGLSVKB8uApFz8OBmlnxvjuJenj_iNea7igOZRmVOMrGfdJO_VRGNDmMfXrvmN17mv_1SrNPLc8opMY0jer3PCbYoRGD',
      tag: 'New Arrival',
      rating: 4.9,
      inStock: true
    },
    {
      id: 'dress-1',
      name: 'Silk Midi Slip Dress',
      price: 120.00,
      description: 'Luxurious 100% mulberry silk with a graceful silhouette and adjustable straps.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGhmpXWkUI_a7DxuzjPbtOAxcvEbebBUAXRIUzuOr0hOuwSMpWaOwiha50doSNdH7dHRJivfWaJ_jo3rAfgC5dOIRe8sedyAs1uN9wB9CD7tfKxzJ3KxvghLOxo1l89qcZZAI0_bqJd9HiNIM2FgEbpHUGvC9c9ZgUn297_GMOkLnx9jManOEwx2Ry1xBK0tp45zGemTCWK1kvlY-6V6CjlpqVOtxtkcs4KwLIT3cmi5H_Um5shZN98sLgN-cbjV3iiK05nAg1Tw9Z',
      tag: 'Top Rated',
      rating: 5.0,
      inStock: true
    },
    {
      id: 'coat-1',
      name: 'Over-sized Wool Coat',
      price: 210.00,
      description: 'Australian wool blend with double-breasted closure and silk lining.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQVsmeCECj-WXah937O3ybqROlBgjQ_NxvC5C_KdS4zjBRYnQUPLCst1wFOt_VnwtUTRMfhEhQo-5SBTnXWmTSSpAd5yG3Nc58uczR3s-50DY_BI3e7eiNeahrqQZRm_IJCav1IAP4PKHjwjA4fdzHapdbT9CiiC-mH_12DFOm88mvodhHtPkFIFFrihEI-uixC5pR3h9QDrM0MWWbYQSSDCwWNBg2p6F9lvQYTnW66t4EluDp_j0eGsRTNpmLVltMp9yDH_Hz5t5c',
      tag: 'Winter Collection',
      rating: 4.7,
      inStock: false
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight mb-2">My Wishlist</h2>
        <p className="text-slate-500">You have {wishlistItems.length} items saved for later.</p>
      </div>

      <div className="flex flex-col gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className={`group flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all ${!item.inStock ? 'opacity-80' : ''}`}>
            <div className="w-full md:w-48 aspect-square rounded-xl overflow-hidden shrink-0 relative">
              <img 
                alt={item.name} 
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${!item.inStock ? 'grayscale' : ''}`} 
                src={item.image} 
              />
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur px-3 py-1 rounded-full">Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.inStock ? 'text-primary bg-primary/10' : 'text-slate-400 bg-slate-100'}`}>
                    {item.tag}
                  </span>
                  <div className={`flex items-center ${item.inStock ? 'text-amber-500' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-sm fill">star</span>
                    <span className="text-xs font-bold ml-1">{item.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-1 max-w-sm">{item.description}</p>
                <p className={`text-2xl font-black ${item.inStock ? 'text-slate-900' : 'text-slate-400'}`}>${item.price.toFixed(2)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {item.inStock ? (
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-200 text-slate-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed" disabled>
                    <span className="material-symbols-outlined text-lg">notifications</span>
                    <span>Notify Me</span>
                  </button>
                )}
                <button className="flex items-center justify-center p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="px-8 py-3 rounded-full border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors">
          View More Saved Items
        </button>
      </div>
    </div>
  );
};

export default Wishlist;

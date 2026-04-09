import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const Home = () => {
  const dispatch = useDispatch();

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }));
  };

  const trendingProducts = [
    {
      id: 'p1',
      name: 'Essence Puffer Jacket',
      price: 220,
      category: 'Outerwear',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsKsLmNq2A0qRfilzDWoT13FEcOHR-UkhrTQR-cfdO_Pa6byygbBCybvisAfI7d_sc2zUimEGaOjnmSl_82ChdCwSo0rbQbC2EFLxkRHeaVyBFSykR4KtfsCoGeUgWH538sOz16v7fJTJBNj11LQyqVoYB2p8OgEhRceiSbIl1QC7eE9KjpWkBKeerBu2itsyIze0DdFFy38k0KZpwqcCUrTEvD9xoaewm9_FCqxyOSxV18j7tC21ZHxI1WSwZuP1STE3WyDptiAWM'
    },
    {
      id: 'p2',
      name: 'Urban Carryall',
      price: 185,
      category: 'Accessories',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkzb_dy0Nj9B_xG4mbAVyP2qVm6gu6uryv_jJjA5coXvNLiW4j4R4T3HOztkQxSBrWjDRR8X-TuQALIg26yVYwBJCuH2ZSkNsLksuiVRPTkAe_kxdtIz7o3q919xO5gyZLNY1WMrjXOSN7xhmk17XPpWZDhwYhsMeowpuR1OfK_sfyr6YlXRsWeu0mPnbNOsuJ3d7tCgA_mMenBcPaqRACzaIcIhP8EGqiK6PVn9XOtDac53sbknuHARVdxhpQ3_TC5v3p32qDgxDI'
    },
    {
      id: 'p3',
      name: 'Heavyweight Tee',
      price: 45,
      category: 'Basics',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2mElWNXPN91vBf04Un_A81SzltC8N3iyGmsZ3azF4NnRWeK7g6_5pGF8kX78qVZzhM2nDq8jIEIwtcKMGWyK3S10lKyCkvNqofDC8IhUGK4B8hJth9Qw7YBT3k71oPVVtoxQ1OLWiQ5eSQ108HT7_Z-sv7HMQXgoz09hpx0Gi_v6fMUkziTN4gNx953Ofc5fI_AiRf7CbxGSHcDuuP-OTxUwJdcqZgY5RChHVUGoykC8s5HZgnQM7qXv1GQCD1vP2L7wKQO0lrsI7',
      soldOut: true
    },
    {
      id: 'p4',
      name: 'Linen Relaxed Shorts',
      price: 75,
      category: 'Summer',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0QttrYleoBPPD7hF9kSValqTn-i1uexx9gtE4bPjfmEPTX9FGS2Xr5P1Ebwp16YAGxieGAKlTLk3U3ibGG6Q4eFEVg4GIav2jj4MHI5xkh-_WzS19PmFFW0eV39BwCpY3Cd-_yXGCJuWpkj7GO4bRJVKDze21CWS_9jzWn1XK8XopHBVbXUAn0IFIajCMLvKp1-jRfhniDAv42NlJYuUEK_F29XuRlHbXpOQa4gaO6ZItCrKfz-WrxvnZjPz_l-hqpUYL1dk154hP'
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-10">
      {/* Hero Section */}
      <section className="py-10">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 aspect-[16/9] md:aspect-[21/9] flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-80 mix-blend-overlay" 
              alt="Minimalist fashion photography" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAihznjSrr4Q-jgJNpPxMMbi-1zTgRunqNobJjUtgSJKD91LUhzQtCCsrZ_l19HYGiH0QoWN_QcvkZBKmk-7IrtcrMRa4n5GJw_OMqE37S3OIhJsVHJkGRT_gCyqclWubjddFYmwzjQvSLZqCll7xfGuoi7rl5WXImgzNe7tYTXbYMkp9eQb8BXUDX207xGb1DEmoc6Iw3CS-hI9psRR3X9rOJ3MajJDV27jvtiaZhh9MZHEinbvdNP3TmW3XrdvcD4RPjYS-O0PkCo" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 to-transparent"></div>
          </div>
          <div className="relative z-10 px-8 md:px-16 max-w-2xl flex flex-col gap-6">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">Summer 2024 Collection</span>
            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tight">
              Redefine <br/>Your Style
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-md leading-relaxed">
              Experience premium minimal fashion designed for the modern individual who values substance and aesthetics.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/products" className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:brightness-110 transition-all flex items-center gap-2">
                Shop Now <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                View Lookbook
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-primary/5">
        <div className="flex items-center gap-3 px-4">
          <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
          <div>
            <h4 className="font-bold text-sm">Free Shipping</h4>
            <p className="text-xs text-slate-500">On orders over $150</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 border-l border-primary/5">
          <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
          <div>
            <h4 className="font-bold text-sm">Premium Quality</h4>
            <p className="text-xs text-slate-500">Ethically sourced fabrics</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 md:border-l border-primary/5">
          <span className="material-symbols-outlined text-primary text-3xl">lock</span>
          <div>
            <h4 className="font-bold text-sm">Secure Payment</h4>
            <p className="text-xs text-slate-500">100% encrypted checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 border-l border-primary/5">
          <span className="material-symbols-outlined text-primary text-3xl">published_with_changes</span>
          <div>
            <h4 className="font-bold text-sm">Easy Returns</h4>
            <p className="text-xs text-slate-500">30-day return policy</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight">Browse Categories</h2>
          <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
            All Categories <span className="material-symbols-outlined text-sm">north_east</span>
          </a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard title="Men" count="240+" image="https://lh3.googleusercontent.com/aida-public/AB6AXuDB9OuZkYXUM5hy3WBtQ9Ebk8vtAsz2dNx6JgQr60w87D_qgWrpM1srQNPH6Kg8Ni5UmxnYx8HULkDcLXB4__edVHd2oJEHPJIR-EER1TquODl6VUVTBoIN7pBror0OtI-zIjfDS47LpvxRYJDXrdlHcB3iloxfL5SBpUIAWPs672FGCMcBDITupniR5SeKk6_-Vg05uhGUacPkQCJcNpeSRF8RAgjMR2Xu57mdXSl6fYFHdMpD1yQZSLTLgigsDe5Ss3iqPfZ1Utrn" />
          <CategoryCard title="Women" count="315+" image="https://lh3.googleusercontent.com/aida-public/AB6AXuBNqhTPZKOxRgOfuBZ86cszk6SHFaE0WfMk295LDdkgPCU_OYIPzuMt-nQgrJzukyfbOvUYQmv3AxrF2JWjqoQ56RzdmxQ7Wg-o4NvjvYwuUC-TEDn7beufk5nhaTCRGgLGGicoqzUb8OewuxoFC4n1QmWo4SZwy_UG49uQg4_4wZCKQ_YmaruED34_FYIfEQnGNcln1Em6uP4PNBlnzAmSna1w2M1Vyxg2erBTSJLYAkLFT5ZeTbipCBYzzz2zJRt0k6klhSEgb1HF" />
          <CategoryCard title="Kids" count="110+" image="https://lh3.googleusercontent.com/aida-public/AB6AXuCOLcshtH5LO3Xh9t2nqC6kPKdZTaZ_jlbu6mIpf0FOFRZMcVAOFyHr-9dIcDd_yiuob19LTqdci1ydqIRblUQHbUQHqKeiT_GvTQcCGEnYe0dqQBMpEAQxmgZNKmLoirrUIu3iqw92PB4WTRUKwo7wdxhroIhLr3iN3mKFyChiYxeDKaLRBTnZFQWA1sTIdidBndzruG0SDnxJzFgZNJCGy79b_79oYZho_XkBhjIQqY9uwRX_1fmxCEZeD9tmLfkMAEYwIuB8RgN-" />
          <CategoryCard title="Accessories" count="85+" image="https://lh3.googleusercontent.com/aida-public/AB6AXuBGnaxJZakkUfzAyL2bFg0mW3mHbf34hvXvNti4G20U_wp6U64Bmh6ZO2JKuI5FtFoJz6Pqx7p6Uyr2eVYzMgzzejwyUHxBNR3Aezi16Hy5zKXAnkqh_a4n6_nyEKv___8yVZW_7AZuA-8Ut6kKxFVC5J74idk4C3sun8jBr1IWTeFvp_1hk2nSzdZA2zAcPSUS91ksdwNioOwrQKGADKWoVKr25NGoD1TkE04lhZoYnx28h6jrPe_KIMi18Z-oQhWq_62C78Vs_Bwy" />
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight">Trending Now</h2>
            <p className="text-slate-500 text-sm">Most wanted pieces this week</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
            </button>
            <button className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center bg-primary text-white hover:brightness-110 transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map(product => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-primary/5 mb-4">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={product.name} 
                  src={product.image} 
                />
                {!product.soldOut && (
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="material-symbols-outlined text-slate-900">favorite</span>
                  </button>
                )}
                {product.soldOut && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase">Sold Out</div>
                )}
                <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => !product.soldOut && handleAddToCart(product)}
                    className={`w-full py-3 ${product.soldOut ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900'} text-white font-bold rounded-xl text-sm`}
                  >
                    {product.soldOut ? 'Notify Me' : 'Add to Cart'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                  <h4 className="font-bold text-slate-800">{product.name}</h4>
                </div>
                <p className={`font-black ${product.soldOut ? 'text-slate-400 line-through' : 'text-primary'}`}>${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="bg-primary/5 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="flex-1 relative z-10">
            <h2 className="text-4xl font-black mb-4">Join the Thread</h2>
            <p className="text-slate-600 text-lg mb-8 max-w-md">Subscribe to get early access to drops, exclusive lookbooks, and 15% off your first order.</p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input className="flex-1 px-6 py-4 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Enter your email" type="email"/>
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:brightness-110 transition-all whitespace-nowrap">Join Now</button>
            </form>
            <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">Privacy guaranteed. Unsubscribe anytime.</p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 w-full">
            <FeatureCard icon="eco" title="100% Eco" desc="Sustainable materials only" />
            <FeatureCard icon="thumb_up" title="10k+ Happy" desc="Rated 4.9/5 by customers" />
            <FeatureCard icon="support_agent" title="24/7 Care" desc="Expert style advice" />
            <FeatureCard icon="verified" title="Original" desc="Authenticity guaranteed" />
          </div>
        </div>
      </section>
    </div>
  );
};

const CategoryCard = ({ title, count, image }: { title: string, count: string, image: string }) => (
  <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
    <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} src={image} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    <div className="absolute bottom-6 left-6">
      <h3 className="text-white text-2xl font-black uppercase tracking-wider">{title}</h3>
      <p className="text-white/70 text-sm mt-1">{count} Items</p>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <span className="material-symbols-outlined text-primary mb-2">{icon}</span>
    <h4 className="font-bold mb-1">{title}</h4>
    <p className="text-xs text-slate-500">{desc}</p>
  </div>
);

export default Home;

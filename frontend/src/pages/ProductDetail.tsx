import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: 'tee-oversized-1',
    name: 'Urban Thread Oversized Tee',
    price: 45.00,
    oldPrice: 65.00,
    category: 'Sustainable Cotton Series • Earth Tone Edition',
    description: 'Crafted for those who value both style and comfort, the Urban Thread Oversized Tee is a staple piece for any modern wardrobe. Made from premium, heavyweight sustainable cotton, this t-shirt offers a structured yet relaxed silhouette that drapes perfectly. The dropped shoulders and extra room in the body provide that authentic streetwear look while maintaining a clean, sophisticated aesthetic.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmnWhE2-W0JmPQkmSVPZJ5CJvOk1pauTmZJx_FhU9RHPfHgbCwdHhDn0UZQ6YeLpK_Q1ptyNmL207PPFoyYVLEkWDaaZNNF3P1DrxQ4SnaP1j-SPfZ4Em0a_RoDhzOyaxokS-BVnZ_cTBak0RHOH18c7F7jjFvhPVIYZMGu6Qso4YA11fLXdMlZTGSNMwQSNARwgeiSJK8SR6Wji3q6d0KAurlHIO5_dQAhJKICmpSv9l139-lLTEgydb-VRg88tl2U7n6ikAk7rIm',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVrG6qYBx61pQpMfZoORcxniR7WwIomx0zqkMQswzVylfnC9LhbGzCVfIWb2-krWekD0hpjpP0TJooM-dqoeSBWDQJA_Y539QjUr35tvYuzm2PBwr3awIZERAk4sHlXLQ09cvGC5qcrRjTAXGGM9xPRSeXMvJFxQm5WH5XJ-CH7fiaPi046rzAtUt8eShLLc08YiBakwCSfcivfuMP0ceHGlWAUAhWketvFAnSoLYGrv5JiD58NDVMrSwr1UdJwnPfHlpwFUF28Od8',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBwIIxw_tOMaNMVxZJMU_19I821kBLxKwq3hH_TBlvd6_d_9_uMRSXJYD4fsEWRmWhJHLkYfB4ARocGwUQAo_adDiTWY2UkFpvLiv2bopFcZU-3BdBD0SCP3hUAVQnFNmV_Q62XYqH_O3WuNulSm4JzeNhmgb3B1I7Wp1XSMH-xXHNuexgHT5MABPmzCsPYkRipioOFfKuxuQZT3HSKglhyyygK4UoXPgcjCwdER066Kjgvlyy-xb-Aj2BVcBH5iT2jTkcDzd2wZ06b',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxnaEhz8hOelID5fYCelJOAG_-Pz3lDTKNUOuiI52oKyJiwLSGlh9gBCh85AYAPCxP4m2PPoHlvZTqsgTN_bV6rTbPtBL05OB1KJ5klqYm2MXGgGVEbTPNdPG4t_a6SnLKpU52N_9bixoa8n7cUhQLh632WEnlcsHLDpeKIFPo1Cotmo5rFWW3NmVyU2Jngea9gu1Z040TTa6qemRMyv6fO8lMO0pCmt334V_0OZ6CPiLp1ALAhVhuWVc94-58SyIKr3hn-DwRaPbV'
    ],
    reviews: [
      { id: 1, author: 'Alex Rivera', rating: 5, date: '2 days ago', title: 'Perfect oversized fit!', content: "I've been looking for a tee that actually fits \"oversized\" without looking sloppy. The quality of the fabric is incredible—it's thick and feels very high-end. Definitely worth the price.", avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAQkNQ_1nDXCu8ghS-QunxmxcwMgjEgvONzYKIpqu_DDq_c2N78bQjpv6pZVuS_FbeoU8VGRWT8Yg6oGmml_W1l2OloPrgT8h_s8FgsjWMFPUIrPTb5CbpDFjYuMMz4RYZr9-nos1eE2axVmuqEreHb0bUtW6QIqR9RxlYAWhMiQWRw8pLUXI1Wnv5tH6hKsPVGgGIMeZyR3YTxuHcfGXo24gQvAyP3RygPbdfn1zZdoFPy4CGc_a8UByn01e6ua3syYwrCzsKT8gY' },
      { id: 2, author: 'Jordan Smith', rating: 4, date: '1 week ago', title: 'Love the color selection', content: "The red color is so vibrant and unique. It hasn't faded after two washes. The only thing is it runs very large, so maybe size down if you want it a bit more fitted.", avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-jW3vrWqBONHyQGWCaJ2-C0PL8Cv3SHONs7gicsxM_NnHcxuS_DtlKcyDfEUCsMmvht3rxQdJZKHQBlfuOV5PtlCqU79iEheTJH90QJjCpaRuMMhK_EW4yoViju9X73qBB7WIsQpo5eJpf-B_PzcCaIWb_OQLCVchfzSe85ufH1O_vDdhsGYzRg8bz-UY2ik6x0C_cZ0_ksEbqejP_pxmH49d3UH4iuw_yFq1HuMf5FnFU3JmeX0kuY18CAzfPPVqqeYLzU5ak-eL' }
    ]
  };

  const [activeImg, setActiveImg] = useState(product.images[0]);

  const handleAddToCartClick = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0]
    }));
  };

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 lg:px-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/products" className="hover:text-primary transition-colors">Apparel</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
            <img src={activeImg} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveImg(img)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeImg === img ? 'border-primary' : 'border-primary/5 opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`Detail ${idx}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">New Arrival</span>
              <div className="flex items-center gap-1 text-primary">
                {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-sm fill">star</span>)}
                <span className="material-symbols-outlined text-sm">star_half</span>
                <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold ml-1">(124 Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2">{product.name}</h1>
            <p className="text-slate-500 font-medium">{product.category}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-black text-primary">${product.price.toFixed(2)}</span>
            <span className="text-lg text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
          </div>

          <div className="h-px bg-primary/10 w-full"></div>

          {/* Size Selector */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold uppercase tracking-wide">Select Size</span>
              <button className="text-xs font-bold text-primary underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-12 w-12 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${selectedSize === size ? 'border-2 border-primary bg-primary/5 text-primary' : 'border-primary/20 hover:border-primary hover:text-primary'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty and Add to Cart */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex items-center h-14 bg-primary/5 rounded-xl px-4 border border-primary/10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-primary">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-12 text-center font-black">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-primary">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <button 
                onClick={handleAddToCartClick}
                className="flex-1 h-14 bg-primary text-white rounded-xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>
            </div>
            <button className="w-full h-14 border-2 border-primary/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined">favorite</span>
              Add to Wishlist
            </button>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <div>
                <p className="text-xs font-bold">Free Shipping</p>
                <p className="text-[10px] text-slate-500">Orders over $75</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="material-symbols-outlined text-primary">eco</span>
              <div>
                <p className="text-xs font-bold">100% Cotton</p>
                <p className="text-[10px] text-slate-500">Eco-friendly source</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Tabs */}
      <div className="mt-20">
        <div className="flex border-b border-primary/10 gap-8">
          <button className="pb-4 text-sm font-black border-b-2 border-primary text-primary">Description</button>
          <button className="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Details</button>
          <button className="pb-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Shipping & Returns</button>
        </div>
        <div className="py-8 max-w-3xl">
          <p className="text-slate-600 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-20 border-t border-primary/10 pt-16">
        <h2 className="text-3xl font-black mb-10">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Summary */}
          <div className="lg:col-span-4 bg-primary/5 rounded-2xl p-8 h-fit">
            <div className="text-center mb-8">
              <p className="text-6xl font-black text-primary mb-2">4.8</p>
              <div className="flex justify-center gap-1 text-primary mb-2">
                {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined fill">star</span>)}
              </div>
              <p className="text-sm font-bold text-slate-500">Based on 124 reviews</p>
            </div>
            {/* Bars placeholder */}
            <div className="space-y-3">
              {[5,4,3,2,1].map(star => (
                <div key={star} className="grid grid-cols-[24px_1fr_40px] items-center gap-3">
                  <span className="text-xs font-black">{star}</span>
                  <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: star === 5 ? '80%' : star === 4 ? '12%' : '5%' }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-right">{star === 5 ? '80%' : star === 4 ? '12%' : '5%'}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 h-12 bg-slate-900 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Write a Review</button>
          </div>

          {/* Review List */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {product.reviews.map(review => (
              <div key={review.id} className="border-b border-primary/5 pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${review.avatar})` }}></div>
                  <div>
                    <p className="text-sm font-black">{review.author}</p>
                    <div className="flex gap-0.5 text-primary">
                      {Array.from({length: review.rating}).map((_, i) => <span key={i} className="material-symbols-outlined text-[14px] fill">star</span>)}
                    </div>
                  </div>
                  <span className="ml-auto text-xs font-medium text-slate-400">{review.date}</span>
                </div>
                <h4 className="text-base font-bold mb-2">{review.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{review.content}</p>
              </div>
            ))}
            <button className="flex items-center justify-center gap-2 text-primary font-black text-sm py-4 hover:gap-4 transition-all">
              Load More Reviews
              <span className="material-symbols-outlined">arrow_downward</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;

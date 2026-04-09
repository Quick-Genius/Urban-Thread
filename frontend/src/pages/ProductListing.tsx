import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductListing = () => {
  const [priceRange, setPriceRange] = useState(500);

  const products = [
    {
      id: '1',
      name: 'Classic Minimalist Trench',
      price: 249.00,
      category: 'Outerwear',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_0CjTxYDgrDJVHZBrpPqFDI59BokEIxoQqumhi9-UyutPegjhaOlWDQ6vr_eJjHoQtuo32d6xUnJY-kAnYBPGfycIG9Q_3iT5nz4BaJajmUSouHHagwcrLh6kWRgfh5smgRjT8r-n4nyoMQjKE08xiZV8VJpJcsacOsuyq4zKEWWh3etmSQvZEUIDPqE3cXe4MZv1-38OPEPBdMlU0qzEWblPPANf5W1sKJNYTLFoZP1H24VVDQlonW5HPSoiJv_kRXL80HBNlsod',
      tag: 'New',
      rating: 4.9
    },
    {
      id: '2',
      name: 'Heavyweight Loopback Hoodie',
      price: 89.00,
      category: 'Essentials',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3XeWj4lkrZAn6iPEfSqEWjBLFNEd1wTtgbCoSOs3v-1HedrMTXT9W07CSJD-dWHew7cX365waoC6P7gDzwbawE-1wRNPXUdVlX6V03woQkD403I5k4R4hZTmgVkTWxE6hljGRpKBEJPSkaJyJDNE6I_mnig6tIFEn4kxp891AnEFzGVB_Evb6DpSeB8itZxakJpV7xFRqb36DFqEWRA_blUQDyaZT5RpQLzap1HLR7HbTp9PJhIVTorv0xj98w8bZucgM5lvHESBp',
      rating: 4.7
    },
    {
      id: '3',
      name: 'Raw Selvedge Denim',
      price: 160.00,
      category: 'Denim',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCmz_RsCd4IfiROnh1udvYxyRiIGyxY9JCh7pwSARCPfx0n-1B6knmb1fIi57V3WpDNKxEitdHiqrbAeTWGOPS6MYgiELJCGGd9PE2HmPhcQi5iZHjmLX1p2plyUyUDC3FvRchp8CtPSQdlyWpq6FG34dSAKOhql6WKyNK5t_QTJHZsgStPK1j-1nBkfJya6bhSI4FGe_AJBI-RxHS9eaSU3VfUsZvBnxn63Xs7nxZqOMyxCVQcqy_JQwF_R03tu1JGIGjuvcDiATE',
      tag: 'Popular',
      rating: 4.8
    },
    {
      id: '4',
      name: 'Premium Cotton Tee Pack',
      price: 45.00,
      oldPrice: 60.00,
      category: 'Basics',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaga8sItlZQlqw1h6RmL6nRc_jzlGWXQiAryJTQ5iTucZ8hak5p0KAN_3aooJUmG3UsIFO4MHY8co9ZbQQ6EMReQoDoBWqCA3HHumVjtA0-CQ5gA07saiR23RLm_tvcbtk3toN3RthM890nOx3uMbshxpBOE3yUuUL_oacr4pGys-xF9ts74t-410y6JITFX31bwP3zhAeQQOBZKl6aerP3A_XPY6uuv5w6pc9fsAzCaVF63lBwX1PgWovX7m0bXVhuYaJd2wGuMx7',
      rating: 4.9
    },
    {
      id: '5',
      name: 'Modular Weather Parka',
      price: 310.00,
      category: 'Techwear',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArsbiXTAs8xE3xaN24h0WFmAV_w7vxlPupuXjVpxFA0AsYAgebQooqudJ_xDtFG6qV4zUBAMuSSpSM4-FesnfBOBCH87d2RGEyBbfEsQClt0A9kEbBuizOE74m-OjxFndTOheHuTcOlScsFP4UOYIMkGV6TLtIHw4af2nlwbcQfMtNph2tB_eEbGFxDuhzhAl-z6xDzVlXB13c-CqX80Da5B01EkmdvZGQItfT8VOAQdLkLg8APC_U8Ggl8C7QNCz09KmXVEkAMmeP',
      rating: 4.6
    },
    {
      id: '6',
      name: 'Indigo Chambray Shirt',
      price: 75.00,
      category: 'Shirts',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk1ii270Hws02d3vNK-dvzst4e8BCH4GhR0b6KyI-yYnfPM_Y-ZlpObrJzjZ-0OQTE-e2w4ktYWHRien-tI7CfOAMGyY_U5KoapzPDsr-Sej9CXooNSuhfOwmAw-4OCroruYhqcR9mL_dx9YLDmehhAcdg8SvS31gb48TcoIT334g6-sH1XOC9fXQ2uPUmjQQcdawk2R5J3-Yauo7_BNjBIPFO9yOT5bbHtxzutQlSYFAXpTpW2jaCcobausbwVSJuwicjdsEorw_M',
      rating: 4.5
    },
    {
      id: '7',
      name: 'Merino Wool Crewneck',
      price: 120.00,
      category: 'Knitwear',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT6q2FRpuSX9Hg_Acs1DQTDBWrC9uh7qjNMC3ZDIU4HUudANcu_N-2prf4tQMlVF13h68Zw2LbJ_DIdI3kHhOZclYv8kYZ45JOnC7IFU8_vl-qaLxrhc3JbQGs1yTMwnDlfNie2LeYF-ldfgwLeqwVnYsJ8TmyLbT4omhSCBzzc47CHeUxh--HddUhd9g_IZJVIjUiqtCqSYvX3cVdBv5sgy0vN0NlX52HNL3x2CJJDqszfEQ_y6Xh8-LWqMWh-GVz18dZMhyiMOuF',
      rating: 4.9
    },
    {
      id: '8',
      name: 'Grained Leather Biker',
      price: 450.00,
      category: 'Luxury',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-E1O0gUcVjuktHusdwmJD1WNEV15ztlfa_aB9hb_MkZkt_jaJbBqS93E8h6uCmQCgbv6q9qucxFhvnACYdzF1HLX7KbYx4W63Nt2zxJ-9ahkNQYVEVtjPwag4IFDXB47fO3m9KHvWIYhulok1BVzcw0I2jGB4y6e7vY3AN0-_XUugetWGRZ__eGuFE6tXAYu_wtglxNqAtE7t9SjZyYn2DJTFpBCvum3tyrCZiYxkpFqUU-lQqmbbfSY3iSjr_E-b9hobDyh06-H-',
      rating: 5.0
    }
  ];

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:flex-row gap-8 px-4 md:px-10 lg:px-20 py-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-24 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Filters</h3>
            <button className="text-xs font-bold text-primary hover:underline">Reset All</button>
          </div>
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary/60">Category</p>
              <div className="space-y-2">
                {['Outerwear', 'Hoodies', 'T-Shirts', 'Pants'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded border-primary/20 text-primary focus:ring-primary" />
                    <span className="text-sm group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary/60">Price Range</p>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer" 
                />
                <div className="mt-2 flex justify-between text-xs font-medium">
                  <span>$0</span>
                  <span>${priceRange}+</span>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary/60">Size</p>
              <div className="grid grid-cols-3 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} className={`rounded-lg border border-primary/20 py-2 text-xs font-bold hover:bg-primary hover:text-white transition-all ${size === 'M' ? 'bg-primary text-white' : ''}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all">
            Apply Filters
          </button>
        </div>
      </aside>

      {/* Product Grid */}
      <section className="flex-1">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-xs font-medium text-primary/50">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-slate-900">Clothing</span>
            </nav>
            <h1 className="text-4xl font-black tracking-tight">
              Urban Apparel 
              <span className="text-lg font-normal text-primary/40 ml-2">1,240 items</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold whitespace-nowrap">Sort by</span>
            <select className="rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-semibold focus:ring-primary focus:border-primary">
              <option>Newest Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col gap-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-primary/5">
                <img 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={product.name} 
                  src={product.image} 
                />
                <button className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-primary transition-transform hover:scale-110 shadow-sm border border-slate-100">
                  <span className="material-symbols-outlined text-lg">favorite</span>
                </button>
                {product.tag && (
                  <div className="absolute bottom-3 left-3 flex gap-1">
                    <span className={`rounded-lg ${product.tag === 'New' ? 'bg-primary' : 'bg-slate-900'} px-2 py-1 text-[10px] font-black uppercase text-white`}>
                      {product.tag}
                    </span>
                  </div>
                )}
              </div>
              <div className="px-1">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">{product.category}</p>
                <h4 className="text-sm font-bold leading-tight line-clamp-1">{product.name}</h4>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black">${product.price.toFixed(2)}</p>
                    {product.oldPrice && (
                      <p className="text-sm font-bold text-slate-400 line-through">${product.oldPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">star</span>
                    <span className="text-xs font-bold">{product.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button className="flex size-10 items-center justify-center rounded-xl border border-primary/20 hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="flex size-10 items-center justify-center rounded-xl bg-primary text-white font-bold">1</button>
            <button className="flex size-10 items-center justify-center rounded-xl hover:bg-primary/5 font-bold transition-colors">2</button>
            <button className="flex size-10 items-center justify-center rounded-xl hover:bg-primary/5 font-bold transition-colors">3</button>
          </div>
          <button className="flex size-10 items-center justify-center rounded-xl border border-primary/20 hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default ProductListing;

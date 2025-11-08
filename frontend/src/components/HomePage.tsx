import { motion } from 'motion/react';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRef, useState, useEffect } from 'react';
import productService from '../services/productService';
import { ProductCard } from './ProductCard';

export function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts({ sort: 'newest' });
      setTrendingProducts(data.products.slice(0, 8));
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      title: 'MEN',
      image: 'https://images.unsplash.com/photo-1516442443906-71605254b628?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdHNoaXJ0JTIwbW9kZWx8ZW58MXx8fHwxNzYyMTk3NzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/products/men',
    },
    {
      title: 'WOMEN',
      image: 'https://images.unsplash.com/photo-1702678839327-761d359c3c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbnMlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzYyMTk3NzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/products/women',
    },
    {
      title: 'KIDS',
      image: 'https://images.unsplash.com/photo-1759313560190-d160c3567170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZmFzaGlvbiUyMHBsYXlmdWx8ZW58MXx8fHwxNzYyMTYwMTMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/products/kids',
    },
    {
      title: 'ACCESSORIES',
      image: 'https://images.unsplash.com/photo-1716827172706-9f4c36b039eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBjbG90aGluZyUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NjIxOTc3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      link: '/products/accessories',
    },
  ];



  const testimonials = [
    {
      name: 'Rahul K.',
      rating: 5,
      text: 'Best quality tees! The Marvel collection is absolutely fire 🔥',
      image: 'https://images.unsplash.com/photo-1643387848945-da63387848945-da63360662f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2MjExMzQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      name: 'Priya S.',
      rating: 5,
      text: 'Love the fit and fabric. Worth every penny!',
      image: 'https://images.unsplash.com/photo-1702678839327-761d359c3c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbnMlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzYyMTk3NzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      name: 'Arjun M.',
      rating: 5,
      text: 'Fast delivery and amazing quality. Highly recommended!',
      image: 'https://images.unsplash.com/photo-1760509370980-d201b9bc327e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGZhc2hpb24lMjB5b3V0aHxlbnwxfHx8fDE3NjIxNTc2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  return (
    <div className="bg-[#FAFAFA]">
      {/* Hero Banner */}
      <section className="relative h-[600px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1643387848945-da63387848945-da63360662f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2MjExMzQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-white uppercase mb-4">
                The New Marvel Collection
              </h1>
              <p className="text-white/90 mb-8">
                Unleash your superhero style. Limited edition drops now live.
              </p>
              <Link
                to="/collections"
                className="inline-flex items-center px-8 py-4 bg-[#FF3B30] text-white uppercase rounded-lg hover:bg-[#007AFF] transition-all shadow-lg hover:shadow-xl"
              >
                Shop the Drop
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="uppercase text-[#1E1E1E] mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={category.link}
                className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white uppercase p-6">{category.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="uppercase text-[#1E1E1E]">Trending Now</h2>
          <Link to="/products/all" className="text-[#FF3B30] hover:text-[#007AFF] uppercase flex items-center">
            View All
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30]"></div>
          </div>
        ) : trendingProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <motion.div key={product._id} whileHover={{ y: -5 }}>
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                  rating={product.rating}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Limited Edition Banner */}
      <section className="bg-[#FF3B30] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white uppercase mb-4">Limited Edition Collaborations</h2>
          <p className="text-white/90 mb-8">
            Marvel × UrbanThread | Anime Collection | Exclusive Drops
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center px-8 py-4 bg-white text-[#FF3B30] uppercase rounded-lg hover:bg-[#1E1E1E] hover:text-white transition-all"
          >
            Explore Collections
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="uppercase text-[#1E1E1E] mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-[#1E1E1E]">{testimonial.name}</h4>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF3B30] text-[#FF3B30]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

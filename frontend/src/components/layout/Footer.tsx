import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-primary/5 pt-16 pb-8 px-4 lg:px-40 mt-16">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 text-primary mb-6">
            <span className="material-symbols-outlined text-3xl font-bold">cyclone</span>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-black uppercase">Urban Thread</h2>
          </Link>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
            Elevating daily essentials through thoughtful design and uncompromising quality. Born in the city, designed for the world.
          </p>
          <div className="flex gap-4">
            <a className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined text-base">public</span>
            </a>
            <a className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined text-base">alternate_email</span>
            </a>
            <a className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined text-base">share</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Shop</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-500">
            <li><Link className="hover:text-primary transition-colors" to="/products?category=men">Men's Collection</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/products?category=women">Women's Collection</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/products?category=new">New Arrivals</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/products?category=accessories">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-500">
            <li><Link className="hover:text-primary transition-colors" to="/about">Our Story</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/sustainability">Sustainability</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/careers">Careers</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/stockists">Stockists</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-500">
            <li><Link className="hover:text-primary transition-colors" to="/support/shipping">Shipping & Returns</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/support/size-guide">Size Guide</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/support/order-tracking">Order Tracking</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/support/faq">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400">© 2024 Urban Thread Studio. All rights reserved.</p>
        <div className="flex gap-8 text-xs text-slate-400 uppercase font-bold tracking-widest">
          <Link className="hover:text-primary transition-colors" to="/privacy">Privacy</Link>
          <Link className="hover:text-primary transition-colors" to="/terms">Terms</Link>
          <Link className="hover:text-primary transition-colors" to="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

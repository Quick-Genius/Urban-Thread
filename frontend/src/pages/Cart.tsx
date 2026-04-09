import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../store/store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-slate-300">shopping_cart</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Explore our latest collections to find something you love.</p>
        <Link to="/products" className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-10 py-12">
      <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="hidden md:grid grid-cols-12 pb-4 border-b border-slate-100 text-[10px] uppercase font-black tracking-widest text-slate-400">
            <div className="col-span-6">Product Details</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="flex flex-col gap-8">
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 pb-8 border-b border-slate-50 last:border-none">
                <div className="col-span-1 md:col-span-6 flex gap-4">
                  <div className="w-24 h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">Size: OS • ID: {item.id}</p>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-center">
                  <div className="flex items-center h-10 bg-slate-50 rounded-lg px-2 border border-slate-200">
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                      className="p-1 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="p-1 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 text-center">
                  <p className="text-sm font-bold text-slate-500">${item.price.toFixed(2)}</p>
                </div>

                <div className="col-span-1 md:col-span-2 text-right">
                  <p className="text-base font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 h-fit sticky top-24">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="flex flex-col gap-4 text-sm mb-6 pb-6 border-b border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Estimated Shipping</span>
                <span className="text-slate-900 font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Estimated Tax (8%)</span>
                <span className="text-slate-900 font-bold">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-base font-bold text-slate-900 uppercase">Total Amount</span>
              <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg"
            >
              Checkout Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none">Authenticity Guaranteed</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">undo</span>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none">30-Day Free Returns</p>
              </div>
            </div>
          </div>

          <Link to="/products" className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CartPage;

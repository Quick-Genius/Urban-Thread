import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <main className="mx-auto max-w-[1200px] w-full px-4 md:px-10 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
        <Link to="/" className="text-primary hover:underline">Home</Link>
        <span className="material-symbols-outlined text-slate-400 text-xs">chevron_right</span>
        <span className="text-slate-900 dark:text-slate-100">Checkout</span>
      </nav>

      <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] mb-10">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Checkout Steps */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          {/* Step 1: Shipping */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">1</span>
              <h3 className="text-xl font-bold">Shipping Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">First Name</label>
                <input className="rounded-lg border-primary/20 bg-white dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" placeholder="Alex" type="text"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">Last Name</label>
                <input className="rounded-lg border-primary/20 bg-white dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" placeholder="Rivera" type="text"/>
              </div>
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">Address</label>
                <input className="rounded-lg border-primary/20 bg-white dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" placeholder="123 Fashion Ave" type="text"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">City</label>
                <input className="rounded-lg border-primary/20 bg-white dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" placeholder="New York" type="text"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">ZIP Code</label>
                <input className="rounded-lg border-primary/20 bg-white dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" placeholder="10001" type="text"/>
              </div>
            </div>
          </section>

          <hr className="border-primary/10"/>

          {/* Step 2: Payment */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm font-bold">2</span>
              <h3 className="text-xl font-bold">Payment Method</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 border-2 border-primary rounded-xl bg-primary/5 cursor-pointer">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">credit_card</span>
                  <span className="font-medium">Credit or Debit Card</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">Card Number</label>
                  <input className="rounded-lg border-primary/20 bg-white dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" placeholder="0000 0000 0000 0000" type="text"/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">Expiry Date</label>
                  <input className="rounded-lg border-primary/20 bg-white dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" placeholder="MM/YY" type="text"/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">CVC</label>
                  <input className="rounded-lg border-primary/20 bg-white dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-12 px-4 shadow-sm" placeholder="123" type="text"/>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary/40 cursor-pointer transition-colors">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-700"></div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">account_balance_wallet</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Digital Wallet (Apple/Google Pay)</span>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-primary/10"/>

          {/* Step 3: Review */}
          <section className="flex flex-col gap-6 opacity-60">
            <div className="flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm font-bold">3</span>
              <h3 className="text-xl font-bold">Review & Place Order</h3>
            </div>
            <p className="text-slate-500">Please complete the steps above to review your order.</p>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 flex flex-col gap-6 p-6 rounded-2xl bg-white dark:bg-background-dark/40 border border-primary/10 shadow-sm">
            <h3 className="text-xl font-bold">Order Summary</h3>
            
            <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-slate-500">Your cart is empty.</p>
                  <Link to="/products" className="text-primary font-bold hover:underline mt-2 inline-block">Continue Shopping</Link>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20 border border-primary/5 shrink-0" 
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-slate-900 dark:text-slate-100 text-base font-bold line-clamp-1">{item.name}</p>
                        <p className="text-slate-500 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch(addToCart(item))}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <p className="text-primary font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <hr className="border-primary/10"/>

            {/* Calculations */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black mt-2 pt-4 border-t border-primary/10">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input className="flex-1 rounded-lg border-primary/20 bg-background-light dark:bg-background-dark/50 focus:border-primary focus:ring-primary h-10 px-3 text-sm shadow-inner" placeholder="Promo code" type="text"/>
              <button className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold hover:bg-slate-800 transition-colors whitespace-nowrap">Apply</button>
            </div>

            <button className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/25">
              Place Your Order
            </button>
            
            <p className="text-center text-xs text-slate-500">
              By placing your order, you agree to Urban Thread's <br/>
              <a className="underline" href="#">Terms of Service</a> and <a className="underline" href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;

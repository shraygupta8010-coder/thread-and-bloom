'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CodModal from '@/components/CodModal';
import ToastNotification from '@/components/ToastNotification';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from '@/hooks/useTheme';

export default function ShoppingCartPage() {
  const { theme, toggleTheme } = useTheme();
  const [isCodOpen, setIsCodOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [couponInput, setCouponInput] = useState('');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscountAmount,
    getGrandTotal,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3200);
  };

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) { showToast('Please enter a coupon code.'); return; }
    const res = applyCoupon(couponInput);
    showToast(res.message);
    if (res.success) setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    showToast('Coupon removed.');
  };

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const grandTotal = getGrandTotal();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col transition-colors duration-300">
      <ToastNotification message={toast.message} visible={toast.visible} />

      <Navbar
        wishlistCount={0}
        onOpenCod={() => setIsCodOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activePage="discover"
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-32 sm:pt-36 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-on-surface-variant">
            <li><Link href="/" className="hover:text-on-surface transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blankets" className="hover:text-on-surface transition-colors">Shop</Link></li>
            <li>/</li>
            <li className="text-on-surface font-semibold">Shopping Cart</li>
          </ol>
        </nav>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-on-surface mb-8 sm:mb-10">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="py-20 text-center bg-surface-container border border-outline-variant/40 rounded-sm">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">production_quantity_limits</span>
            <h2 className="text-xl font-serif font-medium text-on-surface mb-2">Your Shopping Cart is Empty</h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
              Discover our exquisite collection of handcrafted blankets, bedsheets, and comforters.
            </p>
            <Link href="/blankets" className="inline-block bg-on-surface hover:bg-primary text-surface hover:text-on-primary text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 transition-all duration-200">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Product Table */}
            <div className="lg:col-span-8">
              <div className="hidden sm:grid sm:grid-cols-12 pb-3 border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant font-medium">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right pr-2">Total</div>
              </div>

              <div className="divide-y divide-outline-variant/30">
                {items.map((item) => (
                  <div key={item.id} className="py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="sm:col-span-6 flex gap-4 items-start">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 relative bg-surface-container border border-outline-variant/40 flex-shrink-0 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-on-surface leading-snug">{item.name}</h3>
                        <div className="mt-1 space-y-0.5 text-xs text-on-surface-variant">
                          <p>Collection Name: <span className="text-on-surface">{item.collection}</span></p>
                          <p>Size: <span className="text-on-surface">{item.size}</span></p>
                          <p>Colourway: <span className="text-on-surface">{item.colorName}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="sm:col-span-2 flex sm:justify-center items-center">
                      <span className="sm:hidden text-xs text-on-surface-variant mr-2">Price:</span>
                      <span className="text-sm font-medium text-on-surface">₹{item.price.toLocaleString('en-IN')}.00</span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="sm:col-span-2 flex sm:justify-center items-center">
                      <span className="sm:hidden text-xs text-on-surface-variant mr-2">Quantity:</span>
                      <div className="inline-flex items-center border border-outline-variant bg-surface-container-lowest">
                        <button
                          type="button"
                          onClick={() => { if (item.quantity > 1) { updateQuantity(item.id, -1); } else { removeItem(item.id); showToast(`Removed ${item.name}`); } }}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                        >
                          <span className="text-base font-light select-none">−</span>
                        </button>
                        <span className="w-9 h-8 flex items-center justify-center text-xs font-semibold text-on-surface select-none">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                        >
                          <span className="text-base font-light select-none">+</span>
                        </button>
                      </div>
                    </div>

                    {/* Line Total + Trash */}
                    <div className="sm:col-span-2 flex sm:justify-end items-center gap-3">
                      <span className="sm:hidden text-xs text-on-surface-variant mr-2">Total:</span>
                      <span className="text-sm font-semibold text-on-surface">₹{(item.price * item.quantity).toLocaleString('en-IN')}.00</span>
                      <button
                        type="button"
                        onClick={() => { removeItem(item.id); showToast(`Removed ${item.name}`); }}
                        aria-label={`Remove ${item.name}`}
                        className="text-on-surface-variant hover:text-error p-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete_outline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/40">
                <Link href="/blankets" className="inline-block bg-on-surface hover:bg-primary text-surface hover:text-on-primary text-xs font-bold uppercase tracking-[0.2em] px-8 py-3.5 transition-all duration-200 shadow-sm">
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-surface-container p-6 sm:p-7 border border-outline-variant/40 shadow-sm">
                <h2 className="text-xl font-serif font-medium text-on-surface mb-5">Total</h2>

                <div className="space-y-2.5 pb-4 border-b border-outline-variant/30 text-xs">
                  <div className="flex justify-between text-on-surface-variant uppercase tracking-wider font-medium">
                    <span>Product Name</span>
                    <span>Subtotal</span>
                  </div>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-on-surface">
                      <span className="line-clamp-1 pr-2">{item.name}{item.quantity > 1 ? ` (×${item.quantity})` : ''}</span>
                      <span className="font-medium whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}.00</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 text-on-surface">
                    <span>Total (+)</span>
                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>Product Discount (-)</span>
                    <span className="font-medium text-[#2E7D32]">{discount > 0 ? `-₹${discount.toLocaleString('en-IN')}.00` : '₹0.00'}</span>
                  </div>
                </div>

                <div className="py-4 space-y-2 border-b border-outline-variant/30">
                  <div className="flex justify-between text-xs text-on-surface">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-sm font-bold text-on-surface">Grand Total</span>
                    <span className="text-base sm:text-lg font-bold text-on-surface">₹{grandTotal.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="py-5">
                  <form onSubmit={handleApplyCoupon} className="flex">
                    <input
                      type="text"
                      placeholder="Enter Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant uppercase outline-none focus:border-primary"
                    />
                    <button type="submit" className="bg-surface-container-lowest hover:bg-on-surface hover:text-surface text-on-surface border-y border-r border-outline-variant px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors">
                      APPLY
                    </button>
                  </form>
                  {couponCode && (
                    <div className="mt-2.5 p-2 bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-between text-xs text-[#2E7D32]">
                      <span><strong>{couponCode}</strong> applied ({couponMessage})</span>
                      <button type="button" onClick={handleRemoveCoupon} className="hover:underline font-bold ml-2">✕</button>
                    </div>
                  )}
                  <p className="mt-2 text-[10px] text-on-surface-variant">
                    Privilege Codes:{' '}
                    <button type="button" onClick={() => setCouponInput('LUXURY10')} className="underline font-semibold">LUXURY10</button>
                    {' '}(10% off) or{' '}
                    <button type="button" onClick={() => setCouponInput('WELCOME500')} className="underline font-semibold">WELCOME500</button>
                  </p>
                </div>

                <Link href="/checkout" className="w-full block text-center bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.22em] py-4 transition-all duration-200 shadow-md">
                  PROCEED TO CHECKOUT
                </Link>

                <div className="mt-5 flex items-center justify-center flex-wrap gap-2 py-2 border-y border-outline-variant/30 text-on-surface-variant text-[11px]">
                  {['Paytm', 'VISA', 'Mastercard', 'AMEX', 'GPay', 'BHIM'].map((p) => (
                    <span key={p} className="font-bold px-1.5 py-0.5 bg-surface-container-lowest border border-outline-variant/50 rounded-xs">{p}</span>
                  ))}
                </div>


              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sign In Modal */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm">
          <div className="bg-surface border border-outline-variant/50 w-full max-w-md p-6 sm:p-8 relative shadow-2xl">
            <button type="button" onClick={() => setIsSignInModalOpen(false)} aria-label="Close"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h3 className="text-xl font-serif font-medium text-on-surface mb-2">Sign In to Thread &amp; Bloom</h3>
            <p className="text-xs text-on-surface-variant mb-6">Access saved addresses, track bespoke orders, and enjoy member privilege rates.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-semibold">Email / Mobile</label>
                <input type="text" placeholder="name@luxury.com / +91"
                  className="w-full bg-surface-container border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface outline-none" />
              </div>
              <button type="button"
                onClick={() => { setIsSignInModalOpen(false); showToast('Signed in as Thread & Bloom Patron'); }}
                className="w-full bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.2em] py-3.5 transition-colors">
                REQUEST OTP / SIGN IN
              </button>
            </div>
          </div>
        </div>
      )}

      <CodModal isOpen={isCodOpen} onClose={() => setIsCodOpen(false)} onSubmit={() => showToast('Order inquiry received')} />
      <Footer />
    </div>
  );
}

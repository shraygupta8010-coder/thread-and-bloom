'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import DiscoverHero from '@/components/discover/DiscoverHero';
import DiscoverCategories from '@/components/discover/DiscoverCategories';
import DiscoverNewArrivals from '@/components/discover/DiscoverNewArrivals';
import DiscoverTopSelling from '@/components/discover/DiscoverTopSelling';
import Footer from '@/components/Footer';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import CodModal from '@/components/CodModal';
import ToastNotification from '@/components/ToastNotification';
import { INITIAL_CART_ITEMS } from '@/data/products';
import { useTheme } from '@/hooks/useTheme';

const buildInitialCart = (): CartItem[] =>
  INITIAL_CART_ITEMS.map((item) => ({ ...item, qty: 1 }));

export default function DiscoverPage() {
  // ── State ──────────────────────────────────────────────────────────
  const { theme, toggleTheme } = useTheme();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCodOpen, setIsCodOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(buildInitialCart);
  const [toast, setToast] = useState({ message: '', visible: false });

  // ── Toast helper ────────────────────────────────────────────────────
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3200);
  }, []);

  // ── Cart actions ────────────────────────────────────────────────────
  const addToBag = useCallback(
    (title: string, variant: string) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.title === title && i.variant === variant);
        if (existing) {
          return prev.map((i) =>
            i.title === title && i.variant === variant ? { ...i, qty: i.qty + 1 } : i
          );
        }
        const image =
          INITIAL_CART_ITEMS.find((d) => d.title === title)?.image ??
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85';
        return [
          ...prev,
          {
            id: `cart-${Date.now()}`,
            title,
            variant,
            image,
            qty: 1,
          },
        ];
      });
      showToast(`Added ${title} to your bag`);
      setIsCartOpen(true);
    },
    [showToast]
  );

  const updateQty = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0A0A0A] text-on-surface dark:text-[#FAF6F0] transition-colors duration-300">
      {/* ── Fixed Navbar (Permanently dark, original dimensions) ───── */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={2}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCod={() => setIsCodOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activePage="discover"
      />

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="w-full overflow-hidden">
        {/* 1. Hero / Banner (Cinematic collection slider + sub-nav) */}
        <DiscoverHero />

        {/* 2. Categories (Bento Grid matching D'Decor) */}
        <DiscoverCategories />

        {/* 3. New Arrivals (Product showcase, no prices) */}
        <DiscoverNewArrivals onAddToBag={addToBag} />

        {/* 4. Top Selling (Horizontal sliding carousel with SHOP overlay) */}
        <DiscoverTopSelling />
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <Footer />

      {/* ── Cart Drawer ─────────────────────────────────────────── */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCodOpen(true);
        }}
      />

      {/* ── Cash On Delivery Checkout Modal ────────────────────── */}
      <CodModal
        isOpen={isCodOpen}
        onClose={() => setIsCodOpen(false)}
        onSubmit={() => {
          setIsCodOpen(false);
          setCartItems([]);
          showToast('Order placed successfully! Concierge will WhatsApp you shortly.');
        }}
      />

      {/* ── Notification Toast ──────────────────────────────────── */}
      <ToastNotification message={toast.message} visible={toast.visible} />
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import CinematicVideoBanner from '@/components/CinematicVideoBanner';
import HeroSection from '@/components/HeroSection';
import CollectionsSection from '@/components/CollectionsSection';
import NewArrivalsSection from '@/components/NewArrivalsSection';
import TopSellingCarousel from '@/components/TopSellingCarousel';
import CraftPillars from '@/components/CraftPillars';
import Footer from '@/components/Footer';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import CodModal from '@/components/CodModal';
import ToastNotification from '@/components/ToastNotification';
import { INITIAL_CART_ITEMS } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from '@/hooks/useTheme';

export default function HomePage() {
  // ── State ──────────────────────────────────────────────────────────
  const { theme, toggleTheme } = useTheme();
  const { addItem, openCartDropdown } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCodOpen, setIsCodOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });

  // ── Toast helper ────────────────────────────────────────────────────
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3200);
  }, []);

  // ── Cart actions ────────────────────────────────────────────────────
  const addToBag = useCallback(
    (title: string, variant: string) => {
      const parts = variant.split('/').map((s) => s.trim());
      const size = parts[1] || 'King';
      const colorName = parts[0] || 'Natural';
      const image =
        INITIAL_CART_ITEMS.find((d) => d.title === title)?.image ??
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBz0e690py1VcSuuQ8cFdIMM6W-Amra7rOMtMlkDUolBeV_c2w1epFHI4t399sBfJa7PX4Yc3UY7bB5alngrElknGoC6XWaq-SZ0Ihn_BFxeFOnQQVWJxa48c2-agNO0z80rEkBNYM0duRdBc7eZAxcPmblnMM7koGrM58kJ7Uby8hAw4r3ZEfssEI2cndat4cqKfHDSyhu9ByQU-YAPwoN0zqRB1BBopZo3pfK0gqurltVHr5Tsxio';

      addItem({
        productId: title.toLowerCase().replace(/\s+/g, '-'),
        name: title,
        collection: 'HERITAGE',
        subtitle: variant,
        size: `${size} Size`,
        colorName,
        price: 4999,
        image,
        quantity: 1,
      });

      showToast(`Added ${title} to your bag`);
      openCartDropdown();
    },
    [addItem, openCartDropdown, showToast]
  );

  const { items, updateQuantity, removeItem, getItemCount } = useCartStore();

  const updateQty = useCallback(
    (id: string, delta: number) => { updateQuantity(id, delta); },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeItem(id);
      showToast('Item removed from bag');
    },
    [removeItem, showToast]
  );

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCodOpen(true);
  }, []);

  const handleCodSubmit = useCallback(() => {
    setIsCodOpen(false);
    showToast('Your COD Order has been placed! Concierge confirmation sent.');
  }, [showToast]);

  const cartCount = getItemCount();

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen bg-surface transition-colors duration-300">
      {/* Fixed Navbar */}
      <Navbar
        cartCount={cartCount}
        wishlistCount={2}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCod={() => setIsCodOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main content — pushed below fixed header (h-20 + announcement ~32px ≈ 7rem) */}
      <main className="w-full pt-28 bg-surface transition-colors duration-300 min-h-screen">
        <div className="flex flex-col w-full">
          <CinematicVideoBanner />
          <HeroSection onOpenCod={() => setIsCodOpen(true)} />
          <CollectionsSection />
          <NewArrivalsSection onAddToBag={addToBag} />
          <TopSellingCarousel onAddToBag={addToBag} />
          <CraftPillars />
        </div>
      </main>

      <Footer />

      {/* Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        items={items.map((i) => ({
          id: i.id,
          title: i.name,
          variant: `${i.collection} / ${i.size} / ${i.colorName}`,
          image: i.image,
          qty: i.quantity,
        }))}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />

      <CodModal
        isOpen={isCodOpen}
        onClose={() => setIsCodOpen(false)}
        onSubmit={handleCodSubmit}
      />

      <ToastNotification message={toast.message} visible={toast.visible} />
    </div>
  );
}

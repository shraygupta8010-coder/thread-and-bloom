'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/blankets' },
  { label: 'Bedsheets', href: '/bedsheets' },
  { label: 'Comforters', href: '/comforters' },
  { label: 'About', href: '/#about' },
];

export default function Header() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const openCart = useUIStore((state) => state.openCart);
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="sticky top-0 left-0 right-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-espresso text-[#fbfaf8] py-2 text-center text-xs tracking-widest uppercase font-label-sm font-medium border-b border-white/10">
        <p className="tracking-[0.16em]">
          Free Pan-India Express Delivery on orders over ₹999 • Cash on Delivery Available
        </p>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-champagne-border">
        <div className="h-20 w-full px-margin flex items-center justify-between gap-6">
          {/* Logo & Brand Wordmark */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex flex-col group">
              <span className="font-headline-md text-headline-md tracking-[0.08em] uppercase text-espresso font-semibold">
                Thread &amp; Bloom
              </span>
              <span className="font-label-sm text-[10px] tracking-[0.24em] uppercase text-sand-terracotta">
                Luxury Bedding &amp; Living
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`font-label-md text-label-md uppercase tracking-[0.14em] transition-colors duration-200 pb-0.5 ${
                    isActive
                      ? 'text-espresso font-semibold border-b-2 border-espresso'
                      : 'text-on-surface-variant hover:text-espresso'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons & Search */}
          <div className="flex items-center gap-5">
            {/* Desktop Search Box */}
            <div className="hidden md:flex items-center bg-porcelain border border-champagne-border rounded-full px-4 py-1.5 focus-within:border-espresso/40 focus-within:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="material-symbols-outlined text-outline text-[18px] mr-2">search</span>
              <input
                type="text"
                placeholder="Search Turkish cotton, Sherpa..."
                className="bg-transparent border-0 outline-none font-body-md text-xs text-on-surface placeholder:text-outline w-44 lg:w-56"
              />
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden flex items-center justify-center text-on-surface-variant hover:text-espresso"
              aria-label="Search"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/#curated-catalog"
              className="relative flex items-center justify-center text-on-surface-variant hover:text-espresso transition-colors"
              aria-label="Wishlist"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              <span className="absolute -top-1.5 -right-2 bg-sand-terracotta text-white font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium shadow-sm">
                2
              </span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center text-on-surface-variant hover:text-espresso transition-colors"
              aria-label="Open Cart Drawer"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              <span className="absolute -top-1.5 -right-2 bg-espresso text-white font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium shadow-sm">
                {cartItemCount}
              </span>
            </button>

            {/* Account Trigger */}
            <button
              onClick={() => openAuthModal('signin')}
              className="w-8 h-8 rounded-full bg-porcelain border border-champagne-border flex items-center justify-center text-espresso hover:border-espresso transition-colors cursor-pointer"
              aria-label="User Account"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 py-3 bg-porcelain border-t border-champagne-border flex items-center">
            <span className="material-symbols-outlined text-outline text-[18px] mr-2">search</span>
            <input
              type="text"
              autoFocus
              placeholder="Search Turkish cotton, Sherpa..."
              className="bg-transparent border-0 outline-none font-body-md text-xs text-on-surface placeholder:text-outline w-full"
            />
          </div>
        )}

        {/* Mobile Category Quick Bar */}
        <div className="xl:hidden flex items-center gap-5 overflow-x-auto px-4 py-2 border-t border-champagne-border bg-porcelain/60 scrollbar-hide text-xs">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap font-label-md uppercase tracking-wider text-[11px] ${
                pathname === link.href ? 'text-espresso font-semibold' : 'text-on-surface-variant'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>
    </div>
  );
}

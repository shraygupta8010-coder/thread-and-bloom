'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Sun, Moon } from 'lucide-react';

interface BlanketsNavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenCod?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function BlanketsNavbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenCod,
  theme = 'light',
  onToggleTheme,
  searchQuery,
  onSearchChange,
}: BlanketsNavbarProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const PRIMARY_NAV = [
    { label: 'Shop', href: '/blankets', active: true },
    { label: 'Discover', href: '/discover', active: false },
    { label: 'Style Expert', href: '/#style', active: false },
    { label: 'Sustainability', href: '/#sustainability', active: false },
    { label: 'Blog', href: '/#blog', active: false },
    { label: 'Store Locator', href: '/#stores', active: false },
  ];

  const SECONDARY_NAV = [
    { label: 'Bedding', href: '/blankets', active: true },
    { label: 'Bath', href: '/shop?category=Towels', active: false },
    { label: 'Ready Made Curtains', href: '/#curtains', active: false },
    { label: 'Gifting', href: '/#gifting', active: false },
    { label: 'Kids', href: '/#kids', active: false },
    { label: 'Decor Accessories', href: '/#decor', active: false },
    { label: 'Offers', href: '/#offers', active: false, highlight: true },
  ];

  return (
    <header className="w-full bg-white dark:bg-[#100F0E] border-b border-[#EBE8E3] dark:border-white/10 sticky top-0 z-40 shadow-xs">
      {/* Topmost Brand & Utility Bar */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-3 flex items-center justify-between">
        {/* Brand Logo - D'DECOR style typography */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <span className="font-serif text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-[#FAF6F0] leading-none uppercase">
              T&apos;DECOR
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-stone-500 dark:text-[#E6C594] font-medium mt-0.5">
              Live Beautiful
            </span>
          </div>
        </Link>

        {/* Right Action Icons: Dealer, AID, User, Wishlist, Cart, Theme */}
        <div className="flex items-center gap-5 sm:gap-7 text-xs text-stone-800 dark:text-stone-200 font-medium">
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-semibold tracking-wider uppercase text-stone-600 dark:text-stone-400">
            <button
              onClick={onOpenCod}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Dealer Log In
            </button>
            <button
              onClick={onOpenCod}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              AID Log In
            </button>
          </div>

          {/* User Account */}
          <button
            onClick={onOpenCod}
            aria-label="Account"
            className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span className="hidden sm:inline text-xs">Account</span>
          </button>

          {/* Wishlist */}
          <Link
            href="#wishlist"
            className="relative flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"
          >
            <Heart className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span className="text-xs font-semibold">{wishlistCount}</span>
          </Link>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            aria-label="Bag"
            className="relative flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span className="bg-[#1C1C19] dark:bg-[#E6C594] text-white dark:text-[#12100E] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              className="p-1 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E6C594]" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Nav Bar (Shop, Discover, Style Expert, etc.) */}
      <div className="border-t border-b border-[#F0EDE8] dark:border-white/5 py-2.5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-hide">
            {PRIMARY_NAV.map((nav) => (
              <Link
                key={nav.label}
                href={nav.href}
                className={`text-xs uppercase tracking-wider font-semibold transition-colors ${
                  nav.active
                    ? 'bg-[#1C1C19] text-white px-3.5 py-1 rounded-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white'
                }`}
              >
                {nav.label}
              </Link>
            ))}
          </nav>

          {/* Search Box on Right */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F6F3EE] dark:bg-stone-800/80 px-3 py-1.5 rounded-xs border border-transparent focus-within:border-stone-400">
              <Search className="w-3.5 h-3.5 text-stone-500 mr-2" />
              <input
                type="text"
                placeholder="Search blankets, bedsheets..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs text-stone-800 dark:text-stone-100 placeholder:text-stone-400 w-36 sm:w-48"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Category Bar: Bedding, Bath, Curtains, etc. */}
      <div className="bg-[#FAF8F5] dark:bg-[#0E0D0C] py-2 border-b border-[#EBE8E3] dark:border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-hide text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
          {SECONDARY_NAV.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className={`whitespace-nowrap transition-colors ${
                sub.active
                  ? 'text-stone-900 dark:text-[#E6C594] font-bold border-b border-stone-900 dark:border-[#E6C594] pb-0.5'
                  : sub.highlight
                  ? 'text-[#BA1A1A] dark:text-[#ffb4ab] font-bold'
                  : 'hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

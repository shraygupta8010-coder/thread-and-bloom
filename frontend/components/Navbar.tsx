'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import MiniCartDropdown from '@/components/cart/MiniCartDropdown';
import ProfileModal from '@/components/ProfileModal';
import AuthModal from '@/components/AuthModal';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

interface NavbarProps {
  cartCount?: number;
  wishlistCount: number;
  onOpenCart?: () => void;
  onOpenCod: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  activePage?: 'home' | 'discover' | 'blankets' | 'comforters';
}

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenCod,
  theme = 'dark',
  onToggleTheme,
  activePage = 'home',
}: NavbarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { getItemCount, toggleCartDropdown } = useCartStore();
  const {
    profile,
    isLoggedIn,
    isProfileModalOpen,
    openProfileModal,
    closeProfileModal,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    logout,
  } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentCartCount = mounted ? getItemCount() : (cartCount ?? 0);

  const handleCartClick = () => {
    toggleCartDropdown();
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setUserMenuOpen(prev => !prev);
    } else {
      openAuthModal();
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const userInitial = profile?.firstName ? profile.firstName[0].toUpperCase() : '?';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-[0_1px_12px_rgba(0,0,0,0.7)]">
      {/* Announcement Bar */}
      <div className="bg-[#0A0A0A] border-b border-[#E6C594]/15 py-2">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-[#E6C594]">
            100% Premium Cotton &amp; Plush Weaves • Cash on Delivery Available
          </p>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-[#12100E]/96 backdrop-blur-md border-b border-[#E6C594]/10">
        <div className="h-20 w-full max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link className="flex flex-col" href="/">
              <span className="font-headline-md text-headline-md tracking-tight text-[#FAF6F0] leading-tight">
                Thread &amp; Bloom
              </span>
              <span className="font-label-sm text-[10px] tracking-[0.2em] uppercase text-[#E6C594] mt-0.5">
                Luxury Bedding &amp; Living
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-7">
            <Link
              aria-current={activePage === 'home' ? 'page' : undefined}
              className={`font-label-md text-label-md uppercase tracking-wider transition-colors duration-200 ${
                activePage === 'home'
                  ? 'text-[#E6C594] font-semibold text-xs border-b-2 border-[#E6C594] pb-0.5'
                  : 'text-[#EDE4D7] hover:text-[#E6C594]'
              }`}
              href="/"
            >
              Home
            </Link>
            <Link
              aria-current={activePage === 'discover' ? 'page' : undefined}
              className={`font-label-md text-label-md uppercase tracking-wider transition-colors duration-200 ${
                activePage === 'discover'
                  ? 'text-[#E6C594] font-semibold text-xs border-b-2 border-[#E6C594] pb-0.5'
                  : 'text-[#EDE4D7] hover:text-[#E6C594]'
              }`}
              href="/discover"
            >
              Discover
            </Link>
            <Link
              className="font-label-md text-label-md uppercase tracking-wider text-[#EDE4D7] hover:text-[#E6C594] transition-colors duration-200"
              href="/#new-arrivals"
            >
              New Arrivals
            </Link>
            <Link
              className="font-label-md text-label-md uppercase tracking-wider text-[#EDE4D7] hover:text-[#E6C594] transition-colors duration-200"
              href="/#top-selling"
            >
              Top Selling
            </Link>
            <Link
              className="font-label-md text-label-md uppercase tracking-wider text-[#EDE4D7] hover:text-[#E6C594] transition-colors duration-200"
              href="/craft-care"
            >
              Craft &amp; Care
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="hidden md:flex items-center bg-[#1F1C19] border border-[#3A3125] focus-within:border-[#E6C594]/50 rounded-full px-4 py-1.5 transition-colors">
              <span className="material-symbols-outlined text-[#E6C594] text-[20px] mr-2">search</span>
              <input
                className="bg-transparent border-0 outline-none font-body-md text-xs text-[#FAF6F0] placeholder:text-[#C7B9A5]/60 w-44 lg:w-56"
                placeholder="Search Turkish cotton, Sherpa..."
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                type="button"
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E6C594]/50 bg-[#1F1C19] hover:bg-[#2A2318] hover:border-[#E6C594] transition-all duration-200 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px] text-[#E6C594]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                <span className="font-label-sm text-[11px] uppercase tracking-wider font-bold text-[#E6C594] hidden sm:inline-block">
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </span>
              </button>
            )}

            {/* Track Order Button */}
            <Link
              href="/orders"
              className="relative flex items-center justify-center text-[#EDE4D7] hover:text-[#E6C594] transition-colors"
              aria-label="My Orders"
              title="My Orders"
            >
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            </Link>

            {/* Wishlist */}
            <a
              className="relative flex items-center justify-center text-[#EDE4D7] hover:text-[#E6C594] transition-colors"
              href="#new-arrivals"
              aria-label="Wishlist"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              <span className="absolute -top-1.5 -right-2 bg-[#E6C594] text-[#12100E] font-label-sm text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            </a>

            {/* Cart */}
            <div className="relative">
              <button
                aria-label="Open Cart"
                className="relative flex items-center justify-center text-[#EDE4D7] hover:text-[#E6C594] transition-colors p-1"
                onClick={handleCartClick}
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                <span
                  suppressHydrationWarning
                  className="absolute -top-1 -right-1.5 bg-[#E6C594] text-[#12100E] font-label-sm text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {currentCartCount}
                </span>
              </button>
              <MiniCartDropdown />
            </div>

            {/* Profile / Auth button with dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleProfileClick}
                type="button"
                aria-label={isLoggedIn ? 'Patron Account Menu' : 'Sign In'}
                suppressHydrationWarning
                className="w-8 h-8 rounded-full bg-[#E6C594] text-[#12100E] flex items-center justify-center shadow-sm hover:bg-[#FAF6F0] transition-colors font-bold text-sm"
              >
                {mounted && isLoggedIn ? (
                  <span className="text-[13px] font-bold leading-none">{userInitial}</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">person</span>
                )}
              </button>

              {/* Logged-in dropdown menu */}
              {mounted && isLoggedIn && userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#12100E] border border-[#E6C594]/20 shadow-xl z-50 py-1">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-[#E6C594]/15">
                    <p className="text-xs font-semibold text-[#FAF6F0] truncate">
                      {profile?.firstName} {profile?.lastName}
                    </p>
                    <p className="text-[11px] text-[#C7B9A5] truncate mt-0.5">{profile?.email || profile?.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setUserMenuOpen(false); openProfileModal(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#EDE4D7] hover:bg-[#1F1C19] hover:text-[#E6C594] transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                    My Profile &amp; Address
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors text-left border-t border-[#E6C594]/10"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal (shown when not logged in) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLoginSuccess={openProfileModal}
      />

      {/* Profile Modal (shown when logged in) */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </div>
  );
}

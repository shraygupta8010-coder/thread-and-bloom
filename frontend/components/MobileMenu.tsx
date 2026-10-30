'use client';

import { X, Home, ShoppingBag, User, Heart, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

const categories = [
  { id: 'all', name: 'All Bedding & Blankets', href: '/blankets' },
  { id: 'Bedsheets', name: 'King & Queen Bedsheets', href: '/blankets' },
  { id: 'Comforters', name: 'Duvets & Comforters', href: '/comforters' },
  { id: 'Diwali', name: 'Diwali Festive Sets', href: '/blankets' },
  { id: 'Blankets', name: 'Artisan Blankets & Dohars', href: '/blankets' },
];

export default function MobileMenu() {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signOut = useAuthStore((state) => state.signOut);

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs z-50 lg:hidden animate-fade-in"
        onClick={closeMobileMenu}
      />

      {/* Slide Drawer */}
      <div className="fixed left-0 top-0 h-full w-[310px] bg-[#FCFBF9] z-50 shadow-2xl lg:hidden flex flex-col border-r border-[#E7E5E0] animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E0] bg-[#F5F3EF]">
          <div>
            <p className="font-serif text-lg font-semibold text-stone-900 leading-tight">
              LuxeBed <span className="text-[#9A6038] font-normal italic">&amp;</span> Bath
            </p>
            <p className="text-[9px] uppercase tracking-[0.24em] text-stone-500 font-medium">
              Natural Luxury Living
            </p>
          </div>
          <button
            onClick={closeMobileMenu}
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-[#E7E5E0] bg-white">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 flex items-center justify-center text-[#2D4A3E] font-bold text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">{user?.fullName}</p>
                  <p className="text-[11px] text-stone-500 truncate max-w-[150px]">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  closeMobileMenu();
                }}
                className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                openAuthModal('signin');
                closeMobileMenu();
              }}
              className="w-full py-2.5 bg-stone-900 hover:bg-[#2D4A3E] text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              Sign In or Register
            </button>
          )}
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2.5 px-2">Collections</p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F5F3EF] text-xs font-semibold text-stone-800 transition-colors"
                >
                  <span className={cat.id === 'deals' ? 'text-[#9A6038]' : ''}>{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E7E5E0] pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2.5 px-2">Client Care</p>
            <div className="space-y-1">
              {[
                { label: '30-Night Sleep Trial', href: '#' },
                { label: 'Complimentary Shipping Info', href: '#' },
                { label: 'Bedding Care Guide', href: '#' },
                { label: 'Concierge Help', href: '#' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-lg text-xs text-stone-600 hover:text-stone-900 hover:bg-[#F5F3EF] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7E5E0] bg-[#F5F3EF] text-[10px] text-stone-500 text-center">
          OEKO-TEX® Standard 100 Certified Linens
        </div>
      </div>
    </>
  );
}

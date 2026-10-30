'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function MiniCartDropdown() {
  const {
    items,
    isDropdownOpen,
    closeCartDropdown,
    removeItem,
    getSubtotal,
  } = useCartStore();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeCartDropdown();
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, closeCartDropdown]);

  if (!isDropdownOpen) return null;

  const subtotal = getSubtotal();

  return (
    <div
      ref={dropdownRef}
      className="absolute top-[calc(100%+10px)] right-0 w-[320px] sm:w-[360px] bg-white dark:bg-[#1C1814] border border-[#E0D5C8] dark:border-[#382E22] shadow-[0_16px_48px_rgba(0,0,0,0.18)] z-[200]"
    >
      {/* Top Banner: Cart Subtotal */}
      <div className="bg-[#F2EDE5] dark:bg-[#2A231A] px-5 py-3 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#3D3529] dark:text-[#E8DEC8] font-medium">
          Cart Subtotal :
        </span>
        <span className="text-sm font-bold text-[#1A1512] dark:text-[#FAF6F0] tracking-tight">
          ₹{subtotal.toLocaleString('en-IN')}.00
        </span>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-[10px] text-[#7A7268] dark:text-[#A89F91] uppercase tracking-[0.18em] mb-3 font-semibold">
          Recently added item(s)
        </p>

        {items.length === 0 ? (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-3xl text-[#C4BAB0] mb-1">shopping_bag</span>
            <p className="text-xs text-[#7A7268] dark:text-[#A89F91]">Your cart is empty</p>
          </div>
        ) : (
          <div className="max-h-[240px] overflow-y-auto space-y-3 pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 items-start pb-3 border-b border-[#EFE8DC] dark:border-[#2E271F] last:border-0"
              >
                {/* Thumbnail */}
                <div className="w-[62px] h-[62px] relative bg-[#F5EFEB] dark:bg-[#25201A] border border-[#E6DCBF]/50 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="62px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-[11px] font-semibold text-[#1A1512] dark:text-[#FAF6F0] leading-tight line-clamp-2 pr-1">
                      {item.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="text-[#A89F91] hover:text-[#1A1512] dark:hover:text-white transition-colors flex-shrink-0 mt-0.5"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-[#7A7268] dark:text-[#A89F91] mt-0.5">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-[11px] font-bold text-[#1A1512] dark:text-[#E6C594] mt-1">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIEW AND EDIT CART Button */}
      <div className="px-5 pb-5 pt-2">
        <Link
          href="/cart"
          onClick={closeCartDropdown}
          className="block w-full text-center py-3 border border-[#C4BAB0] dark:border-[#4B3E2F] bg-[#F2EDE5] hover:bg-[#E6DCCE] dark:bg-[#2A231A] dark:hover:bg-[#352C21] text-[#1A1512] dark:text-[#FAF6F0] text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-200"
        >
          VIEW AND EDIT CART
        </Link>
      </div>
    </div>
  );
}

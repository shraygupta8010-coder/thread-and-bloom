'use client';

import Image from 'next/image';
import { CartItemData } from '@/data/products';

export interface CartItem extends CartItemData {
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-surface-container-lowest z-50 shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface text-2xl">shopping_bag</span>
            <h3 className="font-title-lg text-title-lg text-on-surface">Your Sanctuaries Bag</h3>
            <span className="bg-primary text-on-primary font-label-sm text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            aria-label="Close cart"
            className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 && (
            <p className="text-center text-on-surface-variant font-body-md text-sm py-12">
              Your bag is empty. Start exploring.
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-6 border-b border-outline-variant/20"
            >
              <div className="w-20 h-24 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-title-lg text-sm text-on-surface">{item.title}</h4>
                    <p className="font-body-md text-xs text-on-surface-variant">{item.variant}</p>
                  </div>
                  <button
                    className="text-outline hover:text-error transition-colors"
                    onClick={() => onRemove(item.id)}
                    title="Remove item"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center bg-surface-container rounded-md px-2 py-1 gap-3">
                    <button
                      className="text-on-surface hover:text-primary font-bold text-sm"
                      onClick={() => onUpdateQty(item.id, -1)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="font-label-md text-xs">{item.qty}</span>
                    <button
                      className="text-on-surface hover:text-primary font-bold text-sm"
                      onClick={() => onUpdateQty(item.id, 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold">
                    COD Eligible
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-container-low border-t border-outline-variant/30 space-y-4">
          <div className="space-y-1.5 text-xs font-body-md">
            <div className="flex justify-between text-on-surface-variant">
              <span>Selected Pieces</span>
              <span className="font-semibold text-on-surface">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Express Delivery</span>
              <span className="text-primary font-semibold">Complimentary</span>
            </div>
          </div>
          <button
            className="w-full py-4 bg-on-background text-on-primary rounded-lg font-label-md text-xs uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-md"
            onClick={onCheckout}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">local_shipping</span>
            <span>Proceed to COD Checkout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

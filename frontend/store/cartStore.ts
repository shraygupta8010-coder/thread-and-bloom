import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

export const INITIAL_CART_ITEMS: CartItem[] = [];

interface CartStore {
  items: CartItem[];
  isDropdownOpen: boolean;
  couponCode: string | null;
  couponDiscountPercent: number;
  couponDiscountAmount: number;
  couponMessage: string | null;

  // Actions
  toggleCartDropdown: () => void;
  openCartDropdown: () => void;
  closeCartDropdown: () => void;

  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, deltaOrExact: number, isExact?: boolean) => void;
  clearCart: () => void;

  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Computed Getters
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: INITIAL_CART_ITEMS,
      isDropdownOpen: false,
      couponCode: null,
      couponDiscountPercent: 0,
      couponDiscountAmount: 0,
      couponMessage: null,

      toggleCartDropdown: () => {
        set((state) => ({ isDropdownOpen: !state.isDropdownOpen }));
      },

      openCartDropdown: () => {
        set({ isDropdownOpen: true });
      },

      closeCartDropdown: () => {
        set({ isDropdownOpen: false });
      },

      addItem: (newItem) => {
        set((state) => {
          const itemKey =
            newItem.id ||
            `${newItem.productId}-${newItem.size}-${newItem.colorName}`.toLowerCase().replace(/\s+/g, '-');

          const existingIndex = state.items.findIndex(
            (i) =>
              i.id === itemKey ||
              (i.productId === newItem.productId &&
                i.size === newItem.size &&
                i.colorName === newItem.colorName)
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += newItem.quantity || 1;
            return { items: updated, isDropdownOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                ...newItem,
                id: itemKey,
                quantity: newItem.quantity || 1,
              },
            ],
            isDropdownOpen: true,
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, deltaOrExact: number, isExact = false) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === id) {
                const nextQty = isExact ? deltaOrExact : item.quantity + deltaOrExact;
                return { ...item, quantity: Math.max(1, nextQty) };
              }
              return item;
            })
            .filter((item) => item.quantity > 0);

          return { items: updated };
        });
      },

      clearCart: () => {
        set({
          items: [],
          couponCode: null,
          couponDiscountPercent: 0,
          couponDiscountAmount: 0,
          couponMessage: null,
        });
      },

      applyCoupon: (rawCode: string) => {
        const code = rawCode.trim().toUpperCase();
        if (!code) {
          return { success: false, message: 'Please enter a coupon code.' };
        }

        const validCoupons: Record<
          string,
          { percent?: number; amount?: number; desc: string }
        > = {
          LUXURY10: { percent: 10, desc: '10% Luxury Privilege discount applied' },
          DECOR10: { percent: 10, desc: '10% Decor Special discount applied' },
          WELCOME500: { amount: 500, desc: '₹500 Welcome Voucher applied' },
          SANCTUARY20: { percent: 20, desc: '20% Sanctuary Collection discount applied' },
        };

        const matched = validCoupons[code];
        if (matched) {
          set({
            couponCode: code,
            couponDiscountPercent: matched.percent || 0,
            couponDiscountAmount: matched.amount || 0,
            couponMessage: matched.desc,
          });
          return { success: true, message: matched.desc };
        }

        return {
          success: false,
          message: 'Invalid coupon code. Try LUXURY10 or DECOR10.',
        };
      },

      removeCoupon: () => {
        set({
          couponCode: null,
          couponDiscountPercent: 0,
          couponDiscountAmount: 0,
          couponMessage: null,
        });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const { couponDiscountPercent, couponDiscountAmount } = get();

        if (couponDiscountPercent > 0) {
          return Math.round((subtotal * couponDiscountPercent) / 100);
        }
        if (couponDiscountAmount > 0) {
          return Math.min(subtotal, couponDiscountAmount);
        }
        return 0;
      },

      getShippingFee: () => {
        return 0; // Complimentary Luxury Delivery
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'tb-luxury-cart-store',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscountPercent: state.couponDiscountPercent,
        couponDiscountAmount: state.couponDiscountAmount,
        couponMessage: state.couponMessage,
      }),
    }
  )
);

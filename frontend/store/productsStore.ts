'use client';

import { create } from 'zustand';
import { ProductItem, fetchProducts, quickUpdateStockApi, deleteProductApi } from '@/lib/api';
import { CATALOG_PRODUCTS } from '@/data/catalog';

interface ProductsState {
  products: ProductItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  brandFilter: string;
  lastFetched: number;

  // Actions
  loadProducts: (category?: string, search?: string, brand?: string, force?: boolean) => Promise<void>;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  setBrandFilter: (brand: string) => void;
  setProducts: (products: ProductItem[]) => void;
  addProduct: (product: ProductItem) => void;
  updateProduct: (product: ProductItem) => void;
  quickUpdateStock: (adminKey: string, id: string, deltaOrExact: number, isExact?: boolean) => Promise<boolean>;
  deleteProduct: (adminKey: string, id: string) => Promise<boolean>;
  getProductById: (id: string) => ProductItem | undefined;
}

const FALLBACK_PRODUCTS: ProductItem[] = CATALOG_PRODUCTS;

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: FALLBACK_PRODUCTS,
  loading: false,
  error: null,
  selectedCategory: 'All',
  searchQuery: '',
  brandFilter: '',
  lastFetched: 0,

  loadProducts: async (category?: string, search?: string, brand?: string, force = false) => {
    // CACHING DISABLED FOR DEVELOPMENT - Always fetch fresh
    set({ loading: true, error: null });
    try {
      const res = await fetchProducts(category, search, brand);
      if (res.success && Array.isArray(res.products) && res.products.length > 0) {
        set({ products: res.products, loading: false, lastFetched: Date.now() });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      console.warn('[Products Store] Backend unreachable, using cached catalog:', err);
      set({ loading: false });
    }
  },

  setSelectedCategory: (cat: string) => {
    set({ selectedCategory: cat });
    get().loadProducts(cat, get().searchQuery, get().brandFilter, true);
  },

  setSearchQuery: (q: string) => {
    set({ searchQuery: q });
    get().loadProducts(get().selectedCategory, q, get().brandFilter, true);
  },

  setBrandFilter: (brand: string) => {
    set({ brandFilter: brand });
    get().loadProducts(get().selectedCategory, get().searchQuery, brand, true);
  },

  setProducts: (products: ProductItem[]) => {
    set({ products });
  },

  addProduct: (product: ProductItem) => {
    set((state) => ({ products: [product, ...state.products] }));
  },

  updateProduct: (product: ProductItem) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    }));
  },

  quickUpdateStock: async (adminKey: string, id: string, deltaOrExact: number, isExact = false) => {
    try {
      const current = get().products.find((p) => p.id === id);
      const newQty = isExact ? deltaOrExact : Math.max(0, (current?.stockQuantity || 0) + deltaOrExact);

      // Optimistic update
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, stockQuantity: newQty, inStock: newQty > 0 } : p
        ),
      }));

      const res = await quickUpdateStockApi(adminKey, id, { stockQuantity: newQty });
      return res.success;
    } catch {
      return false;
    }
  },

  deleteProduct: async (adminKey: string, id: string) => {
    try {
      const res = await deleteProductApi(adminKey, id);
      if (res.success) {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  getProductById: (id: string) => {
    return get().products.find((p) => p.id === id || p.sku.toLowerCase() === id.toLowerCase());
  },
}));

'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BlanketsFilterSidebar, { FilterState } from '@/components/blankets/BlanketsFilterSidebar';
import BlanketCard from '@/components/blankets/BlanketCard';
import BlanketQuickViewModal from '@/components/blankets/BlanketQuickViewModal';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import CodModal from '@/components/CodModal';
import ToastNotification from '@/components/ToastNotification';
import Footer from '@/components/Footer';
import { BLANKETS_CATALOG, BlanketProduct } from '@/data/blanketsCatalog';
import { useCartStore } from '@/store/cartStore';
import { useProductsStore } from '@/store/productsStore';
import { adaptToBlanket } from '@/lib/productAdapters';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

export default function BlanketsPage() {
  // Synchronized theme hook
  const { theme, toggleTheme } = useTheme();

  // Cart & Modal states
  const { items, addItem, updateQuantity, removeItem, openCartDropdown, getItemCount } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCodOpen, setIsCodOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });

  // Quick View state
  const [quickViewProduct, setQuickViewProduct] = useState<BlanketProduct | null>(null);
  const [quickViewSize, setQuickViewSize] = useState<'Queen' | 'King'>('King');
  const [quickViewColor, setQuickViewColor] = useState<string>('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    brands: [],
    priceRange: null,
  });

  // Check URL parameter for brand filter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const brandParam = urlParams.get('brand');
      
      if (brandParam) {
        setFilters(prev => ({
          ...prev,
          brands: [decodeURIComponent(brandParam)]
        }));
        
        // Optional: Remove the parameter from URL after applying
        // window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3200);
  }, []);

  // Cart Handlers
  const handleAddToBag = useCallback(
    (title: string, variant: string, image: string, price: number) => {
      const parts = variant.split('/').map((s) => s.trim());
      const collection = parts[0] || 'PRISTINE';
      const size = parts[1] || 'King';
      const colorName = parts[2] || 'Natural';

      addItem({
        productId: title.toLowerCase().replace(/\s+/g, '-'),
        name: title,
        collection,
        subtitle: `${size} Bed Sheet Set`,
        size: `${size} Size`,
        colorName,
        price,
        image,
        quantity: 1,
      });

      showToast(`Added ${title} (${size}) to your bag`);
      openCartDropdown();
    },
    [addItem, openCartDropdown, showToast]
  );

  const updateQty = useCallback(
    (id: string, delta: number) => {
      updateQuantity(id, delta);
    },
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
    showToast('Your COD Order has been confirmed! Our concierge will dispatch today.');
  }, [showToast]);

  const handleQuickViewOpen = (
    product: BlanketProduct,
    selectedSize: 'Queen' | 'King',
    selectedColor: string
  ) => {
    setQuickViewProduct(product);
    setQuickViewSize(selectedSize);
    setQuickViewColor(selectedColor);
    setIsQuickViewOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      sizes: [],
      brands: [],
      priceRange: null,
    });
    setSearchQuery('');
  };

  const { products: dynamicProducts, loadProducts, setBrandFilter } = useProductsStore();

  useEffect(() => {
    // Check URL parameter for brand filter
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const brandParam = urlParams.get('brand');
      
      if (brandParam) {
        const decodedBrand = decodeURIComponent(brandParam);
        // Set brand filter which will trigger API call with brand parameter
        setBrandFilter(decodedBrand);
        // Also update local filters state for UI
        setFilters(prev => ({
          ...prev,
          brands: [decodedBrand]
        }));
      } else {
        // If no brand param, load all products
        loadProducts();
      }
    }
  }, [setBrandFilter, loadProducts]);

  const allBlankets = useMemo(() => {
    const customBlankets = dynamicProducts
      .filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return (
          cat.includes('blanket') ||
          cat.includes('bedsheet') ||
          cat.includes('towel') ||
          cat.includes('throw') ||
          cat.includes('bedding') ||
          cat.includes('set') ||
          cat.includes('dohar') ||
          cat.includes('comforter')
        );
      })
      .map(adaptToBlanket);

    const ids = new Set(customBlankets.map((b) => b.id));
    const catalogRemaining = BLANKETS_CATALOG.filter((b) => !ids.has(b.id));
    return [...customBlankets, ...catalogRemaining];
  }, [dynamicProducts]);

  // Filter & Sort computation
  const filteredProducts = useMemo(() => {
    // Backend already filtered by brand, so we only filter locally by Size and Price
    return allBlankets.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCol = item.collection.toLowerCase().includes(q);
        const matchesFabric = item.fabricType.toLowerCase().includes(q);
        if (!matchesName && !matchesCol && !matchesFabric) return false;
      }

      // Sizes: Check if product supports any selected size
      if (filters.sizes.length > 0) {
        const hasMatchingSize = filters.sizes.some((sz) => item.sizes.includes(sz));
        if (!hasMatchingSize) return false;
      }

      // Price filter (evaluate based on King price by default)
      if (filters.priceRange) {
        const p = item.sizePrices.King;
        if (filters.priceRange === 'under-3500' && p >= 3500) return false;
        if (filters.priceRange === '3500-5500' && (p < 3500 || p > 5500)) return false;
        if (filters.priceRange === 'above-5500' && p <= 5500) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.sizePrices.King - b.sizePrices.King;
      if (sortBy === 'price-desc') return b.sizePrices.King - a.sizePrices.King;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.reviewsCount - a.reviewsCount;
      return 0; // featured default
    });
  }, [allBlankets, filters, searchQuery, sortBy]);

  const cartCount = getItemCount();

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface transition-colors duration-300">
      {/* Original Fixed Header with Theme Switcher */}
      <Navbar
        cartCount={cartCount}
        wishlistCount={2}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCod={() => setIsCodOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activePage="blankets"
      />

      {/* Main Content Area — pushed below fixed header */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-32 pb-16 bg-surface transition-colors duration-300">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-on-surface-variant uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/discover" className="hover:text-primary transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="font-bold text-primary">
            Blankets &amp; Bedsheets
          </span>
        </nav>

        {/* Catalog Header Bar: Title + Count on Left, Sort By on Right */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 mb-8 border-b border-outline-variant/30 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-4">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight uppercase text-on-surface">
                BEDDING &amp; BLANKETS
              </h1>
              <span className="text-sm font-medium text-on-surface-variant">
                {filteredProducts.length} Items
              </span>
            </div>
            
            {/* SIZE SELECTOR BUTTONS - PROMINENT */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Shop by Size:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (filters.sizes.length === 0 || filters.sizes.includes('Queen')) {
                      setFilters({ ...filters, sizes: ['King'] });
                    } else {
                      setFilters({ ...filters, sizes: [] });
                    }
                  }}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${
                    filters.sizes.includes('King') && filters.sizes.length === 1
                      ? 'border-primary bg-primary text-on-primary shadow-md'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  👑 King Size
                  <span className="ml-2 text-[10px] opacity-70">(17)</span>
                </button>
                <button
                  onClick={() => {
                    if (filters.sizes.length === 0 || filters.sizes.includes('King')) {
                      setFilters({ ...filters, sizes: ['Queen'] });
                    } else {
                      setFilters({ ...filters, sizes: [] });
                    }
                  }}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${
                    filters.sizes.includes('Queen') && filters.sizes.length === 1
                      ? 'border-primary bg-primary text-on-primary shadow-md'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  👸 Queen Size
                  <span className="ml-2 text-[10px] opacity-70">(8)</span>
                </button>
                {filters.sizes.length > 0 && (
                  <button
                    onClick={() => setFilters({ ...filters, sizes: [] })}
                    className="px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-error border border-outline-variant hover:border-error rounded-lg transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-xs text-xs font-semibold text-on-surface bg-surface-container"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant hidden sm:inline uppercase tracking-wider">
                Sort By:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-surface-container-lowest border border-outline-variant/40 px-4 py-2 pr-8 text-xs font-semibold text-on-surface rounded-xs cursor-pointer outline-none focus:border-primary shadow-xs"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Catalog Body: Filters on Left, 3-Card Grid on Right */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <BlanketsFilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalCount={filteredProducts.length}
            />
          </div>

          {/* Mobile Filter Drawer / Accordion */}
          {isMobileFilterOpen && (
            <div className="lg:hidden w-full bg-surface-container-low p-5 border border-outline-variant/30 rounded-xs mb-6">
              <BlanketsFilterSidebar
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                totalCount={filteredProducts.length}
              />
            </div>
          )}

          {/* Product Grid Area (3-Column Layout matching screenshot) */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-low border border-dashed border-outline-variant/50 rounded-xs p-8">
                <h3 className="text-lg font-bold text-on-surface mb-2">
                  No matching blankets or bedsheets found
                </h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
                  Try clearing some filters or searching for another tone, size, or material.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider rounded-xs shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <BlanketCard
                    key={product.id}
                    product={product}
                    onAddToBag={handleAddToBag}
                    onQuickView={handleQuickViewOpen}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Help Button on Bottom Right matching the screenshot */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => showToast('Our concierge helpline is active: 1800-DECOR-TB (Mon-Sun 9am-9pm)')}
          className="flex items-center gap-2 bg-[#1C1C19] hover:bg-black text-[#FAF6F0] dark:bg-[#25221E] dark:hover:bg-[#2F2B26] dark:text-[#E6C594] border border-transparent dark:border-[#E6C594]/30 px-4 py-2.5 rounded-full shadow-2xl text-xs font-semibold uppercase tracking-wider transition-all transform hover:scale-105 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#E6C594]" />
          <span>Help</span>
        </button>
      </div>

      <Footer />

      {/* Modals & Overlays */}
      <BlanketQuickViewModal
        isOpen={isQuickViewOpen}
        product={quickViewProduct}
        initialSize={quickViewSize}
        initialColor={quickViewColor}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToBag={handleAddToBag}
      />

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

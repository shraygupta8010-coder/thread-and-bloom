'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export interface FilterState {
  sizes: ('Queen' | 'King')[];
  brands: string[];
  priceRange: string | null;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalCount: number;
}

export default function BlanketsFilterSidebar({
  filters,
  onChange,
  onReset,
  totalCount,
}: FilterSidebarProps) {
  // Accordion open/collapse states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    size: true,
    brand: true,
    price: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const SIZE_OPTIONS: ('Queen' | 'King')[] = ['King', 'Queen'];
  const BRAND_OPTIONS = [
    'Maharaja',
    'Rose Wood',
    'Double Duty',
    'Double Dhamaal',
    'Discharge',
    'Volla',
    'Florida',
    'Ombre',
    'Oxford',
    'Kalamkari',
    'Meraki',
    'Vibes'
  ];
  const PRICE_OPTIONS = [
    { label: 'Under ₹3,500', value: 'under-3500' },
    { label: '₹3,500 – ₹5,500', value: '3500-5500' },
    { label: '₹5,500 & Above', value: 'above-5500' },
  ];

  const handleBrandClick = (brand: string) => {
    // Redirect to bedsheets page with brand filter
    window.location.href = `/bedsheets?brand=${encodeURIComponent(brand)}`;
  };

  const handleToggle = (key: keyof FilterState, value: string) => {
    const current = (filters[key] as string[]) || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange !== null;

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 bg-surface-container-lowest border border-outline-variant/20 shadow-sm h-fit sticky top-4">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-4">
          <h2 className="text-xl font-bold tracking-tight text-on-surface">
            Shop By
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 pb-4 border-b border-outline-variant/20">
          <p className="text-sm text-on-surface-variant">
            <span className="font-bold text-primary">{totalCount}</span>{' '}
            {totalCount === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Size */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Size</span>
            <span className="text-lg font-light">
              {openSections.size ? '−' : '+'}
            </span>
          </button>
          {openSections.size && (
            <div className="mt-3 space-y-2.5 pl-1">
              {SIZE_OPTIONS.map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    onChange={() => handleToggle('sizes', size)}
                    className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <span className="font-medium">{size} Size</span>
                  <span className="text-[10px] text-on-surface-variant/70">
                    ({size === 'King' ? '108" × 108"' : '90" × 100"'})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brand */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Brand</span>
            <span className="text-lg font-light">
              {openSections.brand ? '−' : '+'}
            </span>
          </button>
          {openSections.brand && (
            <div className="mt-3 space-y-2.5 pl-1">
              {BRAND_OPTIONS.map((brand) => (
                <label
                  key={brand}
                  onClick={(e) => {
                    e.preventDefault();
                    handleBrandClick(brand);
                  }}
                  className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => {}} // Handled by label onClick
                    className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Price</span>
            <span className="text-lg font-light">
              {openSections.price ? '−' : '+'}
            </span>
          </button>
          {openSections.price && (
            <div className="mt-3 space-y-2.5 pl-1">
              {PRICE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === opt.value}
                    onChange={() =>
                      onChange({
                        ...filters,
                        priceRange: filters.priceRange === opt.value ? null : opt.value,
                      })
                    }
                    className="w-4 h-4 border-outline-variant/60 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

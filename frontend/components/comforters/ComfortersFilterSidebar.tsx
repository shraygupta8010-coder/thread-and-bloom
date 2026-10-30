'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export interface ComforterFilterState {
  categories: string[];
  sizes: ('Queen' | 'King')[];
  collections: string[];
  collectionTiers: string[];
  warmthLevels: string[];
  stitchPatterns: string[];
  priceRange: string | null;
  selectedColor: string | null;
}

interface ComfortersFilterSidebarProps {
  filters: ComforterFilterState;
  onChange: (filters: ComforterFilterState) => void;
  onReset: () => void;
  totalCount: number;
}

export default function ComfortersFilterSidebar({
  filters,
  onChange,
  onReset,
  totalCount,
}: ComfortersFilterSidebarProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    category: true,
    size: true,
    warmthLevel: true,
    collection: true,
    atelier: true,
    stitchPattern: false,
    price: true,
    color: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const CATEGORY_OPTIONS = [
    'All-Season Comforters',
    'Winter Comforters',
    'Reversible Comforters',
  ];
  const SIZE_OPTIONS: ('Queen' | 'King')[] = ['King', 'Queen'];
  const WARMTH_OPTIONS = ['All-Season', 'Winter Warmth', 'Deep Winter'];
  const COLLECTION_OPTIONS = ['VEGA', 'PRISTINE', 'ELANTRA', 'OMEGA', 'SPOTLIGHT', 'PRIMARY'];
  const STITCH_OPTIONS = [
    'Baffle Box Stitch',
    'End-to-End Box Stitch',
    'Diamond Quilted Grid',
    'Channel Quilt',
  ];
  const PRICE_OPTIONS = [
    { label: 'Under ₹3,500', value: 'under-3500' },
    { label: '₹3,500 – ₹5,000', value: '3500-5000' },
    { label: '₹5,000 & Above', value: 'above-5000' },
  ];
  const COLOR_OPTIONS = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Oatmeal', hex: '#D2C1AC' },
    { name: 'Charcoal', hex: '#3B3F46' },
    { name: 'Ivory', hex: '#FDFBF7' },
    { name: 'Emerald', hex: '#1C4432' },
    { name: 'Copper', hex: '#BA7A56' },
    { name: 'Smoke Blue', hex: '#7798AB' },
    { name: 'Sage', hex: '#8F9779' },
  ];

  const ATELIER_OPTIONS = [
    { value: 'ATELIER', label: 'Atelier Series',    badge: 'CLASSIC ATELIER',  color: '#C4A35A' },
    { value: 'ELITE',   label: 'Elite & Premium',   badge: 'ELITE SIGNATURE',  color: '#E6C594' },
    { value: 'ROYAL',   label: 'Royal Line',        badge: 'STERLING EDITION', color: '#D4AF37' },
    { value: 'FESTIVE', label: 'Festive Editions',  badge: 'DIWALI SPECIAL',   color: '#FF6700' },
  ];

  const handleToggle = (key: keyof ComforterFilterState, value: string) => {
    const current = (filters[key] as string[]) || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.collections.length > 0 ||
    filters.collectionTiers.length > 0 ||
    filters.warmthLevels.length > 0 ||
    filters.stitchPatterns.length > 0 ||
    filters.priceRange !== null ||
    filters.selectedColor !== null;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 text-on-surface">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-4">
        <h2 className="text-xl font-bold tracking-tight text-on-surface">
          Shop By
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      <div className="divide-y divide-outline-variant/30">
        {/* Category */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Category</span>
            <span className="text-lg font-light">
              {openSections.category ? '−' : '+'}
            </span>
          </button>
          {openSections.category && (
            <div className="mt-3 space-y-2.5 pl-1">
              {CATEGORY_OPTIONS.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => handleToggle('categories', cat)}
                    className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          )}
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
                  <span className="font-medium">{size} Bed</span>
                  <span className="text-[10px] text-on-surface-variant/70">
                    ({size === 'King' ? '108" × 90"' : '90" × 90"'})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Warmth Level */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('warmthLevel')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Warmth Rating</span>
            <span className="text-lg font-light">
              {openSections.warmthLevel ? '−' : '+'}
            </span>
          </button>
          {openSections.warmthLevel && (
            <div className="mt-3 space-y-2.5 pl-1">
              {WARMTH_OPTIONS.map((warmth) => (
                <label
                  key={warmth}
                  className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.warmthLevels.includes(warmth)}
                    onChange={() => handleToggle('warmthLevels', warmth)}
                    className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <span>{warmth}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Collection */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('collection')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Collection</span>
            <span className="text-lg font-light">
              {openSections.collection ? '−' : '+'}
            </span>
          </button>
          {openSections.collection && (
            <div className="mt-3 space-y-2.5 pl-1">
              {COLLECTION_OPTIONS.map((col) => (
                <label
                  key={col}
                  className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.collections.includes(col)}
                    onChange={() => handleToggle('collections', col)}
                    className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <span>{col}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Atelier Series / Collection Line */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('atelier')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Atelier Series / Collection Line</span>
            <span className="text-lg font-light">
              {openSections.atelier ? '−' : '+'}
            </span>
          </button>
          {openSections.atelier && (
            <div className="mt-3 space-y-2.5 pl-1">
              {ATELIER_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.collectionTiers.includes(opt.value)}
                    onChange={() => handleToggle('collectionTiers', opt.value)}
                    className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <span className="flex-1">{opt.label}</span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: opt.color + '22', color: opt.color, border: `1px solid ${opt.color}55` }}
                  >
                    {opt.badge}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Stitch Pattern */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('stitchPattern')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Quilting &amp; Stitch</span>
            <span className="text-lg font-light">
              {openSections.stitchPattern ? '−' : '+'}
            </span>
          </button>
          {openSections.stitchPattern && (
            <div className="mt-3 space-y-2.5 pl-1">
              {STITCH_OPTIONS.map((pattern) => (
                <label
                  key={pattern}
                  className="flex items-center gap-2.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.stitchPatterns.includes(pattern)}
                    onChange={() => handleToggle('stitchPatterns', pattern)}
                    className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                  <span>{pattern}</span>
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
                    name="priceFilter"
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

        {/* Color */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between text-left font-semibold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span>Color Palette</span>
            <span className="text-lg font-light">
              {openSections.color ? '−' : '+'}
            </span>
          </button>
          {openSections.color && (
            <div className="mt-3">
              <div className="grid grid-cols-4 gap-2.5 pl-1">
                {COLOR_OPTIONS.map((col) => {
                  const isSelected = filters.selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      title={col.name}
                      onClick={() =>
                        onChange({
                          ...filters,
                          selectedColor: isSelected ? null : col.name,
                        })
                      }
                      className={`group flex flex-col items-center gap-1 p-1 rounded-md transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-primary bg-surface-container'
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-outline-variant shadow-xs"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[10px] text-on-surface-variant truncate w-full text-center">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

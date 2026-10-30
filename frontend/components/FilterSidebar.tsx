'use client';

import { useState } from 'react';
import { Star, SlidersHorizontal, RotateCcw } from 'lucide-react';

export interface Filters {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  materials: string[];
  minRating: number;
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const CATEGORIES = ['Bedsheets', 'Comforters', 'Towels', 'Blankets'];
const SIZES = ['Single', 'Queen', 'King', 'California King'];
const MATERIALS = ['Cotton', 'Linen', 'Bamboo', 'Microfiber', 'Turkish Cotton'];

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [priceMin, setPriceMin] = useState(filters.priceRange[0]);
  const [priceMax, setPriceMax] = useState(filters.priceRange[1]);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleMaterialToggle = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    onFilterChange({ ...filters, materials: newMaterials });
  };

  const handlePriceApply = () => {
    onFilterChange({ ...filters, priceRange: [Number(priceMin), Number(priceMax)] });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const handleClearFilters = () => {
    setPriceMin(0);
    setPriceMax(12000);
    onFilterChange({
      categories: [],
      priceRange: [0, 12000],
      sizes: [],
      materials: [],
      minRating: 0,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.materials.length > 0 ||
    filters.minRating > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 12000;

  return (
    <aside className="w-64 bg-white rounded-2xl border border-[#E7E5E0] p-6 shadow-xs sticky top-36 space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#2D4A3E]" />
          <span>Refine Selection</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#9A6038] hover:text-stone-900 transition-colors uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Category Section */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3">Collection</p>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-stone-950 cursor-pointer font-medium select-none"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 rounded text-[#2D4A3E] focus:ring-[#2D4A3E] border-stone-300 cursor-pointer"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3">Price Range</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Min (₹)</label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-[#2D4A3E]"
            />
          </div>
          <div>
            <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Max (₹)</label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-[#2D4A3E]"
            />
          </div>
        </div>
        <button
          onClick={handlePriceApply}
          className="w-full py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
        >
          Apply Price
        </button>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3">Bed &amp; Bath Size</p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white'
                    : 'bg-[#F5F3EF] text-stone-700 hover:bg-stone-200'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Material */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3">Pure Material</p>
        <div className="space-y-2">
          {MATERIALS.map((material) => (
            <label
              key={material}
              className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-stone-950 cursor-pointer font-medium select-none"
            >
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={() => handleMaterialToggle(material)}
                className="w-4 h-4 rounded text-[#2D4A3E] focus:ring-[#2D4A3E] border-stone-300 cursor-pointer"
              />
              <span>{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3">Customer Rating</p>
        <div className="space-y-1.5">
          {[4, 3, 2].map((rating) => {
            const isSelected = filters.minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  isSelected ? 'bg-[#F5F3EF] font-semibold text-stone-900' : 'hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="flex items-center gap-1 text-[#9A6038]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rating ? 'fill-current text-[#9A6038]' : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span className="text-stone-700 ml-1.5 font-medium">&amp; up</span>
                </div>
                {isSelected && <span className="text-[10px] text-[#2D4A3E] font-bold uppercase">Active</span>}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

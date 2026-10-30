'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { BlanketProduct } from '@/data/blanketsCatalog';

interface BlanketCardProps {
  product: BlanketProduct;
  onAddToBag: (title: string, variant: string, image: string, price: number) => void;
  onQuickView: (product: BlanketProduct, selectedSize: 'Queen' | 'King', selectedColor: string) => void;
}

export default function BlanketCard({
  product,
  onAddToBag,
  onQuickView,
}: BlanketCardProps) {
  // Selected size: default to first available size from product
  const [selectedSize, setSelectedSize] = useState<'Queen' | 'King'>(
    (product.sizes && product.sizes[0] as 'Queen' | 'King') || 'King'
  );
  // Selected color index
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const activeColor = product.colors && product.colors.length > 0 
    ? (product.colors[selectedColorIdx] || product.colors[0])
    : null;
  const activePrice =
    (product.sizePrices && product.sizePrices[selectedSize]) ||
    (product.sizePrices && product.sizePrices.King) ||
    (product.sizePrices && product.sizePrices.Queen) ||
    2499;
  const originalPrice =
    (product.originalPrices && product.originalPrices[selectedSize]) ||
    (product.originalPrices && product.originalPrices.King) ||
    (product.originalPrices && product.originalPrices.Queen) ||
    Math.round(activePrice * 1.25);

  // Format currency
  const formatINR = (val: number) =>
    '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const colorName = activeColor ? activeColor.name : 'Standard';
    const variantDesc = `${product.collection} / ${selectedSize} / ${colorName}`;
    onAddToBag(product.name, variantDesc, product.images[0], activePrice);
  };

  const handleCardClick = () => {
    const colorName = activeColor ? activeColor.name : 'Standard';
    onQuickView(product, selectedSize, colorName);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-surface-container-lowest border border-outline-variant/30 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-surface-container">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Luxury Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs shadow-md backdrop-blur-md ${
              product.badge.includes('ATELIER')
                ? 'bg-[#1C1A18]/90 text-[#C4A35A] border border-[#C4A35A]/50'
                : product.badge.includes('ELITE')
                ? 'bg-[#1C1A18]/90 text-[#E6C594] border border-[#E6C594]/60'
                : product.badge.includes('STERLING') || product.badge.includes('ROYAL')
                ? 'bg-[#1C1A18]/90 text-[#D4AF37] border border-[#D4AF37]/60'
                : product.badge.includes('DIWALI') || product.badge.includes('FESTIVE')
                ? 'bg-[#7B1A2A]/90 text-[#FFD700] border border-[#FFD700]/60'
                : 'bg-inverse-surface text-inverse-on-surface'
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          aria-label="Wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center text-on-surface hover:scale-110 transition-transform shadow-xs"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-error text-error' : 'text-on-surface-variant'
            }`}
          />
        </button>

        {/* Pieces Count Pill */}
        {product.pieces && (
          <div className="absolute top-3 right-13 bg-[#12100E]/85 backdrop-blur-md text-[#E6C594] border border-[#E6C594]/50 px-2 py-0.5 text-[10px] font-extrabold tracking-wider rounded-xs shadow-md">
            {product.pieces} PC SET
          </div>
        )}

        {/* Quick Actions overlay on hover */}
        <div
          className={`absolute bottom-3 inset-x-3 flex gap-2 transition-all duration-300 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const colorName = activeColor ? activeColor.name : 'Standard';
              onQuickView(product, selectedSize, colorName);
            }}
            className="flex-1 bg-surface-container-lowest/95 hover:bg-surface-container-lowest text-on-surface py-2 text-xs font-semibold uppercase tracking-wider rounded-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 bg-primary text-on-primary hover:opacity-95 py-2 text-xs font-bold uppercase tracking-wider rounded-xs shadow-md transition-opacity flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-surface-container-lowest">
        {/* Size Selection Pills: Show only available sizes from product */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant mr-1">
              Size:
            </span>
            {(product.sizes as ('Queen' | 'King')[]).map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary text-on-primary font-bold'
                      : 'border-outline-variant/40 text-on-surface-variant hover:border-outline hover:text-on-surface'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, idx) => {
                const isSelected = selectedColorIdx === idx;
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIdx(idx);
                    }}
                    className={`w-4 h-4 rounded-full border border-outline-variant relative transition-transform ${
                      isSelected ? 'ring-2 ring-offset-1 ring-primary scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Product Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-on-surface truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">
                {product.collection}
              </span>
              {product.series && (
                <span className="text-[10px] text-[#E6C594] font-medium">
                  • {product.series}
                </span>
              )}
              {product.brand && (
                <span className="text-[10px] text-on-surface-variant font-medium">
                  by {product.brand}
                </span>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mt-1">
              {product.subtitle} • {selectedSize} Size
            </p>
          </div>

          {/* Price displayed prominently on right */}
          <div className="text-right flex-shrink-0">
            <span className="block text-sm sm:text-base font-bold text-on-surface tracking-tight">
              {formatINR(activePrice)}
            </span>
            {originalPrice && originalPrice > activePrice && (
              <span className="block text-[11px] line-through text-outline">
                {formatINR(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Real Inventory - Pieces Status Bar */}
        <div className="mt-2.5 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-[#E6C594]">inventory_2</span>
            <span className="font-bold text-[11px] text-on-surface">
              {product.pieces ? `${product.pieces}-Piece Suite` : 'Luxury Ensemble'}
            </span>
          </div>
        </div>

        {/* Bottom active color preview info */}
        {activeColor && activeColor.name && (
          <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span className="truncate">
              Color: <strong className="text-on-surface">{activeColor.name}</strong>
            </span>
          <span className="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded-xs font-medium text-on-surface-variant">
            {product.threadCount || product.gsm || 'Premium'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

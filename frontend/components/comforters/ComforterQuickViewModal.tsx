'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, ShieldCheck, Truck, RefreshCw, ThermometerSun } from 'lucide-react';
import { ComforterProduct } from '@/data/comfortersCatalog';

interface ComforterQuickViewModalProps {
  product: ComforterProduct | null;
  initialSize: 'Queen' | 'King';
  initialColor: string;
  isOpen: boolean;
  onClose: () => void;
  onAddToBag: (title: string, variant: string, image: string, price: number) => void;
}

export default function ComforterQuickViewModal({
  product,
  initialSize,
  initialColor,
  isOpen,
  onClose,
  onAddToBag,
}: ComforterQuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<'Queen' | 'King'>('King');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedSize(initialSize || 'King');
      setSelectedColor(initialColor || product.colors[0]?.name || '');
      setActiveImageIdx(0);
    }
  }, [product, initialSize, initialColor]);

  if (!isOpen || !product) return null;

  const currentPrice = product.sizePrices[selectedSize];
  const originalPrice = product.originalPrices[selectedSize];
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  const formatINR = (val: number) =>
    '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleAdd = () => {
    const variantDesc = `${product.collection} / ${selectedSize} / ${selectedColor}`;
    onAddToBag(product.name, variantDesc, product.images[0], currentPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-surface-container-lowest text-on-surface rounded-sm shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row border border-outline-variant/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-surface-container-lowest/90 flex items-center justify-center text-on-surface hover:scale-110 transition-transform shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-surface-container-low">
          <div className="relative aspect-[4/4.5] w-full rounded-sm overflow-hidden bg-surface-container">
            <Image
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover object-center transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-inverse-surface text-inverse-on-surface text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-16 h-16 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-primary scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Configurator */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Header info */}
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-primary">
              {product.collection} COLLECTION
            </span>
            <h2 className="text-2xl font-bold tracking-tight mt-1 text-on-surface">
              {product.name}
            </h2>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
              {product.subtitle}
            </p>

            {/* Price section with dynamic rate */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-2xl font-extrabold tracking-tight text-on-surface">
                {formatINR(currentPrice)}
              </span>
              {originalPrice > currentPrice && (
                <>
                  <span className="text-sm line-through text-outline">
                    {formatINR(originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-error uppercase">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Select Size
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  {selectedSize === 'King' ? '108" × 90" (Full King)' : '90" × 90" (Full Queen)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['Queen', 'King'] as const).map((sz) => {
                  const isSelected = selectedSize === sz;
                  const price = product.sizePrices[sz];
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 border rounded-xs text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 ring-1 ring-primary'
                          : 'border-outline-variant/40 hover:border-outline'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs uppercase tracking-wider">
                          {sz} Comforter
                        </span>
                        <span className="text-xs font-semibold text-on-surface">
                          {formatINR(price)}
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant mt-1 block">
                        4-Corner Duvet Anchor Loops
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Select Shade:{' '}
                  <span className="font-normal text-on-surface-variant">
                    {selectedColor}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`group flex items-center gap-2 p-1.5 rounded-xs border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-surface-container'
                          : 'border-outline-variant/40 hover:border-outline'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-outline-variant shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs font-medium text-on-surface pr-1">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-surface-container-low rounded-xs text-[11px] mb-6">
              <div>
                <span className="text-on-surface-variant/70 block uppercase tracking-wider text-[9px]">Fill Core</span>
                <span className="font-semibold text-on-surface">{product.fillType}</span>
              </div>
              <div>
                <span className="text-on-surface-variant/70 block uppercase tracking-wider text-[9px]">Outer Shell</span>
                <span className="font-semibold text-on-surface">{product.shellFabric}</span>
              </div>
              <div>
                <span className="text-on-surface-variant/70 block uppercase tracking-wider text-[9px]">Quilting</span>
                <span className="font-semibold text-on-surface">{product.stitchPattern}</span>
              </div>
              <div>
                <span className="text-on-surface-variant/70 block uppercase tracking-wider text-[9px]">Warmth Rating</span>
                <span className="font-semibold text-on-surface">{product.warmthLevel}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div>
            <button
              onClick={handleAdd}
              type="button"
              className="w-full py-3.5 bg-primary text-on-primary hover:opacity-95 font-bold text-xs uppercase tracking-widest rounded-xs shadow-lg transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag • {formatINR(currentPrice)}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-outline-variant/20 text-[10px] text-on-surface-variant text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-on-surface-variant" />
                <span>Pan-India Free Express</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-on-surface-variant" />
                <span>COD Available</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-on-surface-variant" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

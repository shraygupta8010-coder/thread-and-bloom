'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Star, ShoppingCart, ChevronLeft, ChevronRight, Check, Minus, Plus } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';

export default function QuickViewModal() {
  const quickViewProduct = useUIStore((state) => state.quickViewProduct);
  const setQuickViewProduct = useUIStore((state) => state.setQuickViewProduct);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useUIStore((state) => state.addToast);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  if (!selectedSize && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
  if (!selectedColor && product.colors.length > 0) setSelectedColor(product.colors[0].name);

  const handleClose = () => {
    setQuickViewProduct(null);
    setCurrentImageIndex(0);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      addToast('Please select size and color', 'error');
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      collection: product.category,
      subtitle: selectedSize,
      size: selectedSize,
      colorName: selectedColor,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      quantity,
    });
    addToast('Added to cart', 'success');
    handleClose();
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2 h-full max-h-[90vh]">

            {/* Left — Image Gallery */}
            <div className="relative bg-[#F2F0EB] flex items-center justify-center p-8">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#F2F0EB] transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-[#1A1A1A]" />
              </button>

              {/* Main image */}
              <div className="relative w-full aspect-square">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                  {product.images.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === currentImageIndex ? 'border-[#2D6A4F]' : 'border-transparent hover:border-[#C9C3B8]'
                      }`}
                    >
                      <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="56px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Details */}
            <div className="flex flex-col overflow-y-auto p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A098]">{product.category}</span>
                {product.badge && (
                  <span className="px-2 py-0.5 bg-[#2D6A4F] text-white text-[10px] font-bold rounded-md uppercase tracking-wide">
                    {product.badge}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-4 leading-snug">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#B45309] text-[#B45309]' : 'text-[#E8E4DC]'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#1A1A1A]">{product.rating}</span>
                <span className="text-xs text-[#A8A098]">({product.reviewsCount.toLocaleString()})</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-[#E8E4DC]">
                <span className="text-3xl font-bold text-[#1A1A1A]">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#A8A098] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm font-semibold text-[#2D6A4F]">{product.discountPercent}% off</span>
                  </>
                )}
              </div>

              <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">{product.description}</p>

              {/* Size */}
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#A8A098] mb-2.5">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-[#2D6A4F] bg-[#2D6A4F]/10 text-[#2D6A4F]'
                          : 'border-[#E8E4DC] text-[#4B4B4B] hover:border-[#C9C3B8]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#A8A098] mb-2.5">
                  Colour — <span className="font-normal normal-case tracking-normal text-[#4B4B4B]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name ? 'border-[#2D6A4F] scale-110' : 'border-[#E8E4DC] hover:border-[#C9C3B8]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#A8A098] mb-2.5">Quantity</p>
                <div className="flex items-center gap-2 border border-[#E8E4DC] rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-[#F2F0EB] transition-colors rounded-l-lg"
                    aria-label="Decrease"
                  >
                    <Minus className="w-4 h-4 text-[#1A1A1A]" />
                  </button>
                  <span className="px-4 text-sm font-bold text-[#1A1A1A] min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-[#F2F0EB] transition-colors rounded-r-lg"
                    aria-label="Increase"
                  >
                    <Plus className="w-4 h-4 text-[#1A1A1A]" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#2D6A4F] text-white rounded-xl font-semibold text-sm transition-colors disabled:bg-[#C9C3B8] disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-5"
              >
                <ShoppingCart className="w-4 h-4" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Specs */}
              <div className="bg-[#F2F0EB] rounded-xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A098] mb-4">Specifications</p>
                <div className="space-y-2.5">
                  {[
                    ['Material', product.specs.material],
                    product.specs.threadCount && ['Thread Count', product.specs.threadCount],
                    product.specs.gsm && ['GSM', product.specs.gsm],
                    product.specs.fillType && ['Fill Type', product.specs.fillType],
                    product.specs.pocketDepth && ['Pocket Depth', product.specs.pocketDepth],
                    ['Care', product.specs.washCare],
                  ].filter(Boolean).map((spec) => (
                    <div key={spec![0]} className="flex gap-3">
                      <span className="text-xs text-[#A8A098] min-w-[90px] pt-0.5">{spec![0]}</span>
                      <span className="text-xs text-[#1A1A1A] font-medium leading-relaxed">{spec![1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';

interface ProductCardProps {
  product: Product;
}

const BADGE_STYLES: Record<string, string> = {
  'Best Seller': 'bg-[#2D4A3E] text-white',
  'New': 'bg-stone-900 text-white',
  'Limited Deal': 'bg-[#9A6038] text-white',
  '40% OFF': 'bg-[#9A6038] text-white',
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const setQuickViewProduct = useUIStore((state) => state.setQuickViewProduct);
  const addToast = useUIStore((state) => state.addToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      collection: product.category,
      subtitle: product.sizes[0] ?? '',
      size: product.sizes[0] ?? 'Standard',
      colorName: product.colors[0]?.name ?? 'Default',
      colorHex: product.colors[0]?.hex,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      quantity: 1,
    });
    addToast('Added to cart', 'success');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const currentImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden border border-[#E8E4DC] hover:border-[#C9C3B8] hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F2F0EB]">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md ${BADGE_STYLES[product.badge] || 'bg-[#1A1A1A] text-white'}`}>
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && !product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md bg-[#9A6038] text-white">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-[#6B6B6B]'}`} />
        </button>

        {/* Hover actions */}
        <div className={`absolute bottom-0 inset-x-0 flex gap-2 p-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <button
            onClick={handleQuickView}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 hover:bg-white text-[#1A1A1A] py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-[#2D6A4F] text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="px-4 py-2 bg-[#1A1A1A] text-white text-sm font-semibold rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8A098] mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-[#1A1A1A] line-clamp-2 leading-snug mb-2.5 group-hover:text-[#2D6A4F] transition-colors min-h-[36px]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 fill-[#B45309] text-[#B45309]" />
          <span className="text-xs font-bold text-[#1A1A1A]">{product.rating}</span>
          <span className="text-xs text-[#A8A098]">({product.reviewsCount.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-[#1A1A1A]">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-[#A8A098] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-xs font-semibold text-[#2D6A4F]">{product.discountPercent}% off</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {product.sizes.slice(0, 3).map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 bg-[#F2F0EB] text-[#6B6B6B] rounded font-medium">{s}</span>
          ))}
          {product.sizes.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 text-[#A8A098]">+{product.sizes.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}

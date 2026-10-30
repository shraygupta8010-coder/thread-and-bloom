'use client';

import Image from 'next/image';
import { NEW_ARRIVALS_FEATURE, NEW_ARRIVALS_GRID } from '@/data/products';

interface NewArrivalsSectionProps {
  onAddToBag: (title: string, variant: string) => void;
}

export default function NewArrivalsSection({ onAddToBag }: NewArrivalsSectionProps) {
  return (
    <section
      className="w-full bg-surface-container-lowest py-16 lg:py-20"
      id="new-arrivals"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
      <h2 className="text-center font-body-md text-2xl lg:text-3xl font-bold uppercase tracking-wide text-on-surface mb-10">
        NEW ARRIVALS
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Tall Feature */}
        <div
          className="lg:col-span-6 group cursor-pointer"
          onClick={() => onAddToBag(NEW_ARRIVALS_FEATURE.title, NEW_ARRIVALS_FEATURE.variant)}
        >
          <div className="relative w-full h-[460px] lg:h-[670px] overflow-hidden rounded-sm bg-surface-container">
            <Image
              src={NEW_ARRIVALS_FEATURE.image}
              alt={NEW_ARRIVALS_FEATURE.title}
              width={800}
              height={1000}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {NEW_ARRIVALS_FEATURE.badge && (
              <div className="absolute top-4 left-4 bg-[#1C1A18]/90 text-[#E6C594] border border-[#E6C594]/60 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xs backdrop-blur-md">
                {NEW_ARRIVALS_FEATURE.badge}
              </div>
            )}
            {NEW_ARRIVALS_FEATURE.pieces && (
              <div className="absolute top-4 right-4 bg-[#12100E]/90 text-[#E6C594] border border-[#E6C594]/50 px-2.5 py-1 text-xs font-extrabold tracking-wider rounded-xs backdrop-blur-md">
                {NEW_ARRIVALS_FEATURE.pieces} PC SET
              </div>
            )}
          </div>
          <div className="pt-3.5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-body-md text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {NEW_ARRIVALS_FEATURE.title}
                </h3>
                {NEW_ARRIVALS_FEATURE.stock && (
                  <span className="text-[10px] font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2 py-0.5 rounded-xs border border-[#2E7D32]/30">
                    {NEW_ARRIVALS_FEATURE.stock} in Stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="font-body-md text-xs text-outline">{NEW_ARRIVALS_FEATURE.collection}</p>
                {NEW_ARRIVALS_FEATURE.price && (
                  <span className="text-xs font-bold text-on-surface">
                    ₹{NEW_ARRIVALS_FEATURE.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-semibold hover:underline">
              + Add to Bag
            </span>
          </div>
        </div>

        {/* ── Right 2×2 Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {NEW_ARRIVALS_GRID.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onClick={() => onAddToBag(item.title, item.variant)}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-surface-container">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.badge && (
                  <div className="absolute top-2.5 left-2.5 bg-[#1C1A18]/90 text-[#E6C594] border border-[#E6C594]/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-xs backdrop-blur-md">
                    {item.badge}
                  </div>
                )}
                {item.pieces && (
                  <div className="absolute top-2.5 right-2.5 bg-[#12100E]/90 text-[#E6C594] border border-[#E6C594]/50 px-2 py-0.5 text-[9px] font-extrabold tracking-wider rounded-xs backdrop-blur-md">
                    {item.pieces} PC SET
                  </div>
                )}
              </div>
              <div className="pt-2.5">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-body-md text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </h3>
                  {item.price && (
                    <span className="text-xs font-bold text-on-surface flex-shrink-0">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="text-outline">{item.collection}</span>
                  {item.stock && (
                    <span className="text-[10px] font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-1.5 py-0.2 rounded-xs border border-[#2E7D32]/30">
                      {item.stock} in Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TOP_SELLING } from '@/data/products';

interface TopSellingCarouselProps {
  onAddToBag: (title: string, variant: string) => void;
}

export default function TopSellingCarousel({ onAddToBag }: TopSellingCarouselProps) {
  const [index, setIndex] = useState(0);
  const totalSlides = TOP_SELLING.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function getVisible() {
    if (typeof window === 'undefined') return 3;
    return window.innerWidth < 640 ? 1 : 3;
  }

  function slide(dir: 1 | -1) {
    const visible = getVisible();
    const maxIndex = totalSlides - visible;
    setIndex((prev) => {
      let next = prev + dir;
      if (next > maxIndex) next = 0;
      if (next < 0) next = maxIndex;
      return next;
    });
  }

  // Auto-slide every 3.5 s
  useEffect(() => {
    intervalRef.current = setInterval(() => slide(1), 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute translate: each card is 1/3 of container on desktop
  const visible = getVisible();
  const shiftPercent = (100 / visible) * index;

  return (
    <section
      className="w-full bg-surface-container-low py-16 lg:py-20"
      id="top-selling"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-10">
        <h2 className="text-center font-body-md text-2xl lg:text-3xl font-bold uppercase tracking-wide text-on-surface">
          TOP SELLING
        </h2>
        <div className="hidden sm:flex items-center gap-2 absolute right-0">
          <button
            aria-label="Previous Slide"
            className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface hover:bg-on-background hover:text-on-primary transition-colors shadow-sm"
            onClick={() => slide(-1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button
            aria-label="Next Slide"
            className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface hover:bg-on-background hover:text-on-primary transition-colors shadow-sm"
            onClick={() => slide(1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${shiftPercent}%)` }}
        >
          {TOP_SELLING.map((item) => (
            <div key={item.id} className="w-full sm:w-1/3 flex-shrink-0 px-3">
              <div
                className="group cursor-pointer"
                onClick={() => onAddToBag(item.title, item.variant)}
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-surface-container">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={500}
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
                <div className="pt-3">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-body-md text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </h4>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
}

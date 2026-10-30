'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  ctaText: string;
  image: string;
  category: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-blankets',
    eyebrow: 'HEAVY WINTER WARMTH • 450 GSM SHERPA FLEECE',
    headline: 'Ultra-soft dual-sided sherpa fleece blankets loomed for quiet, restorative warmth.',
    ctaText: 'EXPLORE BLANKETS',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6on4BSe6TuOypgaQnNQU_fyK1zJVcGV9SjazM3QmO15QYfE3Wtr5E5i7yklDhTaqQErTT-R-cFP57ztgsMNMlOlOaUEaMpe1fMyfK3Af-3CtE5b56TBKM1wdj9c3CIX2x14cf7i5mjMxaXOAinLx5Yu4FHLw85OG0QpkgEMRgcmHvwu7VNlHAOdT4LTyw4EiNrLWslcYvi5HPkdP95vwSL1JQoP5TB4_xKBx6erMEc-afxYWILTG1',
    category: 'Blankets',
  },
  {
    id: 'slide-comforters',
    eyebrow: 'DOWN-ALTERNATIVE SLUMBER • MICROFIBER COMFORTERS',
    headline: 'Breathable micro-cluster cloud filling encased in crisp 300 TC long-staple cotton.',
    ctaText: 'EXPLORE COMFORTERS',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoE8LjfXXFkYXhNHSDA5eG5Zl5UufVOxxGDNrYXDm3hCHizb8nVKCMmE5IHjoYBtSpufflJRoT5re5fUKwzEoGTQqQV8mqkki-bHO7fn0_ax7NPl2Ci7MYOskGMN1oTpqj5_laH-91JTgte9jaTDfwkWKIBKTh1dNpi8RviFVpe5tNqUA23-tzb3gym5B4wevzQXmQvVpSOP0dTRq8R1e5P3mkd1f0vlV8TzvmGQ-G3Aj37KqEkNAX',
    category: 'Comforters',
  },
  {
    id: 'slide-towels',
    eyebrow: 'ZERO-TWIST INDULGENCE • 600 GSM TURKISH TOWELS',
    headline: 'Plush zero-twist Turkish cotton loomed for deep absorbency and spa-grade softness.',
    ctaText: 'EXPLORE TOWELS',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5rqRBN226rjpgjjYr1VBvOhiYtahz3Gw4p0xWfwZa6OhLBWa4r2TIwxIrqNYCbkr-WFFhJcFOfJDvwxXWDdNfc014KQVY7yGzXhGHUTrgSMEz7OxQ0DybQefKKF6kZX6_6Siz87xnwx466JC7-eg0jfubDBQQ0uEmFVywD9tKShc_mPCJQTV_g-tfHabyl8qAF08WGSsBXE171ZjNPP7s8JmR6Ynhqa8mw8x6evbLxn27MEBnHLSE',
    category: 'Towels',
  },
];

const SUB_NAV_ITEMS = ['All Sanctuaries', 'Blankets', 'Comforters', 'Towels'];

interface DiscoverHeroProps {
  onExploreClick?: () => void;
}

export default function DiscoverHero({ onExploreClick }: DiscoverHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('All Sanctuaries');

  // Auto-advance slides every 5.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative w-full pt-28 pb-4 bg-surface dark:bg-[#0A0A0A] transition-colors duration-300">
      {/* ── Sub Navigation Bar ──────────────── */}
      <div className="w-full border-b border-outline-variant/30 dark:border-[#E6C594]/15 mb-6">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center gap-8 overflow-x-auto py-3 text-xs tracking-wider uppercase font-medium scrollbar-none">
          {SUB_NAV_ITEMS.map((item) => {
            if (item === 'Blankets') {
              return (
                <Link
                  key={item}
                  href="/blankets"
                  className="transition-colors whitespace-nowrap pb-1 text-on-surface-variant dark:text-[#EDE4D7]/70 hover:text-primary dark:hover:text-[#E6C594] font-medium"
                >
                  {item}
                </Link>
              );
            }
            if (item === 'Comforters') {
              return (
                <Link
                  key={item}
                  href="/comforters"
                  className="transition-colors whitespace-nowrap pb-1 text-on-surface-variant dark:text-[#EDE4D7]/70 hover:text-primary dark:hover:text-[#E6C594] font-medium"
                >
                  {item}
                </Link>
              );
            }
            return (
              <button
                key={item}
                onClick={() => {
                  setActiveSubTab(item);
                  if (item === 'Towels') {
                    const el = document.getElementById('categories-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                type="button"
                className={`transition-colors whitespace-nowrap pb-1 ${
                  activeSubTab === item
                    ? 'text-primary dark:text-[#E6C594] font-bold border-b-2 border-primary dark:border-[#E6C594]'
                    : 'text-on-surface-variant dark:text-[#EDE4D7]/70 hover:text-on-surface dark:hover:text-[#FAF6F0]'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Hero Slider Container ──────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden shadow-2xl bg-surface-container dark:bg-[#141414]">
          {/* Slides Images */}
          {HERO_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              <Image
                src={s.image}
                alt={s.headline}
                fill
                priority={idx === 0}
                className="object-cover object-center"
              />
              {/* Gradient Scrim for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
            </div>
          ))}

          {/* Text Overlay Content */}
          <div className="relative z-20 h-full flex flex-col justify-center max-w-2xl px-8 sm:px-14 lg:px-16 text-white">
            {/* Eyebrow */}
            <div className="inline-block mb-4">
              <span className="font-label-sm text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#E6C594] font-semibold bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E6C594]/30">
                {slide.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl leading-tight font-serif text-[#FAF6F0] mb-6 drop-shadow-md">
              {slide.headline}
            </h1>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href={
                  slide.category === 'Blankets'
                    ? '/blankets'
                    : slide.category === 'Comforters'
                    ? '/comforters'
                    : '#categories-section'
                }
                onClick={onExploreClick}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#12100E] text-[#FAF6F0] hover:bg-[#E6C594] hover:text-[#12100E] border border-[#E6C594]/40 font-label-md text-xs uppercase tracking-[0.2em] font-semibold rounded-sm shadow-xl transition-all duration-300 group"
              >
                <span>{slide.ctaText}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Dot Pagination */}
            <div className="flex items-center gap-2.5 mt-10">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? 'w-7 h-2 bg-[#E6C594]'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

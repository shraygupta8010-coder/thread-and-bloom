'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  targetId: string;
  isComingSoon?: boolean;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-blankets',
    eyebrow: 'EXPLORE',
    title: 'BLANKETS & SHERPA',
    subtitle: '450 GSM dual-sided microfleece woven for crisp northern winters.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6on4BSe6TuOypgaQnNQU_fyK1zJVcGV9SjazM3QmO15QYfE3Wtr5E5i7yklDhTaqQErTT-R-cFP57ztgsMNMlOlOaUEaMpe1fMyfK3Af-3CtE5b56TBKM1wdj9c3CIX2x14cf7i5mjMxaXOAinLx5Yu4FHLw85OG0QpkgEMRgcmHvwu7VNlHAOdT4LTyw4EiNrLWslcYvi5HPkdP95vwSL1JQoP5TB4_xKBx6erMEc-afxYWILTG1',
    targetId: 'discover-new-arrivals',
    isComingSoon: false,
  },
  {
    id: 'cat-comforters',
    eyebrow: 'EXPLORE',
    title: 'MICROFIBER COMFORTERS',
    subtitle: 'Hypoallergenic micro-cluster down alternative encased in 300 TC cotton.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoE8LjfXXFkYXhNHSDA5eG5Zl5UufVOxxGDNrYXDm3hCHizb8nVKCMmE5IHjoYBtSpufflJRoT5re5fUKwzEoGTQqQV8mqkki-bHO7fn0_ax7NPl2Ci7MYOskGMN1oTpqj5_laH-91JTgte9jaTDfwkWKIBKTh1dNpi8RviFVpe5tNqUA23-tzb3gym5B4wevzQXmQvVpSOP0dTRq8R1e5P3mkd1f0vlV8TzvmGQ-G3Aj37KqEkNAX',
    targetId: 'discover-new-arrivals',
    isComingSoon: false,
  },
  {
    id: 'cat-towels',
    eyebrow: 'PRE-LAUNCH',
    title: 'TURKISH BATH TOWELS',
    subtitle: 'Ultra-absorbent 600 GSM weight that dries rapidly and stays plush.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5rqRBN226rjpgjjYr1VBvOhiYtahz3Gw4p0xWfwZa6OhLBWa4r2TIwxIrqNYCbkr-WFFhJcFOfJDvwxXWDdNfc014KQVY7yGzXhGHUTrgSMEz7OxQ0DybQefKKF6kZX6_6Siz87xnwx466JC7-eg0jfubDBQQ0uEmFVywD9tKShc_mPCJQTV_g-tfHabyl8qAF08WGSsBXE171ZjNPP7s8JmR6Ynhqa8mw8x6evbLxn27MEBnHLSE',
    targetId: '',
    isComingSoon: true,
  },
];

export default function DiscoverCategories() {
  return (
    <section
      id="categories-section"
      className="w-full py-16 lg:py-24 bg-surface dark:bg-[#0A0A0A] transition-colors duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <h2 className="text-center font-body-md text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.18em] text-on-surface dark:text-[#FAF6F0] mb-12">
          CATEGORIES
        </h2>

        {/* 3-Column Grid for Blankets, Comforters, and Towels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => {
            const CardContent = (
              <div
                className={`group relative h-[420px] sm:h-[480px] rounded-xl overflow-hidden shadow-lg bg-surface-container dark:bg-[#141414] transition-all duration-500 ${
                  cat.isComingSoon ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {/* Background Product Image */}
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className={`object-cover transition-transform duration-700 ease-out ${
                    cat.isComingSoon ? 'opacity-70 group-hover:scale-102' : 'group-hover:scale-105'
                  }`}
                />

                {/* Scrim for Contrast */}
                <div
                  className={`absolute inset-0 transition-colors duration-300 ${
                    cat.isComingSoon
                      ? 'bg-gradient-to-t from-black/85 via-black/45 to-black/30'
                      : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80'
                  }`}
                />

                {/* Top-Right Coming Soon Badge for Towels */}
                {cat.isComingSoon && (
                  <div className="absolute top-6 right-6 bg-[#E6C594] text-[#12100E] px-3.5 py-1.5 rounded-full font-label-sm text-[10px] uppercase tracking-[0.2em] font-extrabold shadow-lg z-10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#12100E] animate-pulse" />
                    <span>Coming Soon</span>
                  </div>
                )}

                {/* D'Decor Style Top-Left Badge Box */}
                <div className="absolute top-6 left-6 bg-[#FFFFFF]/92 dark:bg-[#12100E]/92 backdrop-blur-md px-5 py-3.5 rounded-sm shadow-xl border border-white/20 dark:border-[#E6C594]/20 group-hover:border-[#E6C594] transition-all duration-300">
                  <span
                    className={`font-label-sm text-[10px] uppercase tracking-[0.25em] block font-semibold mb-0.5 ${
                      cat.isComingSoon
                        ? 'text-[#E6C594]'
                        : 'text-[#83533c] dark:text-[#E6C594]'
                    }`}
                  >
                    {cat.eyebrow}
                  </span>
                  <h3 className="font-headline-md text-base sm:text-lg font-bold tracking-tight text-[#1c1c19] dark:text-[#FAF6F0] group-hover:text-primary dark:group-hover:text-[#E6C594] transition-colors">
                    {cat.title}
                  </h3>
                </div>

                {/* Bottom Card Summary */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-body-md text-xs text-[#EDE4D7]/90 line-clamp-2 mb-3">
                    {cat.subtitle}
                  </p>
                  {cat.isComingSoon ? (
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E6C594]">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>Arriving Soon • Handcrafted Weaves</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E6C594] group-hover:translate-x-1 transition-transform">
                      <span>Explore Collection</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  )}
                </div>
              </div>
            );

            return cat.isComingSoon ? (
              <div key={cat.id} className="block">
                {CardContent}
              </div>
            ) : cat.id === 'cat-blankets' ? (
              <Link key={cat.id} href="/blankets" className="block">
                {CardContent}
              </Link>
            ) : cat.id === 'cat-comforters' ? (
              <Link key={cat.id} href="/comforters" className="block">
                {CardContent}
              </Link>
            ) : (
              <a key={cat.id} href={`#${cat.targetId}`} className="block">
                {CardContent}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

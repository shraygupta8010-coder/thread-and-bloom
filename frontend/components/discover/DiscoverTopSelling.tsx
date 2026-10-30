'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface TopSellingItem {
  id: string;
  category: string;
  image: string;
  targetId: string;
}

const TOP_SELLING_CATEGORIES: TopSellingItem[] = [
  {
    id: 'ts-sherpa',
    category: 'Sherpa Blankets',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6on4BSe6TuOypgaQnNQU_fyK1zJVcGV9SjazM3QmO15QYfE3Wtr5E5i7yklDhTaqQErTT-R-cFP57ztgsMNMlOlOaUEaMpe1fMyfK3Af-3CtE5b56TBKM1wdj9c3CIX2x14cf7i5mjMxaXOAinLx5Yu4FHLw85OG0QpkgEMRgcmHvwu7VNlHAOdT4LTyw4EiNrLWslcYvi5HPkdP95vwSL1JQoP5TB4_xKBx6erMEc-afxYWILTG1',
    targetId: 'categories-section',
  },
  {
    id: 'ts-comforters',
    category: 'Microfiber Comforters',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoE8LjfXXFkYXhNHSDA5eG5Zl5UufVOxxGDNrYXDm3hCHizb8nVKCMmE5IHjoYBtSpufflJRoT5re5fUKwzEoGTQqQV8mqkki-bHO7fn0_ax7NPl2Ci7MYOskGMN1oTpqj5_laH-91JTgte9jaTDfwkWKIBKTh1dNpi8RviFVpe5tNqUA23-tzb3gym5B4wevzQXmQvVpSOP0dTRq8R1e5P3mkd1f0vlV8TzvmGQ-G3Aj37KqEkNAX',
    targetId: 'categories-section',
  },
  {
    id: 'ts-towels',
    category: 'Turkish Bath Towels',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5rqRBN226rjpgjjYr1VBvOhiYtahz3Gw4p0xWfwZa6OhLBWa4r2TIwxIrqNYCbkr-WFFhJcFOfJDvwxXWDdNfc014KQVY7yGzXhGHUTrgSMEz7OxQ0DybQefKKF6kZX6_6Siz87xnwx466JC7-eg0jfubDBQQ0uEmFVywD9tKShc_mPCJQTV_g-tfHabyl8qAF08WGSsBXE171ZjNPP7s8JmR6Ynhqa8mw8x6evbLxn27MEBnHLSE',
    targetId: 'categories-section',
  },
  {
    id: 'ts-dohars',
    category: 'Mulmul Dohars & Blankets',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOK82VKGeNCAKTbg3myL0EPbHY8tjD7wOxbVZLjpo6V2gnOK54j5nHLrzjhMwBEUGmbzzcSdxpTkPWjuaYSavhpA29rKpsddTX081cIuGYyK_JZdQlV4LQHKHJmsJ2Py5G6QUMll82dZCmEdheTyz9m1HMDK5ege07Sz8NxLWmVC8cs6qL4Ce-RAYbtEZzcZM6i3HenY5xCZrKIHS4WnCP3aEuPFwvjkpcVuLQEWkwBTKJxzEbBf9A',
    targetId: 'categories-section',
  },
  {
    id: 'ts-quilted',
    category: 'Quilted Comforters',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXz-NnSOKsbmL88hBSwXib8W3WH1qPK9GVFKBplDnbx_kmsjpLPsHkmx_2mm8RioSCpdgJjs0YSLTqxGzF4LljapuOVceGz0DoM7WwVdBSOgp5fhJlyDf1-NqEDEA_bCUe12qupdCmK7KU5S6cGytDVBPeiNkljbVzRu5eAvc6DQiPqEJWDp-hgdjhfZaRrTf_z6jhFo5Q4nEwvoVnzFMNmUu-vQJiK82NeKgTqaB3v2pnIUbrJc6N',
    targetId: 'categories-section',
  },
  {
    id: 'ts-waffle-towels',
    category: 'Waffle Weave Towels',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwIlFrxqoBkG6U3UZWd3agyC9ES0NlBJLMaPRMbeqhPGaVAcJkQu3A1OeuIrS5M8o3s87yx6NhiZ1fcB7eroSYFBtBr1qDXmHJFIWP7LkUDT65vvCFITxP4zfC8QPuyDoJEQa85VOtE-KiA0bApOmWpxY164fJtebiTNvk5AH6O2tv7__ergJvhNK5jd6eS1_Hv4LkvHt2BeF2d8XOt2tECSf7laYklOYNF5oOKjWlQ95NDBA6rLw-',
    targetId: 'categories-section',
  },
];

export default function DiscoverTopSelling() {
  const [index, setIndex] = useState(0);
  const total = TOP_SELLING_CATEGORIES.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function getVisible() {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function slide(direction: 1 | -1) {
    const visible = getVisible();
    const maxIdx = total - visible;
    setIndex((prev) => {
      let next = prev + direction;
      if (next > maxIdx) next = 0;
      if (next < 0) next = Math.max(0, maxIdx);
      return next;
    });
  }

  // Auto-slide every 4 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => slide(1), 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = getVisible();
  const shiftPercent = (100 / visible) * index;

  return (
    <section
      id="top-selling"
      className="w-full py-16 lg:py-24 bg-surface dark:bg-[#0A0A0A] transition-colors duration-300"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header with Navigation Chevrons */}
        <div className="relative flex items-center justify-center mb-12">
          <h2 className="text-center font-body-md text-2xl lg:text-3xl font-extrabold uppercase tracking-[0.18em] text-on-surface dark:text-[#FAF6F0]">
            TOP SELLING
          </h2>

          <div className="hidden sm:flex items-center gap-2.5 absolute right-0">
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="Previous Slide"
              className="w-10 h-10 rounded-full bg-surface-container-lowest dark:bg-[#1A1815] border border-outline-variant/30 dark:border-[#E6C594]/30 flex items-center justify-center text-on-surface dark:text-[#FAF6F0] hover:bg-primary dark:hover:bg-[#E6C594] hover:text-white dark:hover:text-[#12100E] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="Next Slide"
              className="w-10 h-10 rounded-full bg-surface-container-lowest dark:bg-[#1A1815] border border-outline-variant/30 dark:border-[#E6C594]/30 flex items-center justify-center text-on-surface dark:text-[#FAF6F0] hover:bg-primary dark:hover:bg-[#E6C594] hover:text-white dark:hover:text-[#12100E] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out -mx-3"
            style={{ transform: `translateX(-${shiftPercent}%)` }}
          >
            {TOP_SELLING_CATEGORIES.map((item) => (
              <div
                key={item.id}
                className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                <a
                  href={`#${item.targetId}`}
                  className="group block relative aspect-[4/5] rounded-xl overflow-hidden shadow-md bg-surface-container dark:bg-[#141414]"
                >
                  {/* Category Image */}
                  <Image
                    src={item.image}
                    alt={item.category}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-colors duration-300" />

                  {/* D'Decor Style Bottom Box (SHOP + Category + Arrow) */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#12100E]/95 backdrop-blur-md px-5 py-4 rounded-sm shadow-xl flex items-center justify-between border border-white/20 dark:border-[#E6C594]/20 group-hover:border-[#E6C594] transition-all duration-300">
                    <div>
                      <span className="font-label-sm text-[10px] tracking-[0.25em] uppercase text-[#83533c] dark:text-[#E6C594] block font-semibold mb-0.5">
                        SHOP
                      </span>
                      <h4 className="font-headline-md text-base sm:text-lg font-bold text-[#1c1c19] dark:text-[#FAF6F0] group-hover:text-primary dark:group-hover:text-[#E6C594] transition-colors">
                        {item.category}
                      </h4>
                    </div>
                    <span className="material-symbols-outlined text-on-surface dark:text-[#E6C594] text-[22px] group-hover:translate-x-1.5 transition-transform duration-300">
                      arrow_forward
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

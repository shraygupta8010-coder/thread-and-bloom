'use client';

import Image from 'next/image';

interface DiscoverProduct {
  id: string;
  title: string;
  collection: string;
  variant: string;
  image: string;
}

const FEATURED_ARRIVAL: DiscoverProduct = {
  id: 'na-prism-comforter',
  title: 'Prism Heavy-Weight Winter Comforter',
  collection: 'Vega Collection',
  variant: 'Vega / King Size',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDoE8LjfXXFkYXhNHSDA5eG5Zl5UufVOxxGDNrYXDm3hCHizb8nVKCMmE5IHjoYBtSpufflJRoT5re5fUKwzEoGTQqQV8mqkki-bHO7fn0_ax7NPl2Ci7MYOskGMN1oTpqj5_laH-91JTgte9jaTDfwkWKIBKTh1dNpi8RviFVpe5tNqUA23-tzb3gym5B4wevzQXmQvVpSOP0dTRq8R1e5P3mkd1f0vlV8TzvmGQ-G3Aj37KqEkNAX',
};

const GRID_ARRIVALS: DiscoverProduct[] = [
  {
    id: 'na-oriva-blanket',
    title: 'Oriva Ultra-Soft Sherpa Fleece Blanket',
    collection: 'Spotlight Collection',
    variant: 'Spotlight / Double',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLbSH2OgFEP6lwHRhfrUIore_HjPnbQ4woMZFkU4BnI3jX6PzRzN-RT3yiOTKEq78nhi-C4oijRb9a_O61CPpijd4Tfj7MAiHu5RR5LDraP33gCBbvO3_wEWdsyRIXhLM5Zl1MXtiYkjQkDhx6Gh3Exxk0JXCSRS7cqXQEZUuGKBpMYsCV88KoTFd-0S-RJFEfUOE4GKxJVvJsQV4wJNi2P1D3xY9TeqmaS26MI1lZRZFmarNGzCf1',
  },
  {
    id: 'na-solace-towel',
    title: 'Solace Aegean Luxury Cotton Towel Set',
    collection: 'Verve Collection',
    variant: 'Verve / 4-Piece Suite',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5rqRBN226rjpgjjYr1VBvOhiYtahz3Gw4p0xWfwZa6OhLBWa4r2TIwxIrqNYCbkr-WFFhJcFOfJDvwxXWDdNfc014KQVY7yGzXhGHUTrgSMEz7OxQ0DybQefKKF6kZX6_6Siz87xnwx466JC7-eg0jfubDBQQ0uEmFVywD9tKShc_mPCJQTV_g-tfHabyl8qAF08WGSsBXE171ZjNPP7s8JmR6Ynhqa8mw8x6evbLxn27MEBnHLSE',
  },
  {
    id: 'na-mulmul-dohar',
    title: 'Smoke Blue Reversible Mulmul Dohar',
    collection: 'Primary Collection',
    variant: 'Primary / Queen',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOK82VKGeNCAKTbg3myL0EPbHY8tjD7wOxbVZLjpo6V2gnOK54j5nHLrzjhMwBEUGmbzzcSdxpTkPWjuaYSavhpA29rKpsddTX081cIuGYyK_JZdQlV4LQHKHJmsJ2Py5G6QUMll82dZCmEdheTyz9m1HMDK5ege07Sz8NxLWmVC8cs6qL4Ce-RAYbtEZzcZM6i3HenY5xCZrKIHS4WnCP3aEuPFwvjkpcVuLQEWkwBTKJxzEbBf9A',
  },
  {
    id: 'na-copper-comforter',
    title: 'Prism Copper Tan Quilted Comforter',
    collection: 'Omega Collection',
    variant: 'Omega / King',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXz-NnSOKsbmL88hBSwXib8W3WH1qPK9GVFKBplDnbx_kmsjpLPsHkmx_2mm8RioSCpdgJjs0YSLTqxGzF4LljapuOVceGz0DoM7WwVdBSOgp5fhJlyDf1-NqEDEA_bCUe12qupdCmK7KU5S6cGytDVBPeiNkljbVzRu5eAvc6DQiPqEJWDp-hgdjhfZaRrTf_z6jhFo5Q4nEwvoVnzFMNmUu-vQJiK82NeKgTqaB3v2pnIUbrJc6N',
  },
];

interface DiscoverNewArrivalsProps {
  onAddToBag?: (title: string, variant: string) => void;
}

export default function DiscoverNewArrivals({ onAddToBag }: DiscoverNewArrivalsProps) {
  return (
    <section
      id="discover-new-arrivals"
      className="w-full bg-surface-container-lowest dark:bg-[#12100E] py-16 lg:py-20 transition-colors duration-300"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <h2 className="text-center font-body-md text-2xl lg:text-3xl font-bold uppercase tracking-wide text-on-surface dark:text-[#FAF6F0] mb-10">
          NEW ARRIVALS
        </h2>

        {/* 1 Feature on Left (col-span-6) + 2x2 Grid on Right (col-span-6) — Exact same layout as homepage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Left Tall Feature ────────────────────────────── */}
          <div className="lg:col-span-6 group cursor-pointer">
            <div className="w-full h-[460px] lg:h-[670px] overflow-hidden rounded-sm bg-surface-container dark:bg-[#1C1A17]">
              <Image
                src={FEATURED_ARRIVAL.image}
                alt={FEATURED_ARRIVAL.title}
                width={800}
                height={1000}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="pt-3">
              <h3 className="font-body-md text-sm font-medium text-on-surface dark:text-[#FAF6F0] group-hover:text-primary dark:group-hover:text-[#E6C594] transition-colors">
                {FEATURED_ARRIVAL.title}
              </h3>
              <p className="font-body-md text-xs text-outline dark:text-[#C7B9A5]/70">
                {FEATURED_ARRIVAL.collection}
              </p>
            </div>
          </div>

          {/* ── Right 2×2 Grid ──────────────────────────────── */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GRID_ARRIVALS.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="w-full aspect-square overflow-hidden rounded-sm bg-surface-container dark:bg-[#1C1A17]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="pt-2.5">
                  <h3 className="font-body-md text-sm font-medium text-on-surface dark:text-[#FAF6F0] group-hover:text-primary dark:group-hover:text-[#E6C594] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-xs text-outline dark:text-[#C7B9A5]/70">
                    {item.collection}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

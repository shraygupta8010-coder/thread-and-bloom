import Link from 'next/link';
import { COLLECTIONS } from '@/data/products';

export default function CollectionsSection() {
  return (
    <section className="w-full bg-surface py-20 lg:py-24 transition-colors duration-300" id="collections">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary block mb-2">
              Architectural Layering
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Curated Sanctum Collections
            </h2>
          </div>
          <p className="font-body-md text-on-surface-variant max-w-md">
            Purposefully curated tactile weights designed to withstand chill winter dawns and balmy
            temperate evenings alike.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              className="group block relative overflow-hidden rounded-xl bg-surface-container-low border border-transparent dark:border-outline-variant/40 shadow-sm hover:shadow-xl transition-all duration-500"
              href={col.id === 'blankets' ? '/blankets' : col.id === 'comforters' ? '/comforters' : '#new-arrivals'}
            >
              <div className="relative h-[420px] w-full overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{ backgroundImage: `url('${col.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#E6C594] block mb-1">
                    {col.eyebrow}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-white mb-2">{col.title}</h3>
                  <p className="font-body-md text-xs text-[#FAF6F0]/85 mb-4 line-clamp-2">
                    {col.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-white font-label-md text-label-md tracking-wider uppercase group-hover:text-[#E6C594] transition-colors">
                    <span>{col.cta}</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

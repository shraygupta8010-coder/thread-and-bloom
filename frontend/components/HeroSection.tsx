'use client';

import Image from 'next/image';

interface HeroSectionProps {
  onOpenCod: () => void;
}

const BEDSHEET_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuChDvMLZ-2hC-pUtQ7__skv-648a1UH6ORYOIoe9JOnZYX522w3IGZL9mYB8ysSbL0id36LuYfhwF-Hp8ZOw4D3_sDVmGbo2nFnnCJjJuJHvAIA59UDX7h_R5Apag6AndlLkysl8gFUivOew1hx6g8vrZ2_QOfQyPbEvFHbO4a5d78bhkMjA8J5tk2vmUzWGelDlwNn6okP4-UHSA-DHSW0m9A6qClRKKMbR00pzLziJsKWzcK-xVAH';

export default function HeroSection({ onOpenCod }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-high">
      {/* Strict Centralized Container matching Navbar, Collections, New Arrivals, etc. */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="relative w-full min-h-[640px] lg:min-h-[720px] grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8 lg:gap-0">
          {/* ── Left Editorial Column: Natural Left Alignment with Rest of Brand ── */}
          <div className="lg:col-span-7 flex flex-col justify-center py-12 lg:py-20 lg:pr-10 z-10">
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 bg-surface-container-low px-4 py-1.5 rounded-full mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  Festive Winter Edit • Handcrafted Weaves
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-[1.12] mb-6">
                Pure Comfort, <br />
                <span className="italic font-normal text-primary">Woven for Indian Homes</span>
              </h1>

              {/* Body */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                Immerse yourself in handpicked microfiber comforters, 450 GSM sherpa fleece blankets,
                and 600 GSM Zero-Twist Turkish cotton bath sets crafted for quiet, restorative
                sanctuaries.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a
                  className="px-8 py-4 bg-on-background text-on-primary font-label-md text-label-md uppercase tracking-widest rounded-lg shadow-md hover:bg-primary transition-all duration-300 flex items-center gap-3 group"
                  href="#new-arrivals"
                >
                  <span>Explore Winter Collection</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>
                <button
                  className="px-6 py-4 bg-surface-container-lowest text-on-surface font-label-md text-label-md uppercase tracking-wider rounded-lg shadow-sm hover:bg-surface-container-low transition-all duration-200 flex items-center gap-2.5"
                  onClick={onOpenCod}
                  type="button"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                  <span>Quick COD Order</span>
                </button>
              </div>

              {/* Honest Material Highlights */}
              <div className="grid grid-cols-2 gap-4 max-w-md pt-6 border-t border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">checkroom</span>
                  </div>
                  <div>
                    <p className="font-title-lg text-sm text-on-surface leading-tight">100% Premium Cotton</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant tracking-normal">
                      Long-Staple Soft Weaves
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[20px]">air</span>
                  </div>
                  <div>
                    <p className="font-title-lg text-sm text-on-surface leading-tight">100% Breathable Fill</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant tracking-normal">
                      Cloud-Light Microfiber
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Luxury Bedsheet Image (Centralized & Seamlessly Blended) ── */}
          <div className="lg:col-span-5 relative min-h-[460px] lg:min-h-[720px] overflow-hidden bg-surface-container-high group">
            {/* Bedsheet Photography with Dual-Edge Seamless Feather Mask */}
            <div className="absolute inset-0 bedsheet-blend-mask">
              <Image
                src={BEDSHEET_IMAGE_URL}
                alt="Handloomed Aegean Cotton Bedsheet and Duvet Suite"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                className="w-full h-full object-cover object-center brightness-[0.90] contrast-[1.12] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Rich Warm Luxury Shadow for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#26180f]/75 via-[#26180f]/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Aegean Weaves Card */}
            <div className="hero-floating-card absolute bottom-8 left-6 right-6 sm:left-8 sm:right-8 lg:right-auto lg:left-6 bg-surface-container-lowest/95 backdrop-blur-md p-5 rounded-xl shadow-xl max-w-xs z-10 border border-outline-variant/30">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">workspace_premium</span>
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                    100% Premium Cotton
                  </p>
                  <p className="font-headline-md text-headline-md text-on-surface leading-tight my-1">
                    Aegean Weaves
                  </p>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    Loomed with long-staple single-ply combed yarns for cloud-weight warmth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

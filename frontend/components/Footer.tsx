import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#463A2E] dark:bg-[#12100E] border-t border-transparent dark:border-[#4D433A]/40 text-[#FAF6F0] pt-16 pb-12 transition-colors duration-300">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-[#E6C594]/20">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF6F0] p-1 flex items-center justify-center shadow-md flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#5C4033" strokeWidth="2" />
                  <text
                    x="26"
                    y="62"
                    fontFamily="Playfair Display, serif"
                    fontSize="42"
                    fontWeight="bold"
                    fill="#5C4033"
                  >
                    T
                  </text>
                  <text
                    x="48"
                    y="68"
                    fontFamily="Playfair Display, serif"
                    fontSize="42"
                    fontWeight="bold"
                    fill="#5C4033"
                  >
                    B
                  </text>
                  <circle cx="68" cy="40" r="7" fill="#E8A598" />
                </svg>
              </div>
              <div>
                <span className="font-headline-md text-xl tracking-tight text-[#FAF6F0] block leading-none">
                  Thread &amp; Bloom
                </span>
                <span className="font-label-sm text-[10px] tracking-[0.2em] uppercase text-[#E6C594] block mt-1">
                  Luxury Bedding &amp; Living
                </span>
              </div>
            </div>
            <p className="font-body-md text-xs text-[#D8CBB8] leading-relaxed mb-5">
              Slow-crafted 100% premium cotton bedding, Aegean Turkish bath comforts, and heirloom
              sherpa blankets made for quiet sanctuaries.
            </p>
          </div>

          {/* Living Sanctuaries */}
          <div>
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-[#E6C594] mb-5">
              Living Sanctuaries
            </h4>
            <ul className="space-y-3 font-body-md text-sm text-[#EDE4D7]">
              <li><a className="hover:text-[#E6C594] transition-colors" href="#new-arrivals">Sherpa &amp; Wool Blankets</a></li>
              <li><a className="hover:text-[#E6C594] transition-colors" href="#new-arrivals">Plume Microfiber Comforters</a></li>
              <li><a className="hover:text-[#E6C594] transition-colors" href="#new-arrivals">Turkish Bath Robes &amp; Towels</a></li>
              <li><a className="hover:text-[#E6C594] transition-colors" href="#top-selling">Reversible Mulmul Dohars</a></li>
            </ul>
          </div>

          {/* Craft & Care */}
          <div>
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-[#E6C594] mb-5">
              Craft &amp; Care
            </h4>
            <ul className="space-y-3 font-body-md text-sm text-[#EDE4D7]">
              <li><a className="hover:text-[#E6C594] transition-colors" href="#craft-pillars">Our Weaving Mills</a></li>
              <li><a className="hover:text-[#E6C594] transition-colors" href="#craft-pillars">Fabric &amp; GSM Glossary</a></li>
              <li><a className="hover:text-[#E6C594] transition-colors" href="#craft-pillars">Launder &amp; Longevity Guide</a></li>
            </ul>
          </div>

          {/* Concierge */}
          <div>
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-[#E6C594] mb-5">
              Concierge
            </h4>
            <div className="space-y-3 font-body-md text-sm text-[#EDE4D7]">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#E6C594]">call</span>
                Toll-Free: 1800-419-7221
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#E6C594]">chat</span>
                WhatsApp: +91 98200 44211
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#E6C594]">schedule</span>
                Mon–Sat, 9:00 AM – 8:00 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-body-md text-xs text-[#C7B9A5]">
          <p>&copy; 2026 Thread &amp; Bloom Luxury Living. All master craftsmanship rights reserved.</p>
          <div className="flex items-center flex-wrap gap-5 font-label-sm uppercase tracking-wider text-xs">
            <Link className="hover:text-[#FAF6F0] transition-colors" href="/privacy-policy">Privacy Policy</Link>
            <Link className="hover:text-[#FAF6F0] transition-colors" href="/terms">Terms of Service</Link>
            <Link className="hover:text-[#FAF6F0] transition-colors" href="/shipping-policy">Shipping Policy</Link>
            <Link className="hover:text-[#FAF6F0] transition-colors" href="/refund-policy">Refund Policy</Link>
            <Link className="hover:text-[#E6C594] text-xs text-[#E6C594]/80 transition-colors" href="/admin">Concierge Operations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

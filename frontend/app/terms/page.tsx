'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function TermsAndConditionsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans transition-colors duration-200">
      <Navbar wishlistCount={0} onOpenCod={() => {}} theme={theme} onToggleTheme={toggleTheme} activePage="discover" />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-on-surface-variant">
            <li><Link href="/" className="hover:text-on-surface">Home</Link></li>
            <li>/</li>
            <li className="text-on-surface font-semibold">Terms &amp; Conditions</li>
          </ol>
        </nav>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block mb-2">
          Patron Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-on-surface mb-6">
          Terms &amp; Conditions of Service
        </h1>
        <p className="text-xs text-on-surface-variant mb-10 pb-4 border-b border-outline-variant/40">
          Last Updated: October 2026 • Governing laws of the Republic of India.
        </p>

        <div className="space-y-8 text-xs leading-relaxed text-on-surface-variant">
          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">1. Acceptance of Terms</h2>
            <p>
              By browsing, viewing catalogs, adding suites to the shopping bag, or finalizing orders on Thread &amp; Bloom, you agree to abide by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">2. Handcrafted Weave Variance</h2>
            <p>
              Every blanket, bedsheet, and plush comforter is crafted from natural Giza cotton, Turkish fibers, and high-GSM weaves. Minor variances in thread slub and natural fiber texture are marks of handcrafted textile authenticity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">3. Pricing &amp; Privilege Coupons</h2>
            <p>
              All prices are listed in Indian National Rupees (INR) inclusive of GST. Promotional privilege codes (e.g., LUXURY10, WELCOME500) are valid strictly within specified campaign periods and cannot be stacked arbitrarily.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">4. Payment Gateway Terms</h2>
            <p>
              Online orders processed via Razorpay are subject to real-time bank authorization. In the rare event of account debits without order generation, gateway reversal is triggered within 24–48 hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">5. Cash On Delivery (COD) Protocol</h2>
            <p>
              COD orders require active phone verification. Refusal of delivery upon white-glove arrival without valid cause may result in suspension of future COD ordering privileges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">6. Jurisdiction</h2>
            <p>
              Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts of Pune, Maharashtra, India.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

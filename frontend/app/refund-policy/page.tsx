'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function RefundPolicyPage() {
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
            <li className="text-on-surface font-semibold">Refund &amp; Return Policy</li>
          </ol>
        </nav>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block mb-2">
          Patron Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-on-surface mb-6">
          Refund &amp; Return Policy
        </h1>
        <p className="text-xs text-on-surface-variant mb-10 pb-4 border-b border-outline-variant/40">
          Last Updated: October 2026 • 14-Day Complimentary Exchange &amp; Swift Gateway Refunds.
        </p>

        <div className="space-y-8 text-xs leading-relaxed text-on-surface-variant">
          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">1. The 14-Day Atelier Promise</h2>
            <p>
              We want you to sleep in absolute tranquility. If your bedding suite or plush blanket does not match your expectations in shade, texture, or hand-feel, you may initiate an exchange or return within <strong>14 days of delivery</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">2. Condition of Returned Suites</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Items must be unwashed, unsoiled, and in original packaging with brand tags intact.</li>
              <li>Custom monogrammed or bespoke sizes are eligible only for structural defect replacements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">3. Refund Processing Timelines</h2>
            <div className="p-4 bg-surface-container border border-outline-variant/60 space-y-2">
              <p><strong>Online Payments (Razorpay):</strong> Refunds are processed directly back to the original source method (UPI, credit/debit card, or bank account) within <strong>5 to 7 business days</strong> upon warehouse inspection.</p>
              <p><strong>Cash On Delivery (COD):</strong> Refunds are disbursed via IMPS / NEFT bank transfer or instant UPI handle provided during return concierge authorization.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">4. Initiating an Exchange / Return</h2>
            <p>
              Simply email our Concierge team at <a href="mailto:returns@threadandbloom.com" className="text-primary underline">returns@threadandbloom.com</a> with your order number (e.g. <code>#TB-123456</code>). Our team will arrange a complimentary doorstep courier pickup.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function ShippingPolicyPage() {
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
            <li className="text-on-surface font-semibold">Shipping Policy</li>
          </ol>
        </nav>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block mb-2">
          White-Glove Fulfillment
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-on-surface mb-6">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs text-on-surface-variant mb-10 pb-4 border-b border-outline-variant/40">
          Last Updated: October 2026 • Complimentary White-Glove dispatch across all Indian PIN codes.
        </p>

        <div className="space-y-8 text-xs leading-relaxed text-on-surface-variant">
          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">1. Complimentary Luxury Delivery</h2>
            <p>
              Thread &amp; Bloom provides <strong>100% complimentary delivery</strong> on all orders nationwide. Every linen parcel arrives encased in custom dust bags with branded tissue wrap and care instructions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">2. Dispatch &amp; Transit Timelines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 bg-surface-container border border-outline-variant/60">
                <span className="text-[10px] uppercase font-bold text-primary block mb-1">Standard White Glove</span>
                <p className="font-semibold text-on-surface text-sm">3 to 5 Business Days</p>
                <p className="text-[11px] text-on-surface-variant mt-1">Available across all metro &amp; tier 1/2 cities.</p>
              </div>
              <div className="p-4 bg-surface-container border border-outline-variant/60">
                <span className="text-[10px] uppercase font-bold text-primary block mb-1">Remote &amp; Northeast Regions</span>
                <p className="font-semibold text-on-surface text-sm">5 to 7 Business Days</p>
                <p className="text-[11px] text-on-surface-variant mt-1">Specialized courier routing with signature handover.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">3. Dispatch Notifications &amp; Tracking</h2>
            <p>
              Once your suite leaves our finishing atelier, a tracking link is dispatched via WhatsApp and SMS with real-time waypoint milestones.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">4. Undelivered or Rescheduled Packages</h2>
            <p>
              Our courier executives attempt delivery up to 3 times. If uncontactable, our concierge team will reach out via phone to coordinate a convenient delivery window.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

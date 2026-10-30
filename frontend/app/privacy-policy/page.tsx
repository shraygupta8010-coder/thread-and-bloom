'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

export default function PrivacyPolicyPage() {
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
            <li className="text-on-surface font-semibold">Privacy Policy</li>
          </ol>
        </nav>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block mb-2">
          Legal &amp; Data Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-on-surface mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-on-surface-variant mb-10 pb-4 border-b border-outline-variant/40">
          Last Updated: October 2026 • In compliance with IT Act 2000 &amp; Digital Personal Data Protection Act (DPDPA).
        </p>

        <div className="space-y-8 text-xs leading-relaxed text-on-surface-variant">
          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">1. Commitment to Patron Confidentiality</h2>
            <p>
              Thread &amp; Bloom (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) holds patron trust and privacy with utmost reverence. We process personal details solely to craft bespoke luxury bedding, arrange white-glove courier dispatches, and maintain flawless concierge communication.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contact Information:</strong> Full name, mobile phone number, and verified email address.</li>
              <li><strong>Delivery Coordinates:</strong> Apartment, building name, residence street, city, state, and PIN code.</li>
              <li><strong>Payment Identifiers:</strong> Razorpay transaction references and payment status tokens. We do NOT store card CVVs or net banking credentials on our servers.</li>
              <li><strong>Technical Metadata:</strong> IP address, device fingerprints, and geolocation coordinates captured only upon clicking &quot;Locate My Location&quot;.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">3. Payment Security &amp; Tokenization</h2>
            <p>
              All online digital payments are handled through PCI-DSS Level 1 certified gateways (Razorpay). Sensitive card numbers and UPI pins are encrypted via 256-bit SSL tunnels directly with certified payment networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">4. Data Sharing &amp; Third Parties</h2>
            <p>
              We never monetize or trade patron dossiers. Data is shared exclusively with white-glove logistics partners (BlueDart Apex, Delhivery Luxe) to execute doorstep verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-serif font-semibold text-on-surface">5. Patron Rights &amp; Grievance Redressal</h2>
            <p>
              Patrons may request rectification, export, or complete expungement of their residence dossiers at any time by contacting our Privacy Concierge:
            </p>
            <div className="p-4 bg-surface-container border border-outline-variant/60 text-on-surface">
              <p className="font-semibold">Privacy Officer, Thread &amp; Bloom Atelier</p>
              <p>Email: <a href="mailto:concierge@threadandbloom.com" className="text-primary underline">concierge@threadandbloom.com</a></p>
              <p>Hours: Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

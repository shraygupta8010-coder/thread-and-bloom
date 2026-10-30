'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';
import { Sparkles, Droplets, Wind, Sun, Shield, Heart } from 'lucide-react';

export default function CraftCarePage() {
  const { theme, toggleTheme } = useTheme();
  const [isCodOpen, setIsCodOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#12100E] text-[#FAF6F0]">
      <Navbar
        wishlistCount={0}
        onOpenCod={() => setIsCodOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activePage="discover"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#E6C594]/10 border border-[#E6C594]/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#E6C594]" />
            <span className="text-xs uppercase tracking-wider font-bold text-[#E6C594]">
              Artisanal Excellence
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#FAF6F0]">
            Craft & Care
          </h1>
          
          <p className="text-lg md:text-xl text-[#C7B9A5] leading-relaxed max-w-2xl mx-auto">
            Every Thread & Bloom piece is meticulously crafted with premium materials. 
            Follow our care guidelines to preserve the luxury and longevity of your bedding.
          </p>
        </div>
      </section>

      {/* Care Instructions Grid */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Washing */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-8 hover:border-[#E6C594]/50 transition-all">
              <div className="w-12 h-12 bg-[#E6C594]/10 rounded-full flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6 text-[#E6C594]" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF6F0] mb-3">Washing</h3>
              <ul className="space-y-2 text-sm text-[#C7B9A5]">
                <li>• Machine wash cold (30°C max)</li>
                <li>• Use mild, color-safe detergent</li>
                <li>• Wash dark colors separately</li>
                <li>• Turn inside out before washing</li>
                <li>• Avoid bleach and harsh chemicals</li>
              </ul>
            </div>

            {/* Drying */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-8 hover:border-[#E6C594]/50 transition-all">
              <div className="w-12 h-12 bg-[#E6C594]/10 rounded-full flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-[#E6C594]" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF6F0] mb-3">Drying</h3>
              <ul className="space-y-2 text-sm text-[#C7B9A5]">
                <li>• Tumble dry on low heat</li>
                <li>• Remove promptly to prevent wrinkles</li>
                <li>• Air dry for best results</li>
                <li>• Avoid direct sunlight for colors</li>
                <li>• Shake gently before drying</li>
              </ul>
            </div>

            {/* Ironing */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-8 hover:border-[#E6C594]/50 transition-all">
              <div className="w-12 h-12 bg-[#E6C594]/10 rounded-full flex items-center justify-center mb-4">
                <Sun className="w-6 h-6 text-[#E6C594]" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF6F0] mb-3">Ironing</h3>
              <ul className="space-y-2 text-sm text-[#C7B9A5]">
                <li>• Iron on medium heat if needed</li>
                <li>• Iron inside out to protect colors</li>
                <li>• Use steam for stubborn wrinkles</li>
                <li>• Avoid direct heat on embroidery</li>
                <li>• Store properly to minimize ironing</li>
              </ul>
            </div>

            {/* Storage */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-8 hover:border-[#E6C594]/50 transition-all">
              <div className="w-12 h-12 bg-[#E6C594]/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#E6C594]" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF6F0] mb-3">Storage</h3>
              <ul className="space-y-2 text-sm text-[#C7B9A5]">
                <li>• Store in a cool, dry place</li>
                <li>• Avoid plastic bags (use cotton)</li>
                <li>• Keep away from direct sunlight</li>
                <li>• Fold neatly to prevent creases</li>
                <li>• Use cedar blocks for freshness</li>
              </ul>
            </div>

            {/* Stain Removal */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-8 hover:border-[#E6C594]/50 transition-all">
              <div className="w-12 h-12 bg-[#E6C594]/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#E6C594]" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF6F0] mb-3">Stain Removal</h3>
              <ul className="space-y-2 text-sm text-[#C7B9A5]">
                <li>• Treat stains immediately</li>
                <li>• Blot, don't rub stains</li>
                <li>• Use cold water for fresh stains</li>
                <li>• Test cleaners on hidden areas first</li>
                <li>• Professional cleaning for tough stains</li>
              </ul>
            </div>

            {/* General Care */}
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-8 hover:border-[#E6C594]/50 transition-all">
              <div className="w-12 h-12 bg-[#E6C594]/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[#E6C594]" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF6F0] mb-3">General Care</h3>
              <ul className="space-y-2 text-sm text-[#C7B9A5]">
                <li>• Rotate bedding sets regularly</li>
                <li>• Wash every 1-2 weeks</li>
                <li>• Keep pets off delicate fabrics</li>
                <li>• Use mattress protectors</li>
                <li>• Follow care label instructions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fabric Information */}
      <section className="py-16 px-6 lg:px-12 bg-[#1F1C19]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#FAF6F0]">
            Our Premium Fabrics
          </h2>
          
          <div className="space-y-8">
            {/* Egyptian Cotton */}
            <div className="border-l-4 border-[#E6C594] pl-6">
              <h3 className="text-xl font-bold text-[#E6C594] mb-2">
                Egyptian Cotton (300-400 TC)
              </h3>
              <p className="text-[#C7B9A5] leading-relaxed mb-3">
                Sourced from the Nile Delta, our long-staple Egyptian cotton offers exceptional 
                softness, breathability, and durability. Thread count of 300-400 ensures the 
                perfect balance of comfort and strength.
              </p>
              <p className="text-sm text-[#C7B9A5]/80">
                <strong className="text-[#E6C594]">Best for:</strong> Year-round comfort, hot sleepers, luxury feel
              </p>
            </div>

            {/* Premium Microfiber */}
            <div className="border-l-4 border-[#E6C594] pl-6">
              <h3 className="text-xl font-bold text-[#E6C594] mb-2">
                Premium Microfiber (450 GSM)
              </h3>
              <p className="text-[#C7B9A5] leading-relaxed mb-3">
                Ultra-fine synthetic fibers woven into a plush, hypoallergenic fabric. 
                Our 450 GSM microfiber provides cloud-like softness with easy care properties.
              </p>
              <p className="text-sm text-[#C7B9A5]/80">
                <strong className="text-[#E6C594]">Best for:</strong> Easy maintenance, wrinkle resistance, allergy sufferers
              </p>
            </div>

            {/* Silk Blends */}
            <div className="border-l-4 border-[#E6C594] pl-6">
              <h3 className="text-xl font-bold text-[#E6C594] mb-2">
                Silk Cotton Blend
              </h3>
              <p className="text-[#C7B9A5] leading-relaxed mb-3">
                A luxurious blend combining the elegance of mulberry silk with the breathability 
                of cotton. Temperature-regulating and naturally hypoallergenic.
              </p>
              <p className="text-sm text-[#C7B9A5]/80">
                <strong className="text-[#E6C594]">Best for:</strong> Sensitive skin, temperature regulation, premium luxury
              </p>
            </div>

            {/* Reversible Designs */}
            <div className="border-l-4 border-[#E6C594] pl-6">
              <h3 className="text-xl font-bold text-[#E6C594] mb-2">
                Reversible Jacquard Weave
              </h3>
              <p className="text-[#C7B9A5] leading-relaxed mb-3">
                Intricate patterns woven directly into the fabric using premium cotton and polyester. 
                Two stunning designs in one bedsheet for versatile styling.
              </p>
              <p className="text-sm text-[#C7B9A5]/80">
                <strong className="text-[#E6C594]">Best for:</strong> Design flexibility, durability, statement luxury
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty & Guarantee */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#FAF6F0]">
            Our Quality Promise
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#E6C594] mb-2">100%</div>
              <div className="text-sm text-[#C7B9A5]">Authentic Premium Fabrics</div>
            </div>
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#E6C594] mb-2">7 Days</div>
              <div className="text-sm text-[#C7B9A5]">Easy Return Policy</div>
            </div>
            <div className="bg-[#1F1C19] border border-[#3A3125] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#E6C594] mb-2">3 Years</div>
              <div className="text-sm text-[#C7B9A5]">Quality Guarantee</div>
            </div>
          </div>
          <p className="text-[#C7B9A5] leading-relaxed">
            We stand behind every piece we create. If you're not completely satisfied with your 
            Thread & Bloom bedding, our customer care team is here to help. Contact us at{' '}
            <a href="mailto:care@threadandbloom.com" className="text-[#E6C594] hover:underline">
              care@threadandbloom.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { HERO_VIDEO_URL } from '@/data/products';

export default function CinematicVideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Sync state with native video volume & autoplay policy
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Track native volume and mute changes so React state is always 100% accurate
    const handleVolumeChange = () => {
      setIsMuted(video.muted || video.volume === 0);
    };

    video.addEventListener('volumechange', handleVolumeChange);

    // Initial playback attempt
    video.volume = 1.0;
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // Modern browser autoplay policies block unmuted audio without prior interaction
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
    }

    return () => {
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // Sound toggle handler: reliably turns sound on or off
  const toggleSound = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.muted || video.volume === 0) {
      // Turn sound ON
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => {});
      setIsMuted(false);
    } else {
      // Turn sound OFF
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  return (
    <section className="w-full relative overflow-hidden bg-black mb-12 sm:mb-16 lg:mb-20 shadow-md">
      {/* 16:9 Full-Bleed Widescreen Video (no black padding, fills edge-to-edge) */}
      <div className="relative w-full aspect-[16/9] overflow-hidden group">
        {/* Permanent Autoplay Loop Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover absolute inset-0"
          autoPlay
          loop
          playsInline
          poster="https://lh3.googleusercontent.com/aida-public/AB6AXuChDvMLZ-2hC-pUtQ7__skv-648a1UH6ORYOIoe9JOnZYX522w3IGZL9mYB8ysSbL0id36LuYfhwF-Hp8ZOw4D3_sDVmGbo2nFnnCJjJuJHvAIA59UDX7h_R5Apag6AndlLkysl8gFUivOew1hx6g8vrZ2_QOfQyPbEvFHbO4a5d78bhkMjA8J5tk2vmUzWGelDlwNn6okP4-UHSA-DHSW0m9A6qClRKKMbR00pzLziJsKWzcK-xVAH"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
          <source src="/videos/video-thread-and-looms.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Subtle Luxury Gradient for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Right Dedicated Sound Toggle Button */}
        <div className="absolute top-4 sm:top-7 right-4 sm:right-8 z-30">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md border flex items-center gap-2.5 font-label-sm text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-2xl cursor-pointer ${
              isMuted
                ? 'bg-black/80 hover:bg-black/95 text-[#FAF6F0] border-[#E6C594] ring-2 ring-[#E6C594]/30 animate-pulse'
                : 'bg-black/60 hover:bg-black/85 text-white border-white/30 hover:border-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-[#E6C594]">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
            <span className="font-semibold tracking-[0.14em]">
              {isMuted ? 'Tap for Sound' : 'Mute Sound'}
            </span>
          </button>
        </div>

        {/* Bottom-Left Luxury Badge matching SHOP NOW button size */}
        <div className="absolute bottom-[10%] sm:bottom-[12%] md:bottom-[13%] left-[3%] sm:left-[4.5%] md:left-[5.5%] z-20">
          <div className="justify-center px-6 sm:px-8 md:px-10 py-4 sm:py-4.5 md:py-5 bg-[#0A0A0A]/95 text-[#E6C594] border-2 border-[#E6C594] font-label-md text-sm sm:text-base md:text-lg tracking-[0.22em] uppercase font-bold rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-300 flex items-center gap-3.5 backdrop-blur-md select-none">
            <span className="w-2 h-2 rounded-full bg-[#E6C594] inline-block animate-pulse" />
            <span>HANDCRAFTED LUXURY WEAVES</span>
          </div>
        </div>

        {/* Sole "SHOP NOW" Button placed directly over the Gemini logo/watermark to conceal it */}
        <div className="absolute bottom-[10%] sm:bottom-[12%] md:bottom-[13%] right-[3%] sm:right-[4.5%] md:right-[5.5%] z-30">
          <Link
            href="/discover#categories-section"
            aria-label="Shop Categories"
            className="min-w-[230px] sm:min-w-[265px] md:min-w-[290px] justify-center px-8 sm:px-10 md:px-12 py-4 sm:py-4.5 md:py-5 bg-[#0A0A0A] hover:bg-[#E6C594] text-[#E6C594] hover:text-[#0A0A0A] border-2 border-[#E6C594] font-label-md text-base sm:text-lg tracking-[0.22em] uppercase font-bold rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:shadow-[0_10px_35px_rgba(230,197,148,0.4)] transition-all duration-300 flex items-center gap-3.5 group/btn cursor-pointer backdrop-blur-md"
          >
            <span>SHOP NOW</span>
            <span className="material-symbols-outlined text-[22px] sm:text-[24px] group-hover/btn:translate-x-1.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

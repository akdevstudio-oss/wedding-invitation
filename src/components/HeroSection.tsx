import React from 'react';
import { FloralOrnament } from './FloralOrnament';
import { weddingData } from '../data/weddingData';
import { ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToNext = () => {
    const el = document.getElementById('couple');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F8F5EE]"
    >
      {/* Cinematic Full-bleed Background with Slow Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={weddingData.heroImage}
          alt="Grand Royal Wedding Stage with Floral Arch"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 animate-[pulseGlow_12s_ease-in-out_infinite] transition-transform duration-[10000ms] ease-out"
          style={{
            animationDuration: '20s',
            transform: 'scale(1.04)',
          }}
        />

        {/* Measured Scrim for perfect editorial contrast (Anti-slop rule §1.F) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#44382F]/90 via-[#44382F]/45 to-[#44382F]/70 backdrop-blur-[0.5px]" />
        {/* Soft champagne vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#44382F]/20 to-[#44382F]/70" />
      </div>

      {/* Elegant Corner Filigree in Ivory/Gold */}
      <FloralOrnament variant="corner" className="absolute top-20 left-6 sm:left-12 w-24 h-24 sm:w-32 sm:h-32 text-[#D8C7AA] opacity-75 z-10 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute top-20 right-6 sm:right-12 w-24 h-24 sm:w-32 sm:h-32 text-[#D8C7AA] opacity-75 -scale-x-100 z-10 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute bottom-16 left-6 sm:left-12 w-24 h-24 sm:w-32 sm:h-32 text-[#D8C7AA] opacity-75 -scale-y-100 z-10 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute bottom-16 right-6 sm:right-12 w-24 h-24 sm:w-32 sm:h-32 text-[#D8C7AA] opacity-75 -scale-x-100 -scale-y-100 z-10 pointer-events-none" />

      {/* Main Hero Invitation Card Typography */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center text-[#FDFBF7] flex flex-col items-center">
        {/* Kicker */}
        <p className="text-xs sm:text-sm font-serif tracking-[0.35em] uppercase text-[#D8C7AA] mb-4">
          {weddingData.invitation.kicker}
        </p>

        {/* Bride & Groom Names with Royal Calligraphy Connection */}
        <div className="my-3 space-y-2">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-[#FDFBF7] drop-shadow-md">
            {weddingData.bride.name}
          </h1>
          <div className="flex items-center justify-center gap-4 py-1">
            <span className="w-12 sm:w-20 h-[1px] bg-[#D8C7AA]/60" />
            <span className="font-calligraphy text-4xl sm:text-5xl text-[#D8C7AA] -my-2">
              &amp;
            </span>
            <span className="w-12 sm:w-20 h-[1px] bg-[#D8C7AA]/60" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-[#FDFBF7] drop-shadow-md">
            {weddingData.groom.name}
          </h1>
        </div>

        {/* Divider Flourish */}
        <FloralOrnament variant="flourish" className="w-40 sm:w-56 h-8 text-[#D8C7AA] my-4 opacity-90" />

        {/* Formal Request Lines */}
        <p className="text-xs sm:text-sm md:text-base font-serif tracking-[0.25em] uppercase text-[#E8DFC8] max-w-xl leading-relaxed mt-2">
          {weddingData.invitation.requestLine}
        </p>

        {/* Wedding Date Display */}
        <div className="mt-8 pt-4 border-t border-[#D8C7AA]/30 flex flex-col items-center">
          <span className="text-[11px] font-serif uppercase tracking-[0.3em] text-[#D8C7AA]/80 mb-1">
            Save The Date
          </span>
          <span className="font-display text-xl sm:text-2xl tracking-[0.15em] text-[#FDFBF7] font-medium">
            {weddingData.weddingDateDisplay}
          </span>
          <span className="text-xs font-serif text-[#D8C7AA]/90 tracking-widest mt-1">
            {weddingData.primaryVenue.name} · Multan
          </span>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToNext}
          aria-label="Scroll down to couple introduction"
          className="mt-12 flex flex-col items-center gap-2 text-[#D8C7AA]/80 hover:text-[#FDFBF7] transition-colors cursor-pointer group"
        >
          <span className="text-[10px] font-serif tracking-[0.3em] uppercase">Scroll to Discover</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#D8C7AA]" />
        </button>
      </div>
    </section>
  );
};

import React from 'react';
import { FloralOrnament, MonogramCrest } from './FloralOrnament';
import { weddingData } from '../data/weddingData';
import { ChevronUp, Heart } from 'lucide-react';

export const ClosingSection: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-28 sm:py-36 bg-[#FDFBF7] paper-texture overflow-hidden text-center text-[#44382F] border-t border-[#D8C7AA]">
      {/* Background Floral Ornaments */}
      <FloralOrnament variant="corner" className="absolute top-8 left-8 w-28 h-28 text-[#B69A68] opacity-30 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute top-8 right-8 w-28 h-28 text-[#B69A68] opacity-30 -scale-x-100 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute bottom-8 left-8 w-28 h-28 text-[#B69A68] opacity-30 -scale-y-100 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute bottom-8 right-8 w-28 h-28 text-[#B69A68] opacity-30 -scale-x-100 -scale-y-100 pointer-events-none" />

      {/* Central Content */}
      <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Monogram Crest */}
        <MonogramCrest
          brideInitial={weddingData.monogram.brideInitial}
          groomInitial={weddingData.monogram.groomInitial}
          size="md"
          animate={false}
          className="mb-6"
        />

        {/* Heading */}
        <p className="font-calligraphy text-3xl sm:text-4xl text-[#B69A68] mb-2">
          {weddingData.closing.heading}
        </p>

        {/* Names */}
        <h2 className="font-display text-3xl sm:text-5xl font-light text-[#44382F] tracking-wide my-3">
          {weddingData.bride.name} <span className="font-serif italic font-normal">&amp;</span> {weddingData.groom.name}
        </h2>

        <FloralOrnament variant="flourish" className="w-48 h-8 text-[#B69A68] my-4 opacity-80" />

        {/* Thank you note */}
        <p className="font-serif text-base sm:text-lg text-[#8D8174] max-w-lg leading-relaxed mb-8">
          {weddingData.closing.message}
        </p>

        {/* Signoff */}
        <div className="pt-6 border-t border-[#D8C7AA]/50 w-64 mx-auto mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[#B69A68] font-medium">
            {weddingData.closing.signoff}
          </p>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#8D8174] hover:text-[#44382F] transition-colors py-2 px-4 rounded-xs border border-[#D8C7AA] hover:border-[#B69A68] bg-[#F8F5EE] cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Back to Top</span>
        </button>
      </div>
    </footer>
  );
};

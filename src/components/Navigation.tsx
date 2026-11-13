import React, { useState, useEffect } from 'react';
import { weddingData } from '../data/weddingData';
import { Lock } from 'lucide-react';

interface NavigationProps {
  onOpenAdmin?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#D8C7AA]/50 shadow-xs py-2.5'
          : 'bg-[#FDFBF7]/80 backdrop-blur-xs border-b border-[#D8C7AA]/25 py-3'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
        {/* Zone 1: Refined Royal Monogram Wordmark */}
        <a
          href="#invitation"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('invitation');
          }}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#D8C7AA] bg-[#F8F5EE] hover:border-[#B69A68] transition-colors whitespace-nowrap shrink-0 shadow-2xs"
          aria-label="Couple Monogram I & A"
        >
          <span className="font-display text-sm sm:text-base font-semibold text-[#44382F] leading-none">
            {weddingData.monogram.brideInitial}
          </span>
          <span className="font-calligraphy text-lg sm:text-xl text-[#B69A68] leading-none">
            &amp;
          </span>
          <span className="font-display text-sm sm:text-base font-semibold text-[#44382F] leading-none">
            {weddingData.monogram.groomInitial}
          </span>
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden sm:flex items-center gap-6 text-xs font-serif tracking-[0.2em] uppercase text-[#8D8174]">
          <button
            onClick={() => scrollToSection('invitation')}
            className="hover:text-[#44382F] transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Invitation
          </button>
          <button
            onClick={() => scrollToSection('program')}
            className="hover:text-[#44382F] transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Schedule
          </button>
          <button
            onClick={() => scrollToSection('venue')}
            className="hover:text-[#44382F] transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Venue
          </button>
        </nav>

        {/* Zone 3: Actions (RSVP + Host Admin lock) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => scrollToSection('rsvp')}
            className="px-4 py-1.5 text-xs font-serif uppercase tracking-widest text-[#FDFBF7] bg-[#44382F] hover:bg-[#B69A68] transition-colors shadow-xs whitespace-nowrap shrink-0 rounded-xs cursor-pointer"
          >
            RSVP
          </button>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="p-1.5 text-[#8D8174] hover:text-[#44382F] hover:bg-[#D8C7AA]/30 border border-[#D8C7AA]/60 rounded-xs transition-colors cursor-pointer"
              title="Open Wedding Host Admin Panel"
              aria-label="Host Admin Panel"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { FloralOrnament } from './FloralOrnament';
import { weddingData } from '../data/weddingData';
import { Sparkles, Heart } from 'lucide-react';

export const CoupleSection: React.FC = () => {
  return (
    <section id="couple" className="py-24 sm:py-32 bg-[#F8F5EE] paper-texture relative overflow-hidden">
      {/* Background floral accents */}
      <FloralOrnament
        variant="corner"
        className="absolute top-12 left-10 w-28 h-28 text-[#B69A68] opacity-25 pointer-events-none"
      />
      <FloralOrnament
        variant="corner"
        className="absolute bottom-12 right-10 w-28 h-28 text-[#B69A68] opacity-25 -scale-x-100 -scale-y-100 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Sacred Quranic Blessing Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-serif text-lg sm:text-xl text-[#B69A68] tracking-widest mb-2 font-normal">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs font-serif uppercase tracking-[0.3em] text-[#8D8174] mb-3">
            In The Name Of Allah, The Most Beneficent, The Most Merciful
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#44382F] font-normal tracking-wide">
            The Auspicious Union
          </h2>
          <FloralOrnament variant="divider" className="w-36 h-6 text-[#B69A68] mx-auto mt-3 opacity-80" />
          <p className="font-serif italic text-base sm:text-lg text-[#8D8174] mt-4">
            &ldquo;And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.&rdquo;
          </p>
          <span className="text-[11px] font-serif uppercase tracking-widest text-[#B69A68] mt-1 block">
            — Surah Ar-Rum [30:21]
          </span>
        </div>

        {/* Editorial Royal Monogram & Lineage Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-stretch mb-16">
          {/* --- THE BRIDE: DR. IQRA ARSHAD --- */}
          <div className="lg:col-span-5 bg-[#FDFBF7] p-8 sm:p-10 rounded-t-full border border-[#D8C7AA] hover:border-[#B69A68] shadow-md transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center group relative overflow-hidden">
            {/* Ambient Gold Aura */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D8C7AA]/20 rounded-full blur-2xl group-hover:bg-[#B69A68]/30 transition-colors" />

            {/* Stylized Archway Crest & Monogram */}
            <div className="relative w-36 h-36 rounded-full border-2 border-[#D8C7AA] p-2 flex items-center justify-center mb-6 group-hover:border-[#B69A68] transition-colors">
              <div className="w-full h-full rounded-full bg-[#F8F5EE] border border-[#D8C7AA]/60 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                <FloralOrnament variant="crest" className="w-28 h-28 text-[#B69A68] opacity-35 absolute inset-0 m-auto animate-float-slow" />
                <span className="font-display text-4xl font-bold tracking-widest text-[#44382F] z-10">
                  {weddingData.bride.symbol}
                </span>
                <span className="text-[9px] font-serif uppercase tracking-[0.25em] text-[#B69A68] z-10 mt-1">
                  Bride
                </span>
              </div>
            </div>

            {/* Details */}
            <span className="text-xs font-serif uppercase tracking-[0.25em] text-[#8D8174] mb-1">
              {weddingData.bride.title}
            </span>

            <h3 className="font-display text-2xl sm:text-3xl text-[#44382F] font-normal tracking-wide">
              {weddingData.bride.name}
            </h3>

            <div className="w-12 h-[1px] bg-[#D8C7AA] my-3" />

            <p className="font-calligraphy text-2xl text-[#B69A68]">
              Daughter of
            </p>

            <p className="font-serif text-sm font-medium text-[#44382F] tracking-wide mt-1">
              {weddingData.bride.father}
            </p>
            <p className="text-xs font-serif text-[#8D8174]">
              &amp; {weddingData.bride.mother}
            </p>

            <p className="text-xs font-serif text-[#8D8174] leading-relaxed mt-4 italic max-w-xs">
              &ldquo;{weddingData.bride.bio}&rdquo;
            </p>
          </div>

          {/* --- CENTRAL SACRED EMBLEM --- */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center my-4 lg:my-0">
            <div className="hidden lg:block w-[1px] h-20 bg-gradient-to-b from-transparent via-[#D8C7AA] to-transparent" />
            <div className="relative my-3 p-3 rounded-full bg-[#FDFBF7] border border-[#D8C7AA] shadow-sm">
              <FloralOrnament variant="crest" className="w-16 h-16 text-[#B69A68]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-calligraphy text-2xl text-[#44382F] font-bold">
                  &amp;
                </span>
              </div>
            </div>
            <div className="hidden lg:block w-[1px] h-20 bg-gradient-to-b from-transparent via-[#D8C7AA] to-transparent" />
          </div>

          {/* --- THE GROOM: MUHAMMAD AWAIS --- */}
          <div className="lg:col-span-5 bg-[#FDFBF7] p-8 sm:p-10 rounded-t-full border border-[#D8C7AA] hover:border-[#B69A68] shadow-md transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center group relative overflow-hidden">
            {/* Ambient Gold Aura */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D8C7AA]/20 rounded-full blur-2xl group-hover:bg-[#B69A68]/30 transition-colors" />

            {/* Stylized Archway Crest & Monogram */}
            <div className="relative w-36 h-36 rounded-full border-2 border-[#D8C7AA] p-2 flex items-center justify-center mb-6 group-hover:border-[#B69A68] transition-colors">
              <div className="w-full h-full rounded-full bg-[#F8F5EE] border border-[#D8C7AA]/60 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                <FloralOrnament variant="crest" className="w-28 h-28 text-[#B69A68] opacity-35 absolute inset-0 m-auto animate-float-slow" />
                <span className="font-display text-4xl font-bold tracking-widest text-[#44382F] z-10">
                  {weddingData.groom.symbol}
                </span>
                <span className="text-[9px] font-serif uppercase tracking-[0.25em] text-[#B69A68] z-10 mt-1">
                  Groom
                </span>
              </div>
            </div>

            {/* Details */}
            <span className="text-xs font-serif uppercase tracking-[0.25em] text-[#8D8174] mb-1">
              {weddingData.groom.title}
            </span>

            <h3 className="font-display text-2xl sm:text-3xl text-[#44382F] font-normal tracking-wide">
              {weddingData.groom.name}
            </h3>

            <div className="w-12 h-[1px] bg-[#D8C7AA] my-3" />

            <p className="font-calligraphy text-2xl text-[#B69A68]">
              Son of
            </p>

            <p className="font-serif text-sm font-medium text-[#44382F] tracking-wide mt-1">
              {weddingData.groom.father}
            </p>
            <p className="text-xs font-serif text-[#8D8174]">
              &amp; {weddingData.groom.mother}
            </p>

            <p className="text-xs font-serif text-[#8D8174] leading-relaxed mt-4 italic max-w-xs">
              &ldquo;{weddingData.groom.bio}&rdquo;
            </p>
          </div>
        </div>

        {/* Stylish Visual Showcase: Sacred Rings & Imperial Arches (Pure Architecture, Zero People) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12">
          {/* Card 1: Gold Wedding Rings Still Life */}
          <div className="group relative overflow-hidden rounded-xs border border-[#D8C7AA] shadow-sm bg-[#FDFBF7]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/src/assets/images/wedding_rings_gold_silk_1794486229296.jpg"
                alt="Gold Wedding Bands on Ivory Silk"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#44382F]/75 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FDFBF7]">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#D8C7AA]">
                  Sacred Token
                </span>
                <h4 className="font-display text-xl font-light">
                  Two Eternal Bands, One Sacred Covenant
                </h4>
              </div>
            </div>
          </div>

          {/* Card 2: Imperial Palace Archways */}
          <div className="group relative overflow-hidden rounded-xs border border-[#D8C7AA] shadow-sm bg-[#FDFBF7]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/src/assets/images/palatial_marble_arches_1794486228970.jpg"
                alt="Imperial Islamic Palace Archways"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#44382F]/75 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FDFBF7]">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#D8C7AA]">
                  Regal Architecture
                </span>
                <h4 className="font-display text-xl font-light">
                  Grandeur, Blessings &amp; Timeless Grace
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useState } from 'react';
import { FloralOrnament, MonogramCrest } from './FloralOrnament';
import { weddingData } from '../data/weddingData';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1800; // Elegant, short ~1.8s
    const stepTime = 30;
    const increment = 100 / (duration / stepTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onLoaded, 350);
          return 100;
        }
        return next;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [onLoaded]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FDFBF7] paper-texture text-[#44382F] select-none transition-opacity duration-700">
      {/* Top and Bottom Corner Accents */}
      <FloralOrnament variant="corner" className="absolute top-6 left-6 w-20 h-20 text-[#B69A68] opacity-60" />
      <FloralOrnament variant="corner" className="absolute top-6 right-6 w-20 h-20 text-[#B69A68] opacity-60 -scale-x-100" />
      <FloralOrnament variant="corner" className="absolute bottom-6 left-6 w-20 h-20 text-[#B69A68] opacity-60 -scale-y-100" />
      <FloralOrnament variant="corner" className="absolute bottom-6 right-6 w-20 h-20 text-[#B69A68] opacity-60 -scale-x-100 -scale-y-100" />

      <div className="max-w-md w-full px-8 text-center flex flex-col items-center">
        {/* Monogram Crest */}
        <MonogramCrest
          brideInitial={weddingData.monogram.brideInitial}
          groomInitial={weddingData.monogram.groomInitial}
          size="lg"
          className="mb-6"
        />

        {/* Introductory Message */}
        <p className="text-xs font-serif tracking-[0.25em] uppercase text-[#8D8174] mb-2">
          Royal Wedding Invitation
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#44382F] tracking-wide mb-4">
          A Beautiful Celebration Awaits
        </h2>

        {/* Thin Champagne-Gold Loading Line */}
        <div className="w-48 sm:w-64 h-[2px] bg-[#D8C7AA]/40 rounded-full overflow-hidden my-6 relative">
          <div
            className="h-full bg-gradient-to-r from-[#D8C7AA] via-[#B69A68] to-[#D8C7AA] transition-all duration-100 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Couple Names teaser */}
        <p className="font-calligraphy text-2xl sm:text-3xl text-[#B69A68] mb-6">
          {weddingData.bride.name} & {weddingData.groom.name}
        </p>

        {/* Skip button for quick review */}
        <button
          onClick={onLoaded}
          className="text-[11px] font-sans tracking-widest uppercase text-[#8D8174] hover:text-[#44382F] underline underline-offset-4 transition-colors"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};

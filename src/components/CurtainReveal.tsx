import React, { useEffect, useState } from 'react';

interface CurtainRevealProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const CurtainReveal: React.FC<CurtainRevealProps> = ({ onComplete, onSkip }) => {
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Brief settle time so guests see the grand drapery before it parts gracefully
    const startTimer = setTimeout(() => {
      setIsOpening(true);
    }, 400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {/* Central Radiant Golden Light Beam */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
          isOpening ? 'opacity-90' : 'opacity-0'
        }`}
      >
        <div className="w-[120vw] h-full bg-radial from-[#FDFBF7] via-[#D8C7AA]/40 to-transparent blur-3xl" />
        <div className="absolute w-[2px] h-full bg-gradient-to-b from-transparent via-[#B69A68] to-transparent shadow-[0_0_50px_#B69A68]" />
      </div>

      {/* Top Drapery Valance / Pelmet */}
      <div
        className={`absolute top-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-b from-[#44382F]/30 via-[#D8C7AA]/30 to-transparent z-20 pointer-events-none transition-transform duration-1000 ${
          isOpening ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="w-full h-8 bg-[#C2B092] shadow-md border-b-2 border-[#B69A68]" />
      </div>

      {/* Left Curtain Panel */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1/2 curtain-fabric-left z-10 transition-transform duration-[1800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpening ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Fabric Vertical Pleat Folds */}
        <div className="w-full h-full opacity-35 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,transparent_50%,rgba(255,255,255,0.25)_100%)] bg-[length:40px_100%]" />
        {/* Right edge shadow & gold trimming */}
        <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-r from-transparent to-[#B69A68]/40 border-r border-[#8D8174]/40" />
      </div>

      {/* Right Curtain Panel */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-1/2 curtain-fabric-right z-10 transition-transform duration-[1800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpening ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Fabric Vertical Pleat Folds */}
        <div className="w-full h-full opacity-35 bg-[linear-gradient(90deg,rgba(255,255,255,0.25)_0%,transparent_50%,rgba(0,0,0,0.15)_100%)] bg-[length:40px_100%]" />
        {/* Left edge shadow & gold trimming */}
        <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-l from-transparent to-[#B69A68]/40 border-l border-[#8D8174]/40" />
      </div>

      {/* Accessible Skip Button */}
      <button
        onClick={onSkip}
        type="button"
        className="pointer-events-auto absolute top-6 right-6 z-30 px-3 py-1.5 rounded-full bg-[#FDFBF7]/80 backdrop-blur-sm border border-[#D8C7AA] text-xs font-serif text-[#44382F] hover:bg-[#F8F5EE] shadow-sm tracking-wider uppercase"
      >
        Skip Reveal
      </button>
    </div>
  );
};

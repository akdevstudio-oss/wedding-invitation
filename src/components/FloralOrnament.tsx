import React from 'react';

interface FloralOrnamentProps {
  className?: string;
  variant?: 'corner' | 'divider' | 'crest' | 'flourish';
}

export const FloralOrnament: React.FC<FloralOrnamentProps> = ({
  className = 'w-16 h-16 text-[#B69A68]',
  variant = 'divider',
}) => {
  if (variant === 'corner') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        {/* Elegant Victorian / Regency Corner Flourish */}
        <path d="M 5,5 L 45,5 C 30,12 18,24 15,40 C 12,25 5,15 5,5 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M 5,5 L 5,45 C 12,30 24,18 40,15 C 25,12 15,5 5,5 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M 5,5 L 55,5 M 5,5 L 5,55" />
        <path d="M 12,12 C 22,12 32,18 36,28 C 40,38 48,42 58,40" />
        <path d="M 12,12 C 12,22 18,32 28,36 C 38,40 42,48 40,58" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        <circle cx="28" cy="28" r="1.8" fill="currentColor" />
        <circle cx="48" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="48" r="1.5" fill="currentColor" />
        {/* Delicate floral leaves */}
        <path d="M 22,8 C 26,4 32,4 34,9 C 30,11 25,10 22,8 Z" fill="currentColor" fillOpacity="0.25" />
        <path d="M 8,22 C 4,26 4,32 9,34 C 11,30 10,25 8,22 Z" fill="currentColor" fillOpacity="0.25" />
      </svg>
    );
  }

  if (variant === 'crest') {
    return (
      <svg
        viewBox="0 0 160 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        {/* Royal Botanical Laurel Crest */}
        <circle cx="80" cy="80" r="68" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="80" cy="80" r="62" opacity="0.3" />
        {/* Left Laurel Branch */}
        <path d="M 80,140 C 45,135 30,105 32,75 C 34,48 52,28 78,22" />
        <path d="M 38,120 C 30,115 28,106 34,102 C 38,108 40,114 38,120 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 31,98 C 23,94 22,84 29,81 C 32,87 34,93 31,98 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 32,72 C 24,68 25,58 32,56 C 34,62 35,68 32,72 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 42,48 C 36,42 39,33 46,33 C 47,40 46,45 42,48 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 60,30 C 56,24 62,17 68,19 C 68,26 64,29 60,30 Z" fill="currentColor" fillOpacity="0.2" />

        {/* Right Laurel Branch */}
        <path d="M 80,140 C 115,135 130,105 128,75 C 126,48 108,28 82,22" />
        <path d="M 122,120 C 130,115 132,106 126,102 C 122,108 120,114 122,120 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 129,98 C 137,94 138,84 131,81 C 128,87 126,93 129,98 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 128,72 C 136,68 135,58 128,56 C 126,62 125,68 128,72 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 118,48 C 124,42 121,33 114,33 C 113,40 114,45 118,48 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 100,30 C 104,24 98,17 92,19 C 92,26 96,29 100,30 Z" fill="currentColor" fillOpacity="0.2" />

        {/* Central Crown Motif */}
        <path d="M 72,32 L 76,24 L 80,30 L 84,24 L 88,32 Z" fill="currentColor" fillOpacity="0.3" />
        <circle cx="76" cy="23" r="1.2" fill="currentColor" />
        <circle cx="80" cy="22" r="1.5" fill="currentColor" />
        <circle cx="84" cy="23" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'flourish') {
    return (
      <svg
        viewBox="0 0 200 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M 10,20 C 40,20 60,5 85,20 C 95,26 100,20 100,20 C 100,20 105,26 115,20 C 140,5 160,20 190,20" />
        <circle cx="100" cy="20" r="3" fill="currentColor" />
        <circle cx="85" cy="20" r="1.8" fill="currentColor" />
        <circle cx="115" cy="20" r="1.8" fill="currentColor" />
        <path d="M 70,16 C 65,12 60,15 62,20 C 66,20 69,18 70,16 Z" fill="currentColor" fillOpacity="0.3" />
        <path d="M 130,16 C 135,12 140,15 138,20 C 134,20 131,18 130,16 Z" fill="currentColor" fillOpacity="0.3" />
      </svg>
    );
  }

  // Default: divider
  return (
    <svg
      viewBox="0 0 240 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="10" y1="12" x2="95" y2="12" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M 100,12 C 105,8 115,8 120,12 C 115,16 105,16 100,12 Z" fill="currentColor" fillOpacity="0.25" />
      <circle cx="120" cy="12" r="2.5" fill="currentColor" />
      <path d="M 120,12 C 125,8 135,8 140,12 C 135,16 125,16 120,12 Z" fill="currentColor" fillOpacity="0.25" />
      <line x1="145" y1="12" x2="230" y2="12" stroke="currentColor" strokeOpacity="0.4" />
    </svg>
  );
};

interface MonogramCrestProps {
  brideInitial: string;
  groomInitial: string;
  size?: 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export const MonogramCrest: React.FC<MonogramCrestProps> = ({
  brideInitial,
  groomInitial,
  size = 'md',
  animate = true,
  className = '',
}) => {
  const sizeClass =
    size === 'lg'
      ? 'w-28 h-28 sm:w-32 sm:h-32 text-xl sm:text-2xl'
      : 'w-24 h-24 sm:w-28 sm:h-28 text-lg sm:text-xl';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        animate ? 'animate-float-slow' : ''
      } ${sizeClass} ${className}`}
    >
      <FloralOrnament variant="crest" className="w-full h-full text-[#B69A68]" />
      <div className="absolute inset-0 flex items-center justify-center pt-2">
        <div className="flex items-baseline justify-center gap-1 leading-none">
          <span className="font-display font-semibold text-[#44382F]">
            {brideInitial}
          </span>
          <span className="font-calligraphy text-[#B69A68] text-[1.25em] leading-none">
            &amp;
          </span>
          <span className="font-display font-semibold text-[#44382F]">
            {groomInitial}
          </span>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FloralOrnament } from './FloralOrnament';
import { weddingData } from '../data/weddingData';
import { weddingAudio } from './MusicControl';
import { InvitedGuest } from '../data/weddingStore';

interface EnvelopeOpeningProps {
  guest?: InvitedGuest | null;
  onComplete: () => void;
  onSkip: () => void;
}

export const EnvelopeOpening: React.FC<EnvelopeOpeningProps> = ({ guest, onComplete, onSkip }) => {
  // Opening animation stages: 'sealed' -> 'breaking-seal' -> 'flap-open' -> 'card-rising' -> 'fading'
  const [animationStage, setAnimationStage] = useState<
    'sealed' | 'breaking-seal' | 'flap-open' | 'card-rising' | 'fading'
  >('sealed');

  const triggerOpenSequence = () => {
    if (animationStage !== 'sealed') return;

    // Step 1: Wax seal crack
    setAnimationStage('breaking-seal');
    weddingAudio.playWaxSealCrack();

    // Trigger subtle romantic petal & gold foil burst
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D8C7AA', '#F8F5EE', '#B69A68', '#E8DFC8'],
        shapes: ['circle'],
        scalar: 1.1,
        ticks: 200,
        gravity: 0.7,
      });
    } catch {
      // fallback safe
    }

    // Step 2: Flap rotates open realistically after seal snaps
    setTimeout(() => {
      setAnimationStage('flap-open');
      weddingAudio.playPaperSlide();
    }, 450);

    // Step 3: Invitation card rises out with glowing light
    setTimeout(() => {
      setAnimationStage('card-rising');
    }, 900);

    // Step 4: Fade envelope into the curtain sweep
    setTimeout(() => {
      setAnimationStage('fading');
    }, 2400);

    // Step 5: Transition to curtain reveal
    setTimeout(() => {
      onComplete();
    }, 3100);
  };

  const isOpening = animationStage !== 'sealed';

  const isFlapOpen =
    animationStage === 'flap-open' ||
    animationStage === 'card-rising' ||
    animationStage === 'fading';

  const isCardRising =
    animationStage === 'card-rising' || animationStage === 'fading';

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#F8F5EE] paper-texture text-[#44382F] px-4 overflow-hidden transition-opacity duration-700 ${
        animationStage === 'fading' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Corner Ornaments */}
      <FloralOrnament variant="corner" className="absolute top-6 left-6 w-20 h-20 sm:w-24 sm:h-24 text-[#B69A68] opacity-40 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute top-6 right-6 w-20 h-20 sm:w-24 sm:h-24 text-[#B69A68] opacity-40 -scale-x-100 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute bottom-6 left-6 w-20 h-20 sm:w-24 sm:h-24 text-[#B69A68] opacity-40 -scale-y-100 pointer-events-none" />
      <FloralOrnament variant="corner" className="absolute bottom-6 right-6 w-20 h-20 sm:w-24 sm:h-24 text-[#B69A68] opacity-40 -scale-x-100 -scale-y-100 pointer-events-none" />

      {/* Top Heading — smoothly fades & lifts away once envelope begins opening so it never overlaps the flap or rising card */}
      <div
        className={`text-center max-w-lg mb-6 sm:mb-8 select-none z-10 transition-all duration-500 ease-out ${
          isOpening ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <p className="text-xs sm:text-sm font-serif tracking-[0.3em] uppercase text-[#8D8174] mb-1.5">
          {weddingData.invitation.salutation}
        </p>
        <p className="font-calligraphy text-2xl sm:text-3xl text-[#B69A68] mb-1">
          To Celebrate The Wedding Of
        </p>
        <h1 className="font-display text-2xl sm:text-4xl text-[#44382F] font-semibold tracking-wide">
          {weddingData.bride.name} <span className="font-serif italic font-normal">&amp;</span> {weddingData.groom.name}
        </h1>

        {/* Personalized Guest Salutation Badge */}
        {guest && (
          <div className="mt-3 inline-flex flex-col items-center px-4 py-1.5 bg-[#FDFBF7] border border-[#B69A68] rounded-full shadow-xs animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#8D8174]">
                Specially Presented To
              </span>
              <span className="text-xs font-serif font-bold text-[#44382F]">
                {guest.name}
              </span>
            </div>
            <span className="text-[10px] font-serif text-[#B69A68] font-medium">
              {guest.isWithFamily
                ? '★ Cordially Invited With Family'
                : guest.allowedSeats === 1
                ? '★ 1 Final Invited Member (VIP)'
                : `★ ${guest.allowedSeats} Final Invited Members (${guest.allowedSeats} Afrad)`}
            </span>
          </div>
        )}
      </div>

      {/* 3D Realistic Envelope Container — gently shifts down into center stage as card rises */}
      <div
        className={`relative w-full max-w-[330px] sm:max-w-[420px] h-[220px] sm:h-[270px] [perspective:1200px] cursor-pointer group my-2 select-none transition-transform duration-1000 ease-out ${
          isCardRising ? 'translate-y-14 sm:translate-y-16' : 'translate-y-0'
        }`}
        onClick={triggerOpenSequence}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerOpenSequence();
          }
        }}
        aria-label="Open wedding invitation envelope"
      >
        {/* Soft Ambient Shadow & Glow behind Envelope */}
        <div
          className={`absolute -inset-4 rounded-2xl transition-all duration-1000 pointer-events-none ${
            isCardRising
              ? 'bg-gradient-to-t from-[#B69A68]/30 via-[#D8C7AA]/40 to-transparent blur-2xl opacity-100 scale-110'
              : 'bg-black/10 blur-xl opacity-60'
          }`}
        />

        {/* Envelope Backboard Base */}
        <div className="absolute inset-0 z-0 bg-[#EFE9DD] rounded-lg shadow-2xl border border-[#D8C7AA]/60 overflow-visible" />

        {/* Envelope Inner Lining (Subtle floral gold pattern) */}
        <div className="absolute inset-2 z-0 bg-[#F5EFE3] rounded-md flex items-center justify-center overflow-hidden border border-[#D8C7AA]/40">
          <FloralOrnament variant="crest" className="w-32 h-32 text-[#B69A68] opacity-15" />
        </div>

        {/* --- TOP ENVELOPE FLAP (Rotates 180deg on X-axis, moves behind rising card once opened) --- */}
        <div
          className={`absolute top-0 left-0 right-0 h-1/2 transition-all duration-700 ease-in-out ${
            isFlapOpen ? 'z-10 pointer-events-none' : 'z-40'
          }`}
          style={{
            transformOrigin: 'top center',
            transform: isFlapOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
          }}
        >
          {/* Flap Outer Surface with Golden Seam */}
          <div
            className="absolute inset-0 bg-[#EAE3D2] shadow-md border-b border-[#B69A68]/30"
            style={{ clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)' }}
          />
        </div>

        {/* --- INVITATION CARD (Sliding Up cleanly from Inside Pocket) --- */}
        <div
          className={`absolute left-4 right-4 sm:left-6 sm:right-6 top-3 bottom-3 bg-[#FDFBF7] paper-texture rounded-lg border border-[#B69A68]/50 shadow-xl p-3.5 sm:p-5 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out z-20 ${
            isCardRising
              ? '-translate-y-[52%] sm:-translate-y-[56%] scale-100 opacity-100 shadow-2xl ring-2 ring-[#B69A68]/30'
              : 'translate-y-0 scale-95 opacity-0 pointer-events-none'
          }`}
        >
          {/* Card Top Filigree */}
          <FloralOrnament variant="flourish" className="w-20 sm:w-24 h-5 text-[#B69A68] mb-0.5 shrink-0" />

          {guest ? (
            <div className="mb-1">
              <span className="text-[9px] font-serif uppercase tracking-widest text-[#B69A68] font-bold block">
                Exclusive Invitation For
              </span>
              <span className="font-display text-sm sm:text-base font-bold text-[#44382F] block leading-tight">
                {guest.name}
              </span>
            </div>
          ) : (
            <p className="text-[9px] sm:text-[10px] font-serif uppercase tracking-widest text-[#8D8174]">
              {weddingData.invitation.kicker}
            </p>
          )}

          <h3 className="font-display text-sm sm:text-lg font-bold tracking-wider text-[#44382F] mt-0.5 leading-tight">
            {weddingData.bride.name}
          </h3>
          <p className="font-serif italic text-[11px] text-[#8D8174]">&amp;</p>
          <h3 className="font-display text-sm sm:text-lg font-bold tracking-wider text-[#44382F] leading-tight">
            {weddingData.groom.name}
          </h3>

          <div className="w-10 h-[1px] bg-[#B69A68]/40 my-1.5" />

          <p className="text-[10px] sm:text-[11px] font-serif text-[#8D8174] leading-snug max-w-[240px]">
            {guest
              ? guest.isWithFamily
                ? 'Cordially invited With Family to share our special celebration'
                : `Cordially invited for ${guest.allowedSeats} ${
                    guest.allowedSeats === 1 ? 'member (1 Fard)' : `members (${guest.allowedSeats} Afrad)`
                  } to share our special celebration`
              : 'Cordially invite you to share in the joy of their holy matrimony'}
          </p>

          <p className="font-display text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#B69A68] mt-1.5">
            {weddingData.weddingDateDisplay}
          </p>
        </div>

        {/* Envelope Front Left & Right Fold Triangles (Forming the pocket) */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-lg">
          {/* Left Wing Fold */}
          <div
            className="absolute inset-0 bg-[#EBE4D5] border-r border-[#D8C7AA]/40 shadow-md"
            style={{ clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)' }}
          />
          {/* Right Wing Fold */}
          <div
            className="absolute inset-0 bg-[#E8E1CE] border-l border-[#D8C7AA]/40 shadow-md"
            style={{ clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)' }}
          />
          {/* Bottom Pocket Fold */}
          <div
            className="absolute inset-0 bg-[#E5DDCB] border-t border-[#D8C7AA]/60 shadow-lg"
            style={{ clipPath: 'polygon(0% 100%, 50% 52%, 100% 100%)' }}
          />
        </div>

        {/* --- LUXURY WAX SEAL (Embossed Crimson & Gold Stamp) --- */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
            animationStage === 'breaking-seal'
              ? 'scale-125 opacity-0 filter blur-[2px]'
              : isFlapOpen
              ? 'opacity-0 scale-50 pointer-events-none'
              : 'opacity-100 scale-100 group-hover:scale-105'
          }`}
        >
          <div
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center cursor-pointer shadow-xl transition-shadow"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #9E2A2B, #6E1A24, #480C14)',
              boxShadow: '0 6px 18px rgba(72, 12, 20, 0.45), inset 0 2px 4px rgba(255,255,255,0.25)',
              border: '2px solid rgba(216, 199, 170, 0.6)',
            }}
          >
            {/* Wax dripping organic edges simulation */}
            <div className="absolute inset-1 rounded-full border border-[#D8C7AA]/40 opacity-70" />
            <div className="text-center">
              <span className="font-display font-bold text-sm sm:text-base tracking-widest text-[#F8F5EE] drop-shadow-md">
                {weddingData.monogram.brideInitial}
                <span className="text-[#D8C7AA]">&amp;</span>
                {weddingData.monogram.groomInitial}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Callout */}
      <div
        className={`mt-8 sm:mt-10 flex flex-col items-center gap-3 z-10 transition-all duration-500 ${
          isCardRising ? 'translate-y-12' : 'translate-y-0'
        }`}
      >
        <button
          onClick={triggerOpenSequence}
          disabled={animationStage !== 'sealed'}
          className={`px-8 py-3.5 rounded-full font-display text-sm tracking-widest uppercase transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer ${
            animationStage === 'sealed'
              ? 'bg-[#44382F] text-[#F8F5EE] hover:bg-[#B69A68] hover:shadow-lg hover:scale-105 active:scale-95'
              : 'bg-[#8D8174] text-[#F8F5EE]/80 cursor-wait'
          }`}
        >
          <span>{animationStage === 'sealed' ? 'Open Your Invitation' : 'Opening Invitation...'}</span>
        </button>

        <button
          onClick={onSkip}
          className="text-xs font-serif tracking-widest uppercase text-[#8D8174] hover:text-[#44382F] transition-colors underline underline-offset-4 py-1 cursor-pointer"
        >
          Skip Intro Sequence
        </button>
      </div>
    </div>
  );
};

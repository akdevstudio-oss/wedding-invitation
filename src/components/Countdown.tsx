import React, { useState, useEffect } from 'react';
import { FloralOrnament } from './FloralOrnament';
import { weddingData } from '../data/weddingData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(weddingData.countdownTargetIso).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isComplete: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FDFBF7] paper-texture relative overflow-hidden border-y border-[#D8C7AA]/40">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <p className="text-xs font-serif uppercase tracking-[0.3em] text-[#8D8174] mb-3">
          Until We Say &ldquo;I Do&rdquo;
        </p>

        <h2 className="font-display text-2xl sm:text-4xl text-[#44382F] font-normal tracking-wider mb-2">
          Counting Down To Forever
        </h2>

        <FloralOrnament variant="divider" className="w-28 h-6 text-[#B69A68] mx-auto mt-2 mb-10 opacity-75" />

        {timeLeft.isComplete ? (
          <div className="p-8 bg-[#F8F5EE] border border-[#B69A68] rounded-xs shadow-md max-w-lg mx-auto animate-pulse">
            <h3 className="font-display text-2xl text-[#44382F] mb-2">
              The Auspicious Day Has Arrived!
            </h3>
            <p className="font-serif text-[#8D8174]">
              Today we celebrate love, unity, and the blessing of family. Welcome to our celebration!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {timeUnits.map((unit) => (
              <div
                key={unit.label}
                className="bg-[#F8F5EE] border border-[#D8C7AA] hover:border-[#B69A68] p-5 sm:p-7 rounded-xs shadow-xs transition-transform duration-300 hover:-translate-y-1 flex flex-col items-center"
              >
                <span className="font-display tabular-nums text-3xl sm:text-5xl font-light text-[#44382F] tracking-tight">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#8D8174] mt-2">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs font-serif text-[#8D8174] tracking-widest uppercase mt-10">
          Arrival &amp; Celebrations · {weddingData.weddingDateDisplay} · 01:00 PM Onwards · Multan
        </p>
      </div>
    </section>
  );
};

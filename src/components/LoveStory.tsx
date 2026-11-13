import React, { useEffect, useRef, useState } from 'react';
import { FloralOrnament } from './FloralOrnament';
import { weddingData } from '../data/weddingData';

export const LoveStory: React.FC = () => {
  const [activeItems, setActiveItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveItems((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }
        });
      },
      { threshold: 0.25 }
    );

    const elements = document.querySelectorAll('.story-timeline-step');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="py-24 sm:py-32 bg-[#FDFBF7] paper-texture relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <p className="text-xs font-serif uppercase tracking-[0.3em] text-[#8D8174] mb-2">
            A Journey of Destiny
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#44382F] font-normal tracking-wide">
            Our Love Story
          </h2>
          <FloralOrnament variant="divider" className="w-32 h-6 text-[#B69A68] mx-auto mt-3 opacity-75" />
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Golden Connecting Spine (Center on Desktop, Left on Mobile) */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-8 w-[1px] bg-gradient-to-b from-[#D8C7AA]/20 via-[#B69A68]/60 to-[#D8C7AA]/20 md:-translate-x-1/2" />

          {/* Timeline Milestones */}
          <div className="space-y-16 md:space-y-24">
            {weddingData.loveStory.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const isRevealed = activeItems.includes(index);

              return (
                <div
                  key={milestone.title}
                  data-index={index}
                  className={`story-timeline-step relative flex flex-col md:flex-row items-center transition-all duration-1000 ease-out ${
                    isRevealed ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-8'
                  } ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Central Milestone Pin */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FDFBF7] border-2 border-[#B69A68] shadow-sm flex items-center justify-center z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B69A68]" />
                  </div>

                  {/* Left / Right Content Box */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-12">
                    <div
                      className={`p-6 sm:p-8 bg-[#F8F5EE] border border-[#D8C7AA]/60 rounded-xs shadow-xs hover:border-[#B69A68] transition-colors ${
                        isEven ? 'md:text-right' : 'md:text-left'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2 text-xs font-serif text-[#8D8174] uppercase tracking-widest justify-start md:justify-start">
                        <span>{milestone.stage}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#B69A68] font-medium">{milestone.year}</span>
                      </div>

                      <h3 className="font-display text-2xl text-[#44382F] font-normal mb-3">
                        {milestone.title}
                      </h3>

                      <p className="font-serif text-sm text-[#8D8174] leading-relaxed mb-4">
                        {milestone.description}
                      </p>

                      <p className="font-calligraphy text-xl text-[#B69A68]">
                        &ldquo;{milestone.quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Image Card on Opposite Side */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-12 mt-4 md:mt-0">
                    <div className="overflow-hidden rounded-xs border border-[#D8C7AA]/50 shadow-md group">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE9DD]">
                        <img
                          src={milestone.image}
                          alt={milestone.title}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#44382F]/10 group-hover:bg-transparent transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

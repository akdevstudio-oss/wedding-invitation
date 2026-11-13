import React, { useState, useEffect } from 'react';
import { FloralOrnament } from './FloralOrnament';
import { weddingData, GalleryItem } from '../data/weddingData';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const navigateLightbox = (direction: number) => {
    if (!selectedImage) return;
    const currentIndex = weddingData.gallery.findIndex((item) => item.id === selectedImage.id);
    const nextIndex = (currentIndex + direction + weddingData.gallery.length) % weddingData.gallery.length;
    setSelectedImage(weddingData.gallery[nextIndex]);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#F8F5EE] paper-texture relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 sm:mb-20">
          <p className="text-xs font-serif uppercase tracking-[0.3em] text-[#8D8174] mb-2">
            Cherished Memories
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#44382F] font-normal tracking-wide">
            Editorial Gallery
          </h2>
          <FloralOrnament variant="divider" className="w-32 h-6 text-[#B69A68] mx-auto mt-3 opacity-75" />
        </div>

        {/* Masonry / Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddingData.gallery.map((item, index) => {
            const isTall = index === 1 || index === 2 || index === 4;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className={`group relative overflow-hidden bg-[#EFE9DD] rounded-xs border border-[#D8C7AA] shadow-xs cursor-pointer transition-all duration-500 hover:shadow-xl hover:border-[#B69A68] ${
                  isTall ? 'sm:row-span-2' : ''
                }`}
              >
                <div className={`w-full overflow-hidden relative ${isTall ? 'h-[460px]' : 'h-[280px]'}`}>
                  <img
                    src={item.src}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Elegant Gradient Scrim on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#44382F]/80 via-[#44382F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-[#FDFBF7]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-serif uppercase tracking-widest text-[#D8C7AA]">
                          {item.subtitle}
                        </p>
                        <h4 className="font-display text-lg text-[#FDFBF7] font-medium">
                          {item.title}
                        </h4>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#FDFBF7]/20 backdrop-blur-xs flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-[#FDFBF7]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-[#44382F]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-[#FDFBF7]/80 hover:text-[#FDFBF7] p-2 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-[#FDFBF7]/80 hover:text-[#FDFBF7] p-3 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-[#FDFBF7]/80 hover:text-[#FDFBF7] p-3 rounded-full hover:bg-white/10 transition-colors z-50 cursor-pointer"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Active Image Container */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              referrerPolicy="no-referrer"
              className="max-h-[72vh] max-w-full object-contain rounded-xs shadow-2xl border border-[#D8C7AA]/40"
            />
            <div className="mt-4 text-center text-[#FDFBF7]">
              <p className="text-xs font-serif uppercase tracking-[0.25em] text-[#D8C7AA]">
                {selectedImage.subtitle}
              </p>
              <h3 className="font-display text-xl sm:text-2xl font-light text-[#FDFBF7] mt-1">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

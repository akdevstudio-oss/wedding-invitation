import React from 'react';
import { FloralOrnament } from './FloralOrnament';
import { weddingData } from '../data/weddingData';
import { MapPin, Navigation as NavIcon, Car, Clock, Phone, ExternalLink } from 'lucide-react';

export const Venue: React.FC = () => {
  const venue = weddingData.primaryVenue;

  return (
    <section id="venue" className="py-24 sm:py-32 bg-[#FDFBF7] paper-texture relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 sm:mb-20">
          <p className="text-xs font-serif uppercase tracking-[0.3em] text-[#8D8174] mb-2">
            The Setting
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#44382F] font-normal tracking-wide">
            Venue &amp; Location
          </h2>
          <FloralOrnament variant="divider" className="w-32 h-6 text-[#B69A68] mx-auto mt-3 opacity-75" />
        </div>

        {/* Main Venue Display Card */}
        <div className="bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Venue High-res Image */}
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[480px] overflow-hidden group">
            <img
              src={venue.image}
              alt={venue.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#44382F]/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-6 left-6 lg:hidden text-[#FDFBF7]">
              <span className="text-xs font-serif uppercase tracking-widest text-[#D8C7AA]">
                Heritage Grandeur
              </span>
              <h3 className="font-display text-2xl font-light">{venue.name}</h3>
            </div>
          </div>

          {/* Right: Venue Details & Cartography Theme */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-serif uppercase tracking-[0.25em] text-[#8D8174]">
                The Historic Palace
              </span>

              <h3 className="font-display text-2xl sm:text-3xl text-[#44382F] font-normal tracking-wide mt-1 mb-2">
                {venue.name}
              </h3>

              <p className="font-serif italic text-sm text-[#B69A68] mb-6">
                {venue.hall}
              </p>

              <div className="w-12 h-[1px] bg-[#D8C7AA] mb-6" />

              <p className="font-serif text-sm text-[#8D8174] leading-relaxed mb-8">
                {venue.description}
              </p>

              {/* Information Highlights */}
              <div className="space-y-4 text-xs font-serif text-[#44382F] mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B69A68] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block">{venue.address}</span>
                    <span className="text-[#8D8174]">{venue.cityState}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4 text-[#B69A68] shrink-0" />
                  <span className="text-[#8D8174]">{venue.parkingNote}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#B69A68] shrink-0" />
                  <span className="text-[#8D8174]">Inquiries: {venue.phone}</span>
                </div>
              </div>
            </div>

            {/* Google Maps CTA */}
            <div>
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xs bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7] font-serif text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

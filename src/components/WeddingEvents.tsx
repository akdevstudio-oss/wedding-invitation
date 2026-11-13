import React from 'react';
import { FloralOrnament } from './FloralOrnament';
import { weddingData, WeddingEvent } from '../data/weddingData';
import { Sparkles, Crown, HeartHandshake, MapPin, Calendar, Clock } from 'lucide-react';

export const WeddingEvents: React.FC = () => {
  const getEventIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case 'MEHNDI':
        return <Sparkles className="w-6 h-6 text-[#B69A68]" />;
      case 'BARAT':
        return <Crown className="w-6 h-6 text-[#B69A68]" />;
      case 'WALIMA':
        return <HeartHandshake className="w-6 h-6 text-[#B69A68]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#B69A68]" />;
    }
  };

  const handleDownloadCalendar = (event: WeddingEvent) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Elysian Vows//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.calendarTitle}`,
      `DESCRIPTION:${event.description} - Venue: ${event.venue}, Dress Code: ${event.dressCode}`,
      `LOCATION:${event.venue}, ${event.venueAddress}`,
      `DTSTART:${event.dateIso.replace(/-/g, '')}T${event.time.replace(/[^0-9]/g, '').slice(0, 4)}00Z`,
      `DTEND:${event.dateIso.replace(/-/g, '')}T230000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}-invitation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="events" className="py-24 sm:py-32 bg-[#F8F5EE] paper-texture relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 sm:mb-20">
          <p className="text-xs font-serif uppercase tracking-[0.3em] text-[#8D8174] mb-2">
            Order of Celebrations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#44382F] font-normal tracking-wide">
            Wedding Itinerary
          </h2>
          <FloralOrnament variant="divider" className="w-32 h-6 text-[#B69A68] mx-auto mt-3 opacity-75" />
        </div>

        {/* 3 Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {weddingData.events.map((event) => (
            <div
              key={event.id}
              className="group relative bg-[#FDFBF7] p-8 rounded-xs border border-[#D8C7AA] hover:border-[#B69A68] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              {/* Top Accent line */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#B69A68]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Event Icon Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D8C7AA]/40">
                  <div className="w-12 h-12 rounded-full bg-[#F8F5EE] border border-[#D8C7AA] flex items-center justify-center">
                    {getEventIcon(event.name)}
                  </div>
                  <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8D8174]">
                    Ceremony
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="font-display text-2xl font-normal text-[#44382F] tracking-wider mb-4">
                  {event.name}
                </h3>

                {/* Date & Time */}
                <div className="space-y-2 mb-6 text-sm font-serif text-[#44382F]">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#B69A68] shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#B69A68] shrink-0" />
                    <span className="font-sans text-xs tracking-wide text-[#8D8174]">
                      {event.time} onwards
                    </span>
                  </div>
                  <div className="flex items-start gap-3 pt-1">
                    <MapPin className="w-4 h-4 text-[#B69A68] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{event.venue}</p>
                      <p className="text-xs text-[#8D8174] leading-relaxed mt-0.5">
                        {event.venueAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dress code & description */}
                <div className="pt-4 border-t border-[#D8C7AA]/40 text-xs font-serif text-[#8D8174] space-y-2 mb-6">
                  <p>
                    <strong className="text-[#44382F] uppercase tracking-wider text-[11px] block mb-0.5">
                      Attire:
                    </strong>
                    {event.dressCode}
                  </p>
                  <p className="leading-relaxed italic">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#D8C7AA]/40 flex flex-col sm:flex-row gap-2">
                <a
                  href={event.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 text-center text-xs font-serif uppercase tracking-widest text-[#44382F] bg-[#F8F5EE] hover:bg-[#D8C7AA]/40 border border-[#D8C7AA] transition-colors rounded-xs"
                >
                  View Location
                </a>
                <button
                  type="button"
                  onClick={() => handleDownloadCalendar(event)}
                  className="py-2 px-3 text-center text-xs font-serif uppercase tracking-widest text-[#FDFBF7] bg-[#44382F] hover:bg-[#B69A68] transition-colors rounded-xs"
                  title="Save to your calendar (.ics)"
                >
                  + Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { FloralOrnament, MonogramCrest } from './FloralOrnament';
import { weddingData } from '../data/weddingData';
import {
  MapPin,
  Calendar,
  ExternalLink,
  Sparkles,
  Crown,
  HeartHandshake,
  CheckCircle2,
  RotateCcw,
  Lock,
  UserCheck,
  Search,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  EditableWeddingSettings,
  InvitedGuest,
  loadStoredInvitedGuests,
  saveStoredInvitedGuests,
} from '../data/weddingStore';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

interface RoyalInvitationCardProps {
  settings: EditableWeddingSettings;
  onOpenAdmin: () => void;
  activeGuestOverride?: InvitedGuest | null;
}

export const RoyalInvitationCard: React.FC<RoyalInvitationCardProps> = ({
  settings,
  onOpenAdmin,
  activeGuestOverride,
}) => {
  // All invited guests from store
  const [allGuests, setAllGuests] = useState<InvitedGuest[]>([]);
  const [currentGuest, setCurrentGuest] = useState<InvitedGuest | null>(null);

  // Load guests and check URL search parameter `?invite=slug`
  useEffect(() => {
    const loaded = loadStoredInvitedGuests();
    setAllGuests(loaded);

    if (activeGuestOverride) {
      setCurrentGuest(activeGuestOverride);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const inviteSlug = params.get('invite');
    if (inviteSlug) {
      const match = loaded.find(
        (g) => g.slug.toLowerCase() === inviteSlug.toLowerCase()
      );
      if (match) {
        setCurrentGuest(match);
      }
    }
  }, [activeGuestOverride]);

  // Live Countdown logic
  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(settings.countdownTargetIso).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isComplete: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.countdownTargetIso]);

  // Calendar iCal download
  const handleDownloadCalendar = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:-//Elysian Vows//${settings.brideName} & ${settings.groomName} Wedding//EN`,
      'BEGIN:VEVENT',
      `SUMMARY:${settings.brideName} & ${settings.groomName} Wedding`,
      `DESCRIPTION:Wedding Celebrations: ${settings.arrivalTime} Arrival, ${settings.nikahTime} Nikah, ${settings.rukhsatiTime} Rukhsati at ${settings.venueName}.`,
      `LOCATION:${settings.venueName}, ${settings.venueAddress}`,
      'DTSTART:20261127T130000Z',
      'DTEND:20261127T180000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wedding-invitation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // RSVP Form State
  const maxSeats = currentGuest?.isWithFamily ? 15 : currentGuest ? currentGuest.allowedSeats : 4;
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState(1);
  const [specialMessage, setSpecialMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nameError, setNameError] = useState('');

  // Sync RSVP inputs if a currentGuest is active
  useEffect(() => {
    if (currentGuest) {
      setGuestName(currentGuest.name);
      setGuestCount(currentGuest.isWithFamily ? 4 : Math.min(currentGuest.allowedSeats, 2));
      if (currentGuest.status !== 'pending') {
        setIsSubmitted(true);
        setAttending(currentGuest.status === 'attending' ? 'yes' : 'no');
        setGuestCount(currentGuest.confirmedCount || (currentGuest.isWithFamily ? 4 : currentGuest.allowedSeats));
        setSpecialMessage(currentGuest.confirmedMessage || '');
      }
    }
  }, [currentGuest]);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setNameError('Please enter your name');
      return;
    }
    setNameError('');

    const confirmedCount = attending === 'yes' ? Number(guestCount) : 0;
    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Update guest list in store
    const updated = allGuests.map((g) => {
      const isMatch =
        (currentGuest && g.id === currentGuest.id) ||
        g.name.toLowerCase() === guestName.trim().toLowerCase();
      if (isMatch) {
        return {
          ...g,
          status: attending === 'yes' ? ('attending' as const) : ('declined' as const),
          confirmedCount,
          confirmedMessage: specialMessage.trim(),
          confirmedAt: timestamp,
        };
      }
      return g;
    });

    // If it's a new guest not on initial list, append them
    const matched = updated.find(
      (g) => g.name.toLowerCase() === guestName.trim().toLowerCase()
    );
    if (!matched) {
      const newEntry: InvitedGuest = {
        id: `guest-${Date.now()}`,
        slug: guestName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: guestName.trim(),
        relationship: 'Guest RSVP',
        totalFamilyMembers: confirmedCount || 2,
        allowedSeats: confirmedCount || 2,
        invitedEvents: ['arrival', 'nikah', 'rukhsati'],
        isSpecialGuest: false,
        status: attending === 'yes' ? 'attending' : 'declined',
        confirmedCount,
        confirmedMessage: specialMessage.trim(),
        confirmedAt: timestamp,
      };
      updated.unshift(newEntry);
    }

    setAllGuests(updated);
    saveStoredInvitedGuests(updated);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D8C7AA', '#B69A68', '#F8F5EE'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* ========================================================
          PERSONALIZED GUEST BANNER (If Opened via Personalized Link)
          ======================================================== */}
      {currentGuest && (
        <div className="mb-6 bg-[#FDFBF7] paper-texture border-2 border-[#B69A68] p-5 sm:p-6 rounded-xs shadow-lg text-center animate-fadeIn relative overflow-hidden">
          {/* Subtle Corner Accents */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Crown className="w-4 h-4 text-[#B69A68]" />
            <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#B69A68] font-bold">
              {currentGuest.isSpecialGuest ? 'Exclusive VIP Invitation' : 'Personal Family Invitation'}
            </span>
          </div>

          <p className="font-calligraphy text-xl sm:text-2xl text-[#B69A68] mb-0.5">
            Assalam-o-Alaikum &amp; Welcome
          </p>

          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#44382F] tracking-wide">
            {currentGuest.name}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-serif text-[#8D8174] mt-2 mb-3">
            <span className="bg-[#F8F5EE] px-3 py-1 rounded border border-[#D8C7AA] text-[#44382F]">
              Card For: <strong className="font-semibold text-[#44382F]">{currentGuest.name}</strong>
            </span>
            <span className="font-semibold text-[#44382F] bg-[#B69A68]/20 px-3 py-1 rounded border border-[#B69A68]">
              {currentGuest.isWithFamily
                ? '★ Invited With Family (Poori Family)'
                : currentGuest.allowedSeats === 1
                ? '★ 1 Final Invited Member (Special VIP)'
                : `★ ${currentGuest.allowedSeats} Final Invited Members (${currentGuest.allowedSeats} Afrad)`}
            </span>
          </div>

          {/* Explicit Events Listing (Kis Kis Program Ma Shirkat Ki Dawat Hai) */}
          <div className="pt-3 border-t border-[#D8C7AA]/60 max-w-xl mx-auto">
            <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#8D8174] block mb-2 font-semibold">
              Shirkat Ki Dawat (Invited Ceremonies):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'arrival', label: 'Baraat Arrival (01:00 PM)' },
                { id: 'nikah', label: 'Sacred Nikah Ceremony (02:30 PM)' },
                { id: 'rukhsati', label: 'Rukhsati (04:00 PM)' },
              ].map((ev) => {
                const isInvited = (currentGuest.invitedEvents || ['arrival', 'nikah', 'rukhsati']).includes(ev.id);
                return (
                  <span
                    key={ev.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif ${
                      isInvited
                        ? 'bg-[#44382F] text-[#FDFBF7] shadow-xs'
                        : 'bg-[#F8F5EE] text-[#8D8174]/70 line-through border border-[#D8C7AA]/40'
                    }`}
                  >
                    {isInvited ? '✓' : '✕'} {ev.label}
                  </span>
                );
              })}
            </div>

            {/* Custom Host Message */}
            {currentGuest.customNote && (
              <p className="mt-3 text-xs font-serif italic text-[#8D8174] bg-[#F8F5EE] py-1.5 px-3 rounded-xs border border-[#D8C7AA]/60 inline-block">
                Host Note: &ldquo;{currentGuest.customNote}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          1. MAIN ROYAL INVITATION CARD (Folio Style)
          ======================================================== */}
      <section
        id="invitation"
        className="relative bg-[#FDFBF7] paper-texture rounded-sm border-2 border-[#D8C7AA] p-6 sm:p-12 shadow-xl text-center overflow-hidden mb-12"
      >
        {/* Subtle Decorative Golden Corner Ornaments */}
        <FloralOrnament variant="corner" className="absolute top-4 left-4 w-16 h-16 sm:w-20 sm:h-20 text-[#B69A68] opacity-50 pointer-events-none" />
        <FloralOrnament variant="corner" className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 text-[#B69A68] opacity-50 -scale-x-100 pointer-events-none" />
        <FloralOrnament variant="corner" className="absolute bottom-4 left-4 w-16 h-16 sm:w-20 sm:h-20 text-[#B69A68] opacity-50 -scale-y-100 pointer-events-none" />
        <FloralOrnament variant="corner" className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 text-[#B69A68] opacity-50 -scale-x-100 -scale-y-100 pointer-events-none" />

        {/* Central Monogram Crest */}
        <div className="mb-4 flex justify-center">
          <MonogramCrest
            brideInitial={weddingData.monogram.brideInitial}
            groomInitial={weddingData.monogram.groomInitial}
            size="md"
          />
        </div>

        {/* Bismillah in Calligraphy */}
        <p className="font-serif text-2xl sm:text-3xl text-[#B69A68] mb-1 font-normal tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.25em] text-[#8D8174] mb-6">
          In The Name Of Allah, The Most Beneficent, The Most Merciful
        </p>

        {/* Families Kicker */}
        <p className="text-xs font-serif tracking-[0.25em] uppercase text-[#8D8174] mb-3">
          Together With Our Families
        </p>

        {/* Couple Names - The Visual Focus */}
        <div className="my-2 space-y-1">
          <h1 className="font-display text-3xl sm:text-5xl font-normal text-[#44382F] tracking-wide">
            {settings.brideName}
          </h1>
          <p className="font-serif text-xs text-[#8D8174] tracking-widest uppercase">
            Daughter of {settings.brideFather}
          </p>

          <div className="flex items-center justify-center gap-3 py-1">
            <span className="w-12 h-[1px] bg-[#D8C7AA]" />
            <span className="font-calligraphy text-3xl text-[#B69A68]">&amp;</span>
            <span className="w-12 h-[1px] bg-[#D8C7AA]" />
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-normal text-[#44382F] tracking-wide">
            {settings.groomName}
          </h1>
          <p className="font-serif text-xs text-[#8D8174] tracking-widest uppercase">
            Son of {settings.groomFather}
          </p>
        </div>

        {/* Divider Flourish */}
        <FloralOrnament variant="flourish" className="w-36 h-6 text-[#B69A68] mx-auto my-4 opacity-80" />

        {/* Formal Request & Quranic Verse */}
        <p className="text-xs sm:text-sm font-serif tracking-[0.18em] uppercase text-[#44382F] max-w-lg mx-auto leading-relaxed mb-3">
          Request the honor of your presence and heartfelt prayers at our wedding ceremony
        </p>

        <p className="font-serif italic text-xs sm:text-sm text-[#8D8174] max-w-md mx-auto mb-6">
          &ldquo;And We created you in pairs&rdquo; — Surah An-Naba [78:8]
        </p>

        {/* Prominent Date Box */}
        <div className="inline-flex flex-col items-center px-6 py-3 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs shadow-xs mb-6">
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8D8174] mb-0.5">
            Wedding Day
          </span>
          <span className="font-display text-xl sm:text-2xl font-medium text-[#44382F] tracking-wider">
            {settings.weddingDateDisplay}
          </span>
          <span className="text-xs font-serif text-[#B69A68] tracking-widest mt-0.5">
            {settings.arrivalTime} Onwards · {settings.venueName}
          </span>
        </div>

        {/* Integrated Compact Live Countdown Timer */}
        <div className="pt-4 border-t border-[#D8C7AA]/50 max-w-md mx-auto">
          <p className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8D8174] mb-3">
            Counting Down To The Blessed Moment
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="bg-[#F8F5EE] border border-[#D8C7AA] py-2 px-1 rounded-xs text-center"
              >
                <span className="font-display tabular-nums text-lg sm:text-2xl font-medium text-[#44382F] block">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-serif uppercase tracking-widest text-[#8D8174]">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          2. CEREMONIAL PROGRAM & VENUE (Combined Compact Module)
          ======================================================== */}
      <section id="program" className="space-y-6 mb-12">
        {/* Ceremonial Timeline Strip (3 Key Times on One Clean Row) */}
        <div className="bg-[#FDFBF7] paper-texture rounded-sm border border-[#D8C7AA] p-6 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8D8174] block mb-1">
              Event Itinerary · {settings.weddingDateDisplay}
            </span>
            <h2 className="font-display text-2xl text-[#44382F] font-normal tracking-wide">
              Ceremonial Schedule
            </h2>
            <FloralOrnament variant="divider" className="w-24 h-4 text-[#B69A68] mx-auto mt-2 opacity-70" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Event 1: Arrival */}
            {(() => {
              const isInvited = !currentGuest || (currentGuest.invitedEvents || ['arrival', 'nikah', 'rukhsati']).includes('arrival');
              return (
                <div
                  className={`bg-[#F8F5EE] rounded-xs p-5 text-center flex flex-col justify-between transition-all ${
                    isInvited
                      ? 'border-2 border-[#B69A68] shadow-xs'
                      : 'border border-[#D8C7AA]/40 opacity-70'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#D8C7AA] flex items-center justify-center mx-auto mb-2 text-[#B69A68]">
                      <Sparkles className="w-5 h-5" />
                    </div>

                    {currentGuest ? (
                      <span
                        className={`text-[9px] font-serif uppercase tracking-widest font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                          isInvited
                            ? 'bg-[#44382F] text-[#FDFBF7]'
                            : 'bg-[#D8C7AA]/30 text-[#8D8174]'
                        }`}
                      >
                        {isInvited ? '★ You Are Invited' : 'Private Gathering'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-serif uppercase tracking-widest text-[#8D8174]">
                        Step 01
                      </span>
                    )}

                    <h3 className="font-display text-lg font-medium text-[#44382F] mt-0.5 mb-1">
                      Arrival of Guests &amp; Baraat
                    </h3>
                    <p className="text-xs font-serif text-[#8D8174] leading-relaxed mb-3">
                      Reception of the honorable guests, welcome refreshments, and greetings.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#D8C7AA]/40 text-xs font-serif font-semibold text-[#B69A68] tracking-widest">
                    {settings.arrivalTime}
                  </div>
                </div>
              );
            })()}

            {/* Event 2: Nikah */}
            {(() => {
              const isInvited = !currentGuest || (currentGuest.invitedEvents || ['arrival', 'nikah', 'rukhsati']).includes('nikah');
              return (
                <div
                  className={`bg-[#F8F5EE] rounded-xs p-5 text-center flex flex-col justify-between transition-all ${
                    isInvited
                      ? 'border-2 border-[#B69A68] ring-2 ring-[#B69A68]/20 shadow-md'
                      : 'border border-[#D8C7AA]/40 opacity-70'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#B69A68] flex items-center justify-center mx-auto mb-2 text-[#B69A68]">
                      <Crown className="w-5 h-5" />
                    </div>

                    {currentGuest ? (
                      <span
                        className={`text-[9px] font-serif uppercase tracking-widest font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                          isInvited
                            ? 'bg-[#B69A68] text-[#FDFBF7]'
                            : 'bg-[#D8C7AA]/30 text-[#8D8174]'
                        }`}
                      >
                        {isInvited ? '★ Sacred Nikah Ceremony' : 'Private Gathering'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-serif uppercase tracking-widest text-[#B69A68] font-bold">
                        Sacred Ceremony
                      </span>
                    )}

                    <h3 className="font-display text-lg font-medium text-[#44382F] mt-0.5 mb-1">
                      Sacred Nikah Ceremony
                    </h3>
                    <p className="text-xs font-serif text-[#8D8174] leading-relaxed mb-3">
                      Solemnization of marriage vows, recitations of the Holy Quran, and Duas.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#D8C7AA]/60 text-xs font-serif font-bold text-[#44382F] tracking-widest">
                    {settings.nikahTime}
                  </div>
                </div>
              );
            })()}

            {/* Event 3: Rukhsati */}
            {(() => {
              const isInvited = !currentGuest || (currentGuest.invitedEvents || ['arrival', 'nikah', 'rukhsati']).includes('rukhsati');
              return (
                <div
                  className={`bg-[#F8F5EE] rounded-xs p-5 text-center flex flex-col justify-between transition-all ${
                    isInvited
                      ? 'border-2 border-[#B69A68] shadow-xs'
                      : 'border border-[#D8C7AA]/40 opacity-70'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-[#D8C7AA] flex items-center justify-center mx-auto mb-2 text-[#B69A68]">
                      <HeartHandshake className="w-5 h-5" />
                    </div>

                    {currentGuest ? (
                      <span
                        className={`text-[9px] font-serif uppercase tracking-widest font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                          isInvited
                            ? 'bg-[#44382F] text-[#FDFBF7]'
                            : 'bg-[#D8C7AA]/30 text-[#8D8174]'
                        }`}
                      >
                        {isInvited ? '★ You Are Invited' : 'Private Gathering'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-serif uppercase tracking-widest text-[#8D8174]">
                        Step 03
                      </span>
                    )}

                    <h3 className="font-display text-lg font-medium text-[#44382F] mt-0.5 mb-1">
                      Rukhsati
                    </h3>
                    <p className="text-xs font-serif text-[#8D8174] leading-relaxed mb-3">
                      Heartfelt departure ceremony and blessings as the newlyweds embark on forever.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#D8C7AA]/40 text-xs font-serif font-semibold text-[#B69A68] tracking-widest">
                    {settings.rukhsatiTime}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Venue Card with Direct Google Maps & Calendar Export */}
        <div id="venue" className="bg-[#FDFBF7] paper-texture rounded-sm border border-[#D8C7AA] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-full bg-[#F8F5EE] border border-[#D8C7AA] flex items-center justify-center shrink-0 mt-1 text-[#B69A68]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8D8174]">
                  Celebration Venue
                </span>
                <h3 className="font-display text-2xl font-normal text-[#44382F]">
                  {settings.venueName}
                </h3>
                <p className="font-serif text-sm text-[#44382F] mt-0.5">
                  {settings.venueAddress}
                </p>
                <p className="text-xs font-serif text-[#8D8174] mt-1">
                  Ample guest parking available along the main venue entrance.
                </p>
              </div>
            </div>

            {/* Direct Map & Calendar Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 rounded-xs bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7] font-serif text-xs uppercase tracking-widest transition-colors shadow-xs flex items-center justify-center gap-2 text-center"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="py-3 px-5 rounded-xs bg-[#F8F5EE] hover:bg-[#D8C7AA]/40 text-[#44382F] border border-[#D8C7AA] font-serif text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 text-center"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B69A68]" />
                <span>+ Calendar (.ics)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. COMPACT INTERACTIVE RSVP FORM WITH SEAT LIMIT CAPPING
          ======================================================== */}
      <section
        id="rsvp"
        className="bg-[#FDFBF7] paper-texture rounded-sm border border-[#D8C7AA] p-6 sm:p-10 shadow-sm max-w-2xl mx-auto mb-12"
      >
        <div className="text-center mb-6">
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8D8174] block mb-1">
            Attendance Confirmation
          </span>
          <h2 className="font-display text-2xl text-[#44382F] font-normal tracking-wide">
            Kindly Confirm Your Presence
          </h2>
          <FloralOrnament variant="divider" className="w-24 h-4 text-[#B69A68] mx-auto mt-2 opacity-70" />

          {/* Seat Quota Information Tag */}
          <div className="mt-3 inline-flex items-center gap-2 bg-[#F8F5EE] border border-[#B69A68]/40 px-3 py-1 rounded-full text-xs font-serif text-[#44382F]">
            <Crown className="w-3 h-3 text-[#B69A68]" />
            <span>
              {currentGuest
                ? currentGuest.isWithFamily
                  ? `Card For: ${currentGuest.name} · Invited With Family (Poori Family)`
                  : `Card For: ${currentGuest.name} · Final Invited: ${currentGuest.allowedSeats} ${
                      currentGuest.allowedSeats === 1 ? 'Member (1 Fard)' : 'Members (Afrad)'
                    }`
                : 'General Guest Confirmation'}
            </span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="text-center py-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#F8F5EE] border border-[#B69A68] flex items-center justify-center mx-auto mb-3 text-[#B69A68]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-[#44382F]">
              JazakAllah Khair, {guestName}!
            </h3>
            <p className="font-serif text-xs text-[#8D8174] max-w-sm mx-auto mt-1 mb-4">
              {attending === 'yes'
                ? `Your attendance for ${guestCount} ${
                    guestCount === 1 ? 'guest' : 'guests'
                  } has been happily confirmed. We look forward to celebrating with you!`
                : 'Thank you for letting us know. Your heartfelt prayers mean the world to us.'}
            </p>

            <button
              onClick={() => setIsSubmitted(false)}
              className="inline-flex items-center gap-1.5 text-xs font-serif text-[#8D8174] hover:text-[#44382F] underline underline-offset-4 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Modify Your Attendance Response</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-1.5">
                Your Full Name <span className="text-[#B69A68]">*</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Ali Ahmed & Family"
                className={`w-full px-3.5 py-2.5 bg-[#F8F5EE] border ${
                  nameError ? 'border-red-400' : 'border-[#D8C7AA]'
                } rounded-xs text-xs font-serif text-[#44382F] focus:outline-hidden focus:border-[#B69A68]`}
              />
              {nameError && <p className="text-[11px] text-red-500 mt-1 font-sans">{nameError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-1.5">
                  Attending?
                </label>
                <select
                  value={attending}
                  onChange={(e) => setAttending(e.target.value as 'yes' | 'no')}
                  className="w-full px-3 py-2.5 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F] focus:outline-hidden focus:border-[#B69A68]"
                >
                  <option value="yes">Joyfully Accept</option>
                  <option value="no">Regretfully Decline</option>
                </select>
              </div>

              {/* Strict Number of Guests Capped by Host Quota */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-1.5">
                  Number of Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  disabled={attending === 'no'}
                  className="w-full px-3 py-2.5 bg-[#F8F5EE] border-2 border-[#B69A68] rounded-xs text-xs font-serif text-[#44382F] focus:outline-hidden focus:border-[#B69A68] disabled:opacity-50"
                >
                  {Array.from({ length: maxSeats }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {currentGuest?.isWithFamily
                        ? `${num} ${num === 1 ? 'Member' : 'Members'} (With Family)`
                        : `${num} ${num === 1 ? 'Guest' : 'Guests'} (Max ${maxSeats})`}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#8D8174] font-serif block mt-1">
                  {currentGuest?.isWithFamily
                    ? 'Apni family ke jitne afrad shamil ho rahe hain utne select karein.'
                    : `Limited strictly to ${maxSeats} reserved ${maxSeats === 1 ? 'seat' : 'seats'}.`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-1.5">
                Special Prayers &amp; Warm Wishes
              </label>
              <input
                type="text"
                value={specialMessage}
                onChange={(e) => setSpecialMessage(e.target.value)}
                placeholder="May Allah bless this union with joy & barakah..."
                className="w-full px-3.5 py-2.5 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F] focus:outline-hidden focus:border-[#B69A68]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xs bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7] font-serif text-xs uppercase tracking-[0.2em] transition-colors shadow-xs cursor-pointer"
              >
                Confirm Attendance ({guestCount} {guestCount === 1 ? 'Seat' : 'Seats'})
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ========================================================
          4. CLOSING BLESSING, ROYAL SIGNOFF & HOST ADMIN LINK
          ======================================================== */}
      <footer className="text-center pt-4 text-[#8D8174]">
        <FloralOrnament variant="flourish" className="w-32 h-6 text-[#B69A68] mx-auto mb-3 opacity-60" />
        <p className="font-calligraphy text-2xl text-[#B69A68] mb-1">
          Two Hearts, One Sacred Journey
        </p>
        <p className="font-display text-lg text-[#44382F] tracking-wide mb-2">
          {settings.brideName} <span className="font-serif italic">&amp;</span> {settings.groomName}
        </p>
        <p className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#B69A68] mb-6">
          With Love, Prayers &amp; Gratitude — Families Arshad &amp; Awais
        </p>

        {/* Discreet Host Admin Portal Trigger */}
        <div className="pt-4 border-t border-[#D8C7AA]/40 flex items-center justify-center mb-8">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-[11px] font-serif text-[#8D8174] hover:text-[#44382F] hover:underline underline-offset-4 transition-colors cursor-pointer"
            title="Open Wedding Host Admin Panel"
          >
            <Lock className="w-3 h-3 text-[#B69A68]" />
            <span>Host Admin Panel (Seat Quotas, Guest Links &amp; Settings)</span>
          </button>
        </div>

        {/* Created by AK Dev Studio Footer Credit */}
        <div className="max-w-lg mx-auto bg-[#FDFBF7] paper-texture border border-[#D8C7AA]/80 rounded-sm px-5 py-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/AK_Dev_Studio__Build__Design__Deploy_3191f75b.png"
              alt="AK Dev Studio Logo"
              className="w-14 h-14 rounded-full object-cover border border-[#B69A68]/70 shadow-xs shrink-0"
            />
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#8D8174] block">
                Created By
              </span>
              <h4 className="font-display text-sm sm:text-base font-semibold text-[#44382F] tracking-wide">
                AK Dev Studio
              </h4>
              <span className="text-[10px] font-serif text-[#B69A68] block">
                Build &bull; Design &bull; Deploy
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1.5 text-[11px] font-sans text-[#44382F]">
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
              <a
                href="tel:03261604808"
                className="inline-flex items-center gap-1 hover:text-[#B69A68] transition-colors"
                title="Call 03261604808"
              >
                <Phone className="w-3 h-3 text-[#B69A68]" />
                <span>03261604808</span>
              </a>

              <a
                href="https://wa.me/923261604808"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>

              <a
                href="https://www.facebook.com/share/1AAuzzEAuZ/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#44382F] hover:text-[#B69A68] transition-colors"
                title="AK Dev Studio Facebook Page"
              >
                <Facebook className="w-3 h-3 text-[#B69A68]" />
                <span>Facebook</span>
              </a>
            </div>

            <a
              href="mailto:akdevstudiosolutions@gmail.com"
              className="inline-flex items-center gap-1 text-[#8D8174] hover:text-[#44382F] transition-colors"
            >
              <Mail className="w-3 h-3 text-[#B69A68]" />
              <span>akdevstudiosolutions@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

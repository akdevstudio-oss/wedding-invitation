import React, { useState } from 'react';
import { FloralOrnament } from './FloralOrnament';
import { weddingData } from '../data/weddingData';
import confetti from 'canvas-confetti';
import { CheckCircle2, Heart, Download, RotateCcw } from 'lucide-react';

interface RSVPFormData {
  guestName: string;
  email: string;
  guestsCount: number;
  attending: 'yes' | 'no' | '';
  eventsAttending: string[];
  dietaryRestrictions: string;
  specialMessage: string;
}

export const RSVP: React.FC = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
    guestName: '',
    email: '',
    guestsCount: 1,
    attending: 'yes',
    eventsAttending: ['arrival', 'nikah', 'rukhsati'],
    dietaryRestrictions: '',
    specialMessage: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.guestName.trim()) {
      errs.guestName = 'Please enter your full name.';
    }
    if (!formData.attending) {
      errs.attending = 'Please let us know if you can attend.';
    }
    if (formData.attending === 'yes' && formData.eventsAttending.length === 0) {
      errs.events = 'Please select at least one celebration you will attend.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate luxury verification
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger celebratory gold and ivory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#D8C7AA', '#B69A68', '#F8F5EE'],
        });
      } catch {
        // safe fallback
      }
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      guestName: '',
      email: '',
      guestsCount: 1,
      attending: 'yes',
      eventsAttending: ['arrival', 'nikah', 'rukhsati'],
      dietaryRestrictions: '',
      specialMessage: '',
    });
    setIsSubmitted(false);
  };

  const toggleEvent = (eventId: string) => {
    setFormData((prev) => {
      const exists = prev.eventsAttending.includes(eventId);
      return {
        ...prev,
        eventsAttending: exists
          ? prev.eventsAttending.filter((id) => id !== eventId)
          : [...prev.eventsAttending, eventId],
      };
    });
  };

  return (
    <section id="rsvp" className="py-24 sm:py-32 bg-[#F8F5EE] paper-texture relative">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs font-serif uppercase tracking-[0.3em] text-[#8D8174] mb-2">
            Kindly Respond
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#44382F] font-normal tracking-wide">
            We Would Love To Celebrate With You
          </h2>
          <FloralOrnament variant="divider" className="w-32 h-6 text-[#B69A68] mx-auto mt-3 opacity-75" />
          <p className="text-xs font-serif text-[#8D8174] mt-3">
            Kindly confirm your presence by November 30, 2026.
          </p>
        </div>

        {/* Form or Confirmation Card */}
        <div className="bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs shadow-md p-8 sm:p-12 relative">
          {isSubmitted ? (
            /* --- SUBMISSION CONFIRMATION CARD --- */
            <div className="text-center py-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#F8F5EE] border border-[#B69A68] flex items-center justify-center mx-auto mb-6 text-[#B69A68]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-serif uppercase tracking-[0.25em] text-[#8D8174]">
                Response Recorded
              </span>

              <h3 className="font-display text-2xl sm:text-3xl text-[#44382F] font-normal mt-2 mb-4">
                Thank You, {formData.guestName}
              </h3>

              <div className="w-16 h-[1px] bg-[#D8C7AA] mx-auto mb-6" />

              <p className="font-serif text-sm text-[#8D8174] max-w-md mx-auto leading-relaxed mb-6">
                {formData.attending === 'yes'
                  ? `We are delighted to celebrate our special day with you. Your party of ${formData.guestsCount} has been reserved.`
                  : 'We will miss your presence dearly, but we deeply appreciate your warm wishes and thoughts.'}
              </p>

              {/* Guest Pass Summary Ticket */}
              {formData.attending === 'yes' && (
                <div className="my-6 p-6 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs max-w-md mx-auto text-left font-serif text-xs text-[#44382F] space-y-2">
                  <div className="flex justify-between border-b border-[#D8C7AA]/40 pb-2">
                    <span className="text-[#8D8174] uppercase tracking-wider">Guest Name</span>
                    <span className="font-medium">{formData.guestName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D8C7AA]/40 pb-2">
                    <span className="text-[#8D8174] uppercase tracking-wider">Party Size</span>
                    <span className="font-medium">{formData.guestsCount} Guest(s)</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-[#8D8174] uppercase tracking-wider">Events</span>
                    <span className="font-medium uppercase">
                      {formData.eventsAttending.join(' · ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Demo Mode Notice (Transparent & honest design) */}
              <p className="text-[11px] font-sans text-[#8D8174] italic mb-8">
                Note: This is a front-end preview demonstration. In production, this can be coupled to a database or Google Sheets.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#44382F] hover:text-[#B69A68] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Another Response</span>
              </button>
            </div>
          ) : (
            /* --- INTERACTIVE RSVP FORM --- */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Guest Full Name */}
              <div>
                <label
                  htmlFor="guestName"
                  className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-2"
                >
                  Full Name <span className="text-[#B69A68]">*</span>
                </label>
                <input
                  id="guestName"
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="e.g. Lord & Lady Hamilton"
                  className={`w-full px-4 py-3 bg-[#F8F5EE] border ${
                    errors.guestName ? 'border-red-400' : 'border-[#D8C7AA]'
                  } rounded-xs text-sm font-serif text-[#44382F] placeholder:text-[#8D8174]/50 focus:outline-hidden focus:border-[#B69A68] transition-colors`}
                />
                {errors.guestName && (
                  <p className="text-xs text-red-600 mt-1 font-sans">{errors.guestName}</p>
                )}
              </div>

              {/* Attendance Choice: Yes / No */}
              <div>
                <span className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-3">
                  Will You Be Attending? <span className="text-[#B69A68]">*</span>
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xs border cursor-pointer text-xs font-serif uppercase tracking-wider transition-all ${
                      formData.attending === 'yes'
                        ? 'bg-[#44382F] text-[#FDFBF7] border-[#44382F]'
                        : 'bg-[#F8F5EE] text-[#44382F] border-[#D8C7AA] hover:border-[#B69A68]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={formData.attending === 'yes'}
                      onChange={() => setFormData({ ...formData, attending: 'yes' })}
                      className="sr-only"
                    />
                    <span>Joyfully Accept</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xs border cursor-pointer text-xs font-serif uppercase tracking-wider transition-all ${
                      formData.attending === 'no'
                        ? 'bg-[#44382F] text-[#FDFBF7] border-[#44382F]'
                        : 'bg-[#F8F5EE] text-[#44382F] border-[#D8C7AA] hover:border-[#B69A68]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={formData.attending === 'no'}
                      onChange={() => setFormData({ ...formData, attending: 'no' })}
                      className="sr-only"
                    />
                    <span>Regretfully Decline</span>
                  </label>
                </div>
              </div>

              {/* Conditional Options when Attending */}
              {formData.attending === 'yes' && (
                <>
                  {/* Number of Guests */}
                  <div>
                    <label
                      htmlFor="guestsCount"
                      className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-2"
                    >
                      Number of Guests (Including Yourself)
                    </label>
                    <select
                      id="guestsCount"
                      value={formData.guestsCount}
                      onChange={(e) =>
                        setFormData({ ...formData, guestsCount: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-sm font-serif text-[#44382F] focus:outline-hidden focus:border-[#B69A68] transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Which Events Will You Attend? */}
                  <div>
                    <span className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-2">
                      Events Attending
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {weddingData.events.map((ev) => {
                        const isChecked = formData.eventsAttending.includes(ev.id);
                        return (
                          <button
                            type="button"
                            key={ev.id}
                            onClick={() => toggleEvent(ev.id)}
                            className={`p-3 rounded-xs border text-xs font-serif uppercase tracking-wider text-center transition-colors ${
                              isChecked
                                ? 'bg-[#D8C7AA]/40 border-[#B69A68] text-[#44382F] font-semibold'
                                : 'bg-[#F8F5EE] border-[#D8C7AA] text-[#8D8174] hover:border-[#B69A68]'
                            }`}
                          >
                            {ev.name}
                          </button>
                        );
                      })}
                    </div>
                    {errors.events && (
                      <p className="text-xs text-red-600 mt-1 font-sans">{errors.events}</p>
                    )}
                  </div>
                </>
              )}

              {/* Special Message / Dietary Notes */}
              <div>
                <label
                  htmlFor="specialMessage"
                  className="block text-xs font-serif uppercase tracking-widest text-[#44382F] mb-2"
                >
                  Warm Wishes or Dietary Notes
                </label>
                <textarea
                  id="specialMessage"
                  rows={3}
                  value={formData.specialMessage}
                  onChange={(e) => setFormData({ ...formData, specialMessage: e.target.value })}
                  placeholder="Share your prayers, wishes, or dietary preferences..."
                  className="w-full px-4 py-3 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-sm font-serif text-[#44382F] placeholder:text-[#8D8174]/50 focus:outline-hidden focus:border-[#B69A68] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xs bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7] font-serif text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Confirming...' : 'Confirm Attendance'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/**
 * Wedding Store & Persistence
 * Manages live customizable wedding details, seat allocation quotas, and event-specific guest invitations.
 */

import { weddingData as initialWeddingData } from './weddingData';

export interface InvitedGuest {
  id: string;
  slug: string; // unique slug for link e.g. 'ali'
  name: string; // Card Holder Name e.g. 'Ali' or 'Ali Ahmed & Family'
  relationship: string; // e.g. 'Dear Friend', 'Family Elders'
  allowedSeats: number; // Final Invited Members count e.g. 2 Afrad / 2 Members
  isWithFamily?: boolean; // True when entire family is invited ("With Family")
  totalFamilyMembers?: number; // legacy optional
  invitedEvents: string[]; // Programs invited to: ['arrival', 'nikah', 'rukhsati']
  isSpecialGuest: boolean; // e.g. VIP 1-person special invite
  customNote?: string;
  status: 'pending' | 'attending' | 'declined';
  confirmedCount: number;
  confirmedMessage: string;
  confirmedAt?: string;
}

export interface EditableWeddingSettings {
  brideName: string;
  groomName: string;
  brideFather: string;
  groomFather: string;
  weddingDateDisplay: string;
  countdownTargetIso: string;
  arrivalTime: string;
  nikahTime: string;
  rukhsatiTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  showPetals: boolean;
}

const STORAGE_SETTINGS_KEY = 'elysian_vows_wedding_settings';
const STORAGE_GUESTS_KEY = 'elysian_vows_invited_guests';

// Initial default invited guest list including Ali
const defaultInvitedGuests: InvitedGuest[] = [
  {
    id: 'guest-ali',
    slug: 'ali',
    name: 'Ali',
    relationship: 'Dear Friend',
    allowedSeats: 2, // 2 Final Invited Members
    isWithFamily: false,
    invitedEvents: ['arrival', 'nikah', 'rukhsati'],
    isSpecialGuest: false,
    customNote: 'Specially invited for Sacred Nikah Ceremony & Baraat',
    status: 'pending',
    confirmedCount: 0,
    confirmedMessage: '',
  },
  {
    id: 'guest-kamran',
    slug: 'kamran',
    name: 'Dr. Kamran Malik',
    relationship: 'Special Colleague',
    allowedSeats: 1, // Special single 1-person invite
    isWithFamily: false,
    invitedEvents: ['nikah'],
    isSpecialGuest: true,
    customNote: 'Exclusive Special Invitation for Sacred Nikah Ceremony',
    status: 'pending',
    confirmedCount: 0,
    confirmedMessage: '',
  },
  {
    id: 'guest-tariq',
    slug: 'tariq',
    name: 'Uncle Tariq',
    relationship: 'Family Elders',
    allowedSeats: 6,
    isWithFamily: true, // Full Family Invited (With Family)
    invitedEvents: ['arrival', 'nikah', 'rukhsati'],
    isSpecialGuest: false,
    customNote: 'Honored presence requested With Family for all celebrations',
    status: 'attending',
    confirmedCount: 5,
    confirmedMessage: 'Heartiest congratulations to Dr. Iqra & Muhammad Awais! We will attend With Family.',
    confirmedAt: '2026-11-12 11:20 AM',
  },
];

export const getDefaultSettings = (): EditableWeddingSettings => ({
  brideName: initialWeddingData.bride.name,
  groomName: initialWeddingData.groom.name,
  brideFather: initialWeddingData.bride.father,
  groomFather: initialWeddingData.groom.father,
  weddingDateDisplay: initialWeddingData.weddingDateDisplay,
  countdownTargetIso: initialWeddingData.countdownTargetIso,
  arrivalTime: initialWeddingData.events[0]?.time || '01:00 PM',
  nikahTime: initialWeddingData.events[1]?.time || '02:30 PM',
  rukhsatiTime: initialWeddingData.events[2]?.time || '04:00 PM',
  venueName: initialWeddingData.primaryVenue.name,
  venueAddress: initialWeddingData.primaryVenue.address + ', Multan',
  googleMapsUrl: initialWeddingData.primaryVenue.googleMapsUrl,
  showPetals: true,
});

export const loadStoredSettings = (): EditableWeddingSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.brideFather === 'Arshad Hussain') {
        parsed.brideFather = initialWeddingData.bride.father;
      }
      return { ...getDefaultSettings(), ...parsed };
    }
  } catch {
    // fallback safe
  }
  return getDefaultSettings();
};

export const saveStoredSettings = (settings: EditableWeddingSettings) => {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // fallback safe
  }
};

export const loadStoredInvitedGuests = (): InvitedGuest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_GUESTS_KEY);
    if (raw) {
      const parsed: InvitedGuest[] = JSON.parse(raw);
      // Ensure invitedEvents array exists on older records
      return parsed.map((g) => ({
        ...g,
        invitedEvents: g.invitedEvents || ['arrival', 'nikah', 'rukhsati'],
      }));
    }
  } catch {
    // fallback safe
  }
  return defaultInvitedGuests;
};

export const saveStoredInvitedGuests = (guests: InvitedGuest[]) => {
  try {
    localStorage.setItem(STORAGE_GUESTS_KEY, JSON.stringify(guests));
  } catch {
    // fallback safe
  }
};

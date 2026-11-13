/**
 * Central Wedding Configuration - Dr. Iqra Arshad & Muhammad Awais
 * Friday, 27 November 2026 - Shah Jahan Marriage Hall, Multan
 * Purely stylish aesthetics, architectural majesty, and floral elegance (no human portraits).
 */

import heroRoyal from '../assets/images/hero_royal_palace_floral_1794486227680.jpg';
import weddingRings from '../assets/images/wedding_rings_gold_silk_1794486229296.jpg';
import marbleArches from '../assets/images/palatial_marble_arches_1794486228970.jpg';
import venueGarden from '../assets/images/venue_garden_hall_1794485248675.jpg';
import banquetTable from '../assets/images/banquet_table_chandelier_1794486228852.jpg';

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  dateIso: string;
  time: string;
  venue: string;
  venueAddress: string;
  dressCode: string;
  description: string;
  icon: string;
  googleMapsUrl: string;
  calendarTitle: string;
}

export interface StoryMilestone {
  stage: string;
  year: string;
  title: string;
  description: string;
  quote: string;
  image: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  src: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

export const weddingData = {
  // Couple Profile
  bride: {
    name: "Dr. Iqra Arshad",
    title: "The Bride",
    father: "Arshad Iqbal",
    mother: "Family Arshad",
    bio: "Dedicated physician committed to healing and compassion, with a love for grace, timeless traditions, and literature.",
    symbol: "I",
    accent: "Pearl & Gold",
  },
  groom: {
    name: "Muhammad Awais",
    title: "The Groom",
    father: "Family Awais",
    mother: "Elders & Family",
    bio: "A visionary professional driven by purpose, family values, and warm hospitality.",
    symbol: "A",
    accent: "Emerald & Gold",
  },
  monogram: {
    brideInitial: "I",
    groomInitial: "A",
    display: "I & A",
    coupleDisplay: "Dr. Iqra & Muhammad Awais",
    tagline: "Two Hearts, One Sacred Bond",
  },

  // Main Celebration Date & Countdown (Friday, 27 November 2026 at 1:00 PM)
  weddingDateDisplay: "Friday, 27 November 2026",
  countdownTargetIso: "2026-11-27T13:00:00", // Arrival Time: 1:00 PM

  // Invitation Card Text
  invitation: {
    bismillahArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    kicker: "IN THE NAME OF ALLAH, THE MOST BENEFICENT, THE MOST MERCIFUL",
    familyLine: "TOGETHER WITH OUR FAMILIES",
    requestLine: "REQUEST THE HONOR OF YOUR PRESENCE & PRAYERS AT OUR WEDDING CEREMONY",
    salutation: "YOU ARE CORDIALLY INVITED",
    subtext: "To celebrate love, devotion, and the auspicious union of two souls under divine blessings.",
  },

  // Hero Photography (Pure Architectural Royal Stage with Floral Arch & Chandeliers)
  heroImage: heroRoyal,

  // Love Story Stages
  loveStory: [
    {
      stage: "Chapter I",
      year: "The Beginning",
      title: "Written in the Stars",
      description:
        "A connection guided by divine timing and family harmony. What started as kindred conversation unfolded into deep mutual respect and shared dreams.",
      quote: "And We created you in pairs — Surah An-Naba [78:8]",
      image: weddingRings,
    },
    {
      stage: "Chapter II",
      year: "The Engagement",
      title: "Promises & Blessings",
      description:
        "Surrounded by prayer and joyful families, hearts aligned with shared intentions for a life of compassion, patience, and unyielding support.",
      quote: "Love is not about looking at each other, but looking in the same direction.",
      image: marbleArches,
    },
    {
      stage: "Chapter III",
      year: "27 November 2026",
      title: "The Sacred Nikah",
      description:
        "The momentous day we solemnize our bond before Allah and our beloved guests, embarking upon a lifetime of shared companionship and joy.",
      quote: "Two hearts united in faith, devotion, and endless gratitude.",
      image: heroRoyal,
    },
  ] as StoryMilestone[],

  // Celebratory Schedule (Friday, 27 November 2026)
  events: [
    {
      id: "arrival",
      name: "BARAAT & GUEST ARRIVAL",
      date: "Friday, 27 November 2026",
      dateIso: "2026-11-27",
      time: "01:00 PM",
      venue: "Shah Jahan Marriage Hall",
      venueAddress: "Chungi # 9, Near Eid Gah Road, Multan",
      dressCode: "Traditional Formal / Festive Splendor",
      description:
        "Warm reception of the Baraat and honorable guests, welcome drinks, and traditional greetings as celebrations commence.",
      icon: "Sparkles",
      googleMapsUrl: "https://maps.app.goo.gl/8k2tLtCpQckaJWTa9?g_st=iw",
      calendarTitle: "Muhammad Awais & Dr. Iqra - Guest Arrival",
    },
    {
      id: "nikah",
      name: "SACRED NIKAH CEREMONY",
      date: "Friday, 27 November 2026",
      dateIso: "2026-11-27",
      time: "02:30 PM",
      venue: "Shah Jahan Marriage Hall",
      venueAddress: "Chungi # 9, Near Eid Gah Road, Multan",
      dressCode: "Royal Traditional / Modest Formal",
      description:
        "The sacred solemnization of the Nikah vows, reciting holy verses, offering sincere Duas, and the formal signing.",
      icon: "Crown",
      googleMapsUrl: "https://maps.app.goo.gl/8k2tLtCpQckaJWTa9?g_st=iw",
      calendarTitle: "Muhammad Awais & Dr. Iqra - Nikah Ceremony",
    },
    {
      id: "rukhsati",
      name: "RUKHSATI",
      date: "Friday, 27 November 2026",
      dateIso: "2026-11-27",
      time: "04:00 PM",
      venue: "Shah Jahan Marriage Hall",
      venueAddress: "Chungi # 9, Near Eid Gah Road, Multan",
      dressCode: "Formal Elegance",
      description:
        "The sentimental departure ceremony and heartfelt prayers as the bride steps into her new home with love and barakah.",
      icon: "HeartHandshake",
      googleMapsUrl: "https://maps.app.goo.gl/8k2tLtCpQckaJWTa9?g_st=iw",
      calendarTitle: "Muhammad Awais & Dr. Iqra - Rukhsati Ceremony",
    },
  ] as WeddingEvent[],

  // Venue Feature
  primaryVenue: {
    name: "Shah Jahan Marriage Hall",
    hall: "Grand Royal Banquet & Lawn",
    address: "Chungi # 9, Near Eid Gah Road",
    cityState: "Multan, Punjab, Pakistan",
    description:
      "A renowned wedding banquet hall in Multan offering royal hospitality, majestic lighting, and gracious facilities for an unforgettable celebration.",
    image: venueGarden,
    googleMapsUrl: "https://maps.app.goo.gl/8k2tLtCpQckaJWTa9?g_st=iw",
    phone: "Chungi # 9, Multan",
    parkingNote: "Ample parking available at the venue entrance along Eid Gah Road.",
  },

  // Photo Gallery (Purely Stylish Architectural & Wedding Still Life, No Humans)
  gallery: [
    {
      id: 1,
      title: "The Royal Stage",
      subtitle: "Floral Archway & Grand Ballroom",
      src: heroRoyal,
      aspect: "landscape",
    },
    {
      id: 2,
      title: "Sacred Bands",
      subtitle: "Gold Wedding Rings on Silk",
      src: weddingRings,
      aspect: "portrait",
    },
    {
      id: 3,
      title: "Imperial Arches",
      subtitle: "Islamic Marble Palace Architecture",
      src: marbleArches,
      aspect: "portrait",
    },
    {
      id: 4,
      title: "Grand Banquet Assembly",
      subtitle: "Crystal Candelabras & Gold Chargers",
      src: banquetTable,
      aspect: "landscape",
    },
    {
      id: 5,
      title: "Palace at Twilight",
      subtitle: "Historic Illuminated Courtyard",
      src: venueGarden,
      aspect: "landscape",
    },
    {
      id: 6,
      title: "Golden Symphony",
      subtitle: "Opulent Banquet Ambience",
      src: banquetTable,
      aspect: "landscape",
    },
  ] as GalleryItem[],

  // Closing Note
  closing: {
    heading: "Two Hearts, One Sacred Journey",
    couple: "Dr. Iqra Arshad & Muhammad Awais",
    message: "Thank You For Being Part Of Our Special Day & Sharing In Our Joy",
    signoff: "WITH LOVE, PRAYERS & GRATITUDE",
  },
};

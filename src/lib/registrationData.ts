
export interface RegistrationCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  includes: string[];
  tier: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const registrationCategories: RegistrationCategory[] = [
  {
    id: "category1",
    name: "Category 1 - Flagship Honoree Tier",
    price: 15000,
    tier: "🥇",
    description: "Premier recognition with maximum visibility and exclusive benefits",
    includes: [
      "5-Star Hotel Accommodation (4 Nights)",
      "VIP Airport Pickup & Drop-Off",
      "Executive Lunch & Dinner Vouchers (3 Days)",
      "Shopping Voucher – $200",
      "Abuja Tour & Photography",
      "Full Access: Conference, Dinner & Gala Night",
      "Private Yacht Cruise",
      "Spotlight Feature in TPAHLA Media Series",
      "Legacy Inclusion in TPAHRC",
      "1-Page Profile in Official Compendium",
      "Invitation to Strategic Leadership Roundtables"
    ]
  },
  {
    id: "category2",
    name: "Category 2 - Premier Recognition Tier",
    price: 10000,
    tier: "🥈",
    description: "High-level recognition with comprehensive benefits",
    includes: [
      "4-Star Hotel Accommodation (4 Nights)",
      "VIP Airport Pickup & Drop-Off",
      "Executive Lunch & Dinner Vouchers (3 Days)",
      "Shopping Voucher – $150",
      "Abuja Tour & Photography",
      "Full Access: Conference, Dinner & Gala Night",
      "Featured Mention in Media & Compendium",
      "Private Yacht Cruise",
      "Legacy Inclusion in TPAHRC",
      "Invitation to Strategic Leadership Roundtables"
    ]
  },
  {
    id: "category3",
    name: "Category 3 - Emerging Trailblazer",
    price: 7000,
    tier: "🥉",
    description: "Humanitarian Excellence recognition package",
    includes: [
      "4-Star Hotel Accommodation (4 Nights)",
      "Executive Lunch & Dinner Vouchers (3 Days)",
      "Shopping Voucher – $125",
      "Full Abuja City Tour & Photography",
      "General Access: Conference, Dinner & Gala",
      "Group Feature in Award Roll Call",
      "Mention in Digital Awards Directory",
      "Legacy Inclusion in TPAHRC",
      "Private Yacht Cruise",
      "Invitation to Strategic Roundtables"
    ]
  },
  {
    id: "category4",
    name: "Category 4 - Standard Honoree",
    price: 6000,
    tier: "🏅",
    description: "Quality recognition with essential benefits",
    includes: [
      "4-Star Hotel Accommodation (4 Nights)",
      "Executive Meal Vouchers (3 Days)",
      "Shopping Voucher – $125",
      "General Access: Conference, Dinner & Gala",
      "Full Abuja City Tour & Photography",
      "Group Feature in Awards Roll Call",
      "Mention in Digital Directory",
      "Invitation to Strategic Roundtables"
    ]
  },
  {
    id: "category5",
    name: "Category 5 - Standard Honoree",
    price: 5000,
    tier: "🏵️",
    description: "Standard honoree package with key benefits",
    includes: [
      "4-Star Hotel Accommodation (4 Nights)",
      "Executive Meal Vouchers (3 Days)",
      "Shopping Voucher – $125",
      "Full Abuja City Tour & Photography",
      "General Access: Conference, Dinner & Gala",
      "Roll Call Feature",
      "Digital Mention"
    ]
  },
  {
    id: "category6",
    name: "Category 6 - Entry Honoree",
    price: 3500,
    tier: "🔹",
    description: "Entry-level recognition package",
    includes: [
      "3-Star Hotel Accommodation (4 Nights)",
      "Executive Meal Vouchers (3 Days)",
      "Shopping Voucher – $100",
      "Abuja City Tour & Photography",
      "Event Entry (Conference, Dinner & Gala)",
      "Digital Mention",
      "Group Feature in Awards Directory"
    ]
  },
  {
    id: "category7",
    name: "Category 7 - Entry Honoree",
    price: 3500,
    tier: "🔸",
    description: "Entry-level recognition package",
    includes: [
      "3-Star Hotel Accommodation (4 Nights)",
      "Executive Meal Vouchers (3 Days)",
      "Shopping Voucher – $100",
      "Abuja City Tour & Photography",
      "Event Entry (Conference, Dinner & Gala)",
      "Group Mention",
      "Awards Directory Entry"
    ]
  },
  {
    id: "category8",
    name: "Category 8 - Entry Honoree",
    price: 3333,
    tier: "⚪",
    description: "Entry-level recognition package",
    includes: [
      "3-Star Hotel Accommodation (4 Nights)",
      "Executive Meal Vouchers (3 Days)",
      "Shopping Voucher – $100",
      "Abuja City Tour & Photography",
      "Event Entry (Conference, Dinner & Gala)",
      "Awards Directory Entry"
    ]
  },
  {
    id: "category9",
    name: "Category 9 - Entry Honoree",
    price: 3000,
    tier: "⚫",
    description: "Essential recognition package",
    includes: [
      "3-Star Hotel Accommodation (4 Nights)",
      "Executive Meal Vouchers (3 Days)",
      "Abuja City Tour & Photography",
      "Event Entry (Conference, Dinner & Gala)",
      "Awards Directory Entry"
    ]
  },
  {
    id: "category10",
    name: "Category 10 - Entry Honoree",
    price: 3000,
    tier: "🟣",
    description: "Essential recognition package",
    includes: [
      "3-Star Hotel Accommodation (4 Nights)",
      "Executive Meal Vouchers (3 Days)",
      "Abuja City Tour & Photography",
      "Event Entry (Conference, Dinner & Gala)",
      "Awards Directory Entry"
    ]
  },
  {
    id: "individual",
    name: "Individual Participation",
    price: 200,
    tier: "👤",
    description: "General attendance without nomination",
    includes: [
      "General access to all public sessions (Oct 16–18)",
      "Entry to High-Level Roundtables & Networking",
      "Event Entry (Conference, Dinner & Gala)",
      "Event materials & delegate badge",
      "Certificate of Participation"
    ]
  },
  {
    id: "silver-corporate",
    name: "Silver Corporate Package",
    price: 750,
    tier: "🏢",
    description: "5 delegates package - Ideal for NGOs, CSR Units",
    includes: [
      "All-inclusive general access for 5 delegates",
      "Brand mention at Conference, Dinner & Gala",
      "Corporate networking opportunities",
      "Event materials for all delegates",
      "Certificate of participation for each delegate"
    ]
  },
  {
    id: "gold-corporate",
    name: "Gold Corporate Package",
    price: 1500,
    tier: "🏆",
    description: "10 delegates package - Perfect for institutions & multinationals",
    includes: [
      "All-inclusive general access for 10 delegates",
      "Enhanced brand mention at all events",
      "Priority corporate networking opportunities",
      "Event materials for all delegates",
      "Certificate of participation for each delegate",
      "Corporate logo in event materials"
    ]
  },
  {
    id: "platinum-corporate",
    name: "Platinum Corporate Package",
    price: 2000,
    tier: "💎",
    description: "15 delegates package - Premium visibility for governments & academia",
    includes: [
      "All-inclusive general access for 15 delegates",
      "Premium sponsor recognition at all events",
      "Exclusive corporate networking sessions",
      "Event materials for all delegates",
      "Certificate of participation for each delegate",
      "Corporate logo in event materials",
      "Special mention in closing ceremony"
    ]
  }
];

export const addOns: AddOn[] = [
  {
    id: "extra-accommodation",
    name: "Extended Hotel Stay",
    price: 200,
    description: "Additional night accommodation at the event hotel"
  },
  {
    id: "airport-transfer",
    name: "Premium Airport Transfer",
    price: 100,
    description: "Luxury vehicle airport pickup and drop-off service"
  },
  {
    id: "cultural-tour",
    name: "Extended Cultural Tour",
    price: 150,
    description: "Additional cultural sites and experiences in Abuja beyond standard tour"
  },
  {
    id: "networking-session",
    name: "VIP Networking Session",
    price: 300,
    description: "Exclusive access to private networking sessions with dignitaries"
  },
  {
    id: "media-package",
    name: "Enhanced Media Coverage",
    price: 500,
    description: "Additional media interviews and feature coverage"
  },
  {
    id: "additional-guest",
    name: "Additional Guest Pass",
    price: 400,
    description: "Guest pass for spouse/companion to attend all events"
  },
  {
    id: "business-center",
    name: "Business Center Access",
    price: 150,
    description: "Access to business facilities and meeting rooms throughout event"
  },
  {
    id: "spa-wellness",
    name: "Spa & Wellness Package",
    price: 250,
    description: "Spa treatments and wellness activities during your stay"
  },
  {
    id: "professional-photography",
    name: "Professional Photography Package",
    price: 300,
    description: "Personal photography session with professional editing and delivery"
  },
  {
    id: "legacy-documentation",
    name: "Legacy Documentation Package",
    price: 350,
    description: "Professional video interview and documentary-style coverage of your humanitarian work"
  }
];

// Award Categories for selection
export const awardCategories = [
  {
    id: "humanitarian-legacy",
    name: "Humanitarian Legacy & Leadership",
    description: "Recognizing lifetime achievement and transformational leadership in humanitarian work"
  },
  {
    id: "governance-impact",
    name: "Governance for Humanitarian Impact",
    description: "Honoring leaders in government who champion humanitarian causes"
  },
  {
    id: "youth-gender",
    name: "Youth & Gender Empowerment",
    description: "Celebrating leaders advancing youth development and gender equality"
  },
  {
    id: "sustainable-development",
    name: "Sustainable Development & Climate",
    description: "Recognizing environmental stewardship and sustainable development initiatives"
  },
  {
    id: "innovation-tech",
    name: "Humanitarian Tech & Innovation",
    description: "Honoring technological innovation in humanitarian solutions"
  },
  {
    id: "disaster-relief",
    name: "Disaster Relief & Emergency Response",
    description: "Recognizing excellence in disaster management and emergency response"
  },
  {
    id: "public-sector",
    name: "Public Sector & Institutional Impact",
    description: "Celebrating institutional leadership in humanitarian development"
  },
  {
    id: "social-cultural",
    name: "Social & Cultural Contributions",
    description: "Honoring contributions to social development and cultural preservation"
  },
  {
    id: "human-rights",
    name: "Human Rights & Justice",
    description: "Recognizing advocacy and action for human rights and social justice"
  },
  {
    id: "health-research",
    name: "Humanitarian Research & Public Health",
    description: "Celebrating research and public health initiatives that serve humanity"
  }
];

// Event Itinerary
export const eventItinerary = [
  {
    date: "October 15, 2025",
    title: "Arrival & VIP Reception",
    activities: [
      "Delegate arrival and check-in",
      "Welcome reception",
      "Networking cocktail"
    ]
  },
  {
    date: "October 16, 2025",
    title: "Cultural Experience & Humanitarian Storytelling",
    activities: [
      "Abuja cultural tour and photography",
      "Humanitarian storytelling sessions",
      "Cultural evening program"
    ]
  },
  {
    date: "October 17, 2025",
    title: "High-Level Policy Roundtables",
    activities: [
      "Strategic leadership roundtables",
      "Policy engagement sessions",
      "Pre-award gala dinner"
    ]
  },
  {
    date: "October 18, 2025",
    title: "Leadership Showcase & Grand Awards Gala",
    activities: [
      "Leadership showcase presentations",
      "Grand awards ceremony",
      "Gala dinner and celebration"
    ]
  },
  {
    date: "October 19, 2025",
    title: "Farewell & Departure",
    activities: [
      "Farewell breakfast",
      "Departure arrangements",
      "Airport transfers"
    ]
  }
];

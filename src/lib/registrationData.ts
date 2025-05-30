
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
    name: "Category 3 - Humanitarian Excellence",
    price: 7000,
    tier: "🥉",
    description: "Emerging Trailblazers recognition package",
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
    name: "Category 4",
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
    name: "Category 5",
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
    name: "Silver Corporate",
    price: 750,
    tier: "🏢",
    description: "5 delegates package",
    includes: [
      "All-inclusive general access for 5 delegates",
      "Brand mention at Conference, Dinner & Gala",
      "Corporate networking opportunities",
      "Event materials for all delegates"
    ]
  },
  {
    id: "gold-corporate",
    name: "Gold Corporate",
    price: 1500,
    tier: "🏢",
    description: "10 delegates package",
    includes: [
      "All-inclusive general access for 10 delegates",
      "Brand mention at Conference, Dinner & Gala",
      "Corporate networking opportunities",
      "Event materials for all delegates"
    ]
  },
  {
    id: "platinum-corporate",
    name: "Platinum Sponsor Delegate Pack",
    price: 2000,
    tier: "🏢",
    description: "15 delegates package",
    includes: [
      "All-inclusive general access for 15 delegates",
      "Brand mention at Conference, Dinner & Gala",
      "Corporate networking opportunities",
      "Event materials for all delegates",
      "Sponsor recognition"
    ]
  }
];

export const addOns: AddOn[] = [
  {
    id: "extra-guest",
    name: "Additional Guest",
    price: 500,
    description: "Extra guest for gala dinner and events"
  },
  {
    id: "vip-lounge",
    name: "VIP Lounge Access",
    price: 300,
    description: "Exclusive access to VIP lounge throughout the event"
  },
  {
    id: "photography",
    name: "Professional Photography Package",
    price: 250,
    description: "Personal photography session and edited photos"
  },
  {
    id: "spa-wellness",
    name: "Spa & Wellness Package",
    price: 400,
    description: "Spa treatments and wellness activities"
  },
  {
    id: "cultural-tour",
    name: "Extended Cultural Tour",
    price: 200,
    description: "Additional cultural sites and experiences in Abuja"
  },
  {
    id: "business-center",
    name: "Business Center Access",
    price: 150,
    description: "Access to business facilities and meeting rooms"
  }
];

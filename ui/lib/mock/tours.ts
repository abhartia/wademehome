import { Tour, TourProperty } from "@/lib/types/tours";

export const MOCK_PROPERTIES: TourProperty[] = [
  {
    id: "prop-1",
    name: "The Rivington",
    address: "123 Rivington St, New York, NY",
    rent: "$2,850/mo",
    beds: "1 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Walkable", "Near transit"],
  },
  {
    id: "prop-2",
    name: "Avalon at Edgewater",
    address: "1000 Ave at Port Imperial, Weehawken, NJ",
    rent: "$3,200/mo",
    beds: "2 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Parking", "Gym"],
  },
  {
    id: "prop-3",
    name: "The Lofts at Canal Walk",
    address: "100 Canal Walk Blvd, New Brunswick, NJ",
    rent: "$2,100/mo",
    beds: "1 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Safe & quiet", "Parks"],
  },
  {
    id: "prop-4",
    name: "The Modern at Fort Lee",
    address: "2100 Linwood Ave, Fort Lee, NJ",
    rent: "$2,600/mo",
    beds: "1 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["River views", "Doorman"],
  },
  {
    id: "prop-5",
    name: "The Ashton",
    address: "250 Ashland Pl, Brooklyn, NY",
    rent: "$3,450/mo",
    beds: "2 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Rooftop", "In-unit W/D"],
  },
  {
    id: "prop-6",
    name: "Domain at Austin",
    address: "11005 Burnet Rd, Austin, TX",
    rent: "$1,950/mo",
    beds: "1 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Pool", "Dog park"],
  },
  {
    id: "prop-7",
    name: "Windsor at West University",
    address: "2630 Bissonnet St, Houston, TX",
    rent: "$1,750/mo",
    beds: "1 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Near Rice U", "Updated"],
  },
  {
    id: "prop-8",
    name: "The Essex",
    address: "15 Essex St, Jersey City, NJ",
    rent: "$2,700/mo",
    beds: "Studio",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["PATH access", "Concierge"],
  },
  {
    id: "prop-9",
    name: "Gotham West Market Residences",
    address: "600 W 42nd St, New York, NY",
    rent: "$4,100/mo",
    beds: "2 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Luxury", "Hudson views"],
  },
  {
    id: "prop-10",
    name: "The Continental",
    address: "354 Communipaw Ave, Jersey City, NJ",
    rent: "$2,350/mo",
    beds: "1 bed",
    image:
      "https://images.ctfassets.net/pg6xj64qk0kh/2yULhK0VeJMq0IEWyQAPAx/e5e6e18cc0f19fa14c3f4e49f5dcefee/970_kent-1.jpg",
    tags: ["Pet-friendly", "Laundry"],
  },
];

export const PHOTO_CHECKLIST_ITEMS = [
  "Kitchen",
  "Bathroom",
  "Bedroom(s)",
  "Closets",
  "Windows / natural light",
  "Appliances",
  "Entry / locks",
  "Hallway / common areas",
  "Parking / garage",
  "Laundry",
  "Building exterior",
  "View from unit",
];

export const INSPECTION_CHECKLIST_ITEMS = [
  "Test water pressure",
  "Check all power outlets",
  "Open/close all windows",
  "Test appliances",
  "Check for pests",
  "Check smoke detectors",
  "Test door locks",
  "Look for water damage",
  "Check phone signal",
  "Listen for noise levels",
  "Check HVAC / heating",
  "Inspect flooring",
];

export const SEED_TOURS: Tour[] = [
  {
    id: "tour-1",
    property: MOCK_PROPERTIES[0],
    status: "scheduled",
    scheduledDate: "2026-03-15",
    scheduledTime: "10:00 AM",
    note: null,
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "tour-2",
    property: MOCK_PROPERTIES[1],
    status: "completed",
    scheduledDate: "2026-02-10",
    scheduledTime: "2:00 PM",
    note: {
      ratings: {
        overall: 4,
        cleanliness: 5,
        naturalLight: 3,
        noiseLevel: 4,
        condition: 4,
      },
      pros: "Stunning river views from every room. The gym is brand new with Peloton bikes. Doorman was very friendly and professional.",
      cons: "A bit far from the PATH station — about a 15 min walk. Street parking is tough.",
      generalNotes:
        "Really liked this one. The 2-bed layout is spacious and the closets are huge. Kitchen has quartz counters and stainless appliances. Building felt well-maintained. Would be great if we get a roommate.",
      wouldApply: true,
      photoChecklist: [
        "Kitchen",
        "Bathroom",
        "Bedroom(s)",
        "Windows / natural light",
        "View from unit",
      ],
      updatedAt: "2026-02-10T16:30:00Z",
    },
    createdAt: "2026-02-05T14:00:00Z",
  },
  {
    id: "tour-3",
    property: MOCK_PROPERTIES[4],
    status: "saved",
    scheduledDate: "",
    scheduledTime: "",
    note: null,
    createdAt: "2026-02-25T09:00:00Z",
  },
  {
    id: "tour-4",
    property: MOCK_PROPERTIES[3],
    status: "completed",
    scheduledDate: "2026-02-18",
    scheduledTime: "11:00 AM",
    note: {
      ratings: {
        overall: 3,
        cleanliness: 3,
        naturalLight: 4,
        noiseLevel: 2,
        condition: 3,
      },
      pros: "Great natural light. River views are nice from the bedroom.",
      cons: "Noisy — could hear traffic from the GWB. Hallways felt dated.",
      generalNotes:
        "Decent unit but the noise would be an issue. The model unit looked better than the actual available unit. Worth considering if they offer a noise discount.",
      wouldApply: null,
      photoChecklist: ["Kitchen", "Bedroom(s)", "Windows / natural light"],
      updatedAt: "2026-02-18T13:00:00Z",
    },
    createdAt: "2026-02-12T11:00:00Z",
  },
];

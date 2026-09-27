// SAMPLE application objects only.
// These are NOT real businesses and are NOT pulled from OSM/Google.
// They exist purely to test placing custom interactive markers on top
// of the real geographic map.

export type ObjectType = "house" | "store" | "water" | "park" | "food";

export interface SampleObject {
  id: string;
  name: string;
  type: ObjectType;
  latitude: number;
  longitude: number;
  icon: string;
  description: string;
}

const { latitude: LAT, longitude: LNG } = { latitude: 14.5658, longitude: 121.0287 };

export const sampleObjects: SampleObject[] = [
  {
    id: "house-001",
    name: "SAMPLE HOUSE",
    type: "house",
    latitude: LAT + 0.0012,
    longitude: LNG + 0.0009,
    icon: "🏠",
    description: "Residential building. This is a prototype object.",
  },
  {
    id: "store-001",
    name: "SAMPLE STORE",
    type: "store",
    latitude: LAT - 0.0008,
    longitude: LNG + 0.0015,
    icon: "🏪",
    description: "Neighborhood sari-sari store. This is a prototype location.",
  },
  {
    id: "water-001",
    name: "SAMPLE WATER STATION",
    type: "water",
    latitude: LAT + 0.0005,
    longitude: LNG - 0.0013,
    icon: "💧",
    description: "Water Delivery. 📍 Poblacion, Makati. This is a prototype location.",
  },
  {
    id: "park-001",
    name: "SAMPLE PARK",
    type: "park",
    latitude: LAT - 0.0015,
    longitude: LNG - 0.0006,
    icon: "🌳",
    description: "A small green space. This is a prototype object.",
  },
  {
    id: "food-001",
    name: "SAMPLE FOOD STALL",
    type: "food",
    latitude: LAT + 0.0018,
    longitude: LNG - 0.0002,
    icon: "🍔",
    description: "Local food stall. This is a prototype location.",
  },
];

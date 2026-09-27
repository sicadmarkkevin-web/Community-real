// A business the user has attached to a real OSM building footprint.
// Lives only in memory for this prototype (no backend yet).

export type BusinessCategory = "store" | "water" | "food" | "service" | "other";

export interface UserBusiness {
  id: string;
  buildingId: string;
  name: string;
  category: BusinessCategory;
  latitude: number;
  longitude: number;
}

export const CATEGORY_ICON: Record<BusinessCategory, string> = {
  store: "🏪",
  water: "💧",
  food: "🍔",
  service: "🧰",
  other: "📍",
};

export const CATEGORY_LABEL: Record<BusinessCategory, string> = {
  store: "Store",
  water: "Water Delivery",
  food: "Food",
  service: "Service",
  other: "Other",
};

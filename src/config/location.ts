// Central location configuration.
// Change these values to point the app at a different barangay/neighborhood.

export interface LocationConfig {
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  defaultZoom: number;
}

export const LOCATION_CONFIG: LocationConfig = {
  name: "Poblacion",
  city: "Makati City",
  country: "Philippines",
  latitude: 14.5658,
  longitude: 121.0287,
  defaultZoom: 16,
};

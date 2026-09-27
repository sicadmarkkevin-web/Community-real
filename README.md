# Neighborhood World — Phase 1 Prototype

A proof-of-concept that displays a real Philippine neighborhood (Barangay
Poblacion, Makati City) as an interactive 2D map, with custom sample markers
layered on top to test the "real neighborhood becomes a game world" idea.

No backend, no database, no auth, no payments, no API keys — ₱0 to run.

## 1. Install

```
npm install
```

## 2. Run locally

```
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

## 3. Change the barangay

Edit `src/config/location.ts`. Update `name`, `city`, `country`, `latitude`,
`longitude`, and `defaultZoom`. Nothing else in the app needs to change —
the map, the "My Location" recenter button, and the header text all read
from this one file.

## 4. Where sample objects are defined

`src/data/sampleObjects.ts` — a plain array of sample objects (house, store,
water station, park, food stall). These are clearly-labeled SAMPLE objects
for testing marker placement, not real businesses or OSM data.

## 5. How to add another custom object

Add a new entry to the array in `src/data/sampleObjects.ts`:

```ts
{
  id: "unique-id",
  name: "SAMPLE SOMETHING",
  type: "house", // or "store" | "water" | "park" | "food"
  latitude: 14.5660,
  longitude: 121.0290,
  icon: "🎮",
  description: "Whatever you want this to say.",
}
```

It will automatically appear on the map — `NeighborhoodMap.tsx` renders the
whole array.

## 6. Build for production

```
npm run build
```

Output goes to `dist/`. Preview it locally with `npm run preview`.

## What was built

- Full-screen interactive Leaflet + OpenStreetMap map, centered on
  Poblacion, Makati by default via one config file.
- Real OSM building footprints rendered as clickable polygons — tap any
  building to attach a sample business to it (name + category), or tap an
  occupied building to view/remove what's there. Businesses you add live
  only in memory for this session (no backend yet).
- 5 pre-set custom sample markers (house, store, water station, park, food)
  with click-to-open info popups.
- Top-left "Neighborhood World" header + info panel.
- 📍 My Location button (uses browser Geolocation API, one-shot, no
  continuous tracking).
- 🏠 Poblacion button to recenter the map.
- Responsive layout for desktop and mobile.

## Building data

Building footprints are fetched live from the free [Overpass
API](https://overpass-api.de) (OpenStreetMap's data API) for the area
around the configured location — no API key needed. This happens in
`src/components/BuildingLayer.tsx`. If Overpass is briefly unavailable,
the buildings just won't render; the map and existing markers still work.

## Limitations (Phase 1 only)

- All markers are sample/fake data — not real businesses.
- No backend, database, auth, or persistence — refreshing resets nothing
  since there's no state to lose, but nothing is saved either.
- Building footprints/roads shown are whatever OpenStreetMap already has
  for the area — no custom building data has been added.
- Not connected to any delivery, ordering, or marketplace logic (by design
  — that's explicitly out of scope for this phase).

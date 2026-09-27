import { useEffect, useState } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { LOCATION_CONFIG } from "../config/location";

export interface OsmBuilding {
  id: string;
  positions: LatLngExpression[];
  centerLat: number;
  centerLng: number;
  hasBusiness: boolean;
}

interface Props {
  onBuildingClick: (building: OsmBuilding) => void;
  occupiedBuildingIds: Set<string>;
  onStatusChange?: (status: "loading" | "loaded" | "error", count: number) => void;
}

// Roughly a few hundred meters around the configured neighborhood center.
const DELTA = 0.006;

// Public Overpass mirrors. Different mirrors, hosting origins, and even
// times of day can trip CORS/rate-limit errors on any single one of
// these, so we try several before giving up.
const OVERPASS_ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

// Last-resort: a generic CORS passthrough proxy, wrapping a direct
// Overpass GET request. Only used if every direct mirror attempt fails
// (including with a CORS error, which browsers report identically to a
// real network failure, so we can't tell them apart up front).
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

function centroid(coords: { lat: number; lon: number }[]) {
  let latSum = 0;
  let lngSum = 0;
  coords.forEach((c) => {
    latSum += c.lat;
    lngSum += c.lon;
  });
  return { lat: latSum / coords.length, lng: lngSum / coords.length };
}

function buildQuery() {
  const south = LOCATION_CONFIG.latitude - DELTA;
  const west = LOCATION_CONFIG.longitude - DELTA;
  const north = LOCATION_CONFIG.latitude + DELTA;
  const east = LOCATION_CONFIG.longitude + DELTA;
  return `[out:json][timeout:25];(way["building"](${south},${west},${north},${east}););out geom;`;
}

function parseElements(data: any): OsmBuilding[] {
  return (data.elements || [])
    .filter((el: any) => el.type === "way" && Array.isArray(el.geometry))
    .map((el: any) => {
      const positions: LatLngExpression[] = el.geometry.map(
        (pt: { lat: number; lon: number }) => [pt.lat, pt.lon]
      );
      const c = centroid(el.geometry);
      return {
        id: String(el.id),
        positions,
        centerLat: c.lat,
        centerLng: c.lng,
        hasBusiness: false,
      };
    });
}

async function fetchDirect(endpoint: string, query: string, signal: AbortSignal) {
  const url = `${endpoint}?data=${encodeURIComponent(query)}`;
  const res = await fetch(url, { method: "GET", signal });
  if (!res.ok) throw new Error(`Overpass ${endpoint} responded ${res.status}`);
  return res.json();
}

async function fetchViaProxy(endpoint: string, query: string, signal: AbortSignal) {
  const targetUrl = `${endpoint}?data=${encodeURIComponent(query)}`;
  const proxied = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
  const res = await fetch(proxied, { method: "GET", signal });
  if (!res.ok) throw new Error(`Proxy fetch responded ${res.status}`);
  return res.json();
}

export default function BuildingLayer({
  onBuildingClick,
  occupiedBuildingIds,
  onStatusChange,
}: Props) {
  const [buildings, setBuildings] = useState<OsmBuilding[]>([]);

  useEffect(() => {
    const query = buildQuery();
    const controller = new AbortController();
    onStatusChange?.("loading", 0);

    (async () => {
      const errors: string[] = [];

      // Pass 1: try each mirror directly.
      for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
          const data = await fetchDirect(endpoint, query, controller.signal);
          const parsed = parseElements(data);
          setBuildings(parsed);
          onStatusChange?.("loaded", parsed.length);
          return;
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
          errors.push(`${endpoint}: ${(err as Error).message}`);
        }
      }

      // Pass 2: every direct attempt failed (often a CORS error caused by
      // a rate-limited/error response missing CORS headers) — fall back
      // to a CORS proxy on the first mirror.
      try {
        const data = await fetchViaProxy(
          OVERPASS_ENDPOINTS[0],
          query,
          controller.signal
        );
        const parsed = parseElements(data);
        setBuildings(parsed);
        onStatusChange?.("loaded", parsed.length);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        errors.push(`proxy: ${(err as Error).message}`);
      }

      console.error("Building data unavailable. Attempts:", errors);
      onStatusChange?.("error", 0);
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {buildings.map((b) => {
        const occupied = occupiedBuildingIds.has(b.id);
        return (
          <Polygon
            key={b.id}
            positions={b.positions}
            pathOptions={{
              color: occupied ? "#e07a2f" : "#2f9e6e",
              weight: 2,
              fillColor: occupied ? "#f4b183" : "#8fd9b6",
              fillOpacity: occupied ? 0.55 : 0.4,
            }}
            eventHandlers={{
              click: () => onBuildingClick(b),
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: 0.7, weight: 3 });
              },
              mouseout: (e) => {
                e.target.setStyle({
                  fillOpacity: occupied ? 0.55 : 0.4,
                  weight: 2,
                });
              },
            }}
          >
            <Tooltip sticky>
              {occupied ? "Tap to view business" : "Tap to add a business here"}
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
}

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
}

// Roughly a few hundred meters around the configured neighborhood center.
const DELTA = 0.006;

function centroid(coords: { lat: number; lon: number }[]) {
  let latSum = 0;
  let lngSum = 0;
  coords.forEach((c) => {
    latSum += c.lat;
    lngSum += c.lon;
  });
  return { lat: latSum / coords.length, lng: lngSum / coords.length };
}

export default function BuildingLayer({
  onBuildingClick,
  occupiedBuildingIds,
}: Props) {
  const [buildings, setBuildings] = useState<OsmBuilding[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  useEffect(() => {
    const south = LOCATION_CONFIG.latitude - DELTA;
    const west = LOCATION_CONFIG.longitude - DELTA;
    const north = LOCATION_CONFIG.latitude + DELTA;
    const east = LOCATION_CONFIG.longitude + DELTA;

    const query = `[out:json][timeout:25];(way["building"](${south},${west},${north},${east}););out geom;`;

    const controller = new AbortController();

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Overpass request failed");
        return res.json();
      })
      .then((data) => {
        const parsed: OsmBuilding[] = (data.elements || [])
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
        setBuildings(parsed);
        setStatus("loaded");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, []);

  if (status === "error") return null;

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
              weight: 1.5,
              fillColor: occupied ? "#f4b183" : "#8fd9b6",
              fillOpacity: occupied ? 0.55 : 0.35,
            }}
            eventHandlers={{
              click: () => onBuildingClick(b),
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: 0.65, weight: 2.5 });
              },
              mouseout: (e) => {
                e.target.setStyle({
                  fillOpacity: occupied ? 0.55 : 0.35,
                  weight: 1.5,
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

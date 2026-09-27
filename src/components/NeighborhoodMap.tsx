import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LOCATION_CONFIG } from "../config/location";
import { sampleObjects } from "../data/sampleObjects";
import BusinessMarker from "./BusinessMarker";
import MapControls from "./MapControls";
import LocationPanel from "./LocationPanel";

export default function NeighborhoodMap() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <div className="map-shell">
      <LocationPanel statusMessage={statusMessage} />

      <MapContainer
        center={[LOCATION_CONFIG.latitude, LOCATION_CONFIG.longitude]}
        zoom={LOCATION_CONFIG.defaultZoom}
        className="leaflet-map"
        zoomControl={false}
      >
        {/* Standard OpenStreetMap tiles — free, no API key required.
            A CSS filter (see .leaflet-map / .map-tiles-friendly in
            index.css) is used to nudge the look toward the friendlier,
            more game-like direction without needing a keyed tile
            service, while keeping the real geography intact. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sampleObjects.map((obj) => (
          <BusinessMarker key={obj.id} object={obj} />
        ))}

        <MapControls onStatusMessage={setStatusMessage} />
      </MapContainer>
    </div>
  );
}

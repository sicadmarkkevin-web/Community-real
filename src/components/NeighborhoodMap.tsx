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
        {/* Original visual treatment: a clean, muted-color tile set
            (CARTO Voyager) instead of default OSM styling, to move
            toward a friendlier, more game-like look while keeping
            real geography intact. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {sampleObjects.map((obj) => (
          <BusinessMarker key={obj.id} object={obj} />
        ))}

        <MapControls onStatusMessage={setStatusMessage} />
      </MapContainer>
    </div>
  );
}

import { useMemo, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LOCATION_CONFIG } from "../config/location";
import { sampleObjects } from "../data/sampleObjects";
import type { BusinessCategory, UserBusiness } from "../data/userBusiness";
import { CATEGORY_ICON, CATEGORY_LABEL } from "../data/userBusiness";
import BusinessMarker from "./BusinessMarker";
import MapControls from "./MapControls";
import LocationPanel from "./LocationPanel";
import BuildingLayer, { type OsmBuilding } from "./BuildingLayer";
import AddBusinessPanel from "./AddBusinessPanel";
import ViewBusinessPanel from "./ViewBusinessPanel";

export default function NeighborhoodMap() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<OsmBuilding | null>(
    null
  );
  const [userBusinesses, setUserBusinesses] = useState<UserBusiness[]>([]);

  const occupiedBuildingIds = useMemo(
    () => new Set(userBusinesses.map((b) => b.buildingId)),
    [userBusinesses]
  );

  const businessForSelectedBuilding = selectedBuilding
    ? userBusinesses.find((b) => b.buildingId === selectedBuilding.id) ?? null
    : null;

  const handleBuildingClick = (building: OsmBuilding) => {
    setSelectedBuilding(building);
  };

  const handleAddBusiness = (name: string, category: BusinessCategory) => {
    if (!selectedBuilding) return;
    const newBusiness: UserBusiness = {
      id: `user-${selectedBuilding.id}-${Date.now()}`,
      buildingId: selectedBuilding.id,
      name,
      category,
      latitude: selectedBuilding.centerLat,
      longitude: selectedBuilding.centerLng,
    };
    setUserBusinesses((prev) => [...prev, newBusiness]);
    setSelectedBuilding(null);
  };

  const handleRemoveBusiness = () => {
    if (!businessForSelectedBuilding) return;
    setUserBusinesses((prev) =>
      prev.filter((b) => b.id !== businessForSelectedBuilding.id)
    );
    setSelectedBuilding(null);
  };

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
            A CSS filter (see .leaflet-map in index.css) nudges the look
            toward the friendlier, game-like direction while keeping the
            real geography intact. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Real OSM building footprints, rendered as clickable polygons */}
        <BuildingLayer
          onBuildingClick={handleBuildingClick}
          occupiedBuildingIds={occupiedBuildingIds}
        />

        {sampleObjects.map((obj) => (
          <BusinessMarker key={obj.id} object={obj} />
        ))}

        {userBusinesses.map((b) => (
          <BusinessMarker
            key={b.id}
            object={{
              id: b.id,
              name: b.name,
              type: "store",
              latitude: b.latitude,
              longitude: b.longitude,
              icon: CATEGORY_ICON[b.category],
              description: `${CATEGORY_LABEL[b.category]} · Added by you.`,
            }}
          />
        ))}

        <MapControls onStatusMessage={setStatusMessage} />
      </MapContainer>

      {selectedBuilding && !businessForSelectedBuilding && (
        <AddBusinessPanel
          building={selectedBuilding}
          onCancel={() => setSelectedBuilding(null)}
          onSubmit={handleAddBusiness}
        />
      )}

      {selectedBuilding && businessForSelectedBuilding && (
        <ViewBusinessPanel
          business={businessForSelectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onRemove={handleRemoveBusiness}
        />
      )}
    </div>
  );
}

import { LOCATION_CONFIG } from "../config/location";

interface Props {
  statusMessage: string | null;
  buildingStatus?: "loading" | "loaded" | "error";
  buildingCount?: number;
}

export default function LocationPanel({
  statusMessage,
  buildingStatus,
  buildingCount,
}: Props) {
  return (
    <div className="location-panel">
      <div className="location-panel-header">
        <div className="app-title">🗺️ Neighborhood World</div>
        <div className="app-subtitle">
          {LOCATION_CONFIG.name}, {LOCATION_CONFIG.city}
        </div>
      </div>
      <div className="location-panel-body">
        Explore your real neighborhood as an interactive 2D world.
      </div>

      {buildingStatus === "loading" && (
        <div className="building-status loading">
          Loading buildings…
        </div>
      )}
      {buildingStatus === "loaded" && (
        <div className="building-status loaded">
          {buildingCount} buildings — tap one to add a business
        </div>
      )}
      {buildingStatus === "error" && (
        <div className="building-status error">
          Building data unavailable right now — the map and markers still
          work. Try again in a bit.
        </div>
      )}

      {statusMessage && (
        <div className="location-panel-status">{statusMessage}</div>
      )}
    </div>
  );
}

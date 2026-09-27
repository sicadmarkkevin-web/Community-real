import { LOCATION_CONFIG } from "../config/location";

interface Props {
  statusMessage: string | null;
}

export default function LocationPanel({ statusMessage }: Props) {
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
      {statusMessage && (
        <div className="location-panel-status">{statusMessage}</div>
      )}
    </div>
  );
}

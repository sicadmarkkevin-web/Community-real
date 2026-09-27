import { useMap } from "react-leaflet";
import { LOCATION_CONFIG } from "../config/location";

interface Props {
  onStatusMessage: (msg: string | null) => void;
}

export default function MapControls({ onStatusMessage }: Props) {
  const map = useMap();

  const goToPoblacion = () => {
    map.flyTo(
      [LOCATION_CONFIG.latitude, LOCATION_CONFIG.longitude],
      LOCATION_CONFIG.defaultZoom,
      { duration: 1 }
    );
    onStatusMessage(null);
  };

  const goToMyLocation = () => {
    if (!navigator.geolocation) {
      onStatusMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 17, { duration: 1 });
        onStatusMessage(null);
      },
      () => {
        onStatusMessage(
          "Location permission was denied. Enable it in your browser to use this feature."
        );
      }
    );
  };

  return (
    <div className="map-controls">
      <button className="map-control-btn" onClick={goToMyLocation}>
        📍 My Location
      </button>
      <button className="map-control-btn" onClick={goToPoblacion}>
        🏠 Poblacion
      </button>
    </div>
  );
}

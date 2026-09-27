import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { SampleObject } from "../data/sampleObjects";

function makeIcon(icon: string) {
  return L.divIcon({
    className: "custom-object-marker",
    html: `<div class="marker-bubble">${icon}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

interface Props {
  object: SampleObject;
}

export default function BusinessMarker({ object }: Props) {
  return (
    <Marker
      position={[object.latitude, object.longitude]}
      icon={makeIcon(object.icon)}
    >
      <Popup>
        <div className="object-popup">
          <div className="object-popup-title">
            {object.icon} {object.name}
          </div>
          <div className="object-popup-desc">{object.description}</div>
        </div>
      </Popup>
    </Marker>
  );
}

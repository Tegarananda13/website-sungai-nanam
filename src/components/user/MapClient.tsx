"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Atur ikon default supaya marker muncul dengan benar
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function PetaSungaiNanam() {
  // Fix untuk icon agar tidak hilang di Next.js
  useEffect(() => {
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  // Koordinat Sungai Nanam
  const position: [number, number] = [-1.02775, 100.782583];

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <b>Nagari Sungai Nanam</b><br />
            Kabupaten Solok, Sumatera Barat
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

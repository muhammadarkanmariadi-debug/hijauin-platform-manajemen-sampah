"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Perbaiki icon Leaflet (supaya marker muncul)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({ 
  iconUrl: typeof iconUrl === 'string' ? iconUrl : (iconUrl as any).src, 
  shadowUrl: typeof iconShadow === 'string' ? iconShadow : (iconShadow as any).src 
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen untuk auto-center ke posisi terbaru
function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position]);
  return null;
}

export default function UserTrackerMap() {
  const [path, setPath] = useState<[number, number][]>([]);
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported!");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCurrentPos(newPos);
        setPath((prev) => [...prev, newPos]); // simpan riwayat posisi
      },
      (err) => console.error("Error getting location:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!currentPos)
    return <p className="p-4 text-gray-500 text-center">Menunggu lokasi pengguna...</p>;

  return (
    <MapContainer
      center={currentPos}
      zoom={17}
      scrollWheelZoom={true}
      style={{ height: "450px", width: "100%", borderRadius: "12px" }}
    >
      {/* Peta dasar OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Jalur perjalanan */}
      {path.length > 1 && <Polyline positions={path} color="blue" />}

      {/* Marker lokasi saat ini */}
      <Marker position={currentPos}>
        <Popup>📍 Kamu di sini</Popup>
      </Marker>

      <RecenterMap position={currentPos} />
    </MapContainer>
  );
}

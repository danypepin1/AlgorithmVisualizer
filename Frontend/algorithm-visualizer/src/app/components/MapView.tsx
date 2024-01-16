"use client";

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngLiteral } from 'leaflet';

const MapView: React.FC = () => {
    const [markers, setMarkers] = useState<LatLngLiteral[]>([]);

    const AddMarkerOnClick = () => {
        useMapEvents({
            click: (e) => {
                const newMarker: LatLngLiteral = { lat: e.latlng.lat, lng: e.latlng.lng };
                setMarkers(markers => [...markers, newMarker]);
            },
        });
        return null;
    };

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {markers.map((position, idx) => (
                <Marker key={idx} position={position}>
                    <Popup>
                        Marker at {position.lat.toFixed(3)}, {position.lng.toFixed(3)}
                    </Popup>
                </Marker>
            ))}
            <AddMarkerOnClick />
        </MapContainer>
    );
};

export default MapView;


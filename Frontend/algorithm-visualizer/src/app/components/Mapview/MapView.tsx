"use client";

import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression} from 'leaflet';
import '@/styles/MapView.css';
import { useGraphData } from '@/hooks/useGraphData';


const MapView: React.FC = () => {
    const graphData = useGraphData();

    const mapCenter: LatLngExpression = [46.8336597, -71.2608125];

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            />
          {graphData && (() => {
            const nodeMap = new Map(graphData.nodes.map(node => [node.id, node]));
    
            const polylines: LatLngExpression[][] = graphData.edges.map((edge) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);
    
              if (fromNode && toNode) {
                return [
                  [fromNode.position[0], fromNode.position[1]],
                  [toNode.position[0], toNode.position[1]],
                ];
              }
    
              return [];
            });
    
            return <Polyline positions={polylines} color="orange" />;
          })()}
        </MapContainer>
      );
};

export default MapView;


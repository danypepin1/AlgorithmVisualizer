"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression} from 'leaflet';
import '@/styles/MapView.css';
import { useGraphData } from '@/hooks/useGraphData';
import { Markers } from '../Markers/Markers';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Graph, Node} from '@/types/Graph';

const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Enter city',
    });
    

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};
const MapView: React.FC = () => {
    const graphData = useGraphData();
    const [points, setPoints] = useState<LatLngExpression[]>([]);
    const mapCenter: LatLngExpression = [46.8336597, -71.2608125];


    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            />
            {/* <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          /> */}
            <Markers graphData={graphData}/>
            <SearchControl />
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


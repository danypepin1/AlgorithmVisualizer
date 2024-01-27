import { CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import React, { useState } from 'react';
import { Graph } from '@/types/Graph';

interface MarkersProps {
  graphData: Graph | null;
}


export const Markers: React.FC<MarkersProps> = ({graphData}) => {
  const [points, setPoints] = useState<LatLngExpression[]>([]);
  const map = useMap();

  useMapEvents({
    click: (e) => {
      if (graphData && graphData.nodes.length > 0) {
        const nearestNode = graphData.nodes.reduce((prev, curr) =>
          map.distance(e.latlng, curr.position) < map.distance(e.latlng, prev.position) ? curr : prev
        );
  
        setPoints((prevPoints) => {
          if (prevPoints.length === 2) {

            return [prevPoints[1], nearestNode.position];
          } else {

            return [...prevPoints, nearestNode.position];
          }
        });
      }
    },
  });

  return (
    <>
      {points.map((position, idx) => (
        <CircleMarker key={idx} center={position} radius={5} />
      ))}
    </>
  );
};
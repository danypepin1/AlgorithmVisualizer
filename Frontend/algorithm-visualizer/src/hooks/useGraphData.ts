import { Graph } from '@/types/Graph';
import { useEffect, useState } from 'react';


export const useGraphData = () => {
    const [graphData, setGraphData] = useState<Graph | null>(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/graph/Charlesbourg')
            .then(response => response.json())
            .then(data => setGraphData(data))
            .catch(error => console.error('Error fetching graph data:', error));
    }, []);

    return graphData;
};
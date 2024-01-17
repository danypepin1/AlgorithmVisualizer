export interface Node {
    id: number;
    position: [number, number];
  }
  
  export interface Edge {
    from: number;
    to: number;
  }
  
  export interface Graph {
    edges: Edge[];
    nodes: Node[];
  }
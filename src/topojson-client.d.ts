declare module 'topojson-client' {
  export function feature(topology: Topology, object: GeometryCollection): GeoJSON.FeatureCollection;
  interface Topology {
    type: 'Topology';
    objects: Record<string, GeometryCollection>;
  }
  interface GeometryCollection {
    type: 'GeometryCollection';
    geometries: unknown[];
  }
}

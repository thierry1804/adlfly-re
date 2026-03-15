declare module 'd3-geo' {
  export interface GeoProjection {
    center(coordinates?: [number, number]): this;
    scale(scale?: number): this;
    translate(point?: [number, number]): this;
    (coordinates: [number, number]): [number, number];
  }
  export interface GeoPath {
    projection(projection: GeoProjection | null): this;
    (object: object): string | null;
    centroid(object: object): [number, number];
  }
  export function geoMercator(): GeoProjection;
  export function geoPath(projection?: GeoProjection | null): GeoPath;
}

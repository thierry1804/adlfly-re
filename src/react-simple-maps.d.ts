declare module 'react-simple-maps' {
  import type { ComponentType } from 'react';
  export const ComposableMap: ComponentType<{
    projection?: string;
    projectionConfig?: { center?: [number, number]; scale?: number };
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }>;
  export const Geographies: ComponentType<{
    geography: string | object;
    children: (props: { geographies: unknown[] }) => React.ReactNode;
  }>;
  export const Geography: ComponentType<{
    geography: unknown;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: Record<string, React.CSSProperties>;
    onClick?: () => void;
  }>;
  export const ZoomableGroup: ComponentType<{
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onMove?: (props: { coordinates: [number, number]; zoom: number }) => void;
    onMoveEnd?: (props: { coordinates: [number, number]; zoom: number }) => void;
    children?: React.ReactNode;
  }>;
}

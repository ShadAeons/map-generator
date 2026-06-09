import type { Vector } from './Vector';

export interface GeometryData {
    sites: Vector[];
    polygons: Vector[][];
    neighbours: number[][];
}

export interface World {
    geometry: GeometryData;
}

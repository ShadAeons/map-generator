export interface Vector {
    x: number;
    y: number;
}

export interface Colour {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export interface MapBounds {
    width: number;
    height: number;
}

export interface WorldRenderData {
    bounds: MapBounds;
    sites: Vector[];
    polygons: Vector[][];
    heightmap: number[];
}

export interface WorldBuildParams {
    bounds: MapBounds;
    seed: number;
    nCells: number;
    falloffStrength: number;
    warpStrength: number;
}

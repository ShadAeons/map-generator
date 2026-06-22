import type { Colour, WorldBuildParams } from './types';
import { generateNewSeed, normaliseColour } from './utils';

export const UINT32_MAX = Math.pow(2, 32) - 1;

export const MIN_SIDEBAR_WIDTH = 250;
export const MAX_SIDEBAR_WIDTH = 600;
export const DEFAULT_SIDEBAR_WIDTH = 250;

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 40;
export const ZOOM_FACTOR = 1.12;
export const CANVAS_PADDING = 40;

export const DEFAULT_WORLD_BUILD_PARAMS: WorldBuildParams = {
    bounds: { width: 500, height: 500 },
    nCells: 10_000,
    falloffStrength: 1 / 4,
    warpStrength: 1.5,
    seed: generateNewSeed(),
};

export const DEFAULT_ELEVATION_STYLES: {
    threshold: number;
    colour: Colour;
}[] = [
    { threshold: 0.3, colour: normaliseColour({ r: 42, g: 107, b: 156 }) },
    { threshold: 0.4, colour: normaliseColour({ r: 58, g: 143, b: 191 }) },
    { threshold: 0.45, colour: normaliseColour({ r: 194, g: 162, b: 88 }) },
    { threshold: 0.6, colour: normaliseColour({ r: 90, g: 143, b: 60 }) },
    { threshold: 0.75, colour: normaliseColour({ r: 61, g: 107, b: 40 }) },
    { threshold: 0.9, colour: normaliseColour({ r: 122, g: 106, b: 90 }) },
    { threshold: 1.0, colour: normaliseColour({ r: 232, g: 232, b: 232 }) },
];

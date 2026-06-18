import type { WorldBuildParams } from './types';
import { generateNewSeed } from './utils';

export const UINT32_MAX = Math.pow(2, 32) - 1;

export const ZOOM_FACTOR = 1.12;
export const CANVAS_PADDING = 40;

export const DEFAULT_WORLD_BUILD_PARAMS: WorldBuildParams = {
    bounds: { width: 500, height: 500 },
    nCells: 10_000,
    falloffStrength: 1 / 4,
    warpStrength: 1.5,
    seed: generateNewSeed(),
};

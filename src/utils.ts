import { UINT32_MAX } from './constants';
import type { Colour } from './types';

export function generateNewSeed() {
    return Math.floor(Math.random() * UINT32_MAX);
}

export function normaliseColour(colour: Colour): Colour {
    return { r: colour.r / 255, g: colour.g / 255, b: colour.b / 255 };
}

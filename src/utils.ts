import { UINT32_MAX } from './constants';

export function generateNewSeed() {
    return Math.floor(Math.random() * UINT32_MAX);
}

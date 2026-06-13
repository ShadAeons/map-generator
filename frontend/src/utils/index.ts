const UINT32_MAX = Math.pow(2, 32) - 1;

export function generateNewSeed() {
    return Math.floor(Math.random() * UINT32_MAX);
}

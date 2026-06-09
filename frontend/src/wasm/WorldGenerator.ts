import type { World } from '../types/World';

const UINT32_MAX = Math.pow(2, 32) - 1;

export default class WorldGenerator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private module: any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(m: any) {
        this.module = m;
    }

    public generate(width: number, height: number): World {
        const seed = Math.floor(Math.random() * UINT32_MAX);
        const bounds = { width, height };

        const geometry = this.module.generateGeometry(bounds, seed, 100);

        return { geometry };
    }
}

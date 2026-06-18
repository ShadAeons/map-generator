import type { WorldRenderData, WorldBuildParams } from '../types';
import type { WorldModule } from './WorldModule';

export class WorldGenerator {
    private module: WorldModule;

    constructor(m: WorldModule) {
        this.module = m;
    }

    public generate(params: WorldBuildParams): WorldRenderData {
        const world = new this.module.World(params);
        const data = world.getRenderData();
        world.delete();

        return data;
    }
}

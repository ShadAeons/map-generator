import type { WorldRenderData, WorldBuildParams } from '../types/World.js';
import createWorldModule from './newworld.js';

export interface WorldInstance {
    getRenderData(): WorldRenderData;
    delete(): void;
}

export interface WorldModule extends EmscriptenModule {
    World: {
        new (params: WorldBuildParams): WorldInstance;
    };
}

let modulePromise: Promise<WorldModule> | null = null;

export function loadWorldModule() {
    if (!modulePromise) {
        modulePromise = createWorldModule() as Promise<WorldModule>;
    }

    return modulePromise;
}

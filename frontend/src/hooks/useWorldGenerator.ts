import { useMemo } from 'react';
import { useWorldModule } from './useWorldModule';
import WorldGenerator from '../wasm/WorldGenerator';

export function useWorldGenerator() {
    const module = useWorldModule();

    return useMemo(() => {
        if (!module) return null;

        return new WorldGenerator(module);
    }, [module]);
}

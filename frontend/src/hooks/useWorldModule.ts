import { useEffect, useState } from 'react';
import { getWorldModule } from '../wasm/WorldModule';

export function useWorldModule() {
    const [module, setModule] = useState();

    useEffect(() => {
        getWorldModule().then(setModule);
    }, []);

    return module;
}

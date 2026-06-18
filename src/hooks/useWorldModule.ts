import { useEffect, useState } from 'react';
import { loadWorldModule } from '../wasm/WorldModule';

interface WorldModuleState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: any | null;
    loading: boolean;
    error: Error | null;
}

export function useWorldModule() {
    const [state, setState] = useState<WorldModuleState>({
        module: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        loadWorldModule()
            .then((module) => setState({ module, loading: false, error: null }))
            .catch((error) =>
                setState({ module: null, loading: false, error })
            );
    }, []);

    return state;
}

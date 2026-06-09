import createWorldModule from './newworld.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let modulePromise: Promise<any> | null = null;

export function getWorldModule() {
    if (!modulePromise) {
        modulePromise = createWorldModule();
    }

    return modulePromise;
}

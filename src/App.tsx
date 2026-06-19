import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    faArrowPointer,
    faFloppyDisk,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';

// Components
import { Canvas, Statusbar, Toolbar, Topbar } from './layouts/main';
import {
    GeneratorInspector,
    SaveInspector,
    SelectInspector,
} from './components/inspectors';

// Hooks
import { useWorldGenerator } from './hooks';

// Types
import type { Vector, WorldBuildParams, WorldRenderData } from './types';
import { DEFAULT_WORLD_BUILD_PARAMS } from './constants';
import MainLayout from './layouts/main/MainLayout';

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [pos, setPos] = useState<Vector>({ x: 0, y: 0 });
    const [toolIdx, setToolIdx] = useState<number>(0);

    const [generatedParams, setGeneratedParams] = useState<WorldBuildParams>(
        DEFAULT_WORLD_BUILD_PARAMS
    );
    const [renderData, setRenderData] = useState<WorldRenderData | null>(null);

    const { generator, loading, error } = useWorldGenerator();

    const handleGenerate = useCallback(
        (params: WorldBuildParams) => {
            if (!generator) return;
            setRenderData(generator.generate(params));
            setGeneratedParams(params);
        },
        [generator]
    );

    useEffect(() => {
        if (!generator) return;
        setRenderData(generator.generate(DEFAULT_WORLD_BUILD_PARAMS));
    }, [generator]);

    const tools = useMemo(
        () => [
            {
                label: 'Select',
                icon: faArrowPointer,
                inspector: <SelectInspector />,
            },
            {
                label: 'Generator',
                icon: faPlus,
                inspector: (
                    <GeneratorInspector
                        defaultBuildParams={DEFAULT_WORLD_BUILD_PARAMS}
                        onGenerate={handleGenerate}
                    />
                ),
            },
            {
                label: 'Save',
                icon: faFloppyDisk,
                inspector: <SaveInspector />,
            },
        ],
        [handleGenerate]
    );

    return (
        <>
            {loading && <div>Loading</div>}
            {error && <div>Error: ${error.message}</div>}

            <MainLayout
                toolbar={
                    <Toolbar
                        tools={tools}
                        currentTool={toolIdx}
                        onToolChange={(i) => setToolIdx(i)}
                    />
                }
                inspector={tools[toolIdx].inspector}
                topbar={<Topbar />}
                statusbar={
                    <Statusbar
                        seed={generatedParams.seed}
                        cells={generatedParams.nCells}
                        pos={pos}
                    />
                }
                canvas={
                    <Canvas
                        canvasRef={canvasRef}
                        renderData={renderData}
                        onHover={(p) => setPos(p)}
                    />
                }
            />
        </>
    );
}

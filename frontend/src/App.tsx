import { useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import InputBox from './components/InputBox';
import Button from './components/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

import { useWorldGenerator } from './hooks/useWorldGenerator';
import {
    type WorldRenderData,
    type MapBounds,
    type WorldBuildParams,
} from './types/World';
import { generateNewSeed } from './utils';
import useMapRenderer from './hooks/useMapRenderer';

export default function App() {
    const { generator, loading, error } = useWorldGenerator();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [rightSidebarWidth, setRightSidebarWidth] = useState<number>(250);

    const [bounds, setBounds] = useState<MapBounds>({
        width: 500,
        height: 500,
    });
    const [nCells, setNCells] = useState<number>(10000);
    const [falloffDivisor, setFalloffDivisor] = useState<number>(3);
    const [warpStrength, setWarpStrength] = useState<number>(1.5);
    const [seed, setSeed] = useState<number>(generateNewSeed());

    const [renderData, setRenderData] = useState<WorldRenderData | null>(null);
    useMapRenderer(canvasRef, renderData);

    const handleGenerate = () => {
        if (!canvasRef.current || !generator) return;

        const params: WorldBuildParams = {
            bounds: bounds,
            nCells,
            seed,
            falloffStrength: 1 / (falloffDivisor + 1),
            warpStrength,
        };

        const world = generator.generate(params);
        setRenderData(world);
    };

    return (
        <>
            {loading && <div>Loading...</div>}
            {error && <div>Error: ${error.message}</div>}

            <div
                className="grid grid-rows-[auto_1fr_auto] w-screen h-screen font-inter"
                style={{
                    gridTemplateColumns: `auto 1fr ${rightSidebarWidth}px`,
                }}
            >
                <div className="col-span-3 bg-navy-mid border-border border-b">
                    <h3>Filename</h3>
                </div>

                <Toolbar></Toolbar>

                <Canvas
                    canvasRef={canvasRef}
                    className="w-full h-full min-h-0"
                />

                <Sidebar
                    className="col-start-3"
                    mode="right"
                    onResize={(w) => setRightSidebarWidth(w)}
                >
                    <div className="items-center gap-2 grid grid-cols-[auto_1fr] min-w-0 text-sm">
                        <label>Map Size</label>

                        <div className="flex justify-self-end items-center gap-2 w-full min-w-0">
                            <div className="flex-1">
                                <InputBox
                                    type="number"
                                    className="w-full min-w-0"
                                    value={bounds.width}
                                    onChange={(e) =>
                                        setBounds((b) => ({
                                            width: e.target.valueAsNumber,
                                            height: b.height,
                                        }))
                                    }
                                />
                            </div>
                            <span className="shrink-0">x</span>
                            <div className="flex-1">
                                <InputBox
                                    type="number"
                                    className="w-full min-w-0"
                                    value={bounds.height}
                                    onChange={(e) =>
                                        setBounds((b) => ({
                                            width: b.width,
                                            height: e.target.valueAsNumber,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <label>Cells</label>

                        <div className="justify-self-end w-full min-w-0">
                            <InputBox
                                type="number"
                                className="w-full"
                                value={nCells}
                                onChange={(e) =>
                                    setNCells(e.target.valueAsNumber)
                                }
                            />
                        </div>

                        <label>Falloff Strength</label>

                        <div className="justify-self-end w-full">
                            <InputBox
                                type="number"
                                className="w-full"
                                min={0}
                                value={falloffDivisor}
                                onChange={(e) =>
                                    setFalloffDivisor(e.target.valueAsNumber)
                                }
                            />
                        </div>

                        <label>Warp Strength</label>

                        <div className="justify-self-end w-full">
                            <InputBox
                                type="number"
                                className="w-full"
                                value={warpStrength}
                                onChange={(e) =>
                                    setWarpStrength(e.target.valueAsNumber)
                                }
                            />
                        </div>

                        <label>Seed</label>

                        <div className="flex justify-self-end gap-2 w-full">
                            <InputBox
                                type="number"
                                className="w-full"
                                value={seed}
                                onChange={(e) =>
                                    setSeed(e.target.valueAsNumber)
                                }
                            />
                            <Button onClick={() => setSeed(generateNewSeed())}>
                                <FontAwesomeIcon icon={faArrowsRotate} />
                            </Button>
                        </div>

                        <Button className="col-span-2" onClick={handleGenerate}>
                            Generate
                        </Button>
                    </div>
                </Sidebar>

                <div className="col-span-3 bg-navy-mid border-border border-t h-6"></div>
            </div>
        </>
    );
}

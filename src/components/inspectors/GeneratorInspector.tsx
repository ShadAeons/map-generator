import { useState } from 'react';
import type { WorldBuildParams } from '../../types/World';
import { generateNewSeed } from '../../utils';
import NumberInput from '../NumberInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { GridLayout, GridRow } from '../../layouts/GridLayout';

interface GeneratorInspectorProps {
    defaultBuildParams: WorldBuildParams;
    onGenerate: (params: WorldBuildParams) => void;
}

function parseNumber(e: React.ChangeEvent<HTMLInputElement>, fallback: number) {
    const value = e.target.valueAsNumber;
    return isNaN(value) ? fallback : value;
    // return e.target.valueAsNumber;
}

export default function GeneratorInspector({
    defaultBuildParams,
    onGenerate,
}: GeneratorInspectorProps) {
    const [buildParams, setBuildParams] =
        useState<WorldBuildParams>(defaultBuildParams);

    return (
        <GridLayout className="text-sm">
            <GridRow label="Map size">
                <div className="flex items-center gap-2 w-full">
                    <NumberInput
                        className="flex-1 min-w-0"
                        min={100}
                        value={buildParams.bounds.width}
                        onChange={(e) =>
                            setBuildParams((p) => ({
                                ...p,
                                bounds: {
                                    width: parseNumber(e, 100),
                                    height: p.bounds.height,
                                },
                            }))
                        }
                    />
                    <span>x</span>
                    <NumberInput
                        className="flex-1 min-w-0"
                        min={100}
                        value={buildParams.bounds.height}
                        onChange={(e) =>
                            setBuildParams((p) => ({
                                ...p,
                                bounds: {
                                    width: p.bounds.width,
                                    height: parseNumber(e, 100),
                                },
                            }))
                        }
                    />
                </div>
            </GridRow>

            <GridRow label="Cells">
                <NumberInput
                    className="w-full"
                    min={1}
                    value={buildParams.nCells}
                    onChange={(e) =>
                        setBuildParams((p) => ({
                            ...p,
                            nCells: parseNumber(e, 1),
                        }))
                    }
                />
            </GridRow>

            <GridRow label="Falloff">
                <NumberInput
                    className="w-full"
                    min={0}
                    max={1}
                    step={0.01}
                    value={buildParams.falloffStrength}
                    onChange={(e) =>
                        setBuildParams((p) => ({
                            ...p,
                            falloffStrength: e.target.valueAsNumber,
                        }))
                    }
                />
            </GridRow>

            <GridRow label="Warp Strength">
                <NumberInput
                    className="w-full"
                    min={0}
                    step={0.01}
                    value={buildParams.warpStrength}
                    onChange={(e) =>
                        setBuildParams((p) => ({
                            ...p,
                            warpStrength: parseNumber(e, 0),
                        }))
                    }
                />
            </GridRow>

            <GridRow label="Seed">
                <div className="flex items-center gap-2 w-full">
                    <NumberInput
                        className="flex-1 min-w-0"
                        min={0}
                        value={buildParams.seed}
                        onChange={(e) =>
                            setBuildParams((p) => ({
                                ...p,
                                seed: parseNumber(e, generateNewSeed()),
                            }))
                        }
                    />
                    <Button
                        className="text-xs"
                        onClick={() =>
                            setBuildParams((p) => ({
                                ...p,
                                seed: generateNewSeed(),
                            }))
                        }
                    >
                        <FontAwesomeIcon icon={faArrowsRotate} />
                    </Button>
                </div>
            </GridRow>

            <Button
                className="col-span-2"
                onClick={() => onGenerate(buildParams)}
            >
                Generate
            </Button>
        </GridLayout>
    );
}

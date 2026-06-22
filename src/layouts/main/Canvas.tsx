import { useEffect } from 'react';
import { useCanvasControls, useMapRenderer } from '../../hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowsToEye,
    faMinus,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';

import type { Vector, WorldRenderData } from '../../types';
import { CANVAS_PADDING, ZOOM_FACTOR } from '../../constants';

interface CanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    renderData: WorldRenderData | null;
    onMapHover?: (pos: Vector) => void;
    onMapClick?: (pos: Vector) => void;
}

export function Canvas({
    canvasRef,
    renderData,
    onMapHover: onHover,
}: CanvasProps) {
    const { rendererRef, cameraRef } = useMapRenderer(canvasRef);
    useCanvasControls(canvasRef, rendererRef, cameraRef);

    const getContext = () =>
        canvasRef.current && rendererRef.current && cameraRef.current
            ? {
                  canvas: canvasRef.current,
                  renderer: rendererRef.current,
                  camera: cameraRef.current,
              }
            : null;

    useEffect(() => {
        const ctx = getContext();
        if (!ctx || !renderData) return;
        const { canvas, renderer, camera } = ctx;

        renderer.buildMap(renderData);
        camera.fit(
            renderData.bounds,
            canvas.clientWidth,
            canvas.clientHeight,
            CANVAS_PADDING
        );
        renderer.render();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderData]);

    const resetView = () => {
        const ctx = getContext();
        if (!ctx || !renderData) return;
        const { canvas, renderer, camera } = ctx;

        camera.fit(
            renderData.bounds,
            canvas.clientWidth,
            canvas.clientHeight,
            CANVAS_PADDING
        );
        renderer.render();
    };

    const handleZoom = (factor: number) => {
        if (!canvasRef.current || !rendererRef.current || !cameraRef.current)
            return;
        const canvas = canvasRef.current;
        const renderer = rendererRef.current;
        const camera = cameraRef.current;

        camera.zoomTo(factor, {
            x: canvas.clientWidth / 2,
            y: canvas.clientHeight / 2,
        });
        renderer.render();
    };

    const handleHover = (e: React.PointerEvent) => {
        if (!canvasRef.current || !cameraRef.current) return;
        const camera = cameraRef.current;

        const rect = canvasRef.current.getBoundingClientRect();
        onHover?.(
            camera.toWorldPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            })
        );
    };

    return (
        <div className="relative w-full h-full">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                onContextMenu={(e) => e.preventDefault()}
                onPointerMove={handleHover}
            ></canvas>

            <div className="right-4 bottom-4 absolute flex flex-col bg-neutral-darker border border-border rounded-md overflow-hidden">
                <button
                    className="hover:bg-neutral-dark size-8"
                    onClick={resetView}
                >
                    <FontAwesomeIcon icon={faArrowsToEye} />
                </button>
                <button
                    className="hover:bg-neutral-dark size-8"
                    onClick={() => handleZoom(ZOOM_FACTOR)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                <button
                    className="hover:bg-neutral-dark size-8"
                    onClick={() => handleZoom(1 / ZOOM_FACTOR)}
                >
                    <FontAwesomeIcon icon={faMinus} />
                </button>
            </div>
        </div>
    );
}

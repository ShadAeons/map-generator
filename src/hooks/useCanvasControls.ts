import { useEffect } from 'react';
import type Camera from '../renderer/Camera';
import type MapRenderer from '../renderer/MapRenderer';
import type { Vector } from '../types/Vector';

const ZOOM_FACTOR = 1.12;

export default function useCanvasControls(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    rendererRef: React.RefObject<MapRenderer | null>,
    cameraRef: React.RefObject<Camera | null>
) {
    useEffect(() => {
        if (!canvasRef.current || !rendererRef.current || !cameraRef.current)
            return;
        const canvas = canvasRef.current;
        const renderer = rendererRef.current;
        const camera = cameraRef.current;

        let dragging = false;
        let lastMousePos: Vector | null = null;
        let rendering = false;

        // Only renders when possible
        const requestRender = () => {
            if (rendering) return;

            rendering = true;

            requestAnimationFrame(() => {
                rendering = false;
                renderer.render();
            });
        };

        const startDragging = (e: PointerEvent) => {
            if (!(e.button === 1 || e.button === 2)) return;

            e.preventDefault();

            dragging = true;
            lastMousePos = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
        };

        const stopDragging = () => {
            dragging = false;
            lastMousePos = null;
            canvas.style.cursor = '';
        };

        const drag = (e: PointerEvent) => {
            if (!dragging || !lastMousePos) return;
            const dx = (e.clientX - lastMousePos.x) / camera.zoom;
            const dy = (e.clientY - lastMousePos.y) / camera.zoom;

            lastMousePos = { x: e.clientX, y: e.clientY };

            camera.pan({ x: dx, y: dy });
            requestRender();
        };

        // Zoom feature
        const zoom = (e: WheelEvent) => {
            e.preventDefault();

            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const factor = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;

            camera.zoomTo(factor, { x: mx, y: my });
            requestRender();
        };

        canvas.addEventListener('pointerdown', startDragging);
        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('blur', stopDragging);
        window.addEventListener('pointermove', drag);
        canvas.addEventListener('wheel', zoom);

        return () => {
            canvas.removeEventListener('pointerdown', startDragging);
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('blur', stopDragging);
            window.removeEventListener('pointermove', drag);
            canvas.removeEventListener('wheel', zoom);
        };
    }, [canvasRef, rendererRef, cameraRef]);
}

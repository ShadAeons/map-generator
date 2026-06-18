import { useEffect, useRef } from 'react';
import MapRenderer from '../renderer/MapRenderer';
import Camera from '../renderer/Camera';

export default function useMapRenderer(
    canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
    const rendererRef = useRef<MapRenderer>(null);
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        cameraRef.current = new Camera();
        rendererRef.current = new MapRenderer(
            canvasRef.current,
            cameraRef.current
        );
        return () => rendererRef.current?.destroy();
    }, [canvasRef]);

    return { rendererRef, cameraRef };
}

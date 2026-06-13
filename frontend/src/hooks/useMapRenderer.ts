import { useCallback, useEffect } from 'react';
import type { WorldRenderData } from '../types/World';
import TerrainLayer from '../renderer/layers/TerrainLayer';

const PADDING = 20;

export default function useMapRenderer(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    renderData: WorldRenderData | null
) {
    const draw = useCallback(() => {
        if (!canvasRef.current || !renderData) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const terrainLayer = new TerrainLayer();

        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        const scaleX = (width - PADDING * 2) / renderData.bounds.width;
        const scaleY = (height - PADDING * 2) / renderData.bounds.height;
        const scale = Math.min(scaleX, scaleY);

        const offsetX = (width - renderData.bounds.width * scale) / 2;
        const offsetY = (height - renderData.bounds.height * scale) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        // draw terrain
        terrainLayer.render(ctx, renderData);

        ctx.restore();
    }, [canvasRef, renderData]);

    useEffect(draw, [draw]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const obs = new ResizeObserver(() => draw());
        obs.observe(canvas);
        return () => obs.disconnect();
    }, [canvasRef, draw]);
}

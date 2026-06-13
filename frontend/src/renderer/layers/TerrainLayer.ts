import type { WorldRenderData } from '../../types/World';
import type { Layer } from './Layer';

export default class TerrainLayer implements Layer {
    private static readonly ELEVATION_STYLES = [
        { threshold: 0.3, color: '#2a6b9c' },
        { threshold: 0.4, color: '#3a8fbf' },
        { threshold: 0.45, color: '#c2a258' },
        { threshold: 0.6, color: '#5a8f3c' },
        { threshold: 0.75, color: '#3d6b28' },
        { threshold: 0.9, color: '#7a6a5a' },
        { threshold: 1.0, color: '#e8e8e8' },
    ];

    public render(ctx: CanvasRenderingContext2D, world: WorldRenderData) {
        const buckets = new Map<string, number[]>();

        for (const { color } of TerrainLayer.ELEVATION_STYLES) {
            buckets.set(color, []);
        }

        for (let i = 0; i < world.sites.length; i++) {
            const elevation = world.heightmap[i];
            const color =
                TerrainLayer.ELEVATION_STYLES.find(
                    (s) => elevation < s.threshold
                )?.color ??
                TerrainLayer.ELEVATION_STYLES[
                    TerrainLayer.ELEVATION_STYLES.length - 1
                ].color;

            buckets.get(color)!.push(i);
        }

        ctx.lineWidth = 1.5;
        for (const [color, indices] of buckets) {
            if (indices.length === 0) continue;

            ctx.fillStyle = color;
            ctx.strokeStyle = color;

            ctx.beginPath();
            for (const i of indices) {
                const polygon = world.polygons[i];
                ctx.moveTo(polygon[0].x, polygon[0].y);

                for (let j = 1; j < polygon.length; j++) {
                    ctx.lineTo(polygon[j].x, polygon[j].y);
                }
                ctx.closePath();
            }

            ctx.fill();
            ctx.stroke();
        }
    }
}

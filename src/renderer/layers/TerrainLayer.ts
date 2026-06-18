import type { WorldRenderData } from '../../types/World';
import type { Layer } from './Layer';

const ELEVATION_STYLES: {
    threshold: number;
    colour: [number, number, number];
}[] = [
    { threshold: 0.3, colour: [42, 107, 156] },
    { threshold: 0.4, colour: [58, 143, 191] },
    { threshold: 0.45, colour: [194, 162, 88] },
    { threshold: 0.6, colour: [90, 143, 60] },
    { threshold: 0.75, colour: [61, 107, 40] },
    { threshold: 0.9, colour: [122, 106, 90] },
    { threshold: 1.0, colour: [232, 232, 232] },
];

export default class TerrainLayer implements Layer {
    private _cache: Map<string, Path2D> = new Map();

    public init(data: WorldRenderData) {
        // this._cache.clear();

        // for (const { color } of TerrainLayer.ELEVATION_STYLES) {
        //     this._cache.set(color, new Path2D());
        // }

        // // Sort cells into the right path
        // for (let i = 0; i < renderData.sites.length; i++) {
        //     const elevation = renderData.heightmap[i];
        //     const color =
        //         TerrainLayer.ELEVATION_STYLES.find(
        //             (s) => elevation < s.threshold
        //         )?.color ??
        //         TerrainLayer.ELEVATION_STYLES[
        //             TerrainLayer.ELEVATION_STYLES.length - 1
        //         ].color;

        //     const path = this._cache.get(color)!;
        //     const polygon = renderData.polygons[i];
        //     path.moveTo(polygon[0].x, polygon[0].y);
        //     for (let j = 1; j < polygon.length; j++) {
        //         path.lineTo(polygon[j].x, polygon[j].y);
        //     }
        //     path.closePath();
        // }
        const positions: number[] = [];
        const colours: number[] = [];

        for (let i = 0; i < data.sites.length; ++i) {
            const site = data.sites[i];
            const polygon = data.polygons[i];
            const elevation = data.heightmap[i];

            const [r, g, b] =
                ELEVATION_STYLES.find((s) => elevation < s.threshold)?.colour ??
                ELEVATION_STYLES[ELEVATION_STYLES.length - 1].colour;

            for (let j = 0; j < polygon.length; ++j) {
                const curr = polygon[j];
                const next = polygon[(j + 1) % polygon.length];
                positions.push(site.x, site.y, curr.x, curr.y, next.x, next.y);
                colours.push(r, g, b, r, g, b, r, g, b);
            }
        }

        // this._positionBuf({ data: new Float32Array(positions) });
        // this._colourBuf({ data: new Float32Array(colours) });
        // this._vertexNumber = positions.length / 2;

        // this.render();
    }

    public render(ctx: CanvasRenderingContext2D) {
        for (const [color, path] of this._cache) {
            ctx.fillStyle = color;
            ctx.fill(path);
        }
    }
}

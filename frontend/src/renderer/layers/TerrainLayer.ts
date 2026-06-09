import type { World } from '../../types/World';
import type { CanvasRenderer } from '../CanvasRenderer';
import type { Layer } from './Layer';

export default class TerrainLayer implements Layer {
    public render(renderer: CanvasRenderer, world: World) {
        for (let i = 0; i < world.geometry.sites.length; ++i) {
            const site = world.geometry.sites[i];
            renderer.drawPoint(site, 2, '#ffffff');
        }

        for (let i = 0; i < world.geometry.polygons.length; ++i) {
            const polygon = world.geometry.polygons[i];
            renderer.drawPolygon(polygon, '#fffffff');
        }
    }
}

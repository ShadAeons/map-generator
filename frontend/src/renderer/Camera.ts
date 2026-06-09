import type { Vector } from '../types/Vector';

export default class Camera {
    public pos: Vector = { x: 0, y: 0 };

    public zoom: number = 1;

    public worldToScreen(point: Vector): Vector {
        return {
            x: (point.x - this.pos.x) * this.zoom,
            y: (point.y - this.pos.y) * this.zoom,
        };
    }

    public screenToWorld(point: Vector): Vector {
        return {
            x: point.x / this.zoom + this.pos.x,
            y: point.y / this.zoom + this.pos.y,
        };
    }
}

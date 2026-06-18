import type { Vector } from '../types/Vector';
import type { MapBounds } from '../types/World';

export default class Camera {
    private _position: Vector = { x: 0, y: 0 };
    private _zoom: number = 1;

    get position(): Vector {
        return { ...this._position };
    }

    get zoom(): number {
        return this._zoom;
    }

    public pan(d: Vector) {
        this._position.x += d.x;
        this._position.y += d.y;
    }

    public zoomTo(factor: number, c: Vector) {
        const worldX = c.x / this._zoom - this._position.x;
        const worldY = c.y / this._zoom - this._position.y;

        const zoom = Math.max(0.1, Math.min(this._zoom * factor, 40));

        this._position = {
            x: c.x / zoom - worldX,
            y: c.y / zoom - worldY,
        };
        this._zoom = zoom;
    }

    public fit(
        bounds: MapBounds,
        canvasWidth: number,
        canvasHeight: number,
        padding?: number
    ) {
        let paddedWidth = canvasWidth;
        let paddedHeight = canvasHeight;

        if (padding) {
            paddedWidth -= 2 * padding;
            paddedHeight -= 2 * padding;
        }

        this._zoom = Math.min(
            paddedWidth / bounds.width,
            paddedHeight / bounds.height
        );

        const width = bounds.width * this._zoom;
        const height = bounds.height * this._zoom;

        this._position = {
            x: (canvasWidth / 2 - width / 2) / this._zoom,
            y: (canvasHeight / 2 - height / 2) / this._zoom,
        };
    }
}

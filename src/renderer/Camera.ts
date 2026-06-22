import { MAX_ZOOM, MIN_ZOOM } from '../constants';
import type { MapBounds, Vector } from '../types';

export default class Camera {
    private _position: Vector = { x: 0, y: 0 };
    private _zoom: number = 1;

    get position(): Vector {
        return { ...this._position };
    }

    get zoom(): number {
        return this._zoom;
    }

    public toWorldPosition(screenPos: Vector): Vector {
        return {
            x: screenPos.x / this._zoom - this._position.x,
            y: screenPos.y / this._zoom - this._position.y,
        };
    }

    public pan(d: Vector) {
        this._position.x += d.x;
        this._position.y += d.y;
    }

    public zoomTo(factor: number, c: Vector) {
        this._position = this.toWorldPosition(c);
        this._zoom = Math.max(
            MIN_ZOOM,
            Math.min(this._zoom * factor, MAX_ZOOM)
        );
        this._position = this.toWorldPosition(c);
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

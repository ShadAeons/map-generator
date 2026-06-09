import type { Vector } from '../types/Vector';
import type { World } from '../types/World';
import Camera from './Camera';
import TerrainLayer from './layers/TerrainLayer';

export class CanvasRenderer {
    private canvas: HTMLCanvasElement;
    public readonly ctx: CanvasRenderingContext2D;
    public readonly camera: Camera;

    private terrainLayer: TerrainLayer;

    private dragging: boolean = false;
    private mouseLastPos: Vector = { x: 0, y: 0 };

    private lastWorld: World | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get 2D context');

        this.ctx = ctx;
        this.camera = new Camera();

        this.terrainLayer = new TerrainLayer();

        this.resize(window.innerWidth, window.innerHeight);
        this.bindEvents();
    }

    public render(world: World) {
        this.fill('#1a3d5c');
        this.lastWorld = world;
        this.terrainLayer.render(this, world);
    }

    public drawPolyLine(from: Vector, to: Vector[], style: string) {
        let pt = this.camera.worldToScreen(from);

        this.ctx.beginPath();
        this.ctx.strokeStyle = style;
        this.ctx.moveTo(pt.x, pt.y);
        for (const p of to) {
            pt = this.camera.worldToScreen(p);
            this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.stroke();
    }

    public drawPolygon(points: Vector[], style: string) {
        if (points.length <= 0) return;

        this.ctx.beginPath();
        this.ctx.strokeStyle = style;

        let pt = this.camera.worldToScreen(points[0]);
        this.ctx.moveTo(pt.x, pt.y);

        for (let i = 1; i < points.length; ++i) {
            pt = this.camera.worldToScreen(points[i]);
            this.ctx.lineTo(pt.x, pt.y);
        }

        this.ctx.closePath();
        this.ctx.stroke();
    }

    public drawPoint(p: Vector, size: number, style: string) {
        const pt = this.camera.worldToScreen(p);

        this.ctx.beginPath();
        this.ctx.fillStyle = style;
        this.ctx.arc(pt.x, pt.y, size * this.camera.zoom, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    public fill(style: string) {
        this.ctx.fillStyle = style;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public resize(width: number, height: number) {
        const dpr = window.devicePixelRatio;

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    private bindEvents() {
        this.canvas.addEventListener('mousedown', this.onMousedownEvent);
        window.addEventListener('mouseup', this.onMouseupEvent);
        this.canvas.addEventListener('mousemove', this.onMousemoveEvent);
        this.canvas.addEventListener('wheel', this.onWheelEvent);
        window.addEventListener('resize', this.onResize);
    }

    private getMousePos(e: MouseEvent): Vector {
        const rect = this.canvas.getBoundingClientRect();

        return {
            x: e.clientX - rect.x,
            y: e.clientY - rect.y,
        };
    }

    private onMousedownEvent = (e: MouseEvent) => {
        this.dragging = true;
        this.mouseLastPos = this.getMousePos(e);
    };

    private onMouseupEvent = () => {
        this.dragging = false;
    };

    private onMousemoveEvent = (e: MouseEvent) => {
        if (!this.dragging) return;

        const currentPos = this.getMousePos(e);

        const before = this.camera.screenToWorld(this.mouseLastPos);
        const after = this.camera.screenToWorld(currentPos);

        this.mouseLastPos = currentPos;

        this.camera.pos.x += before.x - after.x;
        this.camera.pos.y += before.y - after.y;

        if (this.lastWorld) this.render(this.lastWorld);
    };

    private onWheelEvent = (e: WheelEvent) => {
        e.preventDefault();

        const rect = this.canvas.getBoundingClientRect();

        const mouse = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        const before = this.camera.screenToWorld(mouse);

        if (e.deltaY < 0) this.camera.zoom *= 1.1;
        else if (e.deltaY > 1) this.camera.zoom /= 1.1;

        const after = this.camera.screenToWorld(mouse);

        this.camera.pos.x += before.x - after.x;
        this.camera.pos.y += before.y - after.y;

        if (this.lastWorld) this.render(this.lastWorld);
    };

    private onResize = () => {
        this.resize(window.innerWidth, window.innerHeight);
        if (this.lastWorld) this.render(this.lastWorld);
    };

    public destroy() {
        this.canvas.removeEventListener('mousedown', this.onMousedownEvent);
        window.removeEventListener('mouseup', this.onMouseupEvent);
        this.canvas.removeEventListener('mousemove', this.onMousemoveEvent);
        this.canvas.removeEventListener('wheel', this.onWheelEvent);
        window.removeEventListener('resize', this.onResize);
    }
}

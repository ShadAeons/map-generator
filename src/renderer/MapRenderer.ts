import REGL, { type Buffer, type DrawCommand, type Regl } from 'regl';
import type { WorldRenderData } from '../types';
import type Camera from './Camera';
import { DEFAULT_ELEVATION_STYLES } from '../constants';

interface Attributes {
    a_position: Buffer;
    a_colour: Buffer;
}

interface Uniforms {
    u_pan: [number, number];
    u_zoom: number;
    u_resolution: [number, number];
}

// const ELEVATION_STYLES: {
//     threshold: number;
//     colour: [number, number, number];
// }[] = [
//     { threshold: 0.3, colour: [42 / 255, 107 / 255, 156 / 255] },
//     { threshold: 0.4, colour: [58 / 255, 143 / 255, 191 / 255] },
//     { threshold: 0.45, colour: [194 / 255, 162 / 255, 88 / 255] },
//     { threshold: 0.6, colour: [90 / 255, 143 / 255, 60 / 255] },
//     { threshold: 0.75, colour: [61 / 255, 107 / 255, 40 / 255] },
//     { threshold: 0.9, colour: [122 / 255, 106 / 255, 90 / 255] },
//     { threshold: 1.0, colour: [232 / 255, 232 / 255, 232 / 255] },
// ];

export default class MapRenderer {
    private _canvas: HTMLCanvasElement;
    private _regl: Regl;
    private _positionBuf: Buffer;
    private _colourBuf: Buffer;
    private _vertexNumber: number = 0;
    private _draw: DrawCommand;

    private _camera: Camera;

    private _observer: ResizeObserver;

    constructor(canvas: HTMLCanvasElement, camera: Camera) {
        this._canvas = canvas;
        this._camera = camera;

        this._regl = REGL({
            canvas,
            attributes: { antialias: false, alpha: true },
        });

        this._positionBuf = this._regl.buffer({
            usage: 'dynamic',
            type: 'float32',
        });

        this._colourBuf = this._regl.buffer({
            usage: 'dynamic',
            type: 'float32',
        });

        this._draw = this._regl<Uniforms, Attributes>({
            vert: `
            precision mediump float;

            attribute vec2 a_position;
            attribute vec3 a_colour;

            uniform vec2 u_pan;
            uniform float u_zoom;
            uniform vec2 u_resolution;

            varying vec3 v_colour;

            void main() {
                vec2 p = (a_position + u_pan) * u_zoom;
                vec2 clip = (p / u_resolution) * 2.0 - 1.0;
                gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
                v_colour = a_colour;
            }
            `,

            frag: `
            precision mediump float;

            varying vec3 v_colour;

            void main() {
                gl_FragColor = vec4(v_colour, 1.0);
            }
            `,

            attributes: {
                a_position: () => this._positionBuf,
                a_colour: () => this._colourBuf,
            },

            uniforms: {
                u_pan: () => [this._camera.position.x, this._camera.position.y],
                u_zoom: () => this._camera.zoom,
                u_resolution: () => [this._canvas.width, this._canvas.height],
            },

            count: () => this._vertexNumber,
            primitive: 'triangles',
        });

        this._observer = new ResizeObserver(() => this.handleResize());
        this._observer.observe(this._canvas.parentElement ?? this._canvas);

        this.handleResize();
    }

    public buildMap(data: WorldRenderData) {
        const positions: number[] = [];
        const colours: number[] = [];
        const styles = DEFAULT_ELEVATION_STYLES;

        for (let i = 0; i < data.sites.length; ++i) {
            const site = data.sites[i];
            const polygon = data.polygons[i];
            const elevation = data.heightmap[i];

            const { r, g, b } =
                styles.find((s) => elevation <= s.threshold)?.colour ??
                styles[styles.length - 1].colour;

            for (let j = 0; j < polygon.length; ++j) {
                const curr = polygon[j];
                const next = polygon[(j + 1) % polygon.length];
                positions.push(site.x, site.y, curr.x, curr.y, next.x, next.y);
                colours.push(r, g, b, r, g, b, r, g, b);
            }
        }

        this._positionBuf({ data: new Float32Array(positions) });
        this._colourBuf({ data: new Float32Array(colours) });
        this._vertexNumber = positions.length / 2;
    }

    public render() {
        this._regl.clear({ color: [0, 0, 0, 0], depth: 1, stencil: 0 });
        this._draw();
    }

    private handleResize() {
        const dpr = window.devicePixelRatio || 1;

        const width = Math.round(this._canvas.clientWidth * dpr);
        const height = Math.round(this._canvas.clientHeight * dpr);

        if (this._canvas.width !== width || this._canvas.height !== height) {
            this._canvas.width = width;
            this._canvas.height = height;

            this._regl.poll();
            this.render();
        }
    }

    public destroy() {
        this._observer.disconnect();
        this._colourBuf.destroy();
        this._positionBuf.destroy();
        this._regl.destroy();
    }
}

import type { WorldRenderData } from '../../types/world';

export interface Layer {
    init(data: WorldRenderData): void;
    render(ctx: CanvasRenderingContext2D): void;
}

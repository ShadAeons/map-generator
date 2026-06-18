import type { WorldRenderData } from '../../types/World';

export interface Layer {
    init(data: WorldRenderData): void;
    render(ctx: CanvasRenderingContext2D): void;
}

import type { WorldRenderData } from '../../types/World';

export interface Layer {
    render(ctx: CanvasRenderingContext2D, world: WorldRenderData): void;
}

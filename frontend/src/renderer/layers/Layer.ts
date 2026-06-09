import type { World } from '../../types/World';
import type { CanvasRenderer } from '../CanvasRenderer';

export interface Layer {
    render: (renderer: CanvasRenderer, world: World) => void;
}

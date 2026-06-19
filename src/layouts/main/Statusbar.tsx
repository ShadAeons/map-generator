import type { Vector } from '../../types';

interface StatusbarProps {
    seed: number;
    pos: Vector;
    cells: number;
}

export function Statusbar({ seed, pos, cells }: StatusbarProps) {
    return (
        <div className="flex gap-4 px-4 py-1">
            <p>Seed: {seed}</p>
            <p>Cells: {cells}</p>
            <p>
                X: {Math.round(pos.x)} Y: {Math.round(pos.y)}
            </p>
        </div>
    );
}

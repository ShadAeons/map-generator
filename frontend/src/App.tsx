import { useEffect, useRef, useState } from 'react';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import type { World } from './types/World';
import { useWorldGenerator } from './hooks/useWorldGenerator';

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<CanvasRenderer>(null);
    const [world, setWorld] = useState<World | null>();

    const generator = useWorldGenerator();

    useEffect(() => {
        if (!canvasRef.current) return;

        const renderer = new CanvasRenderer(canvasRef.current);
        rendererRef.current = renderer;

        return () => {
            renderer.destroy();
            rendererRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!world) return;

        rendererRef.current?.render(world);
    }, [world]);

    const handleClick = () => {
        if (!canvasRef.current || !generator) return;
        const canvas = canvasRef.current;

        const world = generator.generate(canvas.width, canvas.height);
        setWorld(world);
    };

    return (
        <>
            <div className="absolute">
                <button onClick={handleClick}>Create</button>
            </div>
            <div>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    style={{ display: 'block' }}
                ></canvas>
            </div>
        </>
    );
}

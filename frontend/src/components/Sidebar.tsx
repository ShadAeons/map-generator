import { useEffect, useRef } from 'react';

export default function Sidebar({
    className = '',
    minWidth = 250,
    maxWidth = 600,
    mode = 'left',
    onResize,
    children,
}: {
    className?: string;
    minWidth?: number;
    maxWidth?: number;
    mode?: 'left' | 'right';
    onResize?: (width: number) => void;
    children?: React.ReactNode;
}) {
    const dragging = useRef(false);

    useEffect(() => {
        const move = (e: PointerEvent) => {
            if (!dragging.current) return;

            const width = Math.min(
                Math.max(
                    minWidth,
                    mode === 'left' ? e.clientX : window.innerWidth - e.clientX
                ),
                maxWidth
            );

            onResize?.(width);
        };

        const up = () => {
            dragging.current = false;
        };

        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);

        return () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
    }, [minWidth, maxWidth, onResize, mode]);

    const handleResize = (e: React.PointerEvent) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    return (
        <div
            className={`${className} relative border-border ${mode === 'left' ? 'border-r' : 'border-l'} bg-navy-mid p-4`}
        >
            {children}

            <div
                className={`top-0 ${mode === 'left' ? 'right-0' : 'left-0'} absolute w-1 h-full cursor-col-resize`}
                onPointerDown={handleResize}
            ></div>
        </div>
    );
}

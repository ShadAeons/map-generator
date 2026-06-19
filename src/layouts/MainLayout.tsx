import { useEffect, useRef, useState } from 'react';
import {
    DEFAULT_SIDEBAR_WIDTH,
    MAX_SIDEBAR_WIDTH,
    MIN_SIDEBAR_WIDTH,
} from '../constants';

interface MainLayoutProps {
    toolbar: React.ReactNode;
    inspector: React.ReactNode;
    topbar: React.ReactNode;
    statusbar: React.ReactNode;
    canvas: React.ReactNode;
}

export default function MainLayout({
    toolbar,
    inspector,
    topbar,
    statusbar,
    canvas,
}: MainLayoutProps) {
    const [sidebarWidth, setSidebarWidth] = useState<number>(
        DEFAULT_SIDEBAR_WIDTH
    );
    const dragging = useRef<boolean>(false);

    useEffect(() => {
        const move = (e: PointerEvent) => {
            if (!dragging.current) return;

            const width = Math.min(
                Math.max(MIN_SIDEBAR_WIDTH, window.innerWidth - e.clientX),
                MAX_SIDEBAR_WIDTH
            );

            setSidebarWidth(width);
        };

        const stopDragging = () => {
            dragging.current = false;
        };

        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', stopDragging);

        return () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', stopDragging);
        };
    }, []);

    const handleResize = (e: React.PointerEvent) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    return (
        <div
            className="grid grid-rows-[auto_1fr_auto] w-screen h-screen font-inter"
            style={{ gridTemplateColumns: `auto 1fr ${sidebarWidth}px` }}
        >
            <div className="col-span-3 bg-navy-mid border-border border-b">
                {/* <h3>Filename</h3> */}
                {topbar}
            </div>

            {toolbar}

            <div className="w-full h-full min-h-0">{canvas}</div>

            <div className="relative col-start-3 bg-navy-mid p-4 border-border border-l">
                {inspector}

                <div
                    className="top-0 left-0 absolute w-1 h-full cursor-col-resize"
                    onPointerDown={handleResize}
                ></div>
            </div>

            <div className="col-span-3 bg-navy-mid border-border border-t text-xs">
                {statusbar}
            </div>
        </div>
    );
}

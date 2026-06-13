export default function Canvas({
    className = '',
    canvasRef,
}: {
    className?: string;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
    return (
        <div className={`${className}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair"
            ></canvas>
        </div>
    );
}

export default function Toolbar({
    className = '',
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div
            className={`${className} bg-navy-mid border-border border-r w-14 h-full`}
        >
            {children}
        </div>
    );
}

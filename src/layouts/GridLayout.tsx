interface GridRowProps {
    label: string;
    children: React.ReactNode;
}

export function GridLayout({
    className = '',
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`${className} items-center gap-2 grid grid-cols-[auto_1fr]`}
        >
            {children}
        </div>
    );
}

export function GridRow({ label, children }: GridRowProps) {
    return (
        <>
            <label>{label}</label>

            <div className="justify-self-end w-full min-w-0">{children}</div>
        </>
    );
}

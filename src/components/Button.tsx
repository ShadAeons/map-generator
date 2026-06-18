import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    className = '',
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${className} bg-navy-light px-2 py-1 border border-border rounded-md cursor-pointer`}
            {...props}
        >
            {children}
        </button>
    );
}

import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function InputBox({ className = '', ...props }: InputProps) {
    return (
        <input
            className={`${className} bg-navy-light px-2 py-1 border border-border rounded-md outline-none text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]`}
            {...props}
        />
    );
}

import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function NumberInput({
    className = '',
    min,
    max,
    onBlur,
    ...props
}: InputProps) {
    const handleClamp = (e: React.FocusEvent<HTMLInputElement>) => {
        if (min === undefined && max === undefined) {
            onBlur?.(e);
            return;
        }

        const value = e.target.valueAsNumber;

        if (!isNaN(value))
            e.target.value = Math.min(
                Number(max ?? Infinity),
                Math.max(Number(min ?? -Infinity), value)
            ).toString();
        else e.target.value = min?.toString() ?? '0';

        onBlur?.(e);
    };

    return (
        <input
            type="number"
            className={`${className} bg-navy-light px-2 py-1 border border-border rounded-md outline-none text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]`}
            min={min}
            max={max}
            onBlur={handleClamp}
            {...props}
        />
    );
}

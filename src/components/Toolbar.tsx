import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx';

export interface Tool {
    label: string;
    icon: IconDefinition;
    inspector: React.ReactNode;
}

interface ToolbarProps {
    tools: Tool[];
    currentTool: number;
    onToolChange: (idx: number) => void;
}

export default function Toolbar({
    tools,
    currentTool,
    onToolChange,
}: ToolbarProps) {
    return (
        <div className="flex flex-col gap-2 bg-navy-mid px-1 py-2 border-border border-r h-full">
            {tools.map((t, i) => {
                return (
                    <div
                        key={t.label}
                        className={clsx(
                            'relative rounded-full size-10',
                            currentTool === i && 'text-gold',
                            currentTool !== i && 'hover:bg-navy-light'
                        )}
                        onClick={() => onToolChange(i)}
                    >
                        <FontAwesomeIcon
                            icon={t.icon}
                            className="top-1/2 left-1/2 absolute -translate-1/2"
                        />
                    </div>
                );
            })}
        </div>
    );
}

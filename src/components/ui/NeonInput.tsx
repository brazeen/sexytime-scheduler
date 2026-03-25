import { type InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <label className="text-slate-400 text-sm font-medium ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        // Dark slate bg, subtle border
                        'bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200',
                        error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <span className="text-red-300 text-xs ml-1 font-medium">{error}</span>
                )}
            </div>
        );
    }
);

NeonInput.displayName = 'NeonInput';

export default NeonInput;

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    glow?: boolean;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant = 'primary', glow = true, children, ...props }, ref) => {
        // Sleek, smaller radius, professional look
        const baseStyles = 'inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:pointer-events-none text-sm';

        const variants = {
            // Primary: Unsaturated Blue
            primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-white/5',
            // Secondary: Dark Slate
            secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5',
            // Ghost: Subtle
            ghost: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5',
        };

        const glows = {
            primary: 'shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]',
            secondary: '',
            ghost: '',
        };

        return (
            <button
                ref={ref}
                className={twMerge(
                    baseStyles,
                    variants[variant],
                    glow && glows[variant],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

NeonButton.displayName = 'NeonButton';

export default NeonButton;

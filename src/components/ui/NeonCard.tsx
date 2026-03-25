import { type HTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface NeonCardProps extends HTMLAttributes<HTMLDivElement> {
    glowColor?: 'pink' | 'blue' | 'green' | 'none';
}

const NeonCard = forwardRef<HTMLDivElement, NeonCardProps>(
    ({ className, glowColor = 'none', children, ...props }, ref) => {
        // Dark Blue Theme: sleek, low opacity border, dark background
        const baseStyles = 'bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl';

        // Glows are now subtle border accents or shadow tints
        const glows = {
            pink: 'shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] border-blue-500/20', // Mapped pink to blue-ish
            blue: 'shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] border-blue-500/20',
            green: 'shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] border-blue-500/20',
            none: '',
        };

        return (
            <div
                ref={ref}
                className={twMerge(baseStyles, glows[glowColor === 'none' ? 'none' : 'blue'], className)} // Force blue/none for now
                {...props}
            >
                {children}
            </div>
        );
    }
);

NeonCard.displayName = 'NeonCard';

export default NeonCard;

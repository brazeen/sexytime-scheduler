import { useState, useMemo } from 'react';
import { User as UserIcon } from 'lucide-react';

interface NeonAvatarProps {
    src?: string | null;
    name?: string | null;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const NeonAvatar = ({ src, name, className = '', size = 'md' }: NeonAvatarProps) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const colorClasses = useMemo(() => {
        if (!name) return 'bg-neon-blue/10 text-neon-blue border-neon-blue/50';

        const colors = [
            'bg-red-500/20 text-red-400 border-red-500/50',
            'bg-orange-500/20 text-orange-400 border-orange-500/50',
            'bg-amber-500/20 text-amber-400 border-amber-500/50',
            'bg-green-500/20 text-green-400 border-green-500/50',
            'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
            'bg-teal-500/20 text-teal-400 border-teal-500/50',
            'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
            'bg-blue-500/20 text-blue-400 border-blue-500/50',
            'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
            'bg-violet-500/20 text-violet-400 border-violet-500/50',
            'bg-purple-500/20 text-purple-400 border-purple-500/50',
            'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50',
            'bg-pink-500/20 text-pink-400 border-pink-500/50',
            'bg-rose-500/20 text-rose-400 border-rose-500/50',
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    }, [name]);

    const containerClasses = `${sizeClasses[size]} rounded-full border flex items-center justify-center overflow-hidden ${colorClasses} ${className}`;

    if (src && !imageError) {
        return (
            <img
                src={src}
                alt={name || 'User'}
                className={`${sizeClasses[size]} rounded-full object-cover border border-neon-blue ${className}`}
                onError={() => setImageError(true)}
            />
        );
    }

    // Fallback SVG
    return (
        <div className={containerClasses} title={name || 'User'}>
            <UserIcon className="w-[60%] h-[60%] opacity-80" />
        </div>
    );
};

export default NeonAvatar;

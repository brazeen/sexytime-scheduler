import { format, addDays } from 'date-fns';
import { useState } from 'react';
import clsx from 'clsx';
import { type User } from '@supabase/supabase-js';
import NeonAvatar from './ui/NeonAvatar';

export interface Vote {
    room_id: string;
    user_id: string;
    date: string;
    time_slot: 'morning' | 'afternoon' | 'night';
    profiles?: {
        full_name: string;
        avatar_url: string;
    };
}

interface AvailabilityGridProps {
    roomId: string;
    currentUser: User | null;
    votes: Vote[];
    onToggleVote: (date: Date, slot: 'morning' | 'afternoon' | 'night') => void;
    startDate?: string | null;
    endDate?: string | null;
}

const TIME_SLOTS = ['morning', 'afternoon', 'night'] as const;

export const AvailabilityGrid = ({ currentUser, votes, onToggleVote, startDate, endDate }: AvailabilityGridProps) => {
    // Determine the absolute start limit (if any)
    const roomStartDate = startDate ? new Date(startDate) : new Date();
    // For open availability, normalize to start of today
    if (!startDate) roomStartDate.setHours(0, 0, 0, 0);

    const [currentWeekStart, setCurrentWeekStart] = useState(roomStartDate);

    // Reset view if roomStartDate changes significantly (e.g. switching rooms), but simpler to just init state
    // We can add a useEffect if needed, but key-ing the component by room id is safer in parent.

    const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

    const handlePrevWeek = () => {
        const newStart = addDays(currentWeekStart, -7);
        if (startDate && newStart < new Date(startDate)) return; // Don't go before room start
        const limit = startDate ? new Date(startDate) : new Date();
        limit.setHours(0, 0, 0, 0);
        if (!startDate && newStart < limit) return; // Don't go before today for open rooms usually? Actually open rooms might allow past? Let's stick to "Today" as min for now.
        setCurrentWeekStart(newStart);
    };

    const handleNextWeek = () => {
        const newStart = addDays(currentWeekStart, 7);
        if (endDate && newStart > new Date(endDate)) return; // Don't go past room end
        setCurrentWeekStart(newStart);
    };

    const canGoPrev = () => {
        const prevDate = addDays(currentWeekStart, -7);
        const limit = startDate ? new Date(startDate) : new Date();
        limit.setHours(0, 0, 0, 0);
        return prevDate >= limit || (currentWeekStart > limit);
    };

    const canGoNext = () => {
        if (!endDate) return true;
        const nextDate = addDays(currentWeekStart, 7);
        return nextDate <= new Date(endDate);
    };

    const getSlotData = (date: Date, slot: string) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const slotVotes = votes.filter(v => v.date === dateStr && v.time_slot === slot);

        // Get unique profiles
        const profiles = new Map();
        slotVotes.forEach(v => {
            if (v.profiles) profiles.set(v.user_id, v.profiles);
        });

        return {
            count: slotVotes.length,
            profiles: Array.from(profiles.values())
        };
    };

    const isUserSelected = (date: Date, slot: string) => {
        if (!currentUser) return false;
        const dateStr = format(date, 'yyyy-MM-dd');
        return votes.some(v => v.user_id === currentUser.id && v.date === dateStr && v.time_slot === slot);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <button
                    onClick={handlePrevWeek}
                    disabled={!canGoPrev()}
                    className="p-2 hover:bg-white/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-400 hover:text-white"
                >
                    ← Prev Week
                </button>
                <div className="text-sm font-medium text-slate-400">
                    {format(days[0], 'MMM d')} - {format(days[6], 'MMM d, yyyy')}
                </div>
                <button
                    onClick={handleNextWeek}
                    disabled={!canGoNext()}
                    className="p-2 hover:bg-white/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-400 hover:text-white"
                >
                    Next Week →
                </button>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="min-w-[800px] grid grid-cols-[100px_repeat(7,1fr)] gap-2">
                    {/* Header Row */}
                    <div className="col-span-1"></div>
                    {days.map(day => (
                        <div key={day.toISOString()} className="text-center pb-2">
                            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{format(day, 'EEE')}</div>
                            <div className="text-lg font-bold text-slate-200">{format(day, 'd')}</div>
                        </div>
                    ))}

                    {/* Time Slots */}
                    {TIME_SLOTS.map(slot => (
                        <div key={`row-${slot}`} className="contents">
                            <div className="flex items-center justify-end pr-4 font-medium text-slate-500 capitalize text-sm">
                                {slot}
                            </div>
                            {days.map(day => {
                                const startIso = format(day, 'yyyy-MM-dd');
                                const isSelected = isUserSelected(day, slot);
                                const { count, profiles } = getSlotData(day, slot);

                                // Calculate intensity (0-1) based on pure count or ratio. 
                                // Simple ratio against total unique voters in room might be better but let's just do count for visual punch.
                                // Max 5 for full opacity
                                const intensity = Math.min(1, count / 5);

                                return (
                                    <button
                                        key={`${startIso}-${slot}`}
                                        onClick={() => onToggleVote(day, slot)}
                                        className={clsx(
                                            "h-24 rounded-lg transition-all duration-200 border relative group overflow-hidden flex flex-col items-center justify-center gap-1",
                                            isSelected
                                                ? "border-blue-400 ring-1 ring-blue-500/50 z-10"
                                                : "border-slate-800 hover:border-slate-700",
                                            // Base background
                                            !isSelected && count === 0 && "bg-slate-900/40 hover:bg-slate-800/60"
                                        )}
                                        style={{
                                            backgroundColor: isSelected
                                                ? 'rgba(59, 130, 246, 0.2)' // Selected Blue
                                                : count > 0 // Heatmap Blue - adjusted for better visibility
                                                    ? `rgba(59, 130, 246, ${Math.max(0.15, intensity * 0.7)})`
                                                    : undefined
                                        }}
                                    >
                                        {/* Avatars Grid */}
                                        {profiles.length > 0 && (
                                            <div className="flex flex-wrap items-center justify-center gap-1 max-w-[90%] pointer-events-none">
                                                {profiles.slice(0, 4).map((p: any, i) => (
                                                    <NeonAvatar
                                                        key={i}
                                                        src={p.avatar_url}
                                                        name={p.full_name}
                                                        size="sm"
                                                        className="border-slate-700 bg-slate-800"
                                                    />
                                                ))}
                                                {profiles.length > 4 && (
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-400">
                                                        +{profiles.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Accessibly hidden label */}
                                        <span className="sr-only">{slot} {format(day, 'MMM d')} - {count} votes</span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

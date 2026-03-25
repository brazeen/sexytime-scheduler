import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NeonLayout from '../components/layout/NeonLayout';
import { AvailabilityGrid, type Vote } from '../components/AvailabilityGrid';
import NeonButton from '../components/ui/NeonButton';
import NeonCard from '../components/ui/NeonCard';
import NeonAvatar from '../components/ui/NeonAvatar';
import { getRoomById, joinRoom, getRoomHostName, type Room } from '../services/rooms';
import { useAuth } from '../contexts/AuthContext';
import { Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

const RoomPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hostName, setHostName] = useState<string | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchRoomAndDetails = async () => {
            try {
                const data = await getRoomById(id);
                setRoom(data);
                const hostName = await getRoomHostName(id);
                setHostName(hostName);
            } catch (error) {
                console.error('Error fetching room:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoomAndDetails();
    }, [id]);

    // Join room on entry
    useEffect(() => {
        if (id && user) {
            joinRoom(id).catch(console.error);
        }
    }, [id, user]);

    useEffect(() => {
        if (!id) return;

        const fetchVotes = async () => {
            const { data } = await supabase
                .from('votes')
                .select('*, profiles(full_name, avatar_url)')
                .eq('room_id', id);

            if (data) {
                // Flatten/map data to match Vote interface including profile info
                // Supabase returns nested object for relations, we rely on type assertion or mapping
                setVotes(data as any);
            }
        };

        // ... (subscription setup stays here)
        fetchVotes();

        const subscription = supabase
            .channel(`room_votes:${id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'votes', filter: `room_id=eq.${id}` },
                () => {
                    fetchVotes();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [id]);

    const handleToggleVote = async (date: Date, slot: 'morning' | 'afternoon' | 'night') => {
        if (!user || !id) return;

        // Optimistic Update logic could go here, but for now we rely on Realtime which is fast enough or a simple re-fetch
        // Actually let's implement optimistic logic to make it snappy
        const dateStr = format(date, 'yyyy-MM-dd');
        const existingVote = votes.find(
            v => v.user_id === user.id && v.date === dateStr && v.time_slot === slot
        );

        if (existingVote) {
            // Optimistic Remove
            setVotes(prev => prev.filter(v => v !== existingVote));
            await supabase
                .from('votes')
                .delete()
                .match({ room_id: id, user_id: user.id, date: dateStr, time_slot: slot });
        } else {
            // Optimistic Add
            const newVote: any = {
                room_id: id,
                user_id: user.id,
                date: dateStr,
                time_slot: slot,
                profiles: { full_name: 'You', avatar_url: '' } // Temp placeholder for optimistic ui
            };
            setVotes(prev => [...prev, newVote]);
            await supabase.from('votes').insert({
                room_id: id,
                user_id: user.id,
                date: dateStr,
                time_slot: slot
            });
        }
    };

    const participants = useMemo(() => {
        const uniqueUsers = new Map();
        votes.forEach(vote => {
            if (vote.profiles && !uniqueUsers.has(vote.user_id)) {
                uniqueUsers.set(vote.user_id, vote.profiles);
            }
        });
        return Array.from(uniqueUsers.entries());
    }, [votes]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    if (loading) {
        return (
            <NeonLayout>
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-pink"></div>
                </div>
            </NeonLayout>
        );
    }

    if (!room) {
        return (
            <NeonLayout>
                <div className="text-center py-20">
                    <h2 className="text-2xl text-neon-pink font-bold">Room not found</h2>
                    <NeonButton onClick={() => navigate('/')} className="mt-4">Go Home</NeonButton>
                </div>
            </NeonLayout>
        );
    }

    return (
        <NeonLayout>
            <div className="max-w-6xl mx-auto w-full space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent">
                            {room.name}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Created by {hostName}
                        </p>
                    </div>
                    <NeonButton variant="secondary" onClick={copyToClipboard} className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Link
                    </NeonButton>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <NeonCard glowColor="blue" className="p-6 overflow-hidden">
                            <AvailabilityGrid
                                roomId={room.id}
                                currentUser={user}
                                votes={votes}
                                onToggleVote={handleToggleVote}
                                startDate={room.start_date}
                                endDate={room.end_date}
                            />
                        </NeonCard>
                    </div>

                    <div className="space-y-6">
                        <NeonCard glowColor="pink" className="p-4">
                            <h3 className="text-lg font-bold text-neon-pink mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></span>
                                Participants {participants.length > 0 && `(${participants.length})`}
                            </h3>
                            <div className="space-y-3">
                                {!user && (
                                    <div className="text-sm text-gray-400">
                                        <a href="/login" className="text-neon-blue hover:underline">Log in</a> to vote!
                                    </div>
                                )}
                                {participants.map(([userId, profile]: [string, any]) => (
                                    <div key={userId} className="flex items-center gap-3">
                                        <NeonAvatar
                                            src={profile?.avatar_url}
                                            name={profile?.full_name}
                                            size="md"
                                        />
                                        <span className={userId === user?.id ? "text-neon-blue font-bold" : "text-gray-300"}>
                                            {profile?.full_name || 'Anonymous'} {userId === user?.id && '(You)'}
                                        </span>
                                    </div>
                                ))}
                                {participants.length === 0 && (
                                    <p className="text-gray-500 text-sm">No one has joined yet.</p>
                                )}
                            </div>
                        </NeonCard>
                    </div>
                </div>
            </div>
        </NeonLayout>
    );
};

export default RoomPage;

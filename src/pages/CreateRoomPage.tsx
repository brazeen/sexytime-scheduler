import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NeonLayout from '../components/layout/NeonLayout';
import NeonCard from '../components/ui/NeonCard';
import NeonInput from '../components/ui/NeonInput';
import NeonButton from '../components/ui/NeonButton';
import { createRoom } from '../services/rooms';
import { Calendar } from 'lucide-react';

const CreateRoomPage = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [eventName, setEventName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <NeonLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </NeonLayout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventName.trim()) return;

        setLoading(true);
        try {
            // Pass undefined if empty string
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            const room = await createRoom(eventName, start, end);
            navigate(`/room/${room.id}`);
        } catch (error) {
            console.error('Failed to create room:', error);
            // Ideally show toast notification
        } finally {
            setLoading(false);
        }
    };

    return (
        <NeonLayout>
            <div className="flex flex-col items-center justify-center flex-1 py-12">
                <div className="w-full max-w-lg">
                    <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent">
                        Create New Event
                    </h1>

                    <NeonCard glowColor="blue" className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <NeonInput
                                    label="Event Name"
                                    placeholder="e.g. Cyberpunk Rave 2077"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <NeonInput
                                    type="date"
                                    label="Start Date (Optional)"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <NeonInput
                                    type="date"
                                    label="End Date (Optional)"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3 text-gray-400 text-sm">
                                <Calendar className="w-5 h-5 flex-shrink-0" />
                                <span>
                                    {!startDate && !endDate
                                        ? "Defaults to open availability (no limits)"
                                        : "Restricted to selected date range"
                                    }
                                </span>
                            </div>

                            <NeonButton
                                type="submit"
                                className="w-full py-4 text-lg"
                                disabled={loading}
                            >
                                {loading ? 'Creating Matrix...' : 'Create Room'}
                            </NeonButton>
                        </form>
                    </NeonCard>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </NeonLayout>
    );
};

export default CreateRoomPage;

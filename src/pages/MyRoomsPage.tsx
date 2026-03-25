import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NeonLayout from '../components/layout/NeonLayout';
import NeonCard from '../components/ui/NeonCard';
import NeonButton from '../components/ui/NeonButton';
import { getRoomsByUser, type Room } from '../services/rooms';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const MyRoomsPage = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [joinLink, setJoinLink] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getRoomsByUser();
                setRooms(data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleJoin = () => {
        setError('');
        if (!joinLink.trim()) return;

        try {
            const urlString = joinLink.startsWith('http') ? joinLink : `https://${joinLink}`;
            const url = new URL(urlString);
            
            if (!url.pathname.includes('/room/')) {
                setError('Invalid room link format. Please ensure it contains a valid room link.');
                return;
            }

            const pathStartIndex = url.pathname.indexOf('/room/');
            const path = url.pathname.slice(pathStartIndex);
            
            if (url.origin === window.location.origin) {
                navigate(path);
            } else {
                window.location.href = joinLink;
            }
        } catch (e) {
            setError('Please enter a valid URL.');
        }
    };

    return (
        <NeonLayout>
            <div className="py-8 max-w-4xl mx-auto w-full flex-1 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent mb-6">
                        My Events
                    </h1>
                    <div className="flex flex-col gap-2">
                        <NeonCard className="p-2 flex gap-4 items-center pl-4 bg-gray-900/50 backdrop-blur-sm">
                            <input
                                type="text"
                                placeholder="Paste a room link here to join!"
                                className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-gray-500"
                                value={joinLink}
                                onChange={(e) => {
                                    setJoinLink(e.target.value);
                                    if (error) setError('');
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                            />
                            <NeonButton onClick={handleJoin}>
                                Join
                            </NeonButton>
                        </NeonCard>
                        {error && (
                            <p className="text-red-500 text-sm ml-2">{error}</p>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : rooms.length === 0 ? (
                    <NeonCard className="flex flex-col items-center justify-center p-12 text-center gap-4 border-dashed border-gray-700">
                        <Calendar className="w-16 h-16 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-300">No events found</h3>
                        <p className="text-gray-500">Paste a link above to join an event!</p>
                    </NeonCard>
                ) : (
                    <div className="grid gap-4">
                        {rooms.map((room) => (
                            <NeonCard key={room.id} className="group hover:border-neon-pink/50 transition-colors cursor-pointer" onClick={() => navigate(`/room/${room.id}`)}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold group-hover:text-neon-pink transition-colors">{room.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{format(new Date(room.created_at), 'MMM d, yyyy')}</span>
                                            </div>
                                            {room.start_date && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Limited Dates</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowRight className="text-gray-600 group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
                                </div>
                            </NeonCard>
                        ))}
                    </div>
                )}
            </div>
        </NeonLayout>
    );
};

export default MyRoomsPage;

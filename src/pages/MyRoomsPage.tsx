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

    return (
        <NeonLayout>
            <div className="py-8 max-w-4xl mx-auto w-full flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent">
                        My Events
                    </h1>
                    <NeonButton onClick={() => navigate('/create')}>
                        + New Event
                    </NeonButton>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : rooms.length === 0 ? (
                    <NeonCard className="flex flex-col items-center justify-center p-12 text-center gap-4 border-dashed border-gray-700">
                        <Calendar className="w-16 h-16 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-300">No events found</h3>
                        <p className="text-gray-500">You haven't created any rooms yet.</p>
                        <NeonButton variant="secondary" onClick={() => navigate('/create')}>
                            Create your first room
                        </NeonButton>
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

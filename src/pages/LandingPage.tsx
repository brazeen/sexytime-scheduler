import { useNavigate } from 'react-router-dom';
import NeonButton from '../components/ui/NeonButton';
import NeonCard from '../components/ui/NeonCard';
import NeonLayout from '../components/layout/NeonLayout';
import { Calendar, Users, Zap, Star, Clock } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <NeonLayout>
            <div className="flex flex-col items-center justify-center flex-1 text-center gap-8 py-12 md:py-20 relative">
                {/* Floating Space Elements */}
                <div className="absolute top-10 left-10 animate-bounce delay-700 opacity-20">
                    <Star className="w-8 h-8 text-white fill-white" />
                </div>
                <div className="absolute top-20 right-20 animate-pulse delay-300 opacity-20">
                    <Star className="w-4 h-4 text-blue-300 fill-blue-300" />
                </div>

                <div className="max-w-4xl space-y-8 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Clock className="w-4 h-4" />
                        <span>Easy Time Scheduler</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white animate-in fade-in zoom-in duration-1000">
                        Sync up with your squad
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">to have SEXY TIME <span className="text-blue-400 text-lg font-light tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">(Fun and wholesome moments!)</span></span>
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Find a time to meet up with your friends and have a good time - but without the hassle of scheduling. Try <span className="text-blue-400 font-bold tracking-normal">sexytime</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <NeonButton
                            className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] border-white/10"
                            onClick={() => navigate('/create')}
                        >
                            Create Room
                        </NeonButton>
                        <NeonButton
                            variant="secondary"
                            className="text-lg px-8 py-4"
                            onClick={() => navigate('/rooms')}
                        >
                            My Rooms
                        </NeonButton>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-24 px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <NeonCard glowColor="blue" className="flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300 bg-slate-900/40 border-white/5">
                        <div className="p-4 rounded-full bg-blue-500/10">
                            <Calendar className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Schedule Easily</h3>
                        <p className="text-slate-400">Create a room, copy a link, share, and done.</p>
                    </NeonCard>

                    <NeonCard glowColor="blue" className="flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300 bg-slate-900/40 border-white/5">
                        <div className="p-4 rounded-full bg-indigo-500/10">
                            <Users className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Heatmap View</h3>
                        <p className="text-slate-400">Instantly spot the perfect time slot for your annual meeting with the gang.</p>
                    </NeonCard>

                    <NeonCard glowColor="blue" className="flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300 bg-slate-900/40 border-white/5">
                        <div className="p-4 rounded-full bg-cyan-500/10">
                            <Zap className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Real-time Updates</h3>
                        <p className="text-slate-400">Watch schedules update live from all your homies.</p>
                    </NeonCard>
                </div>
            </div>
        </NeonLayout>
    );
};

export default LandingPage;

import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SexytimeLogo from '../ui/SexytimeLogo';

interface NeonLayoutProps {
    children: ReactNode;
}

const NeonLayout = ({ children }: NeonLayoutProps) => {
    const { user, profile, signOut } = useAuth();
    return (
        <div className="min-h-screen text-slate-200 selection:bg-blue-500/30 selection:text-white relative flex flex-col font-sans">
            {/* Subtle Top glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <SexytimeLogo className="w-6 h-6 text-blue-400" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-blue-400">
                        sexytime
                    </h1>
                </Link>
                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                to="/rooms"
                                className="text-sm font-medium text-slate-400 hover:text-white transition-colors mr-2"
                            >
                                My Rooms
                            </Link>

                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-blue-200 font-medium max-w-[150px] truncate">
                                        {profile?.full_name || user.email}
                                    </span>
                                </div>

                                <button
                                    onClick={signOut}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    title="Sign Out"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto p-4 md:p-8 relative z-10 flex flex-col">
                {children}
            </main>

            {/* Footer */}
            <footer className="p-8 text-center text-slate-500 text-sm border-t border-white/5">
                <p>&copy; {new Date().getFullYear()} sexytime Availability Scheduler</p>
            </footer>
        </div>
    );
};

export default NeonLayout;

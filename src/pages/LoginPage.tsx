import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NeonButton from '../components/ui/NeonButton';
import NeonCard from '../components/ui/NeonCard';
import NeonLayout from '../components/layout/NeonLayout';
import { Zap } from 'lucide-react';

const LoginPage = () => {
    const { user, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <NeonLayout>
            <div className="flex items-center justify-center flex-1 py-12">
                <NeonCard glowColor="pink" className="w-full max-w-md p-8 flex flex-col items-center gap-6">
                    <div className="p-4 bg-neon-pink/10 rounded-full">
                        <Zap className="w-12 h-12 text-neon-pink animate-pulse-fast" />
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent">
                            Welcome Back
                        </h2>
                        <p className="text-gray-400">
                            Sign in to manage your rooms and votes.
                        </p>
                    </div>

                    <div className="w-full pt-4">
                        <NeonButton
                            variant="primary"
                            className="w-full justify-center text-lg py-6"
                            onClick={signInWithGoogle}
                        >
                            Sign in with Google
                        </NeonButton>
                    </div>

                    <p className="text-xs text-center text-gray-500 mt-4">
                        By signing in, you are ready to get your scheduling sorted.
                    </p>
                </NeonCard>
            </div>
        </NeonLayout>
    );
};

export default LoginPage;

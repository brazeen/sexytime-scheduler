import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Session, type User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

interface Profile {
    id: string;
    full_name: string;
    avatar_url: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchAndSyncProfile(session.user);
            }
            setLoading(false);
        };

        initSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchAndSyncProfile(session.user);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchAndSyncProfile = async (currentUser: User) => {
        try {
            // 1. Try to fetch existing profile
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // Profile does not exist, so create/sync it
                await syncProfile(currentUser);
            } else if (data) {
                // Profile exists, set it
                setProfile(data);
                // Optional: Check if we need to update it if metadata changed?
                // For now, let's just make sure we have something.
                if (!data.full_name && currentUser.user_metadata) {
                    await syncProfile(currentUser);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const syncProfile = async (currentUser: User) => {
        try {
            const { user_metadata } = currentUser;
            const updates = {
                id: currentUser.id,
                full_name: user_metadata.full_name || user_metadata.name || currentUser.email?.split('@')[0],
                avatar_url: user_metadata.avatar_url || user_metadata.picture,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('profiles')
                .upsert(updates)
                .select()
                .single();

            if (error) {
                console.error('Error syncing profile:', error);
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error in syncProfile:', error);
        }
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });
        if (error) console.error('Error signing in with Google:', error);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, signInWithGoogle, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

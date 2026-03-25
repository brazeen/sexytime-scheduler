import { supabase } from '../lib/supabase';

export interface Room {
    id: string;
    created_by: string;
    name: string;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

export const createRoom = async (name: string, startDate?: Date, endDate?: Date) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User must be logged in to create a room');

    // 1. Create the room
    const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .insert({
            name,
            created_by: user.id,
            start_date: startDate ? startDate.toISOString() : null,
            end_date: endDate ? endDate.toISOString() : null,
        })
        .select()
        .single();

    if (roomError) throw roomError;

    // 2. Add creator as a participant
    const { error: participantError } = await supabase
        .from('room_participants')
        .insert({
            room_id: roomData.id,
            user_id: user.id
        });

    if (participantError) {
        // Optional: rollback room creation or just log error?
        console.error('Failed to add creator as participant:', participantError);
    }

    return roomData as Room;
};

export const joinRoom = async (roomId: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User must be logged in to join a room');

    const { error } = await supabase
        .from('room_participants')
        .insert({
            room_id: roomId,
            user_id: user.id
        });

    // Ignore duplicate key error (already joined)
    if (error && error.code !== '23505') throw error;
};

export const getRoomsByUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Fetch rooms where the user is a participant
    const { data, error } = await supabase
        .from('room_participants')
        .select('joined_at, rooms(*)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });

    if (error) throw error;

    // Map nested data back to Room[]
    // @ts-ignore - Supabase types might be tricky here with nested selects
    return data.map((item: any) => item.rooms) as Room[];
};

export const getRoomById = async (id: string) => {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Room;
};

export const getRoomHostName = async (id: string) => {
    const { data, error } = await supabase
        .from('rooms')
        .select('created_by')
        .eq('id', id)
        .single()

    if (error) throw error;
    const hostRoom = data as Room;

    const { data: hostName, error: hostError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', hostRoom.created_by)
        .single();

    if (hostError) throw hostError;
    return hostName.full_name;
};

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES table (Public profiles linked to Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ROOMS table
create table rooms (
  id uuid default uuid_generate_v4() primary key,
  created_by uuid references profiles(id) not null,
  name text not null,
  start_date date, -- Optional: if null, no limit
  end_date date,   -- Optional
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Rooms
alter table rooms enable row level security;
create policy "Rooms are viewable by everyone." on rooms for select using (true);
create policy "Users can create rooms." on rooms for insert with check (auth.uid() = created_by);
-- Optional: Users can only update their own rooms? For now let's say yes.
create policy "Users can update own rooms." on rooms for update using (auth.uid() = created_by);

-- ROOM PARTICIPANTS table (Junction table)
create table room_participants (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references rooms(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  unique(room_id, user_id)
);

-- RLS for Room Participants
alter table room_participants enable row level security;
create policy "Participants are viewable by everyone." on room_participants for select using (true);
create policy "Users can join rooms (insert)." on room_participants for insert with check (auth.uid() = user_id);
create policy "Users can leave rooms (delete)." on room_participants for delete using (auth.uid() = user_id);

-- VOTES table
create type time_slot_enum as enum ('morning', 'afternoon', 'night');

create table votes (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references rooms(id) on delete cascade not null,
  user_id uuid references profiles(id) not null,
  date date not null,
  time_slot time_slot_enum not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(room_id, user_id, date, time_slot) -- Prevent duplicate votes for same slot
);

-- RLS for Votes
alter table votes enable row level security;
create policy "Votes are viewable by everyone." on votes for select using (true);
create policy "Users can insert their own votes." on votes for insert with check (auth.uid() = user_id);
create policy "Users can delete their own votes." on votes for delete using (auth.uid() = user_id);
create policy "Users can update their own votes." on votes for update using (auth.uid() = user_id);

-- Enable Realtime for these tables
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table rooms, votes, profiles, room_participants;
commit;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  role text DEFAULT 'user',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Allow authenticated users to read profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow users to update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a trigger to automatically insert a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create stadiums table
CREATE TABLE IF NOT EXISTS stadiums (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  price_per_hour integer NOT NULL,
  rating numeric,
  image_url text,
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  stadium_id uuid REFERENCES stadiums(id) NOT NULL,
  date date NOT NULL,
  time_slot text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for the tables
ALTER TABLE stadiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Stadiums are readable by everyone
CREATE POLICY "Stadiums are readable by everyone" ON stadiums
  FOR SELECT USING (true);

-- Bookings are readable by the user who created them
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own bookings
CREATE POLICY "Users can insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert 6 sample stadiums in Baku
INSERT INTO stadiums (name, city, address, price_per_hour, rating, image_url, latitude, longitude) VALUES
('Baku Olympic Stadium Mini-Pitch', 'Baku', 'Heydar Aliyev pr. 323', 60, 4.8, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80', 40.4299, 49.9196),
('Tofiq Bahramov Arena', 'Baku', 'Fətəli Xan Xoyski 10', 80, 4.9, 'https://images.unsplash.com/photo-1518605368461-1ee7e161528e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80', 40.3957, 49.8519),
('Ganjlik Sport Complex', 'Baku', 'Ataturk pr. 2', 40, 4.5, 'https://images.unsplash.com/photo-1524015368236-bbf6f72545b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80', 40.4005, 49.8530),
('Neftchi Arena Mini', 'Baku', '8 Noyabr pr.', 50, 4.6, 'https://images.unsplash.com/photo-1551280857-2b9ebf241519?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80', 40.3789, 49.9576),
('Yasamal Football Center', 'Baku', 'Həsən bəy Zərdabi 73', 30, 4.2, 'https://images.unsplash.com/photo-1574629810360-7efbc193981d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80', 40.3842, 49.8058),
('Bayil Arena', 'Baku', 'Neftçilər pr. 1', 70, 4.7, 'https://images.unsplash.com/photo-1600250395372-b52e37478df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80', 40.3475, 49.8315);

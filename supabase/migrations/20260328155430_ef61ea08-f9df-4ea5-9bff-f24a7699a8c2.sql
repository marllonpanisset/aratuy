
-- Add profile_type enum
CREATE TYPE public.profile_type AS ENUM ('freelancer', 'empregador', 'voluntario', 'ong');

-- Add profile_type column to profiles
ALTER TABLE public.profiles ADD COLUMN profile_type public.profile_type;
ALTER TABLE public.profiles ADD COLUMN languages TEXT[];
ALTER TABLE public.profiles ADD COLUMN phone TEXT;

-- Freelancers table
CREATE TABLE public.freelancers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_url TEXT,
  hourly_rate NUMERIC,
  experience_years INTEGER,
  availability TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers viewable by everyone" ON public.freelancers FOR SELECT USING (true);
CREATE POLICY "Users can insert own freelancer" ON public.freelancers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own freelancer" ON public.freelancers FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_freelancers_updated_at BEFORE UPDATE ON public.freelancers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Volunteers table
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  areas_of_interest TEXT[],
  availability TEXT,
  motivation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Volunteers viewable by everyone" ON public.volunteers FOR SELECT USING (true);
CREATE POLICY "Users can insert own volunteer" ON public.volunteers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own volunteer" ON public.volunteers FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ONGs table
CREATE TABLE public.ongs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  mission TEXT,
  impact TEXT,
  project_category TEXT,
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ongs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ONGs viewable by everyone" ON public.ongs FOR SELECT USING (true);
CREATE POLICY "Users can insert own ong" ON public.ongs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ong" ON public.ongs FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_ongs_updated_at BEFORE UPDATE ON public.ongs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

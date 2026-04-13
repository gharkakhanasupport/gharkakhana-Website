-- 1. Create saved_addresses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.saved_addresses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    phone_number text NOT NULL,
    full_address text NOT NULL,
    pincode text NOT NULL,
    type text DEFAULT 'Home'::text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT saved_addresses_pkey PRIMARY KEY (id)
);

-- 2. If table exists but columns are missing, add them (Fix for PGRST204)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_addresses' AND column_name = 'full_address') THEN 
        ALTER TABLE public.saved_addresses ADD COLUMN full_address text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_addresses' AND column_name = 'full_name') THEN 
        ALTER TABLE public.saved_addresses ADD COLUMN full_name text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_addresses' AND column_name = 'phone_number') THEN 
        ALTER TABLE public.saved_addresses ADD COLUMN phone_number text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_addresses' AND column_name = 'pincode') THEN 
        ALTER TABLE public.saved_addresses ADD COLUMN pincode text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_addresses' AND column_name = 'type') THEN 
        ALTER TABLE public.saved_addresses ADD COLUMN type text DEFAULT 'Home';
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;

-- 4. Setup RLS Policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.saved_addresses;
CREATE POLICY "Users can view their own addresses" 
ON public.saved_addresses FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.saved_addresses;
CREATE POLICY "Users can insert their own addresses" 
ON public.saved_addresses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own addresses" ON public.saved_addresses;
CREATE POLICY "Users can update their own addresses" 
ON public.saved_addresses FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.saved_addresses;
CREATE POLICY "Users can delete their own addresses" 
ON public.saved_addresses FOR DELETE TO authenticated USING (auth.uid() = user_id);

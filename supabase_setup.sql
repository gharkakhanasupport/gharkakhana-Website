-- 1. Create or Update Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    key text NOT NULL,
    value boolean DEFAULT false,
    description text,
    updated_at timestamp with time zone DEFAULT now(),
    allowed_emails text[] DEFAULT '{}'::text[],
    CONSTRAINT site_settings_pkey PRIMARY KEY (id),
    CONSTRAINT site_settings_key_key UNIQUE (key)
);

-- If the table already exists but lacks the column, add it:
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'allowed_emails') THEN 
        ALTER TABLE public.site_settings ADD COLUMN allowed_emails text[] DEFAULT '{}'::text[];
    END IF; 
END $$;

-- Insert default demo mode setting if it does not exist
INSERT INTO public.site_settings (key, value, description, allowed_emails)
VALUES ('demo_mode', true, 'Enable demo mode globally. Whitelisted emails bypass this.', '{}'::text[])
ON CONFLICT (key) DO NOTHING;

-- Enable RLS and setup policy for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to site_settings"
ON public.site_settings FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to update site_settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert site_settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Fix Wallet & Wallet Transactions Policies
-- Ensure tables have RLS enabled
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing restricted policies if they exist so we can recreate them
DROP POLICY IF EXISTS "Users can view their own wallet" ON public.wallet;
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.wallet;
DROP POLICY IF EXISTS "Users can insert their own wallet" ON public.wallet;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.wallet_transactions;

-- Wallet Policies
CREATE POLICY "Users can view their own wallet" 
ON public.wallet FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" 
ON public.wallet FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet" 
ON public.wallet FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Wallet Transactions Policies
CREATE POLICY "Users can view their own transactions" 
ON public.wallet_transactions FOR SELECT TO authenticated 
USING (wallet_id IN (SELECT id FROM public.wallet WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own transactions" 
ON public.wallet_transactions FOR INSERT TO authenticated 
WITH CHECK (wallet_id IN (SELECT id FROM public.wallet WHERE user_id = auth.uid()));

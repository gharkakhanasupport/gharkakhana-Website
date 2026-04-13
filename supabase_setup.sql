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

-- Insert default demo mode setting if it does not exist
INSERT INTO public.site_settings (key, value, description, allowed_emails)
VALUES ('demo_mode', true, 'Enable demo mode globally. Whitelisted emails bypass this.', '{}'::text[])
ON CONFLICT (key) DO NOTHING;

-- 2. Wallet & Wallet Transactions
CREATE TABLE IF NOT EXISTS public.wallet (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance numeric DEFAULT 0,
    currency text DEFAULT 'INR',
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT wallet_pkey PRIMARY KEY (id),
    CONSTRAINT wallet_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    wallet_id uuid NOT NULL REFERENCES public.wallet(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    type text NOT NULL, -- 'credit' or 'debit'
    description text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id)
);

-- 3. Saved Addresses
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

-- 4. Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES auth.users(id),
    cook_id text, -- ID of the home chef
    customer_name text,
    customer_phone text,
    items jsonb DEFAULT '[]'::jsonb,
    total_amount numeric DEFAULT 0,
    status text DEFAULT 'pending'::text,
    delivery_address uuid REFERENCES public.saved_addresses(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

-- 5. Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
    amount numeric NOT NULL,
    currency text DEFAULT 'INR',
    payment_method text, -- 'cod', 'online', 'wallet'
    payment_type text, -- 'razorpay', 'wallet_topup'
    status text DEFAULT 'pending'::text,
    transaction_id text,
    gateway_reference text,
    razorpay_signature text,
    metadata jsonb DEFAULT '{}'::jsonb,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payments_pkey PRIMARY KEY (id)
);

-- 6. Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    menu_item_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT favorites_pkey PRIMARY KEY (id),
    CONSTRAINT favorites_user_item_key UNIQUE (user_id, menu_item_id)
);

-- 7. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    body text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- 8. Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code text NOT NULL,
    description text,
    discount_type text NOT NULL, -- 'percentage' or 'fixed'
    discount_value numeric NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT coupons_pkey PRIMARY KEY (id),
    CONSTRAINT coupons_code_key UNIQUE (code)
);

-- Apply RLS to everything
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Basic Public Read policies
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON public.site_settings;
CREATE POLICY "Allow public read access to site_settings" ON public.site_settings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public read access to coupons" ON public.coupons;
CREATE POLICY "Allow public read access to coupons" ON public.coupons FOR SELECT TO public USING (true);

-- User Restricted Policies
DROP POLICY IF EXISTS "Users can manage their own wallet" ON public.wallet;
CREATE POLICY "Users can manage their own wallet" ON public.wallet FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can manage their own wallet_transactions" ON public.wallet_transactions;
CREATE POLICY "Users can manage their own wallet_transactions" ON public.wallet_transactions FOR ALL TO authenticated 
USING (wallet_id IN (SELECT id FROM public.wallet WHERE user_id::text = auth.uid()::text));

DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.saved_addresses;
CREATE POLICY "Users can manage their own addresses" ON public.saved_addresses FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid()::text = customer_id::text);

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = customer_id::text);

DROP POLICY IF EXISTS "Users can manage their own payments" ON public.payments;
CREATE POLICY "Users can manage their own payments" ON public.payments FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can manage their own notifications" ON public.notifications;
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid()::text = user_id::text);

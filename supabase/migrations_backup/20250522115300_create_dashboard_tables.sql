-- Create system_status table
CREATE TABLE IF NOT EXISTS public.system_status (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    status text not null check (status in ('operational', 'degraded', 'outage')),
    value numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS public.user_activity (
    id uuid primary key default uuid_generate_v4(),
    date date not null,
    active_users integer not null default 0,
    api_requests integer not null default 0,
    avg_response_time numeric not null default 0,
    error_rate numeric not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create dashboard_metrics table
CREATE TABLE IF NOT EXISTS public.dashboard_metrics (
    id uuid primary key default uuid_generate_v4(),
    total_users integer not null default 0,
    total_api_requests integer not null default 0,
    avg_response_time numeric not null default 0,
    error_rate numeric not null default 0,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for system_status
CREATE POLICY "Anyone can read system_status"
    ON public.system_status FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can update system_status"
    ON public.system_status FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Create policies for user_activity
CREATE POLICY "Anyone can read user_activity"
    ON public.user_activity FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can update user_activity"
    ON public.user_activity FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Create policies for dashboard_metrics
CREATE POLICY "Anyone can read dashboard_metrics"
    ON public.dashboard_metrics FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can update dashboard_metrics"
    ON public.dashboard_metrics FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ));

-- Insert sample data for system status
INSERT INTO public.system_status (name, status, value) VALUES
    ('API', 'operational', 99.9),
    ('Database', 'operational', 99.8),
    ('Authentication', 'operational', 100.0),
    ('Storage', 'degraded', 87.5)
ON CONFLICT DO NOTHING;

-- Insert sample data for user activity (last 7 days)
INSERT INTO public.user_activity (date, active_users, api_requests, avg_response_time, error_rate) VALUES
    (CURRENT_DATE - interval '6 days', 45, 15000, 124, 0.12),
    (CURRENT_DATE - interval '5 days', 62, 18000, 118, 0.09),
    (CURRENT_DATE - interval '4 days', 58, 17000, 122, 0.11),
    (CURRENT_DATE - interval '3 days', 71, 21000, 115, 0.08),
    (CURRENT_DATE - interval '2 days', 80, 24000, 110, 0.07),
    (CURRENT_DATE - interval '1 days', 45, 16000, 125, 0.15),
    (CURRENT_DATE, 30, 12000, 130, 0.18)
ON CONFLICT DO NOTHING;

-- Insert initial dashboard metrics
INSERT INTO public.dashboard_metrics (total_users, total_api_requests, avg_response_time, error_rate)
VALUES (1234, 2100000, 124, 0.12)
ON CONFLICT DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_system_status_updated_at
    BEFORE UPDATE ON public.system_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_metrics_updated_at
    BEFORE UPDATE ON public.dashboard_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

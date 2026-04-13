import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SiteSettingsContext = createContext();

const STORAGE_KEY = 'gkk_demo_mode';

export function SiteSettingsProvider({ children }) {
  // Initialize from localStorage as fast fallback
  const [demoMode, setDemoMode] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value, allowed_emails')
          .eq('key', 'demo_mode')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching site settings:', error);
        }

        // Get current user to check against allowed_emails
        const { data: sessionData } = await supabase.auth.getSession();
        const userEmail = sessionData?.session?.user?.email;

        let isDemo = data?.value ?? false;
        const allowedEmails = data?.allowed_emails || [];

        // If Demo mode is globally ON, check if this user is exempt
        if (isDemo && allowedEmails.length > 0 && userEmail) {
          if (allowedEmails.includes(userEmail)) {
            isDemo = false; // Exempt user sees the real website
          }
        }

        setDemoMode(isDemo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(isDemo));
      } catch (err) {
        console.error('Fetch settings failed:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();

    // Listen for auth changes to re-evaluate demo mode based on email
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchSettings();
    });

    const channel = supabase
      .channel('site_settings_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_settings' },
        async (payload) => {
          if (payload.new.key === 'demo_mode') {
            const { data: sessionData } = await supabase.auth.getSession();
            const userEmail = sessionData?.session?.user?.email;
            
            let isDemo = payload.new.value;
            const allowedEmails = payload.new.allowed_emails || [];

            if (isDemo && allowedEmails.length > 0 && userEmail) {
              if (allowedEmails.includes(userEmail)) {
                isDemo = false;
              }
            }

            setDemoMode(isDemo);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(isDemo));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const toggleDemoMode = () => {
    setDemoMode((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <SiteSettingsContext.Provider value={{ demoMode, loading, toggleDemoMode }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}

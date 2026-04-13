import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,

  initializeAuth: () => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ 
        session, 
        user: session?.user ?? null,
        loading: false 
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ 
          session, 
          user: session?.user ?? null,
          loading: false
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    if (error) throw error;
    return data;
  },

  signUp: async (email, password, metadata) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      }
    });
    set({ loading: false });
    if (error) throw error;
    return data;
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();
    set({ user: null, session: null, loading: false });
    if (error) throw error;
  }
}));

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DEMO_DISHES, DEMO_KITCHENS } from '../data/demoData';

export function useMenu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { demoMode } = useSiteSettings();

  useEffect(() => {
    if (demoMode) {
      setItems(DEMO_DISHES);
      setCategories([...new Set(DEMO_DISHES.map(d => d.category))]);
      setLoading(false);
      return;
    }

    async function fetchMenu() {
      setLoading(true);
      
      // Parallel fetch for both tables
      const [menuItemsRes, dailyMenusRes] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true),
        supabase
          .from('daily_menus')
          .select('*')
          .eq('is_available', true)
      ]);

      if (menuItemsRes.error || dailyMenusRes.error) {
        setError(menuItemsRes.error?.message || dailyMenusRes.error?.message);
        setLoading(false);
        return;
      }

      const combined = [...(menuItemsRes.data || []), ...(dailyMenusRes.data || [])];
      // Sort by created_at descending by default
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setItems(combined);
      
      // Extract unique categories
      const uniqueCats = [...new Set(combined.map((d) => d.category).filter(Boolean))];
      setCategories(uniqueCats);
      setLoading(false);
    }

    fetchMenu();

    // Real-time subscriptions for both tables
    const menuChannel = supabase
      .channel('menu_items_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        (payload) => handlePayload(payload)
      )
      .subscribe();

    const dailyChannel = supabase
      .channel('daily_menus_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_menus' },
        (payload) => handlePayload(payload)
      )
      .subscribe();

    function handlePayload(payload) {
      if (payload.eventType === 'INSERT' && payload.new.is_available) {
        setItems((prev) => [payload.new, ...prev]);
        setCategories((prev) => {
          const cat = payload.new.category;
          return cat && !prev.includes(cat) ? [...prev, cat] : prev;
        });
      } else if (payload.eventType === 'UPDATE') {
        setItems((prev) => {
          const updated = prev.map((item) => (item.id === payload.new.id ? payload.new : item));
          return payload.new.is_available 
            ? updated 
            : updated.filter(item => item.id !== payload.new.id);
        });
      } else if (payload.eventType === 'DELETE') {
        setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
      }
    }

    return () => {
      supabase.removeChannel(menuChannel);
      supabase.removeChannel(dailyChannel);
    };
  }, [demoMode]);

  return { items, categories, loading, error };
}

// Fetch ALL menu items (including unavailable) for homepage specials
export function useMenuAll() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { demoMode } = useSiteSettings();

  useEffect(() => {
    if (demoMode) {
      setItems(DEMO_DISHES.slice(0, 6));
      setLoading(false);
      return;
    }

    async function fetchAll() {
      // Parallel fetch for both tables
      const [menuItemsRes, dailyMenusRes] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('daily_menus')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6)
      ]);

      const combined = [...(menuItemsRes.data || []), ...(dailyMenusRes.data || [])];
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setItems(combined.slice(0, 6));
      setLoading(false);
    }
    fetchAll();
  }, [demoMode]);

  return { items, loading };
}

// Fetch all available kitchens
export function useKitchens() {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const { demoMode } = useSiteSettings();

  useEffect(() => {
    if (demoMode) {
      setKitchens(DEMO_KITCHENS);
      setLoading(false);
      return;
    }

    async function fetchKitchens() {
      const { data } = await supabase
        .from('kitchens')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false });

      setKitchens(data || []);
      setLoading(false);
    }
    fetchKitchens();
  }, [demoMode]);

  return { kitchens, loading };
}

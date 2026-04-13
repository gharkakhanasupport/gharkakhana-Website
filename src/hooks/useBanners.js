import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DEMO_BANNERS } from '../data/demoData';

/**
 * useBanners — fetches banners from Supabase `banners` table.
 * Falls back to DEMO_BANNERS when in demo mode or on error.
 *
 * Expected table schema:
 *   banners (id, title, subtitle, image, button_text, link, is_active, display_order, created_at)
 */
export function useBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { demoMode } = useSiteSettings();

  useEffect(() => {
    if (demoMode) {
      setBanners(DEMO_BANNERS);
      setLoading(false);
      return;
    }

    async function fetchBanners() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.warn('Banner fetch failed, using demo banners:', error.message);
          setBanners(DEMO_BANNERS);
        } else if (data && data.length > 0) {
          // Map DB columns to component props
          setBanners(
            data.map((b) => ({
              id: b.id,
              image: b.image || b.image_url,
              title: b.title,
              subtitle: b.subtitle || b.description,
              buttonText: b.button_text || 'Explore',
              link: b.link || '/menu',
            }))
          );
        } else {
          // No banners in DB — don't show anything (empty array = BannerSection returns null)
          setBanners([]);
        }
      } catch (err) {
        console.warn('Banner fetch error:', err);
        setBanners(DEMO_BANNERS);
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();

    // Real-time: re-fetch when banners table changes
    const channel = supabase
      .channel('banners_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'banners' },
        () => {
          fetchBanners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [demoMode]);

  return { banners, loading };
}

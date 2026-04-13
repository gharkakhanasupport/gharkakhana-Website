import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DEMO_ORDERS, DEMO_NOTIFICATIONS, DEMO_WALLET } from '../data/demoData';

export function useDashboard(userId) {
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const { demoMode } = useSiteSettings();

  useEffect(() => {
    if (!userId) return;

    if (demoMode) {
      setOrders(DEMO_ORDERS);
      setNotifications(DEMO_NOTIFICATIONS);
      setWallet(DEMO_WALLET);
      setFavorites([]);
      setCoupons([]);
      setAddresses([]);
      setLoading(false);
      return;
    }

    async function fetchAll() {
      setLoading(true);

      const [ordersRes, favoritesRes, notificationsRes, couponsRes, addressesRes, walletRes] = await Promise.allSettled([
        supabase
          .from('orders')
          .select('*')
          .eq('customer_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('favorites')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(15),
        supabase
          .from('coupons')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('saved_addresses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('wallet')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
      ]);

      setOrders(ordersRes.status === 'fulfilled' ? (ordersRes.value.data || []) : []);
      setFavorites(favoritesRes.status === 'fulfilled' ? (favoritesRes.value.data || []) : []);
      setNotifications(notificationsRes.status === 'fulfilled' ? (notificationsRes.value.data || []) : []);
      setCoupons(couponsRes.status === 'fulfilled' ? (couponsRes.value.data || []) : []);
      setAddresses(addressesRes.status === 'fulfilled' ? (addressesRes.value.data || []) : []);
      setWallet(walletRes.status === 'fulfilled' ? (walletRes.value.data || null) : null);
      setLoading(false);
    }

    fetchAll();

    // Real-time for orders
    const orderChannel = supabase
      .channel('user_orders_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `customer_id=eq.${userId}` },
        () => {
          // Re-fetch on any order change
          supabase
            .from('orders')
            .select('*')
            .eq('customer_id', userId)
            .order('created_at', { ascending: false })
            .limit(20)
            .then(({ data }) => setOrders(data || []));
        }
      )
      .subscribe();

    // Real-time for notifications
    const notifChannel = supabase
      .channel('user_notif_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 15));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [userId, demoMode]);

  return { orders, favorites, notifications, coupons, addresses, wallet, loading };
}

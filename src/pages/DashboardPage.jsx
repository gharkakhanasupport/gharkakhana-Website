import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingBag, FiHeart, FiBell, FiTag, FiArrowRight, FiClock, FiUser,
  FiMail, FiPhone, FiPlus, FiTrash2, FiMapPin, FiCreditCard, FiEdit3,
  FiCheck, FiX, FiLock, FiShield, FiSmartphone, FiCamera, FiChevronRight
} from 'react-icons/fi';
import { useAuthStore } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { DemoDashboard } from '../components/DemoDashboard';
import { Container } from '../components/Container';
import { Toggle } from '../components/Toggle';
import { AddAddressModal } from '../components/AddAddressModal';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { openRazorpayCheckout } from '../utils/razorpay';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const TOPUP_AMOUNTS = [100, 200, 500, 1000, 2000];

function WalletCard({ wallet, user }) {
  const [showTopup, setShowTopup] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleTopup = async (amount) => {
    if (!amount || amount < 1) {
      toast.error('Enter a valid amount');
      return;
    }
    setProcessing(true);
    try {
      // 1. Create a payment record BEFORE opening Razorpay (audit trail)
      const { data: paymentRecord, error: payErr } = await supabase.from('payments').insert({
        user_id: user.id,
        amount,
        payment_type: 'razorpay',
        payment_method: 'wallet_topup',
        status: 'initiated',
        metadata: { type: 'wallet_topup', initiated_at: new Date().toISOString() },
      }).select().single();

      if (payErr) throw payErr;

      // 2. Open Razorpay Checkout
      const paymentResponse = await openRazorpayCheckout({
        amount,
        orderId: paymentRecord.id,
        customerName: user?.user_metadata?.full_name || user?.user_metadata?.first_name || '',
        customerEmail: user?.email || '',
        customerPhone: user?.user_metadata?.phone || '',
        description: `GKK Wallet Top-up ₹${amount}`,
      });

      // 3. Update payment record with Razorpay response
      await supabase.from('payments').update({
        status: 'completed',
        transaction_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature || null,
        gateway_reference: paymentResponse.razorpay_order_id || null,
        completed_at: new Date().toISOString(),
        metadata: {
          type: 'wallet_topup',
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        },
      }).eq('id', paymentRecord.id);

      // 4. Credit the wallet
      const { data: w, error: fetchErr } = await supabase.from('wallet').select('*').eq('user_id', user.id).maybeSingle();
      if (fetchErr) throw fetchErr;

      let walletId;
      if (w) {
        const { error: updateErr } = await supabase.from('wallet').update({ balance: (w.balance || 0) + amount }).eq('id', w.id);
        if (updateErr) throw updateErr;
        walletId = w.id;
      } else {
        const { data: cw, error: insertErr } = await supabase.from('wallet').insert({ user_id: user.id, balance: amount }).select().single();
        if (insertErr) throw insertErr;
        walletId = cw.id;
      }

      // Insert transaction log
      const { error: txnErr } = await supabase.from('wallet_transactions').insert({
        wallet_id: walletId,
        amount,
        type: 'credit',
        description: `Wallet Top-up via Razorpay (Ref: ${paymentRecord.id})`,
      });
      if (txnErr) throw txnErr;

      toast.success(`₹${amount} added to wallet!`);
      setShowTopup(false);
      setCustomAmount('');
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      if (err.message?.includes('cancelled')) {
        toast('Payment cancelled', { icon: '❌' });
      } else {
        toast.error(err.message || 'Payment failed');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-green/90 to-brand-greenDark p-5 text-white shadow-[0_12px_28px_rgba(95,166,59,0.25)]">
      <div className="flex items-center gap-2 mb-3">
        <FiCreditCard className="h-5 w-5" />
        <span className="text-sm font-bold">GKK Wallet</span>
      </div>
      <p className="text-3xl font-bold">₹{wallet?.balance || 0}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-white/70">Available balance</p>
        <button
          onClick={() => setShowTopup(!showTopup)}
          className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30 transition-colors border border-white/30 shadow-sm shadow-black/10 backdrop-blur-sm"
        >
          {showTopup ? 'Cancel' : '+ Add Money'}
        </button>
      </div>

      <AnimatePresence>
        {showTopup && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/15">
              {/* Preset amounts */}
              <div className="flex flex-wrap gap-2 mb-3">
                {TOPUP_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    disabled={processing}
                    onClick={() => handleTopup(amt)}
                    className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold hover:bg-white/30 transition-colors border border-white/20 disabled:opacity-50"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              {/* Custom amount */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Custom ₹"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="1"
                  max="10000"
                  className="flex-1 rounded-lg bg-white/15 border border-white/20 px-3 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                />
                <button
                  disabled={processing || !customAmount}
                  onClick={() => handleTopup(Number(customAmount))}
                  className="rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-brand-green hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing…' : 'Add'}
                </button>
              </div>
              <p className="text-[10px] text-white/50 mt-2">Powered by Razorpay • Test Mode</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle, actionLabel, actionTo }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cream/80 text-brand-brown/40">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-semibold text-brand-brown/60">{title}</p>
      <p className="mt-1 text-xs text-brand-brown/40">{subtitle}</p>
      {actionLabel && (
        <button
          onClick={() => navigate(actionTo || '/menu')}
          className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline"
        >
          {actionLabel} <FiArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function InlineEditField({ label, value, icon: Icon, onSave, type = 'text' }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleSave = () => {
    onSave?.(editValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-brand-brown/6 last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-cream/60 text-brand-brown/40">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-brown/40">{label}</p>
          {editing ? (
            <div className="flex items-center gap-2 mt-0.5">
              <input
                ref={inputRef}
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                className="flex-1 rounded-lg border border-brand-brown/10 bg-white px-2.5 py-1 text-sm text-brand-brown focus:outline-none focus:border-brand-green/40 focus:ring-1 focus:ring-brand-green/20"
              />
              <button onClick={handleSave} className="rounded-lg bg-brand-green p-1.5 text-white hover:bg-brand-greenDark transition-colors">
                <FiCheck className="h-3 w-3" />
              </button>
              <button onClick={handleCancel} className="rounded-lg bg-brand-brown/10 p-1.5 text-brand-brown/40 hover:bg-brand-brown/20 transition-colors">
                <FiX className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <p className="text-sm font-semibold text-brand-brown truncate mt-0.5">{value || '—'}</p>
          )}
        </div>
      </div>
      {!editing && (
        <button
          onClick={() => setEditing(true)}
          className="shrink-0 ml-2 rounded-lg p-2 text-brand-brown/30 hover:text-brand-green hover:bg-brand-green/5 transition-colors"
        >
          <FiEdit3 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function SettingsPanel({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/50 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-brand-cream/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <span className="text-sm font-bold text-brand-brown">{title}</span>
        </div>
        <FiChevronRight className={`h-4 w-4 text-brand-brown/30 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'delivered' || s === 'completed') return 'bg-green-50 text-green-700 border-green-200';
  if (s === 'cooking' || s === 'preparing') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (s === 'cancelled' || s === 'failed') return 'bg-red-50 text-red-600 border-red-200';
  if (s === 'dispatched' || s === 'on the way') return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-brand-cream/50 text-brand-brown/70 border-brand-brown/10';
}

export function DashboardPage() {
  const { user, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const { demoMode, loading: settingsLoading } = useSiteSettings();
  const { orders, favorites, notifications, coupons, addresses, wallet, loading } = useDashboard(user?.id);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Notification preferences (local state for demo)
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    push: true,
    sms: false,
    promotions: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || settingsLoading || !user) {
    return <div className="min-h-screen bg-[#f2d4a8]" />;
  }

  if (demoMode) {
    return <DemoDashboard user={user} />;
  }

  const { user_metadata } = user;
  const avatarFileRef = useRef(null);

  const handleAvatarUpload = () => {
    avatarFileRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For now, show a toast — full crop modal would go here
    toast.success('Avatar upload coming soon!');
  };

  return (
    <div className="min-h-screen bg-[#f2d4a8] pt-6 pb-16">
      <Container>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-6"
        >
          {/* Two-Column Profile Layout */}
          <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            {/* Left Column — Avatar & Identity */}
            <div className="space-y-4">
              <div className="rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/50 shadow-soft overflow-hidden">
                {/* Cover */}
                <div className="h-20 bg-gradient-to-r from-brand-green/20 via-brand-cream/60 to-brand-green/10" />

                <div className="px-6 pb-6 -mt-10 text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto w-fit">
                    <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-brand-green flex items-center justify-center text-2xl font-bold text-white uppercase shadow-lg">
                      {user_metadata?.avatar_url ? (
                        <img src={user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        user_metadata?.first_name?.[0] || user_metadata?.full_name?.[0] || user.email[0]
                      )}
                    </div>
                    <button
                      onClick={handleAvatarUpload}
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white shadow-md hover:bg-brand-greenDark transition-colors border-2 border-white"
                    >
                      <FiCamera className="h-3 w-3" />
                    </button>
                    <input ref={avatarFileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </div>

                  <h1 className="mt-3 text-xl font-bold text-brand-brown tracking-tight">
                    {user_metadata?.full_name || user_metadata?.first_name || 'Welcome!'}
                  </h1>
                  <p className="mt-1 text-xs text-brand-brown/50">{user.email}</p>
                  {user_metadata?.phone && (
                    <p className="mt-0.5 text-xs text-brand-brown/50">{user_metadata.phone}</p>
                  )}

                  {/* Mini Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-brand-cream/40 px-3 py-2.5">
                      <p className="text-lg font-bold text-brand-brown">{orders.length}</p>
                      <p className="text-[10px] font-semibold text-brand-brown/40 uppercase tracking-wider">Orders</p>
                    </div>
                    <div className="rounded-xl bg-brand-cream/40 px-3 py-2.5">
                      <p className="text-lg font-bold text-brand-brown">{favorites.length}</p>
                      <p className="text-[10px] font-semibold text-brand-brown/40 uppercase tracking-wider">Favorites</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate('/menu')}
                      className="flex-1 rounded-xl bg-white/80 border border-brand-green/20 px-4 py-2.5 text-xs font-bold text-brand-green hover:bg-brand-green hover:text-white transition-all"
                    >
                      Dishes
                    </button>
                    <button
                      onClick={() => navigate('/menu')}
                      className="flex-1 rounded-xl bg-brand-green px-4 py-2.5 text-xs font-bold text-white shadow-[0_6px_16px_rgba(95,166,59,0.2)] hover:shadow-[0_10px_20px_rgba(95,166,59,0.3)] transition-all"
                    >
                      Browse Menu
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallet Card */}
              <WalletCard wallet={wallet} user={user} />
            </div>

            {/* Right Column — Settings Panels */}
            <div className="space-y-3">
              {/* Personal Info */}
              <SettingsPanel title="Personal Info" icon={FiUser} defaultOpen={true}>
                <InlineEditField
                  label="Full Name"
                  value={user_metadata?.full_name || user_metadata?.first_name || ''}
                  icon={FiUser}
                  onSave={(val) => toast.success(`Name updated: ${val}`)}
                />
                <InlineEditField
                  label="Email Address"
                  value={user.email}
                  icon={FiMail}
                  type="email"
                  onSave={(val) => toast.success(`Email updated: ${val}`)}
                />
                <InlineEditField
                  label="Phone Number"
                  value={user_metadata?.phone || ''}
                  icon={FiPhone}
                  type="tel"
                  onSave={(val) => toast.success(`Phone updated: ${val}`)}
                />
              </SettingsPanel>

              {/* Account Security */}
              <SettingsPanel title="Account Security" icon={FiShield}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-brand-brown/6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cream/60 text-brand-brown/40">
                        <FiLock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-brown">Password</p>
                        <p className="text-xs text-brand-brown/40">Last changed: Never</p>
                      </div>
                    </div>
                    <button className="rounded-xl border border-brand-brown/10 px-3 py-1.5 text-xs font-bold text-brand-brown/60 hover:border-brand-green/30 hover:text-brand-green transition-all">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cream/60 text-brand-brown/40">
                        <FiSmartphone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-brown">Two-Factor Auth</p>
                        <p className="text-xs text-brand-brown/40">Not enabled</p>
                      </div>
                    </div>
                    <button className="rounded-xl border border-brand-brown/10 px-3 py-1.5 text-xs font-bold text-brand-brown/60 hover:border-brand-green/30 hover:text-brand-green transition-all">
                      Enable
                    </button>
                  </div>
                </div>
              </SettingsPanel>

              {/* Notification Preferences */}
              <SettingsPanel title="Notification Preferences" icon={FiBell}>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Order updates & receipts via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Real-time alerts on your device' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Text messages for critical updates' },
                    { key: 'promotions', label: 'Promotional Updates', desc: 'Deals, offers & new kitchen alerts' },
                  ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-semibold text-brand-brown">{pref.label}</p>
                        <p className="text-xs text-brand-brown/40">{pref.desc}</p>
                      </div>
                      <Toggle
                        checked={notifPrefs[pref.key]}
                        onChange={(val) => setNotifPrefs(prev => ({ ...prev, [pref.key]: val }))}
                        labeled
                      />
                    </div>
                  ))}
                </div>
              </SettingsPanel>

              {/* Connected Accounts */}
              <SettingsPanel title="Connected Accounts" icon={FiLock}>
                <div className="space-y-3">
                  {[
                    { name: 'Google', connected: !!user.app_metadata?.provider && user.app_metadata.provider === 'google', icon: '🔵' },
                    { name: 'Apple', connected: false, icon: '⚫' },
                  ].map(acc => (
                    <div key={acc.name} className="flex items-center justify-between py-3 border-b border-brand-brown/6 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{acc.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-brand-brown">{acc.name}</p>
                          <p className="text-xs text-brand-brown/40">{acc.connected ? 'Connected' : 'Not connected'}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        acc.connected
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-brand-cream/50 text-brand-brown/40 border border-brand-brown/10'
                      }`}>
                        {acc.connected ? 'Active' : 'Link'}
                      </span>
                    </div>
                  ))}
                </div>
              </SettingsPanel>
            </div>
          </motion.div>

          {/* Quick Stats Row */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Orders', value: orders.length, icon: FiShoppingBag, color: 'text-blue-600 bg-blue-50' },
              { label: 'Favorites', value: favorites.length, icon: FiHeart, color: 'text-red-500 bg-red-50' },
              { label: 'Wallet', value: `₹${wallet?.balance || 0}`, icon: FiCreditCard, color: 'text-brand-green bg-green-50' },
              { label: 'Addresses', value: addresses.length, icon: FiMapPin, color: 'text-purple-600 bg-purple-50' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/70 backdrop-blur border border-white/50 p-4 shadow-sm">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-2xl font-bold text-brand-brown">{stat.value}</p>
                <p className="text-xs font-medium text-brand-brown/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Orders */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2">
                  <FiShoppingBag className="text-brand-green" /> My Orders
                </h2>
                {orders.length > 0 && (
                  <span className="text-xs font-medium text-brand-brown/40">{orders.length} total</span>
                )}
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse rounded-xl bg-brand-cream/40 h-16" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <EmptyState
                  icon={FiShoppingBag}
                  title="No orders yet"
                  subtitle="Explore our menu and place your first order!"
                  actionLabel="Browse Menu"
                />
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-xl border border-brand-brown/6 bg-white/80 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-brand-brown">
                          Order #{(order.id || '').slice(0, 8)}
                        </p>
                        <p className="mt-0.5 text-xs text-brand-brown/50 flex items-center gap-1">
                          <FiClock className="h-3 w-3" /> {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.total_amount && (
                          <span className="text-sm font-bold text-brand-brown">₹{order.total_amount}</span>
                        )}
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColor(order.status || 'Pending')}`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Favorites */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2">
                  <FiHeart className="text-red-400" /> My Favorites
                </h2>
                {favorites.length > 0 && (
                  <span className="text-xs font-medium text-brand-brown/40">{favorites.length} saved</span>
                )}
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse rounded-xl bg-brand-cream/40 h-14" />
                  ))}
                </div>
              ) : favorites.length === 0 ? (
                <EmptyState
                  icon={FiHeart}
                  title="No favorites yet"
                  subtitle="Browse the menu and save dishes you love."
                  actionLabel="Discover Dishes"
                />
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="flex items-center gap-3 rounded-xl border border-brand-brown/6 bg-white/80 px-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-400">
                        <FiHeart className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brand-brown truncate">{fav.menu_items?.name || 'Saved item'}</p>
                        <p className="text-xs text-brand-brown/40">{formatDate(fav.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Notifications */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2">
                  <FiBell className="text-amber-500" /> Notifications
                </h2>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse rounded-xl bg-brand-cream/40 h-14" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <EmptyState
                  icon={FiBell}
                  title="All caught up!"
                  subtitle="You'll see order updates and offers here."
                />
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="rounded-xl border border-brand-brown/6 bg-white/80 px-4 py-3">
                      <p className="text-sm text-brand-brown font-medium">{notif.title}</p>
                      <p className="text-xs text-brand-brown/70 mt-0.5">{notif.body}</p>
                      <p className="mt-1 text-[10px] text-brand-brown/40">{formatDate(notif.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Coupons */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2">
                  <FiTag className="text-brand-green" /> Available Coupons
                </h2>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse rounded-xl bg-brand-cream/40 h-14" />
                  ))}
                </div>
              ) : coupons.length === 0 ? (
                <EmptyState
                  icon={FiTag}
                  title="No coupons available"
                  subtitle="Check back for exclusive deals and discounts!"
                />
              ) : (
                <div className="space-y-3">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="flex items-center justify-between rounded-xl border-2 border-dashed border-brand-green/30 bg-green-50/50 px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-brand-brown">{coupon.code}</p>
                        <p className="text-xs text-brand-brown/50">{coupon.description}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-white">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Addresses */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2">
                  <FiMapPin className="text-purple-500" /> Saved Addresses
                </h2>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setIsAddressModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline bg-brand-green/5 px-4 py-2 rounded-full"
                >
                  <FiPlus /> Add New
                </button>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => <div key={i} className="animate-pulse rounded-2xl bg-brand-cream/40 h-24" />)}
                </div>
              ) : addresses.length === 0 ? (
                <EmptyState
                  icon={FiMapPin}
                  title="No addresses saved"
                  subtitle="Add your delivery address for faster checkout."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="group relative rounded-2xl border border-brand-brown/10 bg-white/80 p-5 pr-10 transition-all hover:shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">{addr.type}</span>
                      </div>
                      <p className="font-bold text-brand-brown truncate">{addr.full_name}</p>
                      <p className="mt-1 text-xs text-brand-brown/60 line-clamp-2 leading-relaxed h-8">
                        {addr.full_address}, {addr.pincode}
                      </p>
                      <p className="mt-2 text-[10px] font-medium text-brand-brown/40">{addr.phone_number}</p>

                        <button
                          onClick={() => {
                            setEditingAddress(addr);
                            setIsAddressModalOpen(true);
                          }}
                          className="mr-1 rounded-full p-2 text-brand-green opacity-0 transition-all hover:bg-brand-green/10 group-hover:opacity-100"
                        >
                          <FiEdit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Delete this address?')) return;
                            try {
                              const { error } = await supabase.from('saved_addresses').delete().eq('id', addr.id);
                              if (error) throw error;
                              toast.success('Address deleted');
                              window.location.reload();
                            } catch (err) {
                              toast.error('Failed to delete');
                            }
                          }}
                          className="rounded-full p-2 text-red-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </Container>

      <AddAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        userId={user?.id}
        initialData={editingAddress}
        onAddressAdded={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}

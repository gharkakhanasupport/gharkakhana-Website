import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiBell, FiTag, FiMapPin, FiClock, FiArrowRight, FiCreditCard, FiUser, FiCamera, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/Container';
import { DemoOverlay } from '../components/DemoOverlay';
import { Toggle } from '../components/Toggle';
import { DEMO_ORDERS, DEMO_NOTIFICATIONS, DEMO_WALLET } from '../data/demoData';
import { useState } from 'react';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const DEMO_FAVORITES = [
  { id: 'f1', name: "Maa's Dal Tadka", chef: "Sunita's Kitchen" },
  { id: 'f2', name: 'Kolkata Kathi Roll', chef: "Raju's Rolls" },
  { id: 'f3', name: 'Mishti Doi', chef: 'Bengali Sweets' },
];

const DEMO_COUPONS = [
  { id: 'c1', code: 'WELCOME50', desc: '50% off your first order', value: 50, type: '%' },
  { id: 'c2', code: 'HOMEFOOD', desc: 'Flat ₹30 off on orders above ₹199', value: 30, type: '₹' },
];

const DEMO_ADDRESSES = [
  { id: 'a1', type: 'Home', full_name: 'Demo User', full_address: '42, Salt Lake Sector V, Kolkata', pincode: '700091', phone_number: '+91-9477564633' },
];

function statusColor(status) {
  const s = status.toLowerCase();
  if (s === 'delivered') return 'bg-green-50 text-green-700 border-green-200';
  if (s === 'cooking') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (s === 'on the way') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (s === 'cancelled') return 'bg-red-50 text-red-600 border-red-200';
  return 'bg-brand-cream/50 text-brand-brown/70 border-brand-brown/10';
}

export function DemoDashboard({ user }) {
  const navigate = useNavigate();
  const meta = user?.user_metadata || {};

  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    push: true,
    sms: false,
    promotions: true,
  });

  return (
    <div className="min-h-screen bg-[#f2d4a8] pt-6 pb-16">
      <Container>
        <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">
          {/* Demo Banner */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-white border border-amber-200/60 px-5 py-3.5 flex items-center gap-3">
            <span className="text-xl">🎭</span>
            <div>
              <p className="text-sm font-bold text-amber-800">Demo Mode Active</p>
              <p className="text-xs text-amber-700/70">This is a preview dashboard with sample data. Real orders will appear here once you start ordering!</p>
            </div>
          </motion.div>

          {/* Two-Column Profile Layout */}
          <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            {/* Left Column — Avatar & Identity */}
            <div className="space-y-4">
              <div className="rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/50 shadow-soft overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-brand-green/20 via-brand-cream/60 to-brand-green/10" />
                <div className="px-6 pb-6 -mt-10 text-center">
                  <div className="relative mx-auto w-fit">
                    <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-brand-green flex items-center justify-center text-2xl font-bold text-white uppercase shadow-lg">
                      {meta.avatar_url ? (
                        <img src={meta.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        meta.first_name?.[0] || meta.full_name?.[0] || user?.email?.[0] || 'U'
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white shadow-md border-2 border-white opacity-50 cursor-not-allowed">
                      <FiCamera className="h-3 w-3" />
                    </div>
                  </div>
                  <h1 className="mt-3 text-xl font-bold text-brand-brown tracking-tight">
                    {meta.full_name || meta.first_name || 'Welcome!'}
                  </h1>
                  <p className="mt-1 text-xs text-brand-brown/50">{user?.email}</p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-brand-cream/40 px-3 py-2.5">
                      <p className="text-lg font-bold text-brand-brown">{DEMO_ORDERS.length}</p>
                      <p className="text-[10px] font-semibold text-brand-brown/40 uppercase tracking-wider">Orders</p>
                    </div>
                    <div className="rounded-xl bg-brand-cream/40 px-3 py-2.5">
                      <p className="text-lg font-bold text-brand-brown">{DEMO_FAVORITES.length}</p>
                      <p className="text-[10px] font-semibold text-brand-brown/40 uppercase tracking-wider">Favorites</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/menu')}
                    className="mt-4 w-full rounded-xl bg-brand-green px-4 py-2.5 text-xs font-bold text-white shadow-[0_6px_16px_rgba(95,166,59,0.2)] hover:shadow-[0_10px_20px_rgba(95,166,59,0.3)] transition-all"
                  >
                    Browse Menu
                  </button>
                </div>
              </div>

              {/* Wallet Card */}
              <div className="rounded-2xl bg-gradient-to-br from-brand-green/90 to-brand-greenDark p-5 text-white shadow-[0_12px_28px_rgba(95,166,59,0.25)]">
                <div className="flex items-center gap-2 mb-3">
                  <FiCreditCard className="h-5 w-5" />
                  <span className="text-sm font-bold">Wallet</span>
                </div>
                <p className="text-3xl font-bold">₹{DEMO_WALLET.balance}</p>
                <p className="mt-1 text-xs text-white/70">Available balance</p>
              </div>
            </div>

            {/* Right Column — Settings Panels (Demo Overlays) */}
            <div className="space-y-3">
              {/* Personal Info — Demo Overlay */}
              <DemoOverlay active={true} title="Coming Soon" subtitle="Profile editing will be available shortly.">
                <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/50 shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                      <FiUser className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-bold text-brand-brown">Personal Info</span>
                  </div>
                  <div className="space-y-3">
                    <div className="py-2 border-b border-brand-brown/6">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-brown/40">Full Name</p>
                      <p className="text-sm font-semibold text-brand-brown">{meta.full_name || 'Demo User'}</p>
                    </div>
                    <div className="py-2 border-b border-brand-brown/6">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-brown/40">Email</p>
                      <p className="text-sm font-semibold text-brand-brown">{user?.email || 'demo@gkk.com'}</p>
                    </div>
                    <div className="py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-brown/40">Phone</p>
                      <p className="text-sm font-semibold text-brand-brown">+91-9477564633</p>
                    </div>
                  </div>
                </div>
              </DemoOverlay>

              {/* Notification Preferences — Working */}
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/50 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <FiBell className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-bold text-brand-brown">Notification Preferences</span>
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Order updates via email' },
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
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Orders', value: DEMO_ORDERS.length, icon: FiShoppingBag, color: 'text-blue-600 bg-blue-50' },
              { label: 'Favorites', value: DEMO_FAVORITES.length, icon: FiHeart, color: 'text-red-500 bg-red-50' },
              { label: 'Wallet', value: `₹${DEMO_WALLET.balance}`, icon: FiCreditCard, color: 'text-brand-green bg-green-50' },
              { label: 'Coupons', value: DEMO_COUPONS.length, icon: FiTag, color: 'text-green-600 bg-green-50' },
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
            {/* Demo Orders */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
              <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2 mb-5">
                <FiShoppingBag className="text-brand-green" /> Recent Orders
              </h2>
              <div className="space-y-3">
                {DEMO_ORDERS.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-xl border border-brand-brown/6 bg-white/80 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-brand-brown">{order.name}</p>
                      <p className="mt-0.5 text-xs text-brand-brown/50 flex items-center gap-1">
                        <FiClock className="h-3 w-3" /> {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-brand-brown">₹{order.total}</span>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Demo Favorites */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
              <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2 mb-5">
                <FiHeart className="text-red-400" /> Saved Favorites
              </h2>
              <div className="space-y-3">
                {DEMO_FAVORITES.map((fav) => (
                  <div key={fav.id} className="flex items-center gap-3 rounded-xl border border-brand-brown/6 bg-white/80 px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-400">
                      <FiHeart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-brown">{fav.name}</p>
                      <p className="text-xs text-brand-brown/40">{fav.chef}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Demo Notifications */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
              <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2 mb-5">
                <FiBell className="text-amber-500" /> Notifications
              </h2>
              <div className="space-y-3">
                {DEMO_NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className="rounded-xl border border-brand-brown/6 bg-white/80 px-4 py-3">
                    <p className="text-sm text-brand-brown">{notif.message}</p>
                    <p className="mt-1 text-xs text-brand-brown/40">{notif.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Demo Coupons */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
              <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2 mb-5">
                <FiTag className="text-brand-green" /> Available Coupons
              </h2>
              <div className="space-y-3">
                {DEMO_COUPONS.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between rounded-xl border-2 border-dashed border-brand-green/30 bg-green-50/50 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-brand-brown">{coupon.code}</p>
                      <p className="text-xs text-brand-brown/50">{coupon.desc}</p>
                    </div>
                    <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-white">
                      {coupon.type === '%' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/menu')}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl border border-brand-green/20 bg-brand-green/5 py-3 text-sm font-bold text-brand-green hover:bg-brand-green/10 transition-colors"
              >
                Explore Full Menu <FiArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Demo Addresses — with overlay */}
            <DemoOverlay active={true} title="Coming Soon" subtitle="Address management will be available shortly." className="lg:col-span-2">
              <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/70 backdrop-blur border border-white/50 p-6 shadow-soft">
                <h2 className="text-lg font-bold text-brand-brown flex items-center gap-2 mb-5">
                  <FiMapPin className="text-purple-500" /> Saved Addresses
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {DEMO_ADDRESSES.map((addr) => (
                    <div key={addr.id} className="rounded-2xl border border-brand-brown/10 bg-white/80 p-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">{addr.type}</span>
                      <p className="mt-1 font-bold text-brand-brown">{addr.full_name}</p>
                      <p className="mt-1 text-xs text-brand-brown/60">{addr.full_address}, {addr.pincode}</p>
                      <p className="mt-2 text-[10px] font-medium text-brand-brown/40">{addr.phone_number}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </DemoOverlay>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

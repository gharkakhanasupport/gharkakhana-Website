import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiMail, FiMenu, FiShoppingCart } from 'react-icons/fi';
import { navLinks } from '../data/site';
import { Button } from './Button';
import { Container } from './Container';
import { AuthModal } from './AuthModal';
import { WishlistModal } from './WishlistModal';
import { useAuthStore } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
const logoUrl = new URL('../Images/GharKakhana Logo.png', import.meta.url).href;

function navClassName({ isActive }) {
  return `font-navbar relative rounded-full px-4 py-2 text-sm font-extrabold tracking-tight transition-all duration-300 ${
    isActive
      ? 'bg-brand-green text-white shadow-[0_8px_20px_rgba(95,166,59,0.25)]'
      : 'text-brand-brown/80 hover:bg-white hover:text-brand-brown'
  }`;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { getTotalItems } = useCart();
  const { scrollYProgress } = useScroll();
  const { demoMode } = useSiteSettings();

  const isAppRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/menu') || location.pathname.startsWith('/kitchen') || location.pathname.startsWith('/cart') || location.pathname.startsWith('/checkout');
  
  let currentNavLinks = navLinks;
  if (isAppRoute) {
    currentNavLinks = [
      { label: 'Home', to: '/' },
      { label: 'Menu', to: '/menu' }
    ];
    if (user) currentNavLinks.push({ label: 'Dashboard', to: '/dashboard' });
  }

  const currentMobileLinks = [
    ...currentNavLinks,
    { label: 'Terms & Conditions', to: '/terms-and-conditions' },
    { label: 'Refund Policy', to: '/refund-policy' },
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open || isAuthOpen || isWishlistOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, isAuthOpen, isWishlistOpen]);

  return (
    <>
      <motion.div className="fixed left-0 top-0 z-[70] h-1 origin-left bg-brand-green" style={{ scaleX: scrollYProgress }} />
      <header className="sticky top-0 z-50 bg-[#f2d4a8] py-3">
        <Container>
          <div className="grid h-[72px] grid-cols-[1fr_auto] items-center gap-4 rounded-[1.65rem] border border-brand-brown/12 bg-white/86 px-4 shadow-soft backdrop-blur md:grid-cols-[1fr_auto_1fr] md:px-6 lg:px-7">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3.5 text-left justify-self-start"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/30 bg-brand-green shadow-[0_10px_20px_rgba(47,42,61,0.1)]">
                <img src={logoUrl} alt="Ghar Ka Khana logo" className="h-8 w-8 object-contain drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]" />
              </span>
              <div className="font-navbar">
                <strong className="block text-[1.15rem] font-bold leading-none tracking-[-0.04em] text-brand-brown drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
                  Ghar Ka Khana
                </strong>
                <span className="mt-1 block text-[0.74rem] font-semibold tracking-[0.14em] text-brand-brown/60">Food delivery</span>
              </div>
              {demoMode && (
                <div className="ml-4 rounded-full bg-brand-green/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-green border border-brand-green/20">
                  Demo Mode
                </div>
              )}
            </button>

            <nav className="font-navbar hidden items-center gap-2 rounded-full border border-brand-brown/10 bg-brand-cream/55 px-2 py-1.5 md:flex md:justify-self-center">
              {currentNavLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navClassName}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex md:justify-self-end">
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="font-navbar flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white/50 px-5 py-2.5 text-sm font-bold text-brand-brown transition-all hover:bg-white hover:text-brand-green"
              >
                <FiMail className="text-brand-green" />
                <span>Get Offer Alerts</span>
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full border border-brand-brown/10 bg-white/50 text-brand-brown hover:bg-white transition-all cursor-pointer"
              >
                <FiShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {getTotalItems() > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border-2 border-[#f2d4a8]"
                    >
                      {getTotalItems()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white/50 pl-2 pr-4 py-1 hover:bg-white transition-all cursor-pointer"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-brand-green/20 bg-brand-green flex items-center justify-center text-white font-bold uppercase text-xs">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        user.user_metadata?.first_name?.[0] || user.user_metadata?.full_name?.[0] || user.email[0]
                      )}
                    </div>
                    <FiMenu className="text-brand-brown/70 h-5 w-5" />
                  </button>
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute -right-3 top-full mt-2 w-48 origin-top-right rounded-2xl border border-brand-brown/10 bg-white shadow-soft py-2 flex flex-col font-navbar"
                      >
                        <button onClick={() => { setIsProfileMenuOpen(false); navigate('/dashboard'); }} className="px-4 py-3 text-left text-[0.95rem] font-bold text-brand-brown hover:bg-brand-brown/5 transition-colors">
                          Dashboard
                        </button>
                        <div className="h-px bg-brand-brown/5 mx-2 my-1"></div>
                        <button onClick={() => { setIsProfileMenuOpen(false); signOut(); navigate('/'); }} className="px-4 py-3 text-left text-[0.95rem] font-bold text-red-600 hover:bg-red-50 transition-colors">
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button onClick={() => navigate('/signup')} className="font-navbar h-[46px] px-6 text-base font-bold tracking-tight cursor-pointer">
                  Sign Up
                </Button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-brown/15 bg-white md:hidden"
            >
              <span className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-brand-brown transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-brand-brown transition ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 top-3 h-0.5 w-5 rounded-full bg-brand-brown transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-brand-brown/28 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[60] h-full w-[86%] max-w-sm border-l border-brand-brown/15 bg-brand-cream p-5 shadow-soft md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between border-b border-brand-brown/15 pb-4 font-navbar">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-green/30 bg-brand-green shadow-[0_8px_16px_rgba(47,42,61,0.1)]">
                    <img src={logoUrl} alt="Ghar Ka Khana logo" className="h-7 w-7 object-contain drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)]" />
                  </span>
                  <div>
                    <strong className="block text-lg font-bold leading-none tracking-[-0.04em] text-brand-brown">Ghar Ka Khana</strong>
                    <span className="mt-1 block text-[0.62rem] font-semibold tracking-[0.12em] text-brand-brown/58">Food delivery</span>
                  </div>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="text-xl text-brand-brown/70">
                  ×
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                {currentMobileLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `font-navbar flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-black transition-all duration-300 ${isActive ? 'bg-brand-green text-white shadow-[0_10px_25px_rgba(95,166,59,0.3)]' : 'text-brand-brown/90 hover:bg-white/90'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="font-navbar mt-8 rounded-3xl border border-brand-brown/15 bg-white p-4">
                {user ? (
                  <>
                    <Button onClick={() => { setOpen(false); navigate('/dashboard'); }} className="font-navbar w-full font-bold tracking-tight cursor-pointer mb-2">
                      Dashboard
                    </Button>
                    <button onClick={() => { setOpen(false); signOut(); navigate('/'); }} className="w-full rounded-2xl py-3 text-center text-sm font-bold text-red-600 hover:bg-red-50 border border-red-100 transition-colors">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Button onClick={() => { setOpen(false); navigate('/signup'); }} className="font-navbar w-full font-bold tracking-tight cursor-pointer">
                    Sign Up
                  </Button>
                )}
                <button
                  onClick={() => { setOpen(false); navigate('/cart'); }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-brand-brown/20 bg-white py-3 text-sm font-bold text-brand-brown transition-all hover:bg-brand-brown/5"
                >
                  <FiShoppingCart />
                  <span>Cart ({getTotalItems()} Items)</span>
                </button>
                <button
                  onClick={() => { setOpen(false); setIsWishlistOpen(true); }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 py-3 text-sm font-bold text-brand-green transition-all hover:bg-brand-green/10"
                >
                  <FiMail />
                  <span>Get Offer Alerts</span>
                </button>
                <div className="mt-4 pt-4 border-t border-brand-brown/10 text-xs uppercase tracking-[0.2em] text-brand-brown/70">Contact</div>
                <div className="mt-2 space-y-1 text-sm text-brand-brown">
                  <div>noreplay.gkk26@gmail.com</div>
                  <div>+91-9477564633</div>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}
